# Setup Guide

This guide will help you set up and run the Facial Recognition Web Application.

## Prerequisites

- Docker and Docker Compose
- Git

## Quick Start with Docker

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd facial-regconition
   ```

2. **Start all services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Manual Setup (Development)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start PostgreSQL and Redis** (using Docker):
   ```bash
   docker-compose up postgres redis -d
   ```

6. **Run the backend**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the frontend**:
   ```bash
   npm start
   ```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/facial_recognition
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
REDIS_URL=redis://localhost:6379
RECOGNITION_THRESHOLD=0.6
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

## Database Schema

The application uses PostgreSQL with the following main tables:

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: User's email (unique)
- `face_embedding`: JSON string containing face embedding vector
- `created_at`: Registration timestamp
- `updated_at`: Last update timestamp

### Recognition Logs Table
- `id`: Primary key
- `user_id`: Foreign key to users table (nullable)
- `confidence`: Similarity score (nullable)
- `image_path`: Path to uploaded image (nullable)
- `created_at`: Recognition timestamp

## How Face Recognition Works

1. **Face Detection**: Uses OpenCV to detect faces in images
2. **Feature Extraction**: DeepFace library extracts 128-dimensional embeddings
3. **Storage**: Embeddings are stored as JSON in PostgreSQL
4. **Comparison**: Cosine similarity is used to compare face embeddings
5. **Threshold**: Only matches above the threshold (default 0.6) are considered valid

## API Endpoints

### User Registration
- **POST** `/api/register`
- **Body**: `{ "name": "string", "email": "string", "image_data": "base64_string" }`
- **Response**: User object with ID and timestamps

### Face Recognition
- **POST** `/api/recognize`
- **Body**: `{ "image_data": "base64_string" }`
- **Response**: Recognition result with user info and confidence score

### User Management
- **GET** `/api/users` - List all users
- **GET** `/api/users/{id}` - Get specific user
- **DELETE** `/api/users/{id}` - Delete user

## Troubleshooting

### Common Issues

1. **Face not detected**:
   - Ensure good lighting
   - Face should be clearly visible
   - Try different angles

2. **Low recognition accuracy**:
   - Adjust `RECOGNITION_THRESHOLD` in environment variables
   - Ensure high-quality images during registration
   - Check if face is similar to registration photo

3. **Docker issues**:
   - Ensure Docker is running
   - Check if ports 3000, 8000, 5432, 6379 are available
   - Try `docker-compose down` and `docker-compose up --build`

4. **Backend connection issues**:
   - Verify database is running
   - Check environment variables
   - Ensure CORS origins are correctly configured

### Performance Tips

1. **For better accuracy**:
   - Use high-resolution images
   - Ensure good lighting conditions
   - Register multiple angles if possible

2. **For better performance**:
   - Use Redis for caching (already configured)
   - Consider using GPU acceleration for DeepFace
   - Optimize image sizes before processing

## Security Considerations

1. **Change default secrets** in production
2. **Use HTTPS** in production
3. **Implement proper authentication** for production use
4. **Regular database backups**
5. **Monitor recognition logs** for security

## Production Deployment

For production deployment:

1. Use environment-specific configuration
2. Set up proper SSL certificates
3. Configure reverse proxy (nginx)
4. Use managed database services
5. Implement proper logging and monitoring
6. Set up automated backups
