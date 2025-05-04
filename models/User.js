// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    unique: true,
    trim: true,
    minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'],
    maxlength: [30, 'اسم المستخدم يجب ألا يتجاوز 30 حرفاً'],
    match: [/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف لاتينية وأرقام فقط']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'بريد إلكتروني غير صالح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
    select: false
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
    select: false,
    encrypt: true // تشفير المفتاح الخاص في قاعدة البيانات
  },
  twoFASecret: {
    type: String,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLockedUntil: Date
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.privateKey;
      delete ret.twoFASecret;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// تشفير الباسوورد قبل الحفظ
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(new Error('فشل في تشفير كلمة المرور'));
  }
});

// توليد التوكن
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      publicKey: this.publicKey
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      algorithm: 'HS512'
    }
  );
};

// التحقق من الباسوورد
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// إنشاء توكن إعادة تعيين الباسوورد
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha3-256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// توليد المفاتيح التشفيرية
UserSchema.methods.generateKeys = function() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: process.env.ENCRYPTION_PASSPHRASE
    }
  });

  this.publicKey = publicKey;
  this.privateKey = privateKey;
};

// إدارة قفل الحساب
UserSchema.methods.handleFailedLogin = async function() {
  this.failedLoginAttempts += 1;
  
  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = Date.now() + 30 * 60 * 1000; // 30 دقيقة
  }
  
  await this.save();
};

// التحقق من حالة القفل
UserSchema.methods.isAccountLocked = function() {
  return this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

// البحث عن المستخدم
UserSchema.statics.findByCredentials = async function(identifier, password) {
  const user = await this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() }
    ]
  }).select('+password +privateKey +failedLoginAttempts +accountLockedUntil');

  if (!user || await user.isAccountLocked()) {
    throw new Error('الحساب مقفل أو بيانات غير صحيحة');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.handleFailedLogin();
    throw new Error('بيانات الاعتماد غير صحيحة');
  }

  user.failedLoginAttempts = 0;
  user.accountLockedUntil = null;
  await user.save();

  return user;
};

module.exports = mongoose.model('User', UserSchema);
