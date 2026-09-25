const express = require('express');
const path = require('path');
const healthRoute = require('./routes/health');
const ticketsRoute = require('./routes/tickets');
const usersRoute = require('./routes/users');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve the frontend (static files) from the /public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api/health', healthRoute);
app.use('/api/tickets', ticketsRoute);
app.use('/api/users', usersRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
