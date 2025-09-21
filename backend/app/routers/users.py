from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models.user import User, RecognitionLog
from ..schemas.user import UserCreate, UserResponse, RecognitionRequest, RecognitionResponse, UserListResponse
from ..services.face_recognition import FaceRecognitionService
from ..config import settings

router = APIRouter(prefix="/api", tags=["users"])
face_service = FaceRecognitionService(threshold=settings.recognition_threshold)


@router.post("/register", response_model=UserResponse)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user with face image
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Validate face image
    if not face_service.validate_face_image(user_data.image_data):
        raise HTTPException(status_code=400, detail="No face detected in the image")
    
    # Extract face embedding
    embedding = face_service.extract_embedding(user_data.image_data)
    if not embedding:
        raise HTTPException(status_code=400, detail="Failed to extract face features")
    
    # Create new user
    user = User(
        name=user_data.name,
        email=user_data.email,
        face_embedding=json.dumps(embedding)
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


@router.post("/recognize", response_model=RecognitionResponse)
async def recognize_face(
    request: RecognitionRequest,
    db: Session = Depends(get_db)
):
    """
    Recognize a face from uploaded image
    """
    # Validate face image
    if not face_service.validate_face_image(request.image_data):
        return RecognitionResponse(
            message="No face detected in the image"
        )
    
    # Extract face embedding
    target_embedding = face_service.extract_embedding(request.image_data)
    if not target_embedding:
        return RecognitionResponse(
            message="Failed to extract face features"
        )
    
    # Get all users with their embeddings
    users = db.query(User).all()
    stored_embeddings = []
    
    for user in users:
        try:
            embedding = json.loads(user.face_embedding)
            stored_embeddings.append((user.id, embedding))
        except json.JSONDecodeError:
            continue
    
    if not stored_embeddings:
        return RecognitionResponse(
            message="No registered users found"
        )
    
    # Find best match
    best_match_id, confidence = face_service.find_best_match(target_embedding, stored_embeddings)
    
    # Log recognition attempt
    log_entry = RecognitionLog(
        user_id=best_match_id,
        confidence=confidence,
        image_path=None  # We're not storing images, just embeddings
    )
    db.add(log_entry)
    db.commit()
    
    if best_match_id:
        user = db.query(User).filter(User.id == best_match_id).first()
        return RecognitionResponse(
            user=user,
            confidence=confidence,
            message=f"Face recognized as {user.name}"
        )
    else:
        return RecognitionResponse(
            message="No matching face found"
        )


@router.get("/users", response_model=UserListResponse)
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get list of all registered users
    """
    users = db.query(User).offset(skip).limit(limit).all()
    total = db.query(User).count()
    
    return UserListResponse(
        users=users,
        total=total
    )


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific user by ID
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a user
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}
