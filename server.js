const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// إعداد الشهادة والمفتاح الخاص
const server = https.createServer({
  key: fs.readFileSync('certs/private-key.pem'),
  cert: fs.readFileSync('certs/certificate.pem')
});

const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // تخزين اسم المستخدم مع معلومات الاتصال والمفتاح العام
const registeredUsers = {}; // تخزين بيانات المستخدمين المسجلين (username, hashed password)

// مفتاح التوقيع لـ JWT
const JWT_SECRET = 'supersecretkey'; // يجب تغييره في بيئة الإنتاج

// تسجيل مستخدم جديد
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (registeredUsers[username]) {
    return res.status(400).json({ error: 'هذا المستخدم مسجل بالفعل.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  registeredUsers[username] = { password: hashedPassword };
  res.json({ message: 'تم التسجيل بنجاح!' });
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = registeredUsers[username];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// المصادقة باستخدام JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// استعادة المستخدمين النشطين
app.get('/users', authenticateToken, (req, res) => {
  res.json(Object.keys(users));
});

// WebSocket لإدارة التراسل
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Secure server running at https://localhost:${PORT}`);
});
