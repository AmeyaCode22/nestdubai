const { db } = require('../database/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, phone, nationality, university, student_id, role, created_at FROM users WHERE id = ?').get(id);
  },

  create({ name, email, password, phone, nationality, university, student_id }) {
    const password_hash = bcrypt.hashSync(password, 12);
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, nationality, university, student_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, password_hash, phone || null, nationality || null, university || null, student_id || null);
    return result.lastInsertRowid;
  },

  verifyPassword(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  },

  update(id, { name, phone, nationality, university, student_id }) {
    return db.prepare(`
      UPDATE users SET name = ?, phone = ?, nationality = ?, university = ?, student_id = ?
      WHERE id = ?
    `).run(name, phone, nationality, university, student_id, id);
  },

  getAll() {
    return db.prepare('SELECT id, name, email, phone, nationality, university, role, created_at FROM users ORDER BY created_at DESC').all();
  }
};

module.exports = User;
