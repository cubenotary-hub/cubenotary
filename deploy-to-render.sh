#!/bin/bash

# 🚀 Cube Notary - Deploy to Render Script

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
git status

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: Update calendar system and prepare for Render deployment

- Modern calendar with month navigation
- Fixed calendar clickability issues
- Updated Render configuration
- Ready for production deployment"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to https://render.com"
    echo "2. Create new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Use these settings:"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "   - Health Check: /api/health"
    echo "5. Set environment variables (see DEPLOYMENT_GUIDE.md)"
    echo ""
    echo "🌐 Your site will be available at: https://your-app.onrender.com"
else
    echo "❌ Failed to push to GitHub. Please check your git configuration."
    exit 1
fi
