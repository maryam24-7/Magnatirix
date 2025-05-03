// public/js/main.js

// ========== تهيئة التطبيق ========== //
document.addEventListener('DOMContentLoaded', () => {
  // تهيئة اللغة المفضلة
  initLanguage();
  
  // إعداد معالج الأحداث
  setupEventHandlers();
  
  // التحقق من حالة المصادقة
  checkAuthStatus();
});

// ========== دوال إدارة الحالة ========== //

/**
 * تهيئة اللغة المفضلة من localStorage أو المتصفح
 */
function initLanguage() {
  const savedLang = localStorage.getItem('preferredLang');
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
  const lang = savedLang || browserLang;
  
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // تطبيق الترجمات
  applyTranslations(lang);
}

/**
 * التحقق من حالة تسجيل الدخول
 */
async function checkAuthStatus() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    const response = await fetch('/api/auth/check', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
}

// ========== معالجات الأحداث ========== //

/**
 * إعداد جميع معالجي الأحداث
 */
function setupEventHandlers() {
  // تبديل اللغة
  document.getElementById('languageToggle')?.addEventListener('click', switchLanguage);
  
  // أزرار التنقل الرئيسية
  document.querySelectorAll('.nav-actions button[aria-label]').forEach(btn => {
    btn.addEventListener('click', () => handleNavAction(btn));
  });
  
  // أزرار الهيرو
  document.querySelector('.hero .btn-accent')?.addEventListener('click', () => {
    window.location.href = '/about';
  });
  
  // أزرار CTA
  document.querySelector('.cta-section .btn-accent')?.addEventListener('click', () => {
    window.location.href = '/signup';
  });
  
  // بطاقات الميزات
  const featureRoutes = ['/generate', '/connect', '/ai-log-analyzer', '/nuclei-analyzer'];
  document.querySelectorAll('.feature-card .btn-primary').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      window.location.href = featureRoutes[idx] || '/features';
    });
  });
  
  // روابط الفوتر
  const footerRoutes = {
    'الشروط والأحكام': '/terms',
    'سياسة الخصوصية': '/privacy',
    'عن النظام': '/about',
    'الأسئلة الشائعة': '/faq',
    'اتصل بنا': '/contact'
  };
  
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = footerRoutes[link.textContent.trim()];
      if (route) window.location.href = route;
    });
  });
  
  // تحديث سنة حقوق النشر
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // معالج تسجيل الخروج
  document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);
}

// ========== دوال التفاعل ========== //

/**
 * تبديل اللغة
 */
function switchLanguage() {
  const currentLang = document.documentElement.lang;
  const newLang = currentLang === 'ar' ? 'en' : 'ar';
  
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('preferredLang', newLang);
  
  applyTranslations(newLang);
  location.reload(); // لإعادة تحميل الترجمات
}

/**
 * تطبيق الترجمات الديناميكية
 */
async function applyTranslations(lang) {
  try {
    const response = await fetch(`/i18n/${lang}.json`);
    const translations = await response.json();
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

/**
 * معالج إجراءات التنقل
 */
function handleNavAction(button) {
  const action = button.getAttribute('aria-label');
  
  const actions = {
    'تسجيل الدخول': () => { window.location.href = '/login'; },
    'Login': () => { window.location.href = '/login'; },
    'إنشاء حساب': () => { window.location.href = '/signup'; },
    'Sign Up': () => { window.location.href = '/signup'; },
    'الملف الشخصي': () => { window.location.href = '/profile'; },
    'Profile': () => { window.location.href = '/profile'; }
  };
  
  if (actions[action]) {
    actions[action]();
  }
}

/**
 * تسجيل الخروج
 */
async function logoutUser() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin'
    });
    
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// ========== دوال مساعدة للخادم ========== //

/**
 * إرسال طلب API
 */
async function fetchAPI(endpoint, method = 'GET', body = null) {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      credentials: 'same-origin'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ========== تصدير للاختبارات ========== //
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initLanguage,
    switchLanguage,
    handleNavAction,
    logoutUser,
    fetchAPI
  };
}
