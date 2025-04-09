# Vercel Deployment Steps

Follow these steps to deploy your Tshwane Sporting FC website to Vercel.

## Step 1: Export your database data

First, export your current database data. This will allow you to import it into your new production database.

```bash
# Run the export script
node export-database.js
```

This will create a `db-exports` folder with your database content.

## Step 2: Set up a production PostgreSQL database

You'll need a PostgreSQL database accessible from the internet. Good options include:

1. [Neon](https://neon.tech) (recommended, has free tier)
2. [Supabase](https://supabase.com) (has free tier)
3. [Railway](https://railway.app) (has free tier)
4. [Render](https://render.com) (has free tier)

After setting up your database, make note of the connection string (DATABASE_URL).

## Step 3: Import your data to the production database

Update the DATABASE_URL environment variable to point to your new production database:

```bash
# On macOS/Linux
export DATABASE_URL=your_production_database_url

# On Windows
set DATABASE_URL=your_production_database_url
```

Then run the import script:

```bash
node import-database.js
```

Follow the prompts to confirm the import.

## Step 4: Create a new Vercel project

1. Go to [Vercel](https://vercel.com/) and sign up or log in
2. Click "Add New..." → "Project"
3. Import your GitHub repository

## Step 5: Configure the project

Configure the project settings:

- **Framework Preset**: Other
- **Build Command**: `node vercel-build.sh`
- **Output Directory**: `client`
- **Install Command**: `npm install`

## Step 6: Set environment variables

Add the following environment variables:

- `DATABASE_URL`: Your production PostgreSQL connection string
- `SESSION_SECRET`: A long, random string (generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `NODE_ENV`: `production`

## Step 7: Deploy

Click "Deploy" and wait for your project to build and deploy.

## Step 8: Set up the uploads directory

After deployment, you'll need to make sure your uploads directory exists and is writable. 

You have two options:

1. **Use Vercel's serverless functions and filesystem**:
   Your application is already configured to create the uploads directory.

2. **Use a file storage service** (recommended for production):
   For a more robust solution, consider using a service like:
   - [AWS S3](https://aws.amazon.com/s3/)
   - [Cloudinary](https://cloudinary.com/)
   - [Uploadcare](https://uploadcare.com/)

## Troubleshooting

If you encounter issues:

1. **Check Vercel logs**: Go to your project dashboard → Deployments → Latest deployment → "..." menu → "View Function Logs"

2. **Verify environment variables**: Make sure all variables are set correctly

3. **Database connection issues**: Ensure your database allows connections from Vercel's IP addresses

4. **File upload issues**: Check if your uploads directory exists and has correct permissions

## Maintenance

To update your deployment:

1. Push changes to your GitHub repository
2. Vercel will automatically deploy the new version

For database changes:

1. Use the export script to backup your data
2. Make schema changes
3. Import data back if needed