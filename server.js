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
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.v2');

const app = express();

// التحقق من المتغيرات البيئية
console.log('🔍 تحقق من المتغيرات البيئية:');
console.log('🔗 MONGO_URL:', process.env.MONGO_URL ? '***** موجود *****' : 'غير موجود!');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '***** موجود *****' : 'غير موجود!');
console.log('🚪 PORT:', process.env.PORT || '3000 (افتراضي)');
console.log('🌐 CORS_ORIGIN:', process.env.CORS_ORIGIN || '* (افتراضي)');

// Middleware للتسجيل
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// إعداد trust proxy ليعمل مع Railway
app.set('trust proxy', 1);

// الاتصال بقاعدة البيانات
connectDB().then(() => {
  console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
}).catch(err => {
  console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
  process.exit(1);
});

// Middleware الأساسية
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || uuidv4(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

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

// Routes
app.use("/api/auth", authRoutes);

// Middleware للتحقق من صلاحية JWT
function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'تحتاج إلى تسجيل الدخول' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'تسجيل الدخول غير صالح' });
    }
    req.user = user;
    next();
  });
}

// مسار محمي
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'مرحبًا بك في صفحتك الشخصية!',
    user: req.user
  });
});

// مسارات الصفحات
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'خطأ في الخادم',
    message: err.message
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ الخادم يعمل على المنفذ ${PORT}`);
  console.log(`🌐 البيئة: ${process.env.NODE_ENV || 'development'}`);
});
