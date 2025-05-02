require('dotenv').config();
const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const morgan       = require('morgan');
const fs           = require('fs');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ تم الاتصال بقاعدة البيانات بنجاح"))
.catch(err => console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err));

// Middleware أساسية
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100
});
app.use(limiter);

// Logging Middleware
// أنشئ تيار كتابة إلى ملف access.log
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// سجّل بجنسيّة "combined" في الملف
app.use(morgan('combined', { stream: accessLogStream }));
// ميدل وير بسيط يطبع السجلات إلى الكونصول
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all pages with language support
app.get('/:page', (req, res) => {
  const page = req.params.page.replace('.html', '');
  const filePath = path.join(__dirname, 'public', `${page}.html`);
  
  res.sendFile(filePath, {}, (err) => {
    if (err) {
      res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('خطأ في الخادم');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على المنفذ ${PORT}`);
});
