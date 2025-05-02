require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// تسجيل جميع الطلبات إلى ملف access.log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), 
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// ميدل وير للتسجيل في الكونسول
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// اتصال MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ تم الاتصال بقاعدة البيانات بنجاح"))
.catch(err => console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err));

// ميدل وير أساسية
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تحديد معدل الطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100
});
app.use(limiter);

// ملفات ثابتة
app.use(express.static(path.join(__dirname, 'public')));

// الروتات
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// معالجة الصفحات مع دعم اللغات
app.get('/:page', (req, res) => {
  const page = req.params.page.replace('.html', '');
  const filePath = path.join(__dirname, 'public', `${page}.html`);

  res.sendFile(filePath, {}, (err) => {
    if (err) {
      res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
  });
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('خطأ في الخادم');
});

// تشغيل الخادم مع دعم الاستماع على جميع الواجهات
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ الخادم يعمل على المنفذ ${PORT}`);
});
