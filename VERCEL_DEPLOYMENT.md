# Deploying to Vercel - Updated Instructions

These instructions have been updated to address the TypeScript build errors when deploying to Vercel.

## Prerequisites

1. A GitHub repository with your project code
2. A Vercel account (sign up at vercel.com)
3. A PostgreSQL database accessible from the internet
   - [Neon](https://neon.tech/) (recommended)
   - [Supabase](https://supabase.com/)
   - [Railway](https://railway.app/)

## Step 1: Export your database data

Run the export script to back up your data:

```bash
node export-database.js
```

This will create a `db-exports` folder with your database content.

## Step 2: Set up a production PostgreSQL database

Create a PostgreSQL database using one of the recommended services. Note the connection string (DATABASE_URL).

## Step 3: Import your data to the production database

```bash
# Set the DATABASE_URL environment variable to your new database
export DATABASE_URL=your_new_database_url

# Run the import script
node import-database.js
```

## Step 4: Push code to GitHub

Make sure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Step 5: Set up Vercel project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project settings:
   - Framework Preset: Other
   - Build Command: Leave blank (handled by vercel.json)
   - Output Directory: Leave blank (handled by vercel.json)
   - Install Command: `npm install`

## Step 6: Set environment variables

Add these environment variables in the Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: A random string (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `NODE_ENV`: `production` (should be auto-set by vercel.json)

## Step 7: Deploy

Click "Deploy" to start the deployment process.

## Step 8: Troubleshooting

If you encounter issues:

1. **Check Vercel Logs**: 
   - Go to your project dashboard
   - Navigate to Deployments → Latest deployment → "..." menu → "View Function Logs"

2. **Database connection issues**:
   - Verify your DATABASE_URL environment variable
   - Ensure your database allows connections from Vercel's IP addresses

3. **Static files not loading**:
   - Check if the build process generated the files correctly
   - Verify paths in server.js are correct

4. **File uploads not working**:
   - For production, consider using a file storage service like AWS S3 or Cloudinary
   - Vercel's serverless functions have limited filesystem access

## File Storage in Production

For file uploads in production, consider using a cloud storage solution:

1. **AWS S3**:
   - Better for production environments
   - Provides reliable, scalable file storage
   - Requires AWS account and configuration

2. **Cloudinary**:
   - Specialized for image and video uploads
   - Includes transformation capabilities
   - Has a free tier

3. **Uploadcare**:
   - Simple to integrate
   - Includes CDN for faster delivery
   - Has a free tier with limitations