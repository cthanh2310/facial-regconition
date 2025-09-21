#!/bin/bash

# Development Environment Management Script

case "$1" in
    "start")
        echo "🚀 Starting Local Development Environment"
        echo "========================================"
        
        # Start databases
        echo "📦 Starting databases..."
        docker compose -f docker-compose.dev.yml up -d
        
        # Wait for databases to be ready
        echo "⏳ Waiting for databases to be ready..."
        sleep 5
        
        # Check if backend is running
        if ! pgrep -f "uvicorn app.main:app" > /dev/null; then
            echo "🔧 Starting backend..."
            cd backend
            source venv/bin/activate
            uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
            cd ..
        else
            echo "✅ Backend already running"
        fi
        
        # Check if frontend is running
        if ! pgrep -f "npm start" > /dev/null; then
            echo "🎨 Starting frontend..."
            cd frontend
            npm start &
            cd ..
        else
            echo "✅ Frontend already running"
        fi
        
        echo ""
        echo "🎉 Development environment started!"
        echo "📋 Access URLs:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend API: http://localhost:8000"
        echo "   API Docs: http://localhost:8000/docs"
        echo ""
        echo "🛑 To stop: ./dev.sh stop"
        ;;
        
    "stop")
        echo "🛑 Stopping Development Environment"
        echo "=================================="
        
        # Stop frontend and backend processes
        pkill -f "uvicorn app.main:app"
        pkill -f "npm start"
        
        # Stop databases
        docker compose -f docker-compose.dev.yml down
        
        echo "✅ All services stopped"
        ;;
        
    "status")
        echo "📊 Development Environment Status"
        echo "================================"
        
        # Check databases
        echo "🗄️  Databases:"
        docker compose -f docker-compose.dev.yml ps
        
        echo ""
        echo "🔧 Backend:"
        if pgrep -f "uvicorn app.main:app" > /dev/null; then
            echo "   ✅ Running (PID: $(pgrep -f 'uvicorn app.main:app'))"
            echo "   🌐 Health: $(curl -s http://localhost:8000/health 2>/dev/null || echo 'Not responding')"
        else
            echo "   ❌ Not running"
        fi
        
        echo ""
        echo "🎨 Frontend:"
        if pgrep -f "npm start" > /dev/null; then
            echo "   ✅ Running (PID: $(pgrep -f 'npm start'))"
            echo "   🌐 Status: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 'Not responding')"
        else
            echo "   ❌ Not running"
        fi
        ;;
        
    "logs")
        echo "📝 Viewing Database Logs"
        echo "========================"
        docker compose -f docker-compose.dev.yml logs -f
        ;;
        
    "db")
        echo "🗄️  Connecting to PostgreSQL Database"
        echo "====================================="
        docker exec -it facial-regconition-postgres-1 psql -U user -d facial_recognition
        ;;
        
    "reset")
        echo "🔄 Resetting Development Environment"
        echo "==================================="
        
        # Stop everything
        ./dev.sh stop
        
        # Remove database volumes (WARNING: This deletes all data!)
        echo "⚠️  Removing database volumes (all data will be lost)..."
        docker compose -f docker-compose.dev.yml down -v
        
        # Start fresh
        ./dev.sh start
        
        echo "✅ Environment reset complete"
        ;;
        
    *)
        echo "🛠️  Facial Recognition Development Environment Manager"
        echo "====================================================="
        echo ""
        echo "Usage: $0 {start|stop|status|logs|db|reset}"
        echo ""
        echo "Commands:"
        echo "  start   - Start all development services"
        echo "  stop    - Stop all development services"
        echo "  status  - Show status of all services"
        echo "  logs    - View database logs"
        echo "  db      - Connect to PostgreSQL database"
        echo "  reset   - Reset environment (deletes all data!)"
        echo ""
        echo "Examples:"
        echo "  ./dev.sh start    # Start development environment"
        echo "  ./dev.sh status   # Check what's running"
        echo "  ./dev.sh db       # Connect to database"
        echo "  ./dev.sh stop     # Stop everything"
        ;;
esac
