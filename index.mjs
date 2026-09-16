import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error("Database error:", err.message);
  else console.log("Connected to SQLite database.");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Home - TheAquarium World' });
});

// Marine Zones Route
app.get('/zones', (req, res) => {
  const query = `
    SELECT 
      zones.id AS zone_id,
      zones.name AS zone_name, 
      zones.description AS zone_desc,
      exhibits.name AS exhibit_name, 
      exhibits.description AS exhibit_desc
    FROM zones
    LEFT JOIN exhibits ON zones.id = exhibits.zone_id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Database Query Error:", err.message);
      return res.status(500).send("Database Error: " + err.message);
    }
    
    res.render('zones', { 
      pageTitle: 'Marine Zones - Aquarium World', 
      data: rows 
    });
  });
});ß

app.get('/faq', (req, res) => {
  res.render('faq', { pageTitle: 'FAQ - The Aquarium World' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { pageTitle: 'Contact Us - Aquarium World' });
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const query = "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)";
  db.run(query, [name, email, message], function(err) {
    if (err) return res.status(500).send("Error saving contact submission.");
    res.render('contact-success', { pageTitle: 'Thank You - TheAquarium World' });
  });
});

app.get('/activity', (req, res) => {
  res.render('activity', { pageTitle: 'Marine Reveal Game - Aquarium World' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});