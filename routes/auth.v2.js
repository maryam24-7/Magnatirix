const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const crypto = require('crypto');

// Middleware للتحقق من CSRF token
const verifyCSRF = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const clientToken = req.headers['x-csrf-token'] || req.body.csrfToken;
    
    if (!clientToken || clientToken !== req.session.csrfToken) {
      return res.status(403).json({ 
        success: false,
        message: 'رمز الحماية غير صالح أو منتهي الصلاحية' 
      });
    }
  }
  next();
};

// إنشاء CSRF token
router.get('/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = token;
  res.json({ 
    success: true,
    csrfToken: token 
  });
});

// تطبيق middleware CSRF على جميع طرق POST/PUT/DELETE
router.post("/register", verifyCSRF, authController.register);
router.post("/login", verifyCSRF, authController.login);

module.exports = router;
