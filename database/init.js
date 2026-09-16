import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS exhibits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zone_id INTEGER,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY(zone_id) REFERENCES zones(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM zones", (err, row) => {
    if (row && row.count === 0) {
      const stmtZone = db.prepare("INSERT INTO zones (name, description) VALUES (?, ?)");
      stmtZone.run("Coral Reef Zone", "Vibrant shallow reefs featuring tropical fish and live coral displays.");
      stmtZone.run("Deep Sea Trench", "Explore mysterious creatures of the oceanic depths.");
      stmtZone.run("Coastal Rockpools", "Interactive tide pool exhibits with starfish and sea anemones.");
      stmtZone.run("Freshwater Rivers", "Discover river giants, otters, and lush rainforest ecosystems.");
      stmtZone.finalize();

      const stmtExhibit = db.prepare("INSERT INTO exhibits (zone_id, name, description) VALUES (?, ?, ?)");
      stmtExhibit.run(1, "Clownfish Kingdom", "A colorful display of clownfish living among sea anemones.");
      stmtExhibit.run(2, "Giant Pacific Octopus Tank", "Observe the intelligent octopus navigating deep waters.");
      stmtExhibit.run(3, "Touch Pool Experience", "Hands-on encounter with gentle rockpool sea life.");
      stmtExhibit.run(4, "Amazonian Giant Fish", "Meet massive freshwater species from tropical rivers.");
      stmtExhibit.finalize();
    }
  });
});

console.log("Database created!");