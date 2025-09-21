import json
import base64
import io
import numpy as np
from PIL import Image
import face_recognition
from typing import Optional, Tuple, List
import cv2


class FaceRecognitionService:
    def __init__(self, threshold: float = 0.6):
        self.threshold = threshold
    
    def extract_embedding(self, image_data: str) -> Optional[List[float]]:
        """
        Extract face embedding from base64 encoded image
        """
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert PIL to numpy array
            image_array = np.array(image)
            
            # Convert RGB to BGR for face_recognition
            if len(image_array.shape) == 3 and image_array.shape[2] == 3:
                image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
            
            print(image_array)
            # Extract face encodings using face_recognition
            face_encodings = face_recognition.face_encodings(image_array)
            
            if len(face_encodings) == 0:
                return None
            
            # Return the first face encoding
            return face_encodings[0].tolist()
            
        except Exception as e:
            print(f"Error extracting embedding: {str(e)}")
            return None
    
    def compare_faces(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Compare two face embeddings using face_recognition's compare_faces
        """
        try:
            # Convert to numpy arrays
            emb1 = np.array(embedding1)
            emb2 = np.array(embedding2)
            
            # Use face_recognition's compare_faces function
            # It returns a list of boolean values, we want the first one
            results = face_recognition.compare_faces([emb1], emb2, tolerance=0.6)
            
            if results and results[0]:
                # Calculate distance for similarity score
                distance = face_recognition.face_distance([emb1], emb2)[0]
                # Convert distance to similarity (lower distance = higher similarity)
                similarity = 1.0 - distance
                return float(similarity)
            else:
                return 0.0
            
        except Exception as e:
            print(f"Error comparing faces: {str(e)}")
            return 0.0
    
    def find_best_match(self, target_embedding: List[float], stored_embeddings: List[Tuple[int, List[float]]]) -> Tuple[Optional[int], float]:
        """
        Find the best matching face from stored embeddings
        """
        best_match_id = None
        best_similarity = 0.0
        
        for user_id, stored_embedding in stored_embeddings:
            similarity = self.compare_faces(target_embedding, stored_embedding)
            
            if similarity > best_similarity and similarity >= self.threshold:
                best_similarity = similarity
                best_match_id = user_id
        
        return best_match_id, best_similarity
    
    def validate_face_image(self, image_data: str) -> bool:
        """
        Validate if the image contains a detectable face
        """
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert PIL to numpy array
            image_array = np.array(image)
            
            # Convert RGB to BGR for face_recognition
            if len(image_array.shape) == 3 and image_array.shape[2] == 3:
                image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
            
            # Try to detect face locations
            face_locations = face_recognition.face_locations(image_array)
            
            return len(face_locations) > 0
            
        except Exception as e:
            print(f"Face validation failed: {str(e)}")
            return False
