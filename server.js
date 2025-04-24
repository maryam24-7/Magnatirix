const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

wss.on('connection', socket => {
  console.log('Client connected.');

  socket.on('message', msg => {
    try {
      const { encryptedMessage, encryptedKey, iv, hmac } = JSON.parse(msg);

      const aesKey = crypto.privateDecrypt(
        privateKey,
        Buffer.from(encryptedKey, 'base64')
      );

      const newHmac = crypto.createHmac('sha256', aesKey)
        .update(encryptedMessage)
        .digest('base64');

      if (newHmac !== hmac) {
        socket.send(JSON.stringify({ error: 'فشل التحقق من HMAC' }));
        return;
      }

      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        aesKey,
        Buffer.from(iv, 'base64')
      );

      let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      wss.clients.forEach(client => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ decryptedMessage: decrypted }));
        }
      });

    } catch (e) {
      socket.send(JSON.stringify({ error: 'فشل فك التشفير' }));
    }
  });
});

app.get('/public-key', (req, res) => {
  res.send(publicKey);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));