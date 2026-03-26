const { db } = require('./db');
const bcrypt = require('bcryptjs');

function seedDB() {
  const propCount = db.prepare('SELECT COUNT(*) as c FROM properties').get();
  if (propCount.c > 0) return;

  // ─── PROPERTIES ───────────────────────────────────────────────
  const insertProp = db.prepare(`
    INSERT INTO properties (name, area, address, description, tagline, google_maps_embed, image_hero, image_2, image_3, amenities, nearby)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const properties = [
    {
      name: 'Barsha Heights Nest',
      area: 'Barsha Heights',
      address: 'Al Thanyah 1, Barsha Heights (TECOM), Dubai',
      description: 'Nestled in the heart of Barsha Heights, this modern student residence puts you minutes from Dubai Internet City and Media City free zones. High-speed fibre internet, 24/7 security, and a rooftop chill-out zone make this the most connected student home in Dubai. Metro access at TECOM station is a 7-minute walk. Perfect for students at Middlesex University Dubai, BITS Pilani Dubai, and American University in Dubai.',
      tagline: 'Connected. Central. Comfortable.',
      google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.047!2d55.175!3d25.0770!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA0JzM3LjIiTiA1NcKwMTAnMzAuMCJF!5e0!3m2!1sen!2sae!4v1600000000000',
      image_hero: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&q=80',
      image_2: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      image_3: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      amenities: JSON.stringify(['High-Speed Fibre WiFi','24/7 Security & CCTV','Rooftop Lounge','Shared Study Room','Laundry Facility','Equipped Kitchen','Prayer Room','Air Conditioning','Elevator Access','Maintenance Support']),
      nearby: JSON.stringify(['TECOM Metro (7 min walk)','Dubai Internet City (10 min)','Mall of the Emirates (12 min)','Carrefour Supermarket (5 min)','Hospitals & Clinics (8 min)'])
    },
    {
      name: 'TECOM Scholar Suites',
      area: 'TECOM',
      address: 'Dubai Knowledge Village, TECOM, Dubai',
      description: 'TECOM Scholar Suites is purpose-built for the ambitious student. Located within Dubai Knowledge Village, you\'ll be surrounded by universities, tech parks, and global corporations. The building features dedicated co-working pods, a social lounge with foosball and bean bags, and an on-site convenience store. Whether you\'re up at 2AM coding or cramming for finals — this is your zone.',
      tagline: 'Where Ambition Lives.',
      google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613!2d55.172!3d25.098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjU!5e0!3m2!1sen!2sae!4v1600000000001',
      image_hero: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80',
      image_2: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      image_3: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      amenities: JSON.stringify(['Gigabit WiFi','Co-Working Pods','Social Lounge & Games Room','24/7 Reception','Smart Card Access','Rooftop BBQ Area','Bicycle Parking','On-site Convenience Store','Dedicated Study Halls','Air Conditioning']),
      nearby: JSON.stringify(['Dubai Knowledge Village (2 min walk)','American University in Dubai (5 min)','Ibn Battuta Mall (15 min)','JBR Beach (20 min)','Metro at Nakheel (10 min)'])
    },
    {
      name: 'Discovery Gardens Residence',
      area: 'Discovery Gardens',
      address: 'Zen Cluster, Discovery Gardens, Dubai',
      description: 'The most affordable student home in our portfolio, without compromising on quality. Discovery Gardens Residence offers a peaceful, garden-facing community with lush greenery and a strong sense of neighbourhood. Free shuttle to Ibn Battuta Mall metro station. Perfect for students at Jebel Ali area institutions and those who love a quieter lifestyle while staying connected to the city.',
      tagline: 'Peaceful. Green. Affordable.',
      google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617!2d55.143!3d25.045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sae!4v1600000000002',
      image_hero: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80',
      image_2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      image_3: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80',
      amenities: JSON.stringify(['Free Metro Shuttle','Swimming Pool','Gym & Fitness Center','Garden & Outdoor Seating','24/7 Security','Shared Kitchen','Laundry Room','Prayer Room','Kids Play Area (Community)','Air Conditioning']),
      nearby: JSON.stringify(['Ibn Battuta Mall (5 min)','Ibn Battuta Metro (free shuttle)','Beach (30 min)','Supermarkets & Pharmacies','Jebel Ali Village (10 min)'])
    },
    {
      name: 'Al Barsha Student Hub',
      area: 'Al Barsha',
      address: 'Al Barsha 1, Near Mall of the Emirates, Dubai',
      description: 'Al Barsha Student Hub puts you in the middle of one of Dubai\'s most popular residential and commercial districts. Mall of the Emirates is your backyard — skating, cinema, restaurants, supermarkets all within walking distance. The Metro is 8 minutes away on foot. With strong community events, weekly movie nights, and a rooftop cinema space, this is the social student accommodation in Dubai.',
      tagline: 'Community. Culture. Convenience.',
      google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614!2d55.199!3d25.113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sae!4v1600000000003',
      image_hero: 'https://images.unsplash.com/photo-1560185008-a33f5a09d5f0?w=1400&q=80',
      image_2: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=80',
      image_3: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
      amenities: JSON.stringify(['Rooftop Cinema','Community Events Program','High-Speed WiFi','24/7 Security','Fully Equipped Kitchen','Laundry Facility','Games Room','Study Lounge','On-Site Parking','Air Conditioning']),
      nearby: JSON.stringify(['Mall of the Emirates (8 min walk)','Mall of Emirates Metro (8 min)','American College of Dubai (10 min)','SAE Institute (12 min)','GEMS Schools & Clinics nearby'])
    }
  ];

  const propIds = [];
  for (const p of properties) {
    const result = insertProp.run(p.name, p.area, p.address, p.description, p.tagline, p.google_maps_embed, p.image_hero, p.image_2, p.image_3, p.amenities, p.nearby);
    propIds.push(result.lastInsertRowid);
  }

  // ─── ROOM TYPES ───────────────────────────────────────────────
  const insertRoom = db.prepare(`
    INSERT INTO room_types (property_id, type, label, price_monthly, total_units, max_occupants, description, features, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Prices per property: [Barsha Heights, TECOM Suites, Discovery Gardens, Al Barsha]
  const studioPrices = [3800, 3600, 3100, 3400];
  const partitionPrices = [1650, 1550, 1250, 1450];
  const bedspacePrices = [950, 900, 700, 800];

  for (let i = 0; i < propIds.length; i++) {
    const pid = propIds[i];

    // Studio
    insertRoom.run(
      pid, 'studio', 'Studio Apartment',
      studioPrices[i], 6, 1,
      'Your own private studio — a fully self-contained living space with a kitchenette, private bathroom, queen-size bed, wardrobe, study desk, and AC. Maximum privacy, complete independence.',
      JSON.stringify(['Private Kitchenette','En-Suite Bathroom','Queen Bed','Study Desk & Chair','Built-in Wardrobe','Air Conditioning','High-Speed WiFi','Smart TV','Private Entry']),
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    );

    // Partition
    insertRoom.run(
      pid, 'partition', 'Private Partition',
      partitionPrices[i], 8, 1,
      'A fully partitioned private room within a shared flat of 8 partitions. Each room is walled-off with a lockable door giving you complete privacy, with shared kitchen and bathrooms. Great value without compromise.',
      JSON.stringify(['Lockable Private Room','Shared Kitchen','Shared Bathrooms (2 per flat)','Single Bed','Study Desk','Built-in Wardrobe','Air Conditioning','High-Speed WiFi','8 Partitions Per Flat']),
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
    );

    // Bedspace
    insertRoom.run(
      pid, 'bedspace', 'Bedspace',
      bedspacePrices[i], 7, 7,
      'Shared living at its most social. Each flat accommodates 7 students — 4 in the hall space and 3 in the room. Fully furnished with individual beds, personal lockers, shared kitchen and bathrooms. Perfect for those who want to keep costs ultra-low and love the energy of shared living.',
      JSON.stringify(['Single Bed with Mattress','Personal Locker (lockable)','Shared Kitchen','Shared Bathrooms','Common Hall Space','Study Area','Air Conditioning','High-Speed WiFi','7 Students Per Flat (4 Hall + 3 Room)']),
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'
    );
  }

  // ─── ADMIN USER ───────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nestdubai.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'NestAdmin2025!';
  const adminHash = bcrypt.hashSync(adminPass, 12);

  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'admin')
    `).run('NestDubai Admin', adminEmail, adminHash);
  }

  // ─── DEMO STUDENT ─────────────────────────────────────────────
  const demoHash = bcrypt.hashSync('Demo1234!', 12);
  const existingDemo = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@student.com');
  if (!existingDemo) {
    db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, nationality, university, student_id, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'student')
    `).run('Alex Johnson', 'demo@student.com', demoHash, '+971501234567', 'British', 'Middlesex University Dubai', 'MDX-2024-001');

    // Add a demo active booking
    const demoUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@student.com');
    const roomType = db.prepare('SELECT id FROM room_types WHERE property_id = 1 AND type = "partition"').get();
    if (demoUser && roomType) {
      db.prepare(`
        INSERT INTO bookings (user_id, room_type_id, property_id, status, move_in_date, duration_months, total_amount, payment_status)
        VALUES (?, ?, 1, 'active', '2025-09-01', 12, 19800, 'paid')
      `).run(demoUser.id, roomType.id);
    }
  }

  console.log('✅ Database seeded successfully');
}

module.exports = { seedDB };
