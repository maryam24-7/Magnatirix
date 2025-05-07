const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // إضافة مهلة اختيار السيرفر
    });
    console.log("✅ تم الاتصال بقاعدة البيانات");
    
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ تم قطع الاتصال مع MongoDB");
    });
    
    mongoose.connection.on("error", (err) => {
      console.error("❌ خطأ في الاتصال:", err.message);
    });
    
  } catch (err) {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
