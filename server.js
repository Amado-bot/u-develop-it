const express = require('express');
const mysql = require('mysql2')
const PORT = process.env.PPORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

// Express middleware
app.use(express.urlencoded({
  extended: false
}));

// Connect to database
const db = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'election'
  },
  console.log('Connected to the election database.')
);

app.use(express.json());

// Get all candidates
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT * FROM candidates`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({
        error: err.message
      });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

//Get a Single Candidates
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({
        error: err.message
      });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({
        error: res.message
      });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});