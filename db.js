const mongoose = require('mongoose');

const username = encodeURIComponent(process.env.MONGOUSER);
const password = encodeURIComponent(process.env.MONGOPASSWORD);
const host = process.env.MONGOHOST;
const port = process.env.MONGOPORT;
const database = process.env.MONGODATABASE || 'myDatabase'; // اسم قاعدة البيانات الافتراضي

const uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin&retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000, // 10 ثواني انتظار للاتصال
      socketTimeoutMS: 45000, // 45 ثانية انتظار للعمليات
      serverSelectionTimeoutMS: 5000, // محاولة اختيار السيرفر لمدة 5 ثواني
    });
    
    console.log('✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح');
    console.log(`📊 قاعدة البيانات المتصلة: ${mongoose.connection.name}`);
    console.log(`🛠️ حالة الاتصال: ${mongoose.connection.readyState === 1 ? 'متصل' : 'غير متصل'}`);
    
    // استمع لأحداث الاتصال
    mongoose.connection.on('connected', () => {
      console.log('🔄 إعادة اتصال بنجاح مع MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ خطأ في اتصال MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ تم قطع الاتصال مع MongoDB');
    });
    
  } catch (err) {
    console.error('❌ حدث خطأ أثناء الاتصال بقاعدة البيانات:', err.message);
    console.error('🔧 تفاصيل الخطأ:', err.stack);
    process.exit(1); // الخروج مع رمز خطأ
  }
};

module.exports = connectDB;
