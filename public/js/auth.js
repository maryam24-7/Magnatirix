// auth.js - الإصدار النهائي مع CSRF Protection

// متغير لحفظ CSRF token
let csrfToken = null;

// ========== دوال المساعدة ========== //
async function fetchCSRFToken() {
  try {
    const response = await fetch('/csrf-token', {
      credentials: 'same-origin'
    });
    const data = await response.json();
    
    if (!response.ok) throw new Error('Failed to get CSRF token');
    
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('[CSRF] Token Error:', error);
    throw error;
  }
}

// ========== دوال المصادقة ========== //
async function register(username, password) {
  try {
    // التحقق من المدخلات
    if (!username?.trim() || !password?.trim()) {
      throw new Error('الرجاء تعبئة جميع الحقول المطلوبة');
    }

    // الحصول على CSRF token إذا لم يكن موجودًا
    if (!csrfToken) {
      await fetchCSRFToken();
    }

    // إرسال طلب التسجيل
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        csrfToken: csrfToken
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

async function login(username, password) {
  try {
    // التحقق من المدخلات
    if (!username?.trim() || !password?.trim()) {
      throw new Error('الرجاء إدخال اسم المستخدم وكلمة المرور');
    }

    // الحصول على CSRF token إذا لم يكن موجودًا
    if (!csrfToken) {
      await fetchCSRFToken();
    }

    // إرسال طلب تسجيل الدخول
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        csrfToken: csrfToken
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
      localStorage.setItem('token_expiry', Date.now() + 3600000);
      
      // توليد CSRF token جديد بعد تسجيل الدخول الناجح
      await fetchCSRFToken();
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

async function refreshToken() {
  try {
    // الحصول على CSRF token إذا لم يكن موجودًا
    if (!csrfToken) {
      await fetchCSRFToken();
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
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

function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token_expiry');
  window.location.href = '/login';
}

async function getActiveUsers() {
  try {
    const token = getValidToken();
    if (!token) {
      throw new Error('الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
    }

    // الحصول على CSRF token إذا لم يكن موجودًا
    if (!csrfToken) {
      await fetchCSRFToken();
    }

    const response = await fetch('/api/users/active', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
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

// جلب CSRF token عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchCSRFToken();
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }
});

// تصدير الدوال للاستخدام
export {
  register,
  login,
  refreshToken,
  getValidToken,
  logout,
  getActiveUsers,
  fetchCSRFToken
};
