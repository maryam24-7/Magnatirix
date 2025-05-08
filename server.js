require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. Init DB Connection
require('./src/core/database')();

// 2. Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. Routes
app.use('/api', require('./src/routes'));

// 4. Frontend Routes
app.get(['/', '/receive'], (req, res) => {
  const page = req.path === '/' ? 'index.html' : 'receive.html';
  res.sendFile(path.join(__dirname, 'public', page));
});

// 5. Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 6. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
