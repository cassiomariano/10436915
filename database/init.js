// Creat the db tables and adds the starting data. run with node database/init.js

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  // Table for the aquarium's themed zones
  db.run(`
    CREATE TABLE IF NOT EXISTS zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      image_alt TEXT NOT NULL
    )
  `);

  // table for exhibits; each exhibit belongs to one zone
  db.run(`
    CREATE TABLE IF NOT EXISTS exhibits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zone_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY(zone_id) REFERENCES zones(id)
    )
  `);

  // Table for messages sent through the contact form
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Only add the starting data if the zones table is empty
  db.get('SELECT COUNT(*) AS count FROM zones', (err, row) => {
    if (err) {
      console.error('Error checking zones:', err.message);
      return;
    }
    if (row.count > 0) {
      console.log('Database already has data. Nothing added.');
      return;
    }

    const addZone = db.prepare('INSERT INTO zones (name, description, image, image_alt) VALUES (?, ?, ?, ?)');
    addZone.run('Coral Zone', 'Vibrant shallow reefs featuring tropical fish and live coral displays.', 'coral.jpg', 'Colourful coral reef');
    addZone.run('Deep Sea Trench', 'Explore the mysterious creatures of the ocean depths.', 'deep-sea.jpg', 'golden jellyfish with long trailing tentacles in the blue sea');
    addZone.run('Rockpools', 'Interactive tide pool exhibits with starfish and sea anemones.', 'rockpools.jpg', 'Starfish in a rockpool');
    addZone.run('Freshwater Rivers', 'Discover river giants, otters and lush rainforest ecosystems.', 'freshwater.jpg', 'two otters in a clear river');
    addZone.finalize();

    // zone_id: 1 = Coral, 2 = Deep Sea, 3 = Rockpools, 4 = Freshwater
    const addExhibit = db.prepare('INSERT INTO exhibits (zone_id, name, description) VALUES (?, ?, ?)');
    addExhibit.run(1, 'Clownfish Kingdom', 'A colourful display of clownfish living among sea anemones.');
    addExhibit.run(1, 'Reef Shark Lagoon', 'Watch blacktip reef sharks glide past our panoramic viewing window.');
    addExhibit.run(1, 'Coral Nursery', 'See how our team grows new coral fragments to help restore damaged reefs.');

    addExhibit.run(2, 'Giant Pacific Octopus Tank', 'Observe the intelligent octopus exploring its deep-water home.');
    addExhibit.run(2, 'Glow in the Dark', 'A darkened gallery of bioluminescent jellyfish and lanternfish.');
    addExhibit.run(2, 'Pressure Chamber', 'An interactive display showing how deep-sea animals survive crushing depths.');

    addExhibit.run(3, 'Touch Pool Experience', 'A hands-on encounter with gentle rockpool sea life, guided by our staff.');
    addExhibit.run(3, 'Crab Cove', 'Shore crabs and hermit crabs in a recreated tidal shoreline.');
    addExhibit.run(3, 'Seashore Detectives', 'A hands-on trail where children identify creatures using spotter cards.');

    addExhibit.run(4, 'Amazonian Giant Fish', 'Meet massive freshwater species from tropical rivers.');
    addExhibit.run(4, 'Otter Riverbank', 'Asian short-clawed otters playing in a flowing stream.');
    addExhibit.run(4, 'Rainforest Canopy', 'A humid walkway of poison dart frogs and tropical plants.');
    addExhibit.finalize();

    console.log('Database created and filled with starting data.');
  });
});