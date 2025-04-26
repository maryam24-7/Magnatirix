const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (JS, CSS, images) from current directory
app.use(express.static(__dirname));

// Routes to serve HTML files manually
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

// WebSocket server
let server;
try {
  const privateKey = fs.readFileSync('certs/private-key.pem', 'utf8');
  const certificate = fs.readFileSync('certs/certificate.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  console.log('Using HTTPS server.');
} catch (err) {
  console.warn('Certificates not found. Using HTTP server instead.');
  server = http.createServer(app);
}

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

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
