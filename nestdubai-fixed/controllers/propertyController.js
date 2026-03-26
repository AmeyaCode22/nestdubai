const Property = require('../models/Property');

const propertyController = {
  listAll(req, res) {
    const properties = Property.getAllWithStats();
    res.render('properties', {
      title: 'Find Your Room — NestDubai',
      properties,
      filter: req.query.type || 'all',
      area: req.query.area || 'all'
    });
  },

  showOne(req, res) {
    const id = parseInt(req.params.id);
    const property = Property.getById(id);
    if (!property) return res.status(404).render('404', { title: 'Not Found — NestDubai' });

    const roomTypes = Property.getRoomTypes(id);
    const allProperties = Property.getAll();

    res.render('property', {
      title: `${property.name} — NestDubai`,
      property,
      roomTypes,
      allProperties
    });
  },

  // API endpoint for real-time vacancy updates
  getVacancies(req, res) {
    const properties = Property.getAllWithStats();
    const data = properties.map(p => ({
      id: p.id,
      name: p.name,
      roomTypes: p.roomTypes.map(r => ({
        id: r.id,
        type: r.type,
        label: r.label,
        available: r.available,
        total: r.total_units,
        price: r.price_monthly
      }))
    }));
    res.json(data);
  }
};

module.exports = propertyController;
