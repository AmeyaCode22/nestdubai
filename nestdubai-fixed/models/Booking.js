const { db } = require('../database/db');

const Booking = {
  create({ user_id, room_type_id, property_id, move_in_date, duration_months, total_amount }) {
    const result = db.prepare(`
      INSERT INTO bookings (user_id, room_type_id, property_id, move_in_date, duration_months, total_amount, status, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', 'unpaid')
    `).run(user_id, room_type_id, property_id, move_in_date, duration_months, total_amount);
    return result.lastInsertRowid;
  },

  getById(id) {
    return db.prepare(`
      SELECT b.*, u.name as student_name, u.email as student_email, u.phone as student_phone,
             u.nationality, u.university,
             rt.type as room_type, rt.label as room_label, rt.price_monthly,
             p.name as property_name, p.area, p.address
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN room_types rt ON b.room_type_id = rt.id
      JOIN properties p ON b.property_id = p.id
      WHERE b.id = ?
    `).get(id);
  },

  getByUser(userId) {
    return db.prepare(`
      SELECT b.*, rt.type as room_type, rt.label as room_label, rt.price_monthly,
             p.name as property_name, p.area, p.image_hero as property_image
      FROM bookings b
      JOIN room_types rt ON b.room_type_id = rt.id
      JOIN properties p ON b.property_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(userId);
  },

  updateStatus(id, status) {
    return db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
  },

  updatePayment(id, { payment_status, stripe_payment_intent_id }) {
    return db.prepare(`
      UPDATE bookings SET payment_status = ?, stripe_payment_intent_id = ?, status = 'active'
      WHERE id = ?
    `).run(payment_status, stripe_payment_intent_id, id);
  },

  getAll() {
    return db.prepare(`
      SELECT b.*, u.name as student_name, u.email as student_email, u.nationality, u.university,
             rt.type as room_type, rt.label as room_label, rt.price_monthly,
             p.name as property_name, p.area
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN room_types rt ON b.room_type_id = rt.id
      JOIN properties p ON b.property_id = p.id
      ORDER BY b.created_at DESC
    `).all();
  },

  getStats() {
    return {
      total: db.prepare("SELECT COUNT(*) as c FROM bookings").get().c,
      active: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'active'").get().c,
      pending: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'").get().c,
      revenue: db.prepare("SELECT COALESCE(SUM(total_amount), 0) as r FROM bookings WHERE payment_status = 'paid'").get().r
    };
  }
};

module.exports = Booking;
