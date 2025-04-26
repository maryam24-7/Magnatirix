const express = require('express');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (JS, CSS, images, etc.) from the current directory
app.use(express.static(__dirname));

// Serve HTML pages manually
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/sender.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'sender.html'));
});

app.get('/receiver.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'receiver.html'));
});

app.get('/generate.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'generate.html'));
});

app.get('/connect.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'connect.html'));
});

// Routes without .html (redirect to correct page)
app.get('/sender', (req, res) => {
  res.redirect('/sender.html');
});

app.get('/receiver', (req, res) => {
  res.redirect('/receiver.html');
});

app.get('/generate', (req, res) => {
  res.redirect('/generate.html');
});

app.get('/connect', (req, res) => {
  res.redirect('/connect.html');
});

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected.');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});
