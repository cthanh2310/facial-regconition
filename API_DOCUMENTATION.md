# API Documentation

This document provides detailed information about the Facial Recognition API endpoints.

## Base URL
- Development: `http://localhost:8000`
- Production: `https://your-domain.com`

## Authentication
Currently, the API does not require authentication. For production use, implement proper authentication mechanisms.

## Endpoints

### 1. User Registration

Register a new user with face image.

**Endpoint**: `POST /api/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**Parameters**:
- `name` (string, required): User's full name
- `email` (string, required): User's email address (must be unique)
- `image_data` (string, required): Base64 encoded image data

**Response** (Success - 200):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": null
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data or face not detected
- `400 Bad Request`: User with email already exists

### 2. Face Recognition

Recognize a face from uploaded image.

**Endpoint**: `POST /api/recognize`

**Request Body**:
```json
{
  "image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**Parameters**:
- `image_data` (string, required): Base64 encoded image data

**Response** (Success - 200):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": null
  },
  "confidence": 0.85,
  "message": "Face recognized as John Doe"
}
```

**Response** (No Match - 200):
```json
{
  "user": null,
  "confidence": null,
  "message": "No matching face found"
}
```

**Error Responses**:
- `400 Bad Request`: No face detected in image
- `400 Bad Request`: Failed to extract face features

### 3. Get All Users

Retrieve a list of all registered users.

**Endpoint**: `GET /api/users`

**Query Parameters**:
- `skip` (integer, optional): Number of users to skip (default: 0)
- `limit` (integer, optional): Maximum number of users to return (default: 100)

**Response** (Success - 200):
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": null
    }
  ],
  "total": 1
}
```

### 4. Get User by ID

Retrieve a specific user by their ID.

**Endpoint**: `GET /api/users/{user_id}`

**Path Parameters**:
- `user_id` (integer, required): User's unique identifier

**Response** (Success - 200):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": null
}
```

**Error Responses**:
- `404 Not Found`: User not found

### 5. Delete User

Delete a user and their associated data.

**Endpoint**: `DELETE /api/users/{user_id}`

**Path Parameters**:
- `user_id` (integer, required): User's unique identifier

**Response** (Success - 200):
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses**:
- `404 Not Found`: User not found

### 6. Health Check

Check if the API is running.

**Endpoint**: `GET /health`

**Response** (Success - 200):
```json
{
  "status": "healthy"
}
```

### 7. Root Endpoint

Get basic API information.

**Endpoint**: `GET /`

**Response** (Success - 200):
```json
{
  "message": "Facial Recognition API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

## Data Models

### User Model
```json
{
  "id": "integer",
  "name": "string",
  "email": "string (email format)",
  "created_at": "datetime (ISO 8601)",
  "updated_at": "datetime (ISO 8601) or null"
}
```

### Recognition Response Model
```json
{
  "user": "User object or null",
  "confidence": "float (0.0 to 1.0) or null",
  "message": "string"
}
```

### User List Response Model
```json
{
  "users": "array of User objects",
  "total": "integer"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, no rate limiting is implemented. For production use, implement appropriate rate limiting.

## CORS

CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Configure additional origins in the `CORS_ORIGINS` environment variable.

## Face Recognition Details

### Supported Image Formats
- JPEG
- PNG
- WebP

### Face Detection Requirements
- Face must be clearly visible
- Good lighting conditions recommended
- Minimum face size: 64x64 pixels
- Maximum image size: 10MB

### Recognition Algorithm
- **Model**: Facenet
- **Embedding Size**: 128 dimensions
- **Similarity Metric**: Cosine similarity
- **Default Threshold**: 0.6 (configurable)

### Performance Considerations
- First request may be slower due to model loading
- Processing time: ~1-3 seconds per image
- Memory usage: ~500MB for face recognition models

## Example Usage

### JavaScript/React
```javascript
// Register a user
const registerUser = async (name, email, imageData) => {
  const response = await fetch('http://localhost:8000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      image_data: imageData
    })
  });
  return response.json();
};

// Recognize a face
const recognizeFace = async (imageData) => {
  const response = await fetch('http://localhost:8000/api/recognize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_data: imageData
    })
  });
  return response.json();
};
```

### Python
```python
import requests
import base64

# Register a user
def register_user(name, email, image_path):
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode()
    
    response = requests.post('http://localhost:8000/api/register', json={
        'name': name,
        'email': email,
        'image_data': f'data:image/jpeg;base64,{image_data}'
    })
    return response.json()

# Recognize a face
def recognize_face(image_path):
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode()
    
    response = requests.post('http://localhost:8000/api/recognize', json={
        'image_data': f'data:image/jpeg;base64,{image_data}'
    })
    return response.json()
```
