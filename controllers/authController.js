const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "المستخدم موجود مسبقاً" });
    }

    // إنشاء مستخدم جديد مع تشفير كلمة المرور
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });

    await user.save();
    res.status(201).json({ 
      message: "تم التسجيل بنجاح",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ 
      error: "حدث خطأ أثناء التسجيل",
      details: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم والتحقق من وجوده
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: "بيانات الدخول غير صحيحة" });
    }

    // مقارنة كلمة المرور
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "بيانات الدخول غير صحيحة" });
    }

    // إنشاء وتوقيع التوكن
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ 
      error: "حدث خطأ أثناء الدخول",
      details: err.message 
    });
  }
};
