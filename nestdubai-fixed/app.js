require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const SQLiteStore = require('connect-sqlite3')(session);
const { initDB } = require('./database/db');
const { seedDB } = require('./database/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── TRUST PROXY (required for Railway / any reverse proxy) ───
app.set('trust proxy', 1);

// ─── DATABASE ─────────────────────────────────────────────────
initDB();
seedDB();

// ─── SECURITY ─────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://www.google.com"],
      frameSrc: ["'self'", "https://www.google.com", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    }
  }
}));

// ─── VIEW ENGINE ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ─── SESSION ──────────────────────────────────────────────────
app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: path.join(__dirname, 'database') }),
  secret: process.env.SESSION_SECRET || 'nestdubai-fallback-secret-2025-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ─── LOCAL VARIABLES ──────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    name: req.session.userName,
    role: req.session.userRole
  } : null;
  res.locals.currentPath = req.path;
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────
app.use('/', require('./routes/index'));

// ─── ERROR HANDLER ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('404', { title: 'Something went wrong — NestDubai' });
});

// ─── START ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🏠  NestDubai is running!          ║
  ║   http://localhost:${PORT}              ║
  ║                                      ║
  ║   Admin: admin@nestdubai.com         ║
  ║   Pass:  NestAdmin2025!              ║
  ║                                      ║
  ║   Demo:  demo@student.com            ║
  ║   Pass:  Demo1234!                   ║
  ╚══════════════════════════════════════╝
  `);
});

module.exports = app;
