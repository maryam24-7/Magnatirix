// كائن إدارة الترجمة
const LanguageManager = {
  currentLanguage: 'ar',
  
  translations: {
    ar: {
      // نصوص القوائم والأزرار
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      learnMore: "تعرف أكثر",
      moreDetails: "المزيد من التفاصيل",
      getStarted: "ابدأ مجاناً الآن",
      language: "English",
      copyright: "جميع الحقوق محفوظة",
      back: "العودة",
      
      // نصوص الصفحة الرئيسية
      heroTitle: "نظام التراسل المشفر الآمن",
      heroText: "حافظ على خصوصيتك مع نظام Magnatirix للتراسل المشفر من طرف إلى طرف"
    },
    en: {
      // نصوص القوائم والأزرار
      login: "Login",
      signup: "Sign Up",
      learnMore: "Learn More",
      moreDetails: "More Details",
      getStarted: "Get Started for Free",
      language: "العربية",
      copyright: "All Rights Reserved",
      back: "Back",
      
      // نصوص الصفحة الرئيسية
      heroTitle: "Secure Encrypted Messaging",
      heroText: "Protect your privacy with Magnatirix's end-to-end encrypted messaging system"
    }
  },

  // تهيئة المدير
  init() {
    this.loadLanguage();
    this.setupEventListeners();
    this.updatePage();
  },

  // تحميل اللغة المحفوظة
  loadLanguage() {
    this.currentLanguage = localStorage.getItem('preferredLang') || 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  },

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    // أزرار التنقل
    const navButtons = {
      'loginButton': () => this.navigateTo('login'),
      'signupButton': () => this.navigateTo('signup'),
      'learnMoreButton': () => this.navigateTo('about'),
      'generateButton': () => this.navigateTo('generate'),
      'connectButton': () => this.navigateTo('connect'),
      'aiLogButton': () => this.navigateTo('ai-log-analyzer'),
      'nucleiButton': () => this.navigateTo('nuclei-analyzer'),
      'startNowButton': () => this.navigateTo('signup'),
      'languageToggle': () => this.switchLanguage(),
      'backButton': () => window.history.back()
    };

    for (const [id, handler] of Object.entries(navButtons)) {
      const element = document.getElementById(id);
      if (element) element.addEventListener('click', handler);
    }
  },

  // تحديث الصفحة حسب اللغة
  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    // تحديث العناصر العامة
    this.updateElement('.logo', 'Magnatirix');
    this.updateElement('.copyright', `${langData.copyright} &copy; ${new Date().getFullYear()} Magnatirix`);
    
    // تحديث الأزرار
    this.updateButton('loginButton', langData.login);
    this.updateButton('signupButton', langData.signup);
    this.updateButton('learnMoreButton', langData.learnMore);
    this.updateButton('generateButton', langData.moreDetails);
    this.updateButton('connectButton', langData.moreDetails);
    this.updateButton('aiLogButton', langData.moreDetails);
    this.updateButton('nucleiButton', langData.moreDetails);
    this.updateButton('startNowButton', langData.getStarted);
    this.updateButton('backButton', langData.back);
    
    // تحديث زر تبديل اللغة
    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      const span = toggle.querySelector('span');
      if (span) span.textContent = langData.language;
    }
    
    // تحديث النصوص الخاصة بالصفحة الرئيسية
    if (document.querySelector('.hero h1')) {
      this.updateElement('.hero h1', langData.heroTitle);
      this.updateElement('.hero p', langData.heroText);
    }
  },

  // تبديل اللغة
  switchLanguage() {
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    localStorage.setItem('preferredLang', this.currentLanguage);
    this.updatePage();
  },

  // التنقل بين الصفحات
  navigateTo(page) {
    window.location.href = `${page}.html?lang=${this.currentLanguage}`;
  },

  // تحديث عنصر HTML
  updateElement(selector, text) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  },

  // تحديث نص الزر
  updateButton(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (button) {
      const textElement = button.querySelector('.btn-text') || button;
      textElement.textContent = text;
    }
  }
};

// بدء التشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => LanguageManager.init());
