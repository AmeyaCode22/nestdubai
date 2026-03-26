const User = require('../models/User');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { db } = require('../database/db');

const adminController = {
  showDashboard(req, res) {
    const users = User.getAll();
    const bookings = Booking.getAll();
    const properties = Property.getAllWithStats();
    const stats = Booking.getStats();

    const students = users.filter(u => u.role === 'student');

    res.render('admin', {
      title: 'Admin Dashboard — NestDubai',
      users: students,
      bookings,
      properties,
      stats
    });
  },

  updateBookingStatus(req, res) {
    const { id, status } = req.body;
    Booking.updateStatus(parseInt(id), status);
    res.redirect('/admin');
  },

  cancelBooking(req, res) {
    const id = parseInt(req.params.id);
    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(id);
    res.redirect('/admin');
  }
};

module.exports = adminController;
