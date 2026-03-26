const { db } = require('../database/db');

const Property = {
  getAll() {
    const properties = db.prepare('SELECT * FROM properties ORDER BY id').all();
    return properties.map(p => ({
      ...p,
      amenities: JSON.parse(p.amenities || '[]'),
      nearby: JSON.parse(p.nearby || '[]')
    }));
  },

  getById(id) {
    const p = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    if (!p) return null;
    return {
      ...p,
      amenities: JSON.parse(p.amenities || '[]'),
      nearby: JSON.parse(p.nearby || '[]')
    };
  },

  getRoomTypes(propertyId) {
    const rooms = db.prepare('SELECT * FROM room_types WHERE property_id = ? ORDER BY price_monthly DESC').all(propertyId);
    return rooms.map(r => ({
      ...r,
      features: JSON.parse(r.features || '[]'),
      available: Property.getAvailableUnits(r.id, r.total_units, r.type)
    }));
  },

  getAvailableUnits(roomTypeId, totalUnits, type) {
    if (type === 'bedspace') {
      // Count active bookings for this room type
      const booked = db.prepare(`
        SELECT COUNT(*) as c FROM bookings
        WHERE room_type_id = ? AND status IN ('active','pending')
      `).get(roomTypeId);
      return Math.max(0, totalUnits - booked.c);
    } else if (type === 'partition') {
      const booked = db.prepare(`
        SELECT COUNT(*) as c FROM bookings
        WHERE room_type_id = ? AND status IN ('active','pending')
      `).get(roomTypeId);
      return Math.max(0, totalUnits - booked.c);
    } else {
      const booked = db.prepare(`
        SELECT COUNT(*) as c FROM bookings
        WHERE room_type_id = ? AND status IN ('active','pending')
      `).get(roomTypeId);
      return Math.max(0, totalUnits - booked.c);
    }
  },

  getAllWithStats() {
    const properties = Property.getAll();
    return properties.map(p => {
      const roomTypes = Property.getRoomTypes(p.id);
      const totalCapacity = roomTypes.reduce((sum, r) => sum + r.total_units, 0);
      const totalAvailable = roomTypes.reduce((sum, r) => sum + r.available, 0);
      const lowestPrice = Math.min(...roomTypes.map(r => r.price_monthly));
      return { ...p, roomTypes, totalCapacity, totalAvailable, lowestPrice };
    });
  }
};

module.exports = Property;
