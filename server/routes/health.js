const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/health
// Confirms the server is running AND the database connection works.
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('INSERT INTO health_check DEFAULT VALUES');
    const result = stmt.run();

    const row = db.prepare('SELECT * FROM health_check WHERE id = ?').get(result.lastInsertRowid);

    res.json({
      status: 'ok',
      message: 'Server and database are working',
      record: row
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = router;
