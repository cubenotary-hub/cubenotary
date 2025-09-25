#!/bin/bash

# Cube Notary Deployment Script
# This script helps deploy the full-stack application

set -e  # Exit on any error

echo "🚀 Cube Notary Deployment Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm $(npm --version) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Check environment configuration
check_env() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f "env.example" ]; then
            cp env.example .env
            print_warning "Please edit .env file with your actual credentials before deploying"
            print_warning "Required variables: EMAIL_USER, EMAIL_PASS, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY"
        else
            print_error "env.example file not found. Cannot create .env file."
            exit 1
        fi
    else
        print_success ".env file found"
    fi
}

# Test the application
test_application() {
    print_status "Testing application..."
    
    # Start server in background
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test health endpoint
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "Application is running and healthy"
    else
        print_error "Application health check failed"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop server
    kill $SERVER_PID 2>/dev/null || true
    print_success "Application test completed"
}

# Build for production
build_production() {
    print_status "Building for production..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Create production build
    print_success "Production build completed"
}

# Deploy to Render.com
deploy_render() {
    print_status "Deploying to Render.com..."
    
    # Check if git is configured
    if ! git config user.name > /dev/null 2>&1; then
        print_warning "Git user not configured. Please run:"
        print_warning "git config --global user.name 'Your Name'"
        print_warning "git config --global user.email 'your.email@example.com'"
    fi
    
    # Add all files to git
    git add .
    
    # Commit changes
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || print_warning "No changes to commit"
    
    # Push to main branch
    git push origin main
    
    print_success "Deployed to Render.com successfully"
    print_status "Your application will be available at: https://cubenotary-backend.onrender.com"
}

# Deploy to Heroku
deploy_heroku() {
    print_status "Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI is not installed. Please install it first:"
        print_error "https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Check if logged in to Heroku
    if ! heroku auth:whoami > /dev/null 2>&1; then
        print_error "Not logged in to Heroku. Please run: heroku login"
        exit 1
    fi
    
    # Create Heroku app if it doesn't exist
    if ! heroku apps:info cubenotary > /dev/null 2>&1; then
        print_status "Creating Heroku app..."
        heroku create cubenotary
    fi
    
    # Set environment variables
    print_status "Setting environment variables..."
    heroku config:set NODE_ENV=production
    heroku config:set PORT=10000
    
    # Deploy
    git push heroku main
    
    print_success "Deployed to Heroku successfully"
    print_status "Your application will be available at: https://cubenotary.herokuapp.com"
}

# Deploy with Docker
deploy_docker() {
    print_status "Building Docker image..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Build Docker image
    docker build -t cubenotary .
    
    print_success "Docker image built successfully"
    print_status "To run the container: docker run -p 3000:3000 --env-file .env cubenotary"
}

# Main deployment function
main() {
    echo "Choose deployment option:"
    echo "1) Local development setup"
    echo "2) Deploy to Render.com"
    echo "3) Deploy to Heroku"
    echo "4) Build Docker image"
    echo "5) Test application only"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            print_status "Setting up local development environment..."
            check_node
            check_npm
            install_dependencies
            check_env
            print_success "Local development setup complete!"
            print_status "Run 'npm run dev' to start the development server"
            ;;
        2)
            print_status "Deploying to Render.com..."
            check_node
            check_npm
            install_dependencies
            check_env
            test_application
            build_production
            deploy_render
            ;;
        3)
            print_status "Deploying to Heroku..."
            check_node
            check_npm
            install_dependencies
            check_env
            test_application
            build_production
            deploy_heroku
            ;;
        4)
            print_status "Building Docker image..."
            check_node
            check_npm
            install_dependencies
            check_env
            deploy_docker
            ;;
        5)
            print_status "Testing application..."
            check_node
            check_npm
            install_dependencies
            check_env
            test_application
            ;;
        *)
            print_error "Invalid choice. Please run the script again and choose 1-5."
            exit 1
            ;;
    esac
}

# Run main function
main

print_success "Deployment script completed!"