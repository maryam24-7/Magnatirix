const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML pages
const serveHtml = (fileName) => (req, res) => {
  res.sendFile(path.join(__dirname, 'public', fileName));
};

app.get('/', serveHtml('index.html'));
app.get('/sender.html', serveHtml('sender.html'));
app.get('/receiver.html', serveHtml('receiver.html'));
app.get('/generate.html', serveHtml('generate.html'));
app.get('/connect.html', serveHtml('connect.html'));

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
let server;

if (isProduction) {
  // Production: Use HTTP (Railway handles HTTPS)
  server = http.createServer(app);
  console.log("Running in PRODUCTION mode (HTTP)");
} else {
  // Development: Use HTTPS with self-signed certificates
  // Generate SSL certificates if they don't exist
  if (!fs.existsSync(path.join(__dirname, 'ssl'))) {
    fs.mkdirSync(path.join(__dirname, 'ssl'));
    const { execSync } = require('child_process');
    try {
      execSync('openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.cert -days 365 -nodes -subj "/CN=localhost"');
      console.log('Self-signed certificates generated');
    } catch (err) {
      console.error('Failed to generate SSL certificates:', err);
    }
  }

  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert'))
  };
  server = https.createServer(sslOptions, app);
  console.log("Running in DEVELOPMENT mode (HTTPS)");
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Broadcast message to all clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});
