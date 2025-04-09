// Import required modules
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'sessions'
  }),
  secret: process.env.SESSION_SECRET || 'tshwane-sporting-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Password utilities
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${derivedKey.toString('hex')}.${salt}`);
    });
  });
}

async function comparePasswords(supplied, stored) {
  const [hash, salt] = stored.split('.');
  return new Promise((resolve, reject) => {
    crypto.scrypt(supplied, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(crypto.timingSafeEqual(
        Buffer.from(hash, 'hex'),
        derivedKey
      ));
    });
  });
}

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// API Routes
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

app.post('/api/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, fullName } = req.body;
    
    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, password, "fullName", "isAdmin") VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, fullName, false]
    );
    
    // Log in the new user
    req.login(result.rows[0], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json(result.rows[0]);
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Player routes
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Photo routes
app.get('/api/photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM photos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin check middleware
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
}

// Admin routes (protected)
app.post('/api/players', ensureAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { 
      firstName, surname, age, nationality, preferredFoot, 
      idNumber, dateOfBirth, race, safaId, dateJoined, 
      registrationStatus, category
    } = req.body;
    
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await pool.query(
      `INSERT INTO players (
        "firstName", surname, age, nationality, "preferredFoot", 
        "idNumber", "dateOfBirth", race, "safaId", "dateJoined", 
        "registrationStatus", category, "photoUrl"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        firstName, surname, parseInt(age), nationality, preferredFoot, 
        idNumber, dateOfBirth, race, safaId, dateJoined, 
        registrationStatus, category, photoUrl
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create player error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/photos', ensureAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const result = await pool.query(
      `INSERT INTO photos (title, description, category, "imageUrl") 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, category, imageUrl]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create photo error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve static files - client-side app
app.use(express.static(path.join(__dirname, 'client')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Always return the main index.html for any client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});