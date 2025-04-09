#!/bin/bash

# This script runs before the Vercel build process

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client-side application
echo "Building client..."
npx vite build

# Create the uploads directory
echo "Creating uploads directory..."
mkdir -p uploads

echo "Prebuild process completed"