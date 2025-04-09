// Build script for Vercel deployment
// This script builds the client-side application without TypeScript errors

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Paths
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(distPath, 'public');
const uploadsPath = path.join(__dirname, 'uploads');
const clientPath = path.join(__dirname, 'client');

// Create necessary directories
console.log('Creating build directories...');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Build client
try {
  console.log('Building client application...');
  execSync('npx vite build --outDir dist/public', { stdio: 'inherit' });
  console.log('Client build successful!');
} catch (error) {
  console.error('Error building client:', error.message);
  process.exit(1);
}

// Copy club logo to create favicon
try {
  const logoPath = path.join(__dirname, 'client/src/assets/club-logo.jpg');
  const faviconPath = path.join(publicPath, 'favicon.ico');
  
  if (fs.existsSync(logoPath)) {
    console.log('Copying logo as favicon...');
    fs.copyFileSync(logoPath, faviconPath);
  } else {
    console.log('Logo file not found, skipping favicon creation');
  }
} catch (error) {
  console.warn('Warning: Could not create favicon:', error.message);
}

console.log('Build process completed successfully!');