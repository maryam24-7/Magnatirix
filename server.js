// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// تقديم ملفات المجلد public كملفات ثابتة
app.use(express.static(path.join(__dirname, 'public')));

// التوجيه للصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
