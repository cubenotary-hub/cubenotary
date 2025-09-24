#!/bin/bash

# Cube Notary Website Deployment Script for Render
# Usage: ./deploy.sh YOUR_API_KEY

API_KEY=$1

if [ -z "$API_KEY" ]; then
    echo "❌ Error: Please provide your Render API key"
    echo "Usage: ./deploy.sh YOUR_API_KEY"
    exit 1
fi

echo "🚀 Deploying Cube Notary website to Render..."

# Create static site using Render API
echo "Creating static site on Render..."
curl -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "static_site",
    "name": "cubenotary-website",
    "repo": "https://github.com/cubenotary-hub/cubenotary",
    "branch": "main",
    "buildCommand": "",
    "publishPath": "public",
    "autoDeploy": true
  }'

echo ""
echo "✅ Deployment request sent to Render!"
echo "📋 Check your Render dashboard for deployment status"
echo "🌐 Your site will be available at: https://cubenotary-website.onrender.com"
