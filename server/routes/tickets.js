const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper: compute a due_by timestamp based on priority
function computeDueBy(priority) {
  const hours = { high: 24, medium: 72, low: 168 };
  const dueDate = new Date(Date.now() + hours[priority] * 60 * 60 * 1000);
  return dueDate.toISOString();
}

// POST /api/tickets — create a new ticket
router.post('/', (req, res) => {
  const { title, description, category, priority, created_by } = req.body;

  if (!title || !category || !priority || !created_by) {
    return res.status(400).json({
      status: 'error',
      message: 'title, category, priority, and created_by are required'
    });
  }

  try {
    const due_by = computeDueBy(priority);

    const stmt = db.prepare(`
      INSERT INTO tickets (title, description, category, priority, created_by, due_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, description || null, category, priority, created_by, due_by);

    db.prepare(`
      INSERT INTO activity_log (ticket_id, change_note)
      VALUES (?, ?)
    `).run(result.lastInsertRowid, 'Ticket created with status: new');

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ status: 'ok', ticket });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/tickets — list all tickets, with optional filters
router.get('/', (req, res) => {
  const { status, priority, assigned_to, overdue } = req.query;

  let query = 'SELECT * FROM tickets WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  if (assigned_to) {
    query += ' AND assigned_to = ?';
    params.push(assigned_to);
  }
  if (overdue === 'true') {
    query += " AND due_by < ? AND status NOT IN ('resolved', 'closed')";
    params.push(new Date().toISOString());
  }

  query += ' ORDER BY created_at DESC';

  try {
    const tickets = db.prepare(query).all(...params);
    res.json({ status: 'ok', count: tickets.length, tickets });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/tickets/:id — view one ticket with its full activity history
router.get('/:id', (req, res) => {
  try {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket not found' });
    }

    const history = db.prepare(
      'SELECT * FROM activity_log WHERE ticket_id = ? ORDER BY changed_at ASC'
    ).all(req.params.id);

    res.json({ status: 'ok', ticket, history });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/tickets/:id — update status, priority, assignment, resolution notes, or status_note
router.patch('/:id', (req, res) => {
  const { status, priority, assigned_to, resolution_notes, status_note } = req.body;
  const ticketId = req.params.id;

  try {
    const existing = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Ticket not found' });
    }

    // Guardrail: escalated or pending status should have a reason/context captured
    if ((status === 'escalated' || status === 'pending') && !status_note && !existing.status_note) {
      return res.status(400).json({
        status: 'error',
        message: `A status_note is required when setting status to '${status}' (explain why it's escalated or what it's pending on)`
      });
    }

    const updated = {
      status: status || existing.status,
      priority: priority || existing.priority,
      assigned_to: assigned_to !== undefined ? assigned_to : existing.assigned_to,
      resolution_notes: resolution_notes !== undefined ? resolution_notes : existing.resolution_notes,
      status_note: status_note !== undefined ? status_note : existing.status_note
    };

    db.prepare(`
      UPDATE tickets
      SET status = ?, priority = ?, assigned_to = ?, resolution_notes = ?, status_note = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(updated.status, updated.priority, updated.assigned_to, updated.resolution_notes, updated.status_note, ticketId);

    const changes = [];
    if (status && status !== existing.status) changes.push(`status: ${existing.status} -> ${status}`);
    if (priority && priority !== existing.priority) changes.push(`priority: ${existing.priority} -> ${priority}`);
    if (assigned_to !== undefined && assigned_to !== existing.assigned_to) changes.push(`assigned_to: ${existing.assigned_to} -> ${assigned_to}`);
    if (resolution_notes !== undefined && resolution_notes !== existing.resolution_notes) changes.push('resolution_notes updated');
    if (status_note !== undefined && status_note !== existing.status_note) changes.push(`note: ${status_note}`);

    if (changes.length > 0) {
      db.prepare(`
        INSERT INTO activity_log (ticket_id, change_note)
        VALUES (?, ?)
      `).run(ticketId, changes.join('; '));
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    res.json({ status: 'ok', ticket });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
