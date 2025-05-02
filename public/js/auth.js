// auth.js - الإصدار النهائي

// ========== دوال المصادقة ========== //

/**
 * تسجيل مستخدم جديد
 * @param {string} username - اسم المستخدم أو البريد الإلكتروني
 * @param {string} password - كلمة المرور
 * @returns {Promise<object>} - بيانات الاستجابة
 */
async function register(username, password) {
  try {
    // التحقق من المدخلات
    if (!username?.trim() || !password?.trim()) {
      throw new Error('الرجاء تعبئة جميع الحقول المطلوبة');
    }

    // التحقق من صيغة البريد الإلكتروني إذا كان المستخدم يستخدم البريد
    const isEmail = username.includes('@');
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      throw new Error('صيغة البريد الإلكتروني غير صالحة');
    }

    // إرسال طلب التسجيل
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim()
      }),
      credentials: 'same-origin'
    });

    // معالجة الاستجابة
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل في إنشاء الحساب');
    }

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('[Auth] Register Error:', error);
    return {
      success: false,
      error: error.message || 'حدث خطأ غير متوقع'
    };
  }
}

/**
 * تسجيل الدخول
 * @param {string} username - اسم المستخدم أو البريد
 * @param {string} password - كلمة المرور
 * @returns {Promise<object>} - بيانات الاستجابة
 */
async function login(username, password) {
  try {
    // التحقق من المدخلات
    if (!username?.trim() || !password?.trim()) {
      throw new Error('الرجاء إدخال اسم المستخدم وكلمة المرور');
    }

    // إرسال طلب تسجيل الدخول
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim()
      }),
      credentials: 'same-origin'
    });

    // معالجة الاستجابة
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'معلومات الدخول غير صحيحة');
    }

    // تخزين التوكن بإعدادات أمان
    const token = data?.token;
    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('token_expiry', Date.now() + 3600000); // صلاحية ساعة
    }

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('[Auth] Login Error:', error);
    return {
      success: false,
      error: error.message || 'فشل عملية تسجيل الدخول'
    };
  }
}

/**
 * تجديد التوكن
 * @returns {Promise<object>} - بيانات الاستجابة
 */
async function refreshToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'same-origin'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تجديد الجلسة');
    }

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('token_expiry', Date.now() + 3600000);

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('[Auth] Refresh Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * الحصول على التوكن مع التحقق من الصلاحية
 * @returns {string|null} - التوكن أو null
 */
function getValidToken() {
  try {
    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('token_expiry');

    if (!token || !expiry) return null;
    if (Date.now() > parseInt(expiry)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expiry');
      return null;
    }

    return token;
  } catch (error) {
    console.error('[Auth] Token Error:', error);
    return null;
  }
}

/**
 * تسجيل الخروج
 */
function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token_expiry');
  window.location.href = '/login';
}

/**
 * الحصول على المستخدمين النشطين
 * @returns {Promise<object>} - بيانات الاستجابة
 */
async function getActiveUsers() {
  try {
    const token = getValidToken();
    if (!token) {
      throw new Error('الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
    }

    const response = await fetch('/api/users/active', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || 'فشل جلب البيانات');
    }

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('[Users] Fetch Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// تصدير الدوال للاستخدام
export {
  register,
  login,
  refreshToken,
  getValidToken,
  logout,
  getActiveUsers
};
