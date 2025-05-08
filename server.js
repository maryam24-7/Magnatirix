require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// 1. اتصال MongoDB
mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
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
app.use(express.static('public'));

// 4. المسارات
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
  const message = await Message.findOne({ id: req.params.id });
  message ? res.json(message) : res.status(404).json({ error: 'الرسالة غير موجودة' });
});

// 5. التشغيل
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`));
