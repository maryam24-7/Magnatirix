require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. اتصال MongoDB (بدون ملف منفصل)
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/message_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
})
.then(() => console.log('✅ تم الاتصال بـ MongoDB'))
.catch(err => console.error('❌ خطأ في الاتصال:', err));

// 2. نموذج الرسالة
const Message = mongoose.model('Message', {
  id: { type: String, unique: true },
  content: String,
  expiresAt: { type: Date, default: () => new Date(Date.now() + 3600000), index: { expires: 0 } }
});

// 3. Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 4. مسارات API
app.post('/api/send', async (req, res) => {
  try {
    const { id, content } = req.body;
    await Message.create({ id, content });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'فشل في الحفظ' });
  }
});

app.get('/api/message/:id', async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });
    message ? res.json(message) : res.status(404).json({ error: 'الرسالة غير موجودة' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// 5. مسارات الواجهة
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/receive', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'receive.html'));
});

// 6. تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});
