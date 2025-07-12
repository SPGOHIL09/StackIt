#!/bin/bash
# StackIt - Install all dependencies for backend and frontend
# Usage: bash install-all.sh

set -e

cd "$(dirname "$0")"

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
# Ensure all required frontend packages are installed
npm install react react-dom react-router-dom axios vite bootstrap bootstrap-icons @uiw/react-md-editor date-fns dompurify marked
cd ..

echo "All dependencies installed successfully!"
