# 🛠️ Local Development Setup

This guide shows you how to run the facial recognition application with **databases in Docker** and **frontend/backend locally** for faster development iteration.

## 🎯 Benefits of This Setup

- ✅ **Fast Code Changes**: No Docker rebuilds needed
- ✅ **Hot Reload**: Frontend and backend auto-reload on changes
- ✅ **Debugging**: Easy to debug with local tools
- ✅ **IDE Integration**: Full IDE support for code completion and debugging
- ✅ **Database Persistence**: Data persists in Docker volumes

## 🚀 Quick Setup

### **Option 1: Automated Setup (Recommended)**
```bash
# Run the setup script
./setup-local-dev.sh
```

### **Option 2: Manual Setup**

#### **1. Start Databases Only**
```bash
# Start PostgreSQL and Redis in Docker
docker-compose -f docker-compose.dev.yml up -d

# Verify databases are running
docker-compose -f docker-compose.dev.yml ps
```

#### **2. Setup Backend Environment**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/facial_recognition
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
RECOGNITION_THRESHOLD=0.6
EOF
```

#### **3. Setup Frontend Environment**
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:8000
EOF
```

## 🏃‍♂️ Running the Application

### **Terminal 1: Start Backend**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Terminal 2: Start Frontend**
```bash
cd frontend
npm start
```

### **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432 (PostgreSQL)
- **Cache**: localhost:6379 (Redis)

## 🔧 Development Workflow

### **Making Changes**

1. **Backend Changes**: 
   - Edit Python files in `backend/app/`
   - Backend auto-reloads with `--reload` flag
   - No Docker rebuild needed!

2. **Frontend Changes**:
   - Edit React components in `frontend/src/`
   - Frontend hot-reloads automatically
   - No Docker rebuild needed!

3. **Database Changes**:
   - Data persists in Docker volumes
   - Use DBeaver or any PostgreSQL client to view data
   - Connection: `localhost:5432`, user: `user`, password: `password`

### **Database Management**

#### **Connect to PostgreSQL**
```bash
# Using Docker
docker exec -it facial-regconition-postgres-1 psql -U user -d facial_recognition

# Using local psql (if installed)
psql -h localhost -p 5432 -U user -d facial_recognition
```

#### **View Data**
```sql
-- List all users
SELECT id, name, email, created_at FROM users;

-- View recognition logs
SELECT * FROM recognition_logs ORDER BY created_at DESC;

-- Check face embeddings (first 50 chars)
SELECT id, name, LEFT(face_embedding, 50) as embedding_preview FROM users;
```

#### **Reset Database**
```bash
# Stop and remove volumes (WARNING: This deletes all data!)
docker-compose -f docker-compose.dev.yml down -v

# Start fresh
docker-compose -f docker-compose.dev.yml up -d
```

## 🐛 Debugging

### **Backend Debugging**
```bash
# Run with debugger
cd backend
source venv/bin/activate
python -m debugpy --listen 5678 --wait-for-client -m uvicorn app.main:app --reload
```

### **Frontend Debugging**
- Use browser DevTools
- React Developer Tools extension
- Console logs in browser

### **Database Debugging**
- Use DBeaver or pgAdmin
- Check Docker logs: `docker-compose -f docker-compose.dev.yml logs postgres`

## 📊 Monitoring

### **Check Service Status**
```bash
# Docker services
docker-compose -f docker-compose.dev.yml ps

# Backend health
curl http://localhost:8000/health

# Database connection
docker exec -it facial-regconition-postgres-1 pg_isready -U user -d facial_recognition
```

### **View Logs**
```bash
# All services
docker-compose -f docker-compose.dev.yml logs

# Specific service
docker-compose -f docker-compose.dev.yml logs postgres
docker-compose -f docker-compose.dev.yml logs redis
```

## 🛑 Stopping Services

### **Stop Frontend/Backend**
- Press `Ctrl+C` in the respective terminals

### **Stop Databases**
```bash
# Stop databases
docker-compose -f docker-compose.dev.yml down

# Stop and remove data (WARNING: Deletes all data!)
docker-compose -f docker-compose.dev.yml down -v
```

## 🔄 Switching Between Development Modes

### **Local Development (Current)**
```bash
# Start databases only
docker-compose -f docker-compose.dev.yml up -d

# Run backend locally
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Run frontend locally
cd frontend && npm start
```

### **Full Docker Development**
```bash
# Stop local services first
# Then run full Docker setup
docker-compose up --build
```

## 🚨 Troubleshooting

### **Port Already in Use**
```bash
# Check what's using the port
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :3000

# Kill process if needed
sudo kill -9 <PID>
```

### **Database Connection Issues**
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps

# Check PostgreSQL logs
docker-compose -f docker-compose.dev.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.dev.yml restart postgres
```

### **Python Dependencies Issues**
```bash
# Recreate virtual environment
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **Node Dependencies Issues**
```bash
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables Reference

### **Backend (.env)**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/facial_recognition
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
RECOGNITION_THRESHOLD=0.6
```

### **Frontend (.env.local)**
```bash
REACT_APP_API_URL=http://localhost:8000
```

## 🎉 You're Ready!

This setup gives you the best of both worlds:
- **Fast iteration** with local development
- **Consistent databases** with Docker
- **Easy debugging** with local tools
- **No rebuild delays** for code changes

Happy coding! 🚀
