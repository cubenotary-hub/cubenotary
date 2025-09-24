#!/bin/bash
# Build script for Cube Notary website
echo "Building Cube Notary website..."

# Ensure public directory exists
mkdir -p public

# Copy all HTML files to public directory
cp *.html public/ 2>/dev/null || true
cp _redirects public/ 2>/dev/null || true

echo "Build complete! Files ready in public/ directory."
