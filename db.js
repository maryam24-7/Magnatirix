const mongoose = require('mongoose');

const username = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const host = process.env.MONGOHOST;
const port = process.env.MONGOPORT;

const uri = `mongodb://${username}:${password}@${host}:${port}/?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح');
  } catch (err) {
    console.error('❌ حدث خطأ أثناء الاتصال بقاعدة البيانات:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
