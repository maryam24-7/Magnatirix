// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// 1. تعريف نموذج المستخدم
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    unique: true,
    trim: true,
    minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'],
    maxlength: [30, 'اسم المستخدم يجب ألا يتجاوز 30 حرفاً']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'بريد إلكتروني غير صالح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
    select: false // لا تُرجَع كلمة المرور عند الاستعلام
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  publicKey: {
    type: String,
    required: [true, 'المفتاح العام مطلوب']
  },
  privateKey: {
    type: String,
    required: [true, 'المفتاح الخاص مطلوب'],
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // إضافة created_at و updated_at تلقائياً
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 2. تشفير كلمة المرور قبل الحفظ
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 3. توليد التوكن للمستخدم
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

// 4. التحقق من كلمة المرور
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 5. إنشاء توكن إعادة تعيين كلمة المرور
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 دقائق

  return resetToken;
};

// 6. تحديث وقت النشاط الأخير
UserSchema.methods.updateLastActive = async function() {
  this.lastActive = Date.now();
  await this.save({ validateBeforeSave: false });
};

// 7. توليد مفاتيح التشفير
UserSchema.methods.generateKeys = function() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  this.publicKey = publicKey;
  this.privateKey = privateKey;
};

// 8. المصادقة ثنائية العوامل (2FA)
UserSchema.methods.enable2FA = function() {
  this.twoFASecret = crypto.randomBytes(20).toString('hex');
  return this.twoFASecret;
};

// 9. التحقق من صحة التوكن
UserSchema.statics.verifyToken = async function(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await this.findById(decoded.id).select('+privateKey');
  } catch (err) {
    throw new Error('توكن غير صالح أو منتهي الصلاحية');
  }
};

// 10. البحث عن مستخدم بالبريد أو اسم المستخدم
UserSchema.statics.findByCredentials = async function(identifier, password) {
  const user = await this.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ]
  }).select('+password +privateKey');

  if (!user) {
    throw new Error('بيانات الاعتماد غير صحيحة');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('بيانات الاعتماد غير صحيحة');
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);
