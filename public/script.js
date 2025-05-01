// نظام إدارة اللغة
const LanguageManager = {
  currentLanguage: 'ar',
  
  translations: {
    ar: {
      // نصوص مشتركة
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      language: "English",
      copyright: "جميع الحقوق محفوظة",
      back: "العودة",
      
      // نصوص خاصة بالصفحات
      homeTitle: "نظام التراسل المشفر الآمن",
      homeSubtitle: "حافظ على خصوصيتك مع نظام Magnatirix",
      loginTitle: "تسجيل الدخول إلى حسابك",
      forgotPassword: "نسيت كلمة المرور؟"
    },
    en: {
      // نصوص مشتركة
      login: "Login",
      signup: "Sign Up",
      language: "العربية",
      copyright: "All Rights Reserved",
      back: "Back",
      
      // نصوص خاصة بالصفحات
      homeTitle: "Secure Encrypted Messaging",
      homeSubtitle: "Protect your privacy with Magnatirix",
      loginTitle: "Login to your account",
      forgotPassword: "Forgot password?"
    }
  },

  init() {
    this.loadLanguage();
    this.setupEventListeners();
    this.updatePage();
  },

  loadLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const savedLang = localStorage.getItem('preferredLang');
    
    this.currentLanguage = urlLang || savedLang || 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferredLang', this.currentLanguage);
  },

  setupEventListeners() {
    // زر تبديل اللغة
    document.addEventListener('click', (e) => {
      if (e.target.closest('#languageToggle')) {
        this.switchLanguage();
      }
    });
  },

  switchLanguage() {
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    localStorage.setItem('preferredLang', this.currentLanguage);
    
    // تحديث URL دون إعادة تحميل
    const url = new URL(window.location.href);
    url.searchParams.set('lang', this.currentLanguage);
    window.history.pushState({}, '', url);
    
    this.updatePage();
  },

  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    // تحديث العناصر المشتركة
    this.updateText('#languageToggle span', langData.language);
    this.updateText('#loginButton', langData.login);
    this.updateText('#signupButton', langData.signup);
    this.updateText('.copyright', `${langData.copyright} © ${new Date().getFullYear()}`);
    
    // تحديث النصوص الخاصة بكل صفحة
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    this.updatePageContent(page, langData);
  },

  updatePageContent(page, langData) {
    switch(page) {
      case 'login':
        this.updateText('#login-title', langData.loginTitle);
        this.updateText('#forgot-password-link', langData.forgotPassword);
        break;
      case 'index':
        this.updateText('.hero h1', langData.homeTitle);
        this.updateText('.hero p', langData.homeSubtitle);
        break;
      // يمكن إضافة حالات أخرى للصفحات الأخرى
    }
  },

  updateText(selector, text) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  }
};

// بدء التشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => LanguageManager.init());
