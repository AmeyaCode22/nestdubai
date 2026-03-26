const User = require('../models/User');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

const dashboardController = {
  show(req, res) {
    const user = User.findById(req.session.userId);
    const bookings = Booking.getByUser(req.session.userId);
    const properties = Property.getAllWithStats();

    res.render('dashboard', {
      title: 'My Dashboard — NestDubai',
      user,
      bookings,
      properties,
      welcome: req.query.welcome === '1'
    });
  }
};

module.exports = dashboardController;
