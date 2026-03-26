const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const propertyController = require('../controllers/propertyController');
const bookingController = require('../controllers/bookingController');
const paymentController = require('../controllers/paymentController');
const adminController = require('../controllers/adminController');
const dashboardController = require('../controllers/dashboardController');
const Property = require('../models/Property');
const { requireAuth, requireAdmin, redirectIfAuth } = require('../middleware/auth');

// ─── HOME ──────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const properties = Property.getAllWithStats();
  res.render('index', {
    title: 'NestDubai — Student Accommodation in Dubai',
    properties
  });
});

// ─── ABOUT ────────────────────────────────────────────────────
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us — NestDubai' });
});

// ─── AUTH ─────────────────────────────────────────────────────
router.get('/login', redirectIfAuth, authController.showLogin);
router.post('/login', authController.login);
router.get('/register', redirectIfAuth, authController.showRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// ─── PROPERTIES ───────────────────────────────────────────────
router.get('/properties', propertyController.listAll);
router.get('/properties/:id', propertyController.showOne);

// ─── API: VACANCIES ───────────────────────────────────────────
router.get('/api/vacancies', propertyController.getVacancies);

// ─── DASHBOARD ────────────────────────────────────────────────
router.get('/dashboard', requireAuth, dashboardController.show);

// ─── BOOKING ──────────────────────────────────────────────────
router.get('/book', requireAuth, bookingController.showBookingForm);
router.post('/book', requireAuth, bookingController.submitBooking);

// ─── PAYMENT ──────────────────────────────────────────────────
router.get('/payment/:id', requireAuth, paymentController.showPayment);
router.post('/payment/:id/intent', requireAuth, paymentController.createPaymentIntent);
router.post('/payment/:id/confirm', requireAuth, paymentController.confirmPayment);
router.get('/payment/success/:id', requireAuth, paymentController.showSuccess);

// ─── ADMIN ────────────────────────────────────────────────────
router.get('/admin', requireAdmin, adminController.showDashboard);
router.post('/admin/booking/status', requireAdmin, adminController.updateBookingStatus);
router.post('/admin/booking/:id/cancel', requireAdmin, adminController.cancelBooking);

// ─── 404 ──────────────────────────────────────────────────────
router.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found — NestDubai' });
});

module.exports = router;
