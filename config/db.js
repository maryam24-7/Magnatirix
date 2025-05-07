const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("تم الاتصال بقاعدة البيانات");
  } catch (err) {
    console.error("فشل الاتصال بقاعدة البيانات:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
