const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = {};
const registeredUsers = {};
const JWT_SECRET = 'supersecretkey';

// تسجيل مستخدم جديد
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (registeredUsers[username]) {
      return res.status(400).json({ error: 'هذا المستخدم مسجل بالفعل.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    registeredUsers[username] = { password: hashedPassword };
    res.json({ message: 'تم التسجيل بنجاح!' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = registeredUsers[username];
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// المصادقة
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

// قائمة المستخدمين
app.get('/users', authenticateToken, (req, res) => {
  res.json(Object.keys(users));
});

// WebSocket
wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'register') {
        socket.username = data.username;
        users[data.username] = { socket };
        console.log(`User registered: ${data.username}`);
        return;
      }

      const { receiver } = data;
      const recipient = users[receiver];

      if (recipient && recipient.socket.readyState === WebSocket.OPEN) {
        recipient.socket.send(JSON.stringify(data));
      } else {
        socket.send(JSON.stringify({ error: 'المستلم غير متصل.' }));
      }
    } catch (e) {
      console.error('Error:', e);
    }
  });

  socket.on('close', () => {
    if (socket.username) {
      delete users[socket.username];
      console.log(`User disconnected: ${socket.username}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
