const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'tickets.db');
const db = new Database(dbPath);

// Existing verification table — kept as-is from Phase 2
db.exec(`
  CREATE TABLE IF NOT EXISTS health_check (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    checked_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'staff', 'manager'))
  )
`);

// Tickets table (status_note included for fresh installs)
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('fees', 'attendance', 'id_card', 'documents', 'certificates', 'other')),
    priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'assigned', 'in_progress', 'pending', 'resolved', 'closed', 'escalated')),
    created_by INTEGER NOT NULL,
    assigned_to INTEGER,
    resolution_notes TEXT,
    status_note TEXT,
    due_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
  )
`);

// Activity log table
db.exec(`
  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    change_note TEXT NOT NULL,
    changed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
  )
`);

module.exports = db;
