# Tshwane Sporting FC Website Deployment Guide

This guide provides instructions for deploying the Tshwane Sporting FC website to Vercel or a similar platform.

## Prerequisites

- A PostgreSQL database accessible via the internet (Neon, Supabase, Railway, etc.)
- A Vercel account (or similar hosting platform)
- Git repository with your project code

## Environment Variables

The following environment variables need to be set in your deployment platform:

1. `DATABASE_URL` - Your PostgreSQL connection string
   - Format: `postgresql://username:password@hostname:port/database_name`
   - Must be accessible from the internet

2. `SESSION_SECRET` - Secret key for encrypting session cookies
   - Generate a random string with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Or use a service like https://generate-secret.vercel.app/32

3. `NODE_ENV` - Set to `production` for deployment

## Vercel Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your repository
   - Configure the project:
     - Framework Preset: Other
     - Root Directory: ./
     - Build Command: Node server.js
     - Output Directory: Not required

3. **Add Environment Variables**
   - Click on "Environment Variables"
   - Add the required variables:
     - `DATABASE_URL`
     - `SESSION_SECRET` 
     - `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

## Database Setup

Before your application will work, you need to initialize your database with the correct tables. You have two options:

### Option 1: Manual Database Setup

Connect to your PostgreSQL database and execute the following SQL commands:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "isAdmin" BOOLEAN NOT NULL DEFAULT false
);

-- Create players table
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  surname TEXT NOT NULL,
  age INTEGER NOT NULL,
  nationality TEXT,
  "preferredFoot" TEXT,
  "idNumber" TEXT,
  "dateOfBirth" TEXT,
  race TEXT,
  "safaId" TEXT,
  "dateJoined" TEXT,
  "registrationStatus" TEXT,
  category TEXT,
  "photoUrl" TEXT
);

-- Create photos table
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  "imageUrl" TEXT NOT NULL
);

-- Create sessions table for authentication
CREATE TABLE sessions (
  sid VARCHAR NOT NULL,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (sid)
);

-- Create initial admin user
INSERT INTO users (username, password, "fullName", "isAdmin") 
VALUES ('sporting@tshwane.co.za', 'hashedpassword', 'Tshwane Admin', true);
```

Note: You'll need to replace 'hashedpassword' with a properly hashed password. You can use the provided script to hash a password:

```bash
node -e "const crypto = require('crypto'); const salt = crypto.randomBytes(16).toString('hex'); crypto.scrypt('Sporting@2020', salt, 64, (err, derivedKey) => { if (err) throw err; console.log(derivedKey.toString('hex') + '.' + salt); });"
```

### Option 2: Use Database Migration from Previous Instance

If you have access to your previous Replit database, you can:

1. Export data from your Replit database
2. Import the data into your new database

## Troubleshooting

If your site is blank after deployment:

1. **Check Vercel Logs**: Go to your Vercel dashboard → Your project → Deployments → Latest deployment → View logs
2. **Verify Environment Variables**: Ensure all required variables are set correctly
3. **Check Database Connection**: Verify that your app can connect to the database
4. **Static Files**: Ensure static files are being properly served
5. **Check Uploads Directory**: Make sure the uploads directory exists and is writable

## Need Further Assistance?

If you encounter issues with deployment, please refer to the Vercel documentation or reach out to support.