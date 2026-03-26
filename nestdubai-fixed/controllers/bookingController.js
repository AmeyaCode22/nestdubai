const Property = require('../models/Property');
const Booking = require('../models/Booking');

const bookingController = {
  showBookingForm(req, res) {
    const propertyId = parseInt(req.query.property || 1);
    const roomTypeId = parseInt(req.query.room || 0);
    const property = Property.getById(propertyId);
    if (!property) return res.redirect('/properties');

    const roomTypes = Property.getRoomTypes(propertyId);
    const selectedRoom = roomTypeId ? roomTypes.find(r => r.id === roomTypeId) : roomTypes[0];

    const allProperties = Property.getAll();

    res.render('book', {
      title: 'Book Your Room — NestDubai',
      property,
      roomTypes,
      selectedRoom,
      allProperties,
      error: null
    });
  },

  submitBooking(req, res) {
    const { property_id, room_type_id, move_in_date, duration_months } = req.body;
    const userId = req.session.userId;

    const property = Property.getById(parseInt(property_id));
    const roomTypes = Property.getRoomTypes(parseInt(property_id));
    const selectedRoom = roomTypes.find(r => r.id === parseInt(room_type_id));
    const allProperties = Property.getAll();

    if (!property || !selectedRoom) {
      return res.redirect('/properties');
    }

    if (selectedRoom.available <= 0) {
      return res.render('book', {
        title: 'Book Your Room — NestDubai',
        property, roomTypes, selectedRoom, allProperties,
        error: 'Sorry, no vacancies available for this room type. Please choose another.'
      });
    }

    if (!move_in_date) {
      return res.render('book', {
        title: 'Book Your Room — NestDubai',
        property, roomTypes, selectedRoom, allProperties,
        error: 'Please select a move-in date.'
      });
    }

    const months = parseInt(duration_months) || 6;
    const total = selectedRoom.price_monthly * months;

    const bookingId = Booking.create({
      user_id: userId,
      room_type_id: selectedRoom.id,
      property_id: property.id,
      move_in_date,
      duration_months: months,
      total_amount: total
    });

    res.redirect(`/payment/${bookingId}`);
  }
};

module.exports = bookingController;
