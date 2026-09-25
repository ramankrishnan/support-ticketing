const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/users — list all users, optional ?role= filter
router.get('/', (req, res) => {
  const { role } = req.query;

  try {
    let users;
    if (role) {
      users = db.prepare('SELECT * FROM users WHERE role = ?').all(role);
    } else {
      users = db.prepare('SELECT * FROM users').all();
    }
    res.json({ status: 'ok', count: users.length, users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
