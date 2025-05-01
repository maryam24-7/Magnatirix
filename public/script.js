// كائن إدارة التطبيق
const AppManager = {
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

  // تهيئة التطبيق
  init() {
    this.loadLanguage();
    this.setupEventListeners();
    this.updatePage();
  },

  // تحميل اللغة المحفوظة
  loadLanguage() {
    const savedLang = localStorage.getItem('preferredLang');
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    this.currentLanguage = urlLang || savedLang || 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferredLang', this.currentLanguage);
  },

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    // أزرار التنقل
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      switch(button.id) {
        case 'loginButton':
          this.navigateTo('login');
          break;
        case 'signupButton':
          this.navigateTo('signup');
          break;
        case 'learnMoreButton':
          this.navigateTo('about');
          break;
        case 'generateButton':
          this.navigateTo('generate');
          break;
        case 'connectButton':
          this.navigateTo('connect');
          break;
        case 'aiLogButton':
          this.navigateTo('ai-log-analyzer');
          break;
        case 'nucleiButton':
          this.navigateTo('nuclei-analyzer');
          break;
        case 'startNowButton':
          this.navigateTo('signup');
          break;
        case 'languageToggle':
          this.switchLanguage();
          break;
        case 'backButton':
          window.history.back();
          break;
      }
    });
  },

  // تحديث الصفحة حسب اللغة
  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    // تحديث العناصر العامة
    this.updateElement('.logo', 'Magnatirix');
    this.updateElement('.copyright', `${langData.copyright} &copy; ${new Date().getFullYear()} Magnatirix`);
    
    // تحديث الأزرار
    this.updateButtonText('loginButton', langData.login);
    this.updateButtonText('signupButton', langData.signup);
    this.updateButtonText('learnMoreButton', langData.learnMore);
    this.updateButtonText('generateButton', langData.moreDetails);
    this.updateButtonText('connectButton', langData.moreDetails);
    this.updateButtonText('aiLogButton', langData.moreDetails);
    this.updateButtonText('nucleiButton', langData.moreDetails);
    this.updateButtonText('startNowButton', langData.getStarted);
    this.updateButtonText('backButton', langData.back);
    
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
    
    // تحديث معلمة اللغة في URL بدون إعادة تحميل الصفحة
    const url = new URL(window.location.href);
    url.searchParams.set('lang', this.currentLanguage);
    window.history.pushState({}, '', url);
  },

  // التنقل بين الصفحات
  navigateTo(page) {
    window.location.href = `${page}.html?lang=${this.currentLanguage}`;
  },

  // تحديث عنصر HTML
  updateElement(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.textContent = text;
    });
  },

  // تحديث نص الزر
  updateButtonText(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (button) {
      const textElement = button.querySelector('.btn-text') || button;
      textElement.textContent = text;
    }
  }
};

// بدء التشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => AppManager.init());
