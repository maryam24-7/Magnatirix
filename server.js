// تعديل مؤقت للفحص
mongoose.connect(CONFIG.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
})
.then(() => {
  console.log('✅ تم الاتصال بقاعدة البيانات بنجاح (console.log)'); // إضافة console.log
  logger.info('✅ تم الاتصال بقاعدة البيانات بنجاح');
  app.listen(CONFIG.PORT, () => {
    console.log(`✅ الخادم يعمل على المنفذ ${CONFIG.PORT} (console.log)`); // إضافة console.log
    logger.info(`✅ الخادم يعمل على المنفذ ${CONFIG.PORT}`);
  });
})
.catch(err => {
  console.error('❌ فشل الاتصال بقاعدة البيانات (console.error):', err); // استخدام console.error
  logger.error('❌ فشل الاتصال بقاعدة البيانات:', err);
  process.exit(1);
});

// ... باقي الكود ...

// تأكد من استدعاء app.listen داخل then الخاص باتصال قاعدة البيانات
// وإلا قد يحاول الخادم البدء قبل الاتصال بقاعدة البيانات
if (mongoose.connection.readyState !== 1) {
  // لا تستمع هنا إذا لم يتم الاتصال بقاعدة البيانات بعد
} else {
  // تم نقل app.listen إلى داخل .then أعلاه
}
