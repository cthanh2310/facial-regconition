#!/bin/bash

echo "🚀 Setting up Local Development Environment"
echo "=========================================="

# Create backend .env file
echo "📝 Creating backend environment file..."
cat > backend/.env << EOF
# Local Development Environment Variables
DATABASE_URL=postgresql://user:password@localhost:5432/facial_recognition
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
RECOGNITION_THRESHOLD=0.6
EOF

# Create frontend .env file
echo "📝 Creating frontend environment file..."
cat > frontend/.env.local << EOF
# Local Development Environment Variables
REACT_APP_API_URL=http://localhost:8000
EOF

echo "✅ Environment files created!"
echo ""
echo "🐳 Starting databases with Docker..."
docker compose -f docker-compose.dev.yml up -d

echo ""
echo "⏳ Waiting for databases to be ready..."
sleep 10

echo ""
echo "🔧 Setting up Python virtual environment..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend:"
echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend && npm start"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "4. Stop databases when done:"
echo "   docker compose -f docker-compose.dev.yml down"
