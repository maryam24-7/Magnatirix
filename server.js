// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const compression = require('compression');
const winston = require('winston');
const csrf = require('csurf');

const app = express();

// =============================================
// إعدادات الثوابت والمتغيرات البيئية
// =============================================
const CONFIG = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  PORT: process.env.PORT || 3000, // تم التعديل هنا للتأكيد على المنفذ 3000
  NODE_ENV: process.env.NODE_ENV || 'production'
};

// =============================================
// إعدادات Winston للتسجيل
// =============================================
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (CONFIG.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// =============================================
// الاتصال بقاعدة البيانات
// =============================================
mongoose.connect(CONFIG.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
})
.then(() => logger.info('✅ تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => {
  logger.error('❌ فشل الاتصال بقاعدة البيانات:', err);
  process.exit(1);
});

// =============================================
// Middleware الأساسية
// =============================================
app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: CONFIG.CORS_ORIGIN,
  credentials: true
}));

// Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  }
}));

// ضغط الردود
app.use(compression());

// تحليل الطلبات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// الجلسات
app.use(session({
  secret: CONFIG.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONFIG.MONGO_URL,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    secure: CONFIG.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: CONFIG.NODE_ENV === 'production' ? 'none' : 'strict', // التعديل المهم هنا
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'لقد تجاوزت عدد الطلبات المسموح بها',
  trustProxy: true
}));

// ملفات ثابتة
app.use(express.static(path.join(__dirname, 'public')));

// =============================================
// نماذج MongoDB
// =============================================
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// =============================================
// Middleware للمصادقة
// =============================================
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'الوصول غير مصرح به' });

  jwt.verify(token, CONFIG.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'رمز وصول غير صالح' });
    req.user = user;
    next();
  });
};

// =============================================
// Routes
// =============================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'بيانات الاعتماد غير صحيحة' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      CONFIG.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: CONFIG.NODE_ENV === 'production',
      sameSite: 'none', // التعديل المهم هنا
      maxAge: 3600000
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    logger.error('خطأ تسجيل الدخول:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(409).json({ error: 'المستخدم موجود مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (err) {
    logger.error('خطأ التسجيل:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    logger.error('خطأ جلب الملف:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =============================================
// معالجة الأخطاء
// =============================================
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'خطأ في الخادم' });
});

// =============================================
// تشغيل الخادم
// =============================================
app.listen(CONFIG.PORT, '0.0.0.0', () => {
  logger.info(`✅ الخادم يعمل على المنفذ ${CONFIG.PORT}`);
});
