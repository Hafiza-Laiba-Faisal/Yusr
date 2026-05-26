#!/bin/bash

# Script to run Yusr Frontend
echo "========================================="
echo "  Starting Yusr — Intelligent Quran Coach"
echo "========================================="

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting Yusr on http://localhost:5173 ..."
npm run dev

echo ""
echo "========================================="
echo "  Yusr is running! http://localhost:5173"
echo "  Press Ctrl+C to stop."
echo "========================================="
