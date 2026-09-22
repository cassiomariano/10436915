// Database setup script
// Run with node database/init.js

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
// create table
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

  // Check if db has data.
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
    addZone.run('Coral Zone', 'Shallow coral reefs with tropical fish and live displays.', 'coral.jpg', 'Colourful coral reef');
    addZone.run('Deep Sea Trench', 'Explore the mysterious creatures of the ocean depths.', 'deep-sea.jpg', 'golden jellyfish in the deep blue');
    addZone.run('Rockpools', 'Interactive tide pool exhibits with starfish and sea anemones.', 'rockpools.jpg', 'Starfish in a rockpool');
    addZone.run('Freshwater Rivers', 'Discover river giants, otters and lush rainforest ecosystems.', 'freshwater.jpg', 'Otters in river');
    addZone.finalize();

    // insert exhibits for each zone: 1 = Coral, 2 = Deep Sea, 3 = Rockpools, 4 = Freshwate
    const addExhibit = db.prepare('INSERT INTO exhibits (zone_id, name, description) VALUES (?, ?, ?)');
    addExhibit.run(1, 'Clownfish Kingdom', 'Clownfish living among sea anemones.');
    addExhibit.run(1, 'Reef Shark Lagoon', 'Watch blacktip stingrays glide past our panoramic viewing tunnel.');
    addExhibit.run(1, 'Coral Nursery', 'See how we grow new coral fragments to help restore reefs.');

    addExhibit.run(2, 'Giant Pacific Octopus Tank', 'Observe the octopus exploring its deep-water home.');
    addExhibit.run(2, 'Glow in the Dark', 'A darkened gallery of bioluminescent jellyfish and lanternfish.');
    addExhibit.run(2, 'Pressure Chamber', 'An interactive display showing how deep-sea animals survive sea pressure.');

    addExhibit.run(3, 'Touch Pool Experience', 'Guided hands-on encounter with rockpool sea life.');
    addExhibit.run(3, 'Crab Cove', 'Shore crabs and hermit crabs in a recreated tidal shoreline.');
    addExhibit.run(3, 'Seashore Detectives', 'Kids trail to identify creatures using spotter cards.');

    addExhibit.run(4, 'Amazonian Giant Fish', 'Meet massive freshwater species from tropical rivers.');
    addExhibit.run(4, 'Otter Riverbank', 'Asian short-clawed otters playing in a stream.');
    addExhibit.run(4, 'Rainforest Canopy', 'Walkway with poison dart frogs and tropical plants.');
    addExhibit.finalize();

    console.log('Database set up successfully.');
  });
});