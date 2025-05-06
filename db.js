const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // استخدام MONGO_URL مباشرة من متغيرات Railway
    const uri = process.env.MONGO_URL;
    
    if (!uri) {
      throw new Error('❌ لم يتم تعريف MONGO_URL في متغيرات البيئة');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
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
    process.exit(1);
  }
};

module.exports = connectDB;
