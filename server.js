require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware للتسجيل
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), 
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// إعداد trust proxy ليعمل مع Railway
app.set('trust proxy', 1); // تثق في البروكسي الأول

// الاتصال بقاعدة البيانات
connectDB();

// تعريف نموذج المستخدم (مُحسّن)
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true,
    required: [true, 'البريد الإلكتروني مطلوب'],
    match: [/^\S+@\S+\.\S+$/, 'بريد إلكتروني غير صالح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل']
  }
});

const User = mongoose.model('User', UserSchema);

// Middleware الأساسية
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting معدل للعمل مع Railway
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

// Routes من الملفات المنفصلة
app.use("/api/auth", authRoutes);

// مسارات API (مُحسّنة)
app.post('/api/signup', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send('البريد الإلكتروني مستخدم مسبقًا');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في إنشاء الحساب' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'بيانات الاعتماد غير صحيحة' });
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(401).json({ error: 'بيانات الاعتماد غير صحيحة' });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// مسار محمي كمثال
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

// معالجة الأخطاء (مُحسّنة)
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
});
