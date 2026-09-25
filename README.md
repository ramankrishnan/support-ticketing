# 🎓 Student Support & Ticket Management System

A practical **Student Support & Ticket Management System** developed as a prototype for the **Edumerge Solutions Pre-Drive Product Engineering Assignment — Assignment 4**.

The system provides a centralized platform where students can raise support requests, staff can manage and resolve them, and management can monitor ticket status, ownership, priority, ageing, and overdue requests.

---

## 📌 Problem Statement

Students raise requests related to:

* 💰 Fees
* 📚 Attendance
* 🪪 ID Cards
* 📄 Documents
* 📜 Certificates
* 🏢 Other administrative matters

The system helps staff **own, prioritize, process, and resolve** these requests while providing management with visibility into support operations.

---

## 🎯 Key Objectives

* Centralize student support requests
* Provide clear ticket ownership
* Track ticket status and priority
* Monitor SLA and ticket ageing
* Support pending and escalation workflows
* Maintain resolution information
* Maintain activity history
* Provide management visibility

---

## 👥 User Roles

### 🎓 Student

* Create support tickets
* View submitted tickets
* Track ticket status
* View ticket details and history

### 🧑‍💻 Staff

* View support tickets
* Take ownership of tickets
* Update priority and status
* Add status/resolution notes
* Process and resolve requests

### 👨‍💼 Manager

* View tickets across the system
* Monitor ownership and status
* Identify overdue/ageing tickets
* Monitor overall support activity

---

## 🔄 Ticket Workflow

```text
New
 ↓
Assigned
 ↓
In Progress
 ↓
Pending
 ↓
Resolved
 ↓
Closed
```

Tickets can also be **escalated** when they require attention because of SLA breaches or pending actions.

---

## ⭐ Core Features

### 🎫 Ticket Management

* Create support tickets
* View ticket details
* Track ticket status
* Track ticket priority
* Categorize requests
* Assign ticket ownership

### ⏱️ SLA & Ageing

* Priority-based SLA tracking
* Ticket ageing visibility
* Overdue ticket identification

### 🔄 Pending & Escalation

* Mark tickets as pending when waiting for an action
* Track pending status
* Support escalation of delayed tickets

### 📝 Resolution Tracking

* Add resolution notes
* Record resolution information
* Track resolved tickets

### 📜 Activity History

Ticket activity is maintained to provide visibility into important ticket updates and status changes.

### 📊 Management Visibility

Management can view support activity across tickets and identify tickets requiring attention.

---

## 🛠️ Technology Stack

| Layer           | Technology                    |
| --------------- | ----------------------------- |
| Frontend        | HTML, CSS, Vanilla JavaScript |
| Backend         | Node.js + Express             |
| Database        | SQLite                        |
| Database Driver | better-sqlite3                |
| API             | REST-style HTTP endpoints     |
| Development     | VS Code                       |
| Version Control | Git + GitHub                  |

---

## 🏗️ Architecture

```text
┌──────────────────────┐
│      Web Browser     │
│  HTML / CSS / JS     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Express Server    │
│      REST APIs       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   better-sqlite3     │
│       SQLite         │
└──────────────────────┘
```

The frontend is served by the Express application, while REST-style APIs handle ticket and user operations. SQLite provides lightweight persistent storage suitable for this prototype.

---

## 📂 Project Structure

```text
support-ticketing/
│
├── server/
│   ├── db/
│   │   └── database.js
│   │
│   ├── routes/
│   │   ├── health.js
│   │   ├── tickets.js
│   │   └── users.js
│   │
│   └── app.js
│
├── public/
│   ├── index.html
│   ├── ticket.html
│   └── style.css
│
├── docs/
│   ├── approach-note.md
│   └── ai-usage-report.md
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites

* Node.js 18 or later
* npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/ramankrishnan/support-ticketing.git
cd support-ticketing
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the application

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

### 4. Open the application

```text
http://localhost:3000
```

The SQLite database is created automatically when the application starts.

---

## 🔌 API Endpoints

| Method | Endpoint           | Purpose                           |
| ------ | ------------------ | --------------------------------- |
| POST   | `/api/tickets`     | Create a ticket                   |
| GET    | `/api/tickets`     | List and filter tickets           |
| GET    | `/api/tickets/:id` | View ticket details and history   |
| PATCH  | `/api/tickets/:id` | Update ticket information         |
| GET    | `/api/users`       | List users                        |
| GET    | `/api/health`      | Check application/database health |

### Ticket Filters

The ticket listing API supports filters such as:

* Status
* Priority
* Assigned staff
* Overdue tickets

---

## 🧪 Validation & Edge Cases

The solution considers common support-system scenarios such as:

* Required ticket information
* Invalid or missing ticket data
* Unassigned tickets
* Different ticket priorities
* Status changes
* Pending tickets
* Overdue tickets
* Escalated tickets
* Resolution tracking
* Activity history
* Ticket ownership

The application was tested locally through the browser and API endpoints during development.

---

## 💡 Engineering Decisions

### Why Node.js + Express?

A lightweight backend that is simple to develop, test, and extend.

### Why SQLite?

SQLite provides persistent relational storage without requiring a separate database server, making it suitable for a prototype and assessment environment.

### Why Vanilla JavaScript?

The application does not require a large frontend framework for the current scope. Vanilla JavaScript keeps the prototype lightweight and easy to understand.

### Why REST-style APIs?

Separating frontend interactions from backend operations makes the system easier to test and extend.

---

## ⚖️ Trade-offs

This prototype intentionally focuses on the core support workflow rather than production-scale infrastructure.

Current scope does not include:

* Enterprise authentication/SSO
* Email/SMS notifications
* File attachments
* Multi-institution support
* Advanced reporting
* Production deployment infrastructure

These can be added as future enhancements.

---

## 🔮 Future Enhancements

* Role-based authentication and authorization
* Email/SMS notifications
* File attachment support
* Advanced management dashboard
* Configurable SLA policies
* Automated escalation notifications
* Search and advanced reporting
* Audit logging
* Cloud deployment
* Production database such as PostgreSQL

---

## 📸 Application Screenshots

### Student Support Dashboard

*Add your screenshot here.*

### Create Support Ticket

*Add your screenshot here.*

### Ticket Details & Activity History

*Add your screenshot here.*

### Staff Ticket Management

*Add your screenshot here.*

### Management View

*Add your screenshot here.*

> Replace the screenshot placeholders with the actual project screenshots before final submission.

---

## 📚 Documentation

### Approach Note

See:

```text
docs/approach-note.md
```

This document covers the product objective, users, workflow, assumptions, architecture, engineering decisions, trade-offs, and edge cases.

### AI Usage Report

See:

```text
docs/ai-usage-report.md
```

This contains the mandatory AI usage disclosure required by the Edumerge assignment, including how AI was used and how its output was validated.

---

## 🤖 AI-Assisted Development

AI-assisted development was used during the project for activities including planning, implementation assistance, debugging, documentation, and review.

AI-generated suggestions were reviewed and validated during development rather than being accepted blindly.

Detailed information is provided in:

```text
docs/ai-usage-report.md
```

---

## 👨‍💻 Assignment Information

**Organization:** Edumerge Solutions
**Assignment:** Pre-Drive Product Engineering Assignment
**Selected Assignment:** Assignment 4 — Student Support & Ticket Management
**Project:** Student Support & Ticket Management System

---

## 📦 Repository

**GitHub:**
https://github.com/ramankrishnan/support-ticketing

---

## 📄 License

This project was developed as an assessment prototype for the Edumerge Solutions Pre-Drive Product Engineering Assignment.
