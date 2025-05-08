require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// 1. الاتصال بـ MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/messages')
  .then(() => console.log('✅ تم الاتصال بقاعدة البيانات'))
  .catch(err => console.error('❌ فشل الاتصال:', err));

// 2. نموذج بسيط للرسائل
const Message = mongoose.model('Message', {
  id: String,
  content: String,
  createdAt: { type: Date, default: Date.now, expires: '1h' } // تدمير بعد ساعة
});

// 3. إعدادات أساسية
app.use(express.json());

// 4. مسار الحفظ
app.post('/send', async (req, res) => {
  try {
    const { id, content } = req.body;
    await Message.create({ id, content });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'فشل في الحفظ' });
  }
});

// 5. مسار الاسترجاع
app.get('/message/:id', async (req, res) => {
  const message = await Message.findOne({ id: req.params.id });
  if (!message) return res.status(404).json({ error: 'لم يتم العثور على الرسالة' });
  res.json(message);
});

// 6. تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`));
