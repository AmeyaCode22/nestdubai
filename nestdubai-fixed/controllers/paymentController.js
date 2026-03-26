const Booking = require('../models/Booking');
const { db } = require('../database/db');

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here') {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.log('Stripe not configured — payment will use demo mode');
}

const paymentController = {
  showPayment(req, res) {
    const bookingId = parseInt(req.params.id);
    const booking = Booking.getById(bookingId);

    if (!booking || booking.user_id !== req.session.userId) {
      return res.redirect('/dashboard');
    }

    if (booking.payment_status === 'paid') {
      return res.redirect(`/payment/success/${bookingId}`);
    }

    res.render('payment', {
      title: 'Complete Payment — NestDubai',
      booking,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      stripeConfigured: !!stripe,
      error: null
    });
  },

  async createPaymentIntent(req, res) {
    const bookingId = parseInt(req.params.id);
    const booking = Booking.getById(bookingId);

    if (!booking || booking.user_id !== req.session.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!stripe) {
      // Demo mode — simulate success
      return res.json({ clientSecret: 'demo_' + bookingId, demo: true });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.total_amount * 100), // in fils (AED cents)
        currency: 'aed',
        metadata: {
          booking_id: bookingId.toString(),
          user_id: booking.user_id.toString(),
          property: booking.property_name,
          room_type: booking.room_type
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Payment initialization failed' });
    }
  },

  async confirmPayment(req, res) {
    const bookingId = parseInt(req.params.id);
    const { paymentIntentId, demo } = req.body;
    const booking = Booking.getById(bookingId);

    if (!booking || booking.user_id !== req.session.userId) {
      return res.redirect('/dashboard');
    }

    // Demo mode
    if (demo === 'true' || !stripe) {
      Booking.updatePayment(bookingId, {
        payment_status: 'paid',
        stripe_payment_intent_id: 'demo_' + Date.now()
      });

      db.prepare(`
        INSERT INTO payments (booking_id, user_id, amount, status, paid_at)
        VALUES (?, ?, ?, 'paid', CURRENT_TIMESTAMP)
      `).run(bookingId, req.session.userId, booking.total_amount);

      return res.redirect(`/payment/success/${bookingId}`);
    }

    // Real Stripe
    try {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status === 'succeeded') {
        Booking.updatePayment(bookingId, {
          payment_status: 'paid',
          stripe_payment_intent_id: paymentIntentId
        });

        db.prepare(`
          INSERT INTO payments (booking_id, user_id, amount, stripe_payment_intent_id, status, paid_at)
          VALUES (?, ?, ?, ?, 'paid', CURRENT_TIMESTAMP)
        `).run(bookingId, req.session.userId, booking.total_amount, paymentIntentId);

        res.redirect(`/payment/success/${bookingId}`);
      } else {
        res.redirect(`/payment/${bookingId}?error=payment_failed`);
      }
    } catch (err) {
      console.error(err);
      res.redirect(`/payment/${bookingId}?error=verification_failed`);
    }
  },

  showSuccess(req, res) {
    const bookingId = parseInt(req.params.id);
    const booking = Booking.getById(bookingId);

    if (!booking || booking.user_id !== req.session.userId) {
      return res.redirect('/dashboard');
    }

    res.render('payment-success', {
      title: 'Booking Confirmed! — NestDubai',
      booking
    });
  }
};

module.exports = paymentController;
