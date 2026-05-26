#!/bin/bash

# Get the absolute path of the project directory
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_DIR/quran-tajweed-backend"

echo "🚀 Starting Quran Tajweed Project (Backend + Frontend)..."

# 1. Start Backend in background
echo "📡 Starting Backend on port 8000..."
cd "$BACKEND_DIR"
./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# 2. Start Frontend
echo "💻 Starting Frontend on port 5173..."
cd "$PROJECT_DIR"
npm run dev &
FRONTEND_URL="http://localhost:5173/secret-quran-coach"

# Function to stop everything on Ctrl+C
cleanup() {
    echo -e "\n🛑 Stopping servers..."
    kill $BACKEND_PID
    # Kill the npm process group
    pkill -P $$
    exit
}

trap cleanup SIGINT SIGTERM

echo "-------------------------------------------------------"
echo "✅ Everything is running!"
echo "👉 Open: $FRONTEND_URL"
echo "-------------------------------------------------------"

# Keep the script running
wait
