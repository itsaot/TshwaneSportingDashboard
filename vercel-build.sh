#!/bin/bash

# Install dependencies
npm install

# Build the application
npm run build

# Create the necessary directories
mkdir -p dist/public/uploads

# Copy the club logo to create a favicon
if [ -f "client/src/assets/club-logo.jpg" ]; then
  cp client/src/assets/club-logo.jpg dist/public/favicon.ico
fi

# Ensure uploads directory exists and has proper permissions
chmod -R 755 dist/public/uploads

echo "Build completed successfully!"