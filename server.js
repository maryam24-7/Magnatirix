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
const crypto = require('crypto');
const https = require('https');
const fs = require('fs');

console.log('🚀 بدء تحميل المتغيرات البيئية وتثبيت المكتبات');

const app = express();

// =============================================
console.log('⚙️ تحميل إعدادات التكوين...');
const CONFIG = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SSL_KEY_PATH: process.env.SSL_KEY_PATH || 'path/to/your/private.key',
  SSL_CERT_PATH: process.env.SSL_CERT_PATH || 'path/to/your/certificate.crt',
  SSL_CA_PATH: process.env.SSL_CA_PATH || 'path/to/your/ca.crt'
};

// =============================================
console.log('📝 إعداد Winston للتسجيل...');
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
  console.log('🧪 وضع التطوير مفعل - سيتم عرض السجلات في وحدة التحكم');
}

// =============================================
console.log('🌐 محاولة الاتصال بقاعدة البيانات...');
mongoose.connect(CONFIG.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
})
.then(() => {
  logger.info('✅ تم الاتصال بقاعدة البيانات بنجاح');
  console.log('✅ [MongoDB] تم الاتصال بقاعدة البيانات');
})
.catch(err => {
  logger.error('❌ فشل الاتصال بقاعدة البيانات:', err);
  console.error('❌ [MongoDB] فشل الاتصال:', err);
  process.exit(1);
});

// =============================================
console.log('🧩 إعداد الـ Middleware...');
app.set('trust proxy', 1);

app.use(cors({
  origin: CONFIG.CORS_ORIGIN,
  credentials: true
}));
console.log('🔓 CORS مفعل لـ:', CONFIG.CORS_ORIGIN);

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
console.log('🛡️ تم تطبيق Helmet لحماية الترويسات');

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log('📦 Middleware الخاصة بالتحليل والضغط جاهزة');

// =============================================
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
    sameSite: CONFIG.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
console.log('🗝️ تم تفعيل الجلسات باستخدام MongoStore');

// =============================================
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const clientToken = req.headers['x-csrf-token'] || req.body.csrfToken;
    if (!clientToken || clientToken !== req.session.csrfToken) {
      return res.status(403).json({ error: 'رمز CSRF غير صالح أو مفقود' });
    }
  }
  next();
});

app.get('/api/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = token;
  res.json({ csrfToken: token });
  console.log('🔐 تم إصدار رمز CSRF جديد');
});

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'لقد تجاوزت عدد الطلبات المسموح بها',
  trustProxy: true
}));
console.log('🚦 تم تفعيل Rate Limiting');

// =============================================
app.use(express.static(path.join(__dirname, 'public')));
console.log('📁 تم تحميل الملفات الثابتة من مجلد public');

// =============================================
console.log('🧬 إنشاء نموذج User...');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

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
console.log('📡 إعداد المسارات');
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
      sameSite: 'none',
      maxAge: 3600000
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

    console.log(`✅ تسجيل دخول ناجح للمستخدم: ${user.username}`);

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

    console.log(`🆕 تم تسجيل مستخدم جديد: ${newUser.username}`);

  } catch (err) {
    logger.error('خطأ التسجيل:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
    console.log(`👤 تم استرجاع بيانات المستخدم: ${user.username}`);
  } catch (err) {
    logger.error('خطأ جلب الملف:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =============================================
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'خطأ في الخادم' });
});

// =============================================
if (CONFIG.NODE_ENV === 'production') {
  const options = {
    key: fs.readFileSync(CONFIG.SSL_KEY_PATH),
    cert: fs.readFileSync(CONFIG.SSL_CERT_PATH),
    ca: fs.readFileSync(CONFIG.SSL_CA_PATH)
  };

  https.createServer(options, app).listen(CONFIG.PORT, () => {
    logger.info(`✅ الخادم يعمل على HTTPS في المنفذ ${CONFIG.PORT}`);
    console.log(`✅ [HTTPS] الخادم يعمل على https://localhost:${CONFIG.PORT}`);
  });
} else {
  app.listen(CONFIG.PORT, '0.0.0.0', () => {
    logger.info(`✅ الخادم يعمل على HTTP في المنفذ ${CONFIG.PORT}`);
    console.log(`✅ [Express] الخادم يعمل على http://localhost:${CONFIG.PORT}`);
  });
}
