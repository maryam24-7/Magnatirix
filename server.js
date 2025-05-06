require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
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
const bcrypt = require('bcryptjs');
const compression = require('compression');
const winston = require('winston');
const csrf = require('csurf');
const connectDB = require('./db');

const app = express();

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

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// =============================================
// التحقق من المتغيرات البيئية
// =============================================
logger.info('التحقق من المتغيرات البيئية:');
logger.info(`MONGO_URL: ${process.env.MONGO_URL ? '***** موجود *****' : 'غير موجود!'}`);
logger.info(`JWT_SECRET: ${process.env.JWT_SECRET ? '***** موجود *****' : 'غير موجود!'}`);
logger.info(`PORT: ${process.env.PORT}`);
logger.info(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// =============================================
// الاتصال بقاعدة البيانات
// =============================================
connectDB().then(() => {
  logger.info('✅ تم الاتصال بقاعدة البيانات بنجاح');
}).catch(err => {
  logger.error('❌ فشل الاتصال بقاعدة البيانات:', err);
  process.exit(1);
});

// =============================================
// Middleware الأساسية
// =============================================

// إعداد trust proxy ليعمل مع Railway/Heroku
app.set('trust proxy', 1);

// CORS مع أصول محددة
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Helmet مع إعدادات مخصصة
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// ضغط الردود
app.use(compression());

// تحليل الطلبات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// إدارة الجلسات مع MongoDB Store
app.use(session({
  secret: process.env.SESSION_SECRET || uuidv4(),
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 24 * 60 * 60,
    autoRemove: 'native'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'لقد تجاوزت عدد الطلبات المسموح بها',
  trustProxy: true,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  }
});
app.use(limiter);

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
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'تحتاج إلى تسجيل الدخول' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'تسجيل الدخول غير صالح' });
    }
    req.user = user;
    next();
  });
}

// =============================================
// Routes
// =============================================

// تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // التحقق من وجود المستخدم
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // إنشاء JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // إنشاء Refresh Token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // إرسال الرد
    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    logger.error('خطأ في تسجيل الدخول:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// إنشاء حساب جديد
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // التحقق من وجود المستخدم مسبقاً
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'اسم المستخدم أو البريد الإلكتروني موجود مسبقاً' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء مستخدم جديد
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // إنشاء JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // إنشاء Refresh Token
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // إرسال الرد
    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      refreshToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    logger.error('خطأ في إنشاء الحساب:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تجديد Token
app.post('/api/auth/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh Token مطلوب' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    // إنشاء JWT جديد
    const newToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'تم تجديد Token بنجاح',
      token: newToken
    });
  } catch (err) {
    logger.error('خطأ في تجديد Token:', err);
    res.status(403).json({ error: 'Refresh Token غير صالح' });
  }
});

// مسار محمي
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    res.json({
      message: 'مرحبًا بك في صفحتك الشخصية!',
      user
    });
  } catch (err) {
    logger.error('خطأ في جلب بيانات الملف:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// مسار للحصول على CSRF Token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// مسارات الصفحات
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =============================================
// معالجة الأخطاء
// =============================================
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'خطأ في الخادم',
    message: err.message
  });
});

// =============================================
// تشغيل الخادم
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`✅ الخادم يعمل على المنفذ ${PORT}`);
});
