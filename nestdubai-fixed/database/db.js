const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'nest.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      nationality TEXT,
      university TEXT,
      student_id TEXT,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      address TEXT NOT NULL,
      description TEXT,
      tagline TEXT,
      google_maps_embed TEXT,
      image_hero TEXT,
      image_2 TEXT,
      image_3 TEXT,
      amenities TEXT,
      nearby TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS room_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      price_monthly REAL NOT NULL,
      total_units INTEGER NOT NULL,
      max_occupants INTEGER NOT NULL,
      description TEXT,
      features TEXT,
      image_url TEXT,
      FOREIGN KEY (property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      room_type_id INTEGER NOT NULL,
      property_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      move_in_date TEXT NOT NULL,
      duration_months INTEGER DEFAULT 6,
      total_amount REAL,
      payment_status TEXT DEFAULT 'unpaid',
      stripe_payment_intent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (room_type_id) REFERENCES room_types(id),
      FOREIGN KEY (property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      stripe_payment_intent_id TEXT,
      stripe_charge_id TEXT,
      status TEXT DEFAULT 'pending',
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

module.exports = { db, initDB };
