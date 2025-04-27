// server.js
const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// 1) قدم الملفات الثابتة مِن public، واربط مسار بدون امتداد إلى *.html تلقائيًا
app.use(
  express.static(
    path.join(__dirname, 'public'),
    { extensions: ['html'] }
  )
);

// 2) لأي مسار غير موجود كملف ثابت، أعد index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
