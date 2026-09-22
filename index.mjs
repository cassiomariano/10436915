// Aquarium World - start the website with: node index.mjs

import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = 5000; // port required by the brief

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Home - Aquarium World' });
});

app.get('/zones', (req, res) => {
  const query = `
    SELECT zones.id AS zone_id, zones.name AS zone_name, zones.description AS zone_desc,
           exhibits.name AS exhibit_name, exhibits.description AS exhibit_desc
    FROM zones
    LEFT JOIN exhibits ON zones.id = exhibits.zone_id
    ORDER BY zones.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).send('Sorry, the zones could not be loaded.');
    }

    // The join returns one row per exhibit, so group the exhibits under each zone
    const zones = [];
    rows.forEach(row => {
      let zone = zones.find(z => z.id === row.zone_id);
      if (!zone) {
        zone = { id: row.zone_id, name: row.zone_name, description: row.zone_desc, exhibits: [] };
        zones.push(zone);
      }
      if (row.exhibit_name) {
        zone.exhibits.push({ name: row.exhibit_name, description: row.exhibit_desc });
      }
    });

    res.render('zones', { pageTitle: 'Explore the Zones - Aquarium World', zones: zones });
  });
});

app.get('/activity', (req, res) => {
  res.render('activity', { pageTitle: 'Deep Sea Game - Aquarium World' });
});

app.get('/faq', (req, res) => {
  res.render('faq', { pageTitle: 'Visitor FAQs - Aquarium World' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { pageTitle: 'Get in Touch - Aquarium World' });
});

app.post('/contact', (req, res) => {
  // Server-side validation: never trust data from the browser alone
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();

  if (name.length < 2 || !email.includes('@') || message.length < 10) {
    return res.status(400).send('Please go back and fill in all fields correctly.');
  }

  // Parameterised query (the ? marks) prevents SQL injection
  const query = 'INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)';

  db.run(query, [name, email, message], function (err) {
    if (err) {
      console.error('Insert error:', err.message);
      return res.status(500).send('Sorry, your message could not be saved.');
    }
    res.render('contact-success', { pageTitle: 'Thank You - Aquarium World' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});