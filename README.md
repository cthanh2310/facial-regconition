# Facial Recognition Web Application

A modern web application for facial recognition with user registration and real-time recognition capabilities.

## Features

- **User Registration**: Capture face images via webcam or file upload
- **Face Recognition**: Compare input faces with stored embeddings
- **Secure Storage**: Store face embeddings in PostgreSQL database
- **Modern UI**: Clean React frontend with real-time webcam integration
- **Docker Support**: Easy local development setup

## Tech Stack

- **Frontend**: React.js with react-webcam
- **Backend**: Python FastAPI
- **Face Recognition**: DeepFace library
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Project Structure

```
facial-regconition/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repository>
   cd facial-regconition
   ```

2. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Manual Setup

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `POST /api/register` - Register a new user with face image
- `POST /api/recognize` - Recognize a face from uploaded image
- `GET /api/users` - List all registered users

## How Recognition Works

The application uses DeepFace library to:
1. Extract face embeddings (128-dimensional vectors) from images
2. Store embeddings in PostgreSQL database
3. Compare new face embeddings with stored ones using cosine similarity
4. Return the closest match if similarity threshold is met

## Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**:
```
DATABASE_URL=postgresql://user:password@localhost:5432/facial_recognition
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env)**:
```
REACT_APP_API_URL=http://localhost:8000
```

## Development

- Backend runs on port 8000
- Frontend runs on port 3000
- PostgreSQL runs on port 5432
- Redis runs on port 6379 (for caching)

## License

MIT License
