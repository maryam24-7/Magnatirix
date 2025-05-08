require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

// تهيئة التطبيق
const app = express();

// 1. الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/secret_messages', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ تم الاتصال بـ MongoDB');
  } catch (err) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
    process.exit(1);
  }
};
connectDB();

// 2. نموذج الرسالة (مع انتهاء الصلاحية التلقائي)
const Message = mongoose.model('Message', new mongoose.Schema({
  id: { type: String, unique: true },
  encryptedMessage: String,
  encryptedKey: String,
  iv: String,
  createdAt: { type: Date, default: Date.now, expires: '24h' } // تدمير تلقائي بعد 24 ساعة
}));

// 3. إعدادات الأمان الأساسية
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 4. منع الهجمات الأساسية
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'لقد تجاوزت عدد الطلبات المسموح بها'
});
app.use(limiter);

// 5. مسارات التطبيق الأساسية
app.post('/api/send', async (req, res) => {
  try {
    const { id, encryptedMessage, encryptedKey, iv } = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!id || !encryptedMessage || !encryptedKey || !iv) {
      return res.status(400).json({ error: 'بيانات غير كاملة' });
    }

    await Message.create({ id, encryptedMessage, encryptedKey, iv });
    res.json({ success: true });
    
  } catch (err) {
    console.error('خطأ في حفظ الرسالة:', err);
    res.status(500).json({ error: 'فشل في حفظ الرسالة' });
  }
});

app.get('/api/message/:id', async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });
    if (!message) return res.status(404).json({ error: 'الرسالة غير موجودة' });
    
    res.json({
      encryptedMessage: message.encryptedMessage,
      encryptedKey: message.encryptedKey,
      iv: message.iv
    });
    
  } catch (err) {
    console.error('خطأ في استرجاع الرسالة:', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// 6. مسار للصفحة الرئيسية
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7. تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على المنفذ ${PORT}`);
});
