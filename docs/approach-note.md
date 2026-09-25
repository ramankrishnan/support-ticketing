# Approach Note — Student Support & Ticket Management System

## Objective
Build a working prototype where students raise support tickets (fees, attendance, ID cards, documents, certificates, other), staff own/process/resolve them, and management has visibility into ticket status, ageing, and overdue items.

## Users / Roles
- **Student** — creates tickets, can view their own tickets
- **Staff** — gets assigned tickets, updates status, adds resolution notes
- **Manager** — visibility across all tickets (read access via the same list/filter endpoints)

## Ticket Workflow
new → assigned → in_progress → pending → resolved → closed
(escalated is available as a status when a ticket needs urgent attention or has breached its SLA)

## Key Features Implemented
- Ticket creation with category and priority
- Status workflow covering the full lifecycle
- Staff assignment/ownership
- SLA via a computed `due_by` field (High = 24h, Medium = 72h, Low = 168h from creation)
- Ageing/overdue detection via a `GET /api/tickets?overdue=true` filter (due_by < now, excluding resolved/closed)
- Full activity/audit history — every status, priority, assignment, or resolution-notes change is logged with a timestamp
- Management visibility via filterable ticket list (status, priority, assigned staff, overdue)

## Architecture
- **Backend:** Node.js + Express, REST API under `/api`
- **Database:** SQLite (via better-sqlite3) — a single-file database, sufficient for a prototype; would move to PostgreSQL for a production/multi-user deployment
- **Frontend:** Static HTML + vanilla JavaScript served directly by Express (`public/` folder) — no build tooling, calls the API with `fetch()`
- **Data model:** `users`, `tickets`, `activity_log` tables (see schema in `server/db/database.js`)

## Assumptions
- No authentication system implemented — users are selected from a dropdown (seeded test users: 1 student, 1 staff, 1 manager) rather than logged in. In production this would be replaced with real auth and session-based user identity.
- SLA durations are fixed constants per priority level, not a configurable rules engine.
- No email/SMS notifications — status and history changes are visible only within the app.
- One ticket has exactly one assigned staff member at a time (no split/merge/multi-assignee support).
- Manager role currently has the same read access as anyone querying the list/filter endpoints — no separate manager-only dashboard UI was built given time constraints, though the underlying API supports it.

## Trade-offs (given the assignment deadline)
- Chose SQLite + vanilla JS frontend over a full framework (React) or production database (PostgreSQL) to prioritize a working, verifiable end-to-end system within the time available.
- Skipped authentication entirely rather than building a partial/insecure version of it.
- Kept the UI functional rather than visually polished — the priority was demonstrating correct workflow logic (status transitions, SLA computation, audit trail) over UI design.

## Edge Cases Considered
- Ticket not found → API returns 404 with a clear error message (tested for both GET and PATCH on `/api/tickets/:id`)
- Missing required fields on ticket creation → API returns 400 with a validation message
- Overdue calculation explicitly excludes tickets already `resolved` or `closed`, so completed work is never flagged as overdue
- Activity log only records an entry when a field actually changes (a PATCH request that changes nothing produces no log noise)
- Category, priority, and status are constrained at the database level via CHECK constraints, preventing invalid values from ever being stored

## Future Work (explicitly out of scope for this prototype)
- Real authentication and role-based access control
- Email/SMS notifications on status changes or SLA breaches
- File attachments on tickets
- Multi-department ticket routing
- A dedicated manager analytics dashboard (charts, ageing summaries)
- Containerization (Docker) for deployment
