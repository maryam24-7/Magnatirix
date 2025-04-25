const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();

// تحميل الشهادة والمفتاح الخاص
const server = https.createServer({
  key: fs.readFileSync('certs/private-key.pem'),
  cert: fs.readFileSync('certs/certificate.pem')
});

const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // تخزين اسم المستخدم مع معلومات الاتصال والمفتاح العام

wss.on('connection', socket => {
  console.log('Client connected');

  socket.on('message', msg => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'register') {
        socket.username = data.username;
        socket.publicKey = data.publicKey;
        users[data.username] = {
          socket,
          publicKey: data.publicKey,
          registeredAt: new Date()
        };
        console.log(`User registered: ${data.username}`);
        return;
      }

      const { sender, receiver, encryptedMessage, encryptedKey, iv, hmac } = data;
      const recipient = users[receiver];

      if (recipient && recipient.socket.readyState === WebSocket.OPEN) {
        recipient.socket.send(JSON.stringify({
          sender,
          encryptedMessage,
          encryptedKey,
          iv,
          hmac
        }));
      } else {
        socket.send(JSON.stringify({ error: 'المستلم غير متصل.' }));
      }
    } catch (e) {
      console.error('Error processing message:', e.message);
      socket.send(JSON.stringify({ error: 'Processing failed' }));
    }
  });

  socket.on('close', () => {
    for (const [username, user] of Object.entries(users)) {
      if (user.socket === socket) {
        delete users[username];
        console.log(`User disconnected: ${username}`);
        break;
      }
    }
  });
});

app.get('/public-key/:username', (req, res) => {
  const user = users[req.params.username];
  if (user) {
    res.send(user.publicKey);
  } else {
    res.status(404).send('User not found');
  }
});

app.get('/users', (req, res) => {
  res.json(Object.keys(users));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Secure server running at https://localhost:${PORT}`);
});
