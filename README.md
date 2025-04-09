# Tshwane Sporting FC Website

A comprehensive website for Tshwane Sporting FC featuring player management, photo gallery, and more.

## Features

- **Public-facing Website**: 
  - Club information and history
  - Player profiles (senior and junior players)
  - Photo gallery
  - Responsive design for mobile, tablet, and desktop

- **Authentication System**:
  - User registration and login
  - Admin privileges for authorized users

- **Admin Dashboard**:
  - Player management (add, edit, delete)
  - Photo gallery management
  - Statistics and overview

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - TanStack Query for data fetching
  - React Hook Form for form handling
  - Tailwind CSS for styling
  - Shadcn UI components

- **Backend**:
  - Node.js with Express
  - PostgreSQL database
  - Passport.js for authentication
  - Drizzle ORM for database access

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/tshwane-sporting-fc.git
   cd tshwane-sporting-fc
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/tshwane_sporting
     SESSION_SECRET=your_random_secret_key
     ```

4. Set up the database
   ```bash
   npm run db:push
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) or [vercel-deploy.md](./vercel-deploy.md).

## Folder Structure

```
tshwane-sporting-fc/
├── client/                 # Frontend React application
│   ├── src/                # Source code
│   │   ├── assets/         # Static assets
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express server
│   ├── auth.ts             # Authentication logic
│   ├── db.ts               # Database connection
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data access layer
│   └── vite.ts             # Vite configuration
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Database schema and types
├── uploads/                # Uploaded files
├── scripts/                # Utility scripts
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Admin Login

- Username: sporting@tshwane.co.za
- Password: Sporting@2020

## License

All rights reserved. This project is proprietary and confidential.

## About Tshwane Sporting FC

Tshwane Sporting FC was founded in 2020 at SAPS Training college by Coach Jomo. The club won the league in its first year but lost in the promotions.