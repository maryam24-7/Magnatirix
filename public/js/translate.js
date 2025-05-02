// كائن إدارة التطبيق
const AppManager = {
  currentLanguage: 'ar',
  
  translations: {
    ar: {
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      learnMore: "تعرف أكثر",
      moreDetails: "المزيد من التفاصيل",
      getStarted: "ابدأ مجاناً الآن",
      language: "English",
      copyright: "جميع الحقوق محفوظة",
      back: "العودة",
      heroTitle: "نظام التراسل المشفر الآمن",
      heroText: "حافظ على خصوصيتك مع نظام Magnatirix للتراسل المشفر من طرف إلى طرف"
    },
    en: {
      login: "Login",
      signup: "Sign Up",
      learnMore: "Learn More",
      moreDetails: "More Details",
      getStarted: "Get Started for Free",
      language: "العربية",
      copyright: "All Rights Reserved",
      back: "Back",
      heroTitle: "Secure Encrypted Messaging",
      heroText: "Protect your privacy with Magnatirix's end-to-end encrypted messaging system"
    }
  },

  init() {
    this.loadLanguage();
    this.setupEventListeners();
    this.updatePage();
    this.debugButtons();
  },

  loadLanguage() {
    const savedLang = localStorage.getItem('preferredLang');
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    this.currentLanguage = urlLang || savedLang || 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferredLang', this.currentLanguage);
  },

  setupEventListeners() {
    // استخدام event delegation بشكل محسن
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, [data-action]');
      if (!button) return;

      const buttonId = button.id || button.getAttribute('data-action');
      if (!buttonId) return;

      console.log('تم النقر على:', buttonId);

      switch(buttonId) {
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
      }
    });
  },

  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    // تحديث النصوص
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
    
    // تحديث زر اللغة
    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      const span = toggle.querySelector('span');
      if (span) span.textContent = langData.language;
    }
    
    // تحديث النصوص الأخرى
    this.updateElement('.hero h1', langData.heroTitle);
    this.updateElement('.hero p', langData.heroText);
  },

  switchLanguage() {
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    localStorage.setItem('preferredLang', this.currentLanguage);
    this.updatePage();
    
    const url = new URL(window.location.href);
    url.searchParams.set('lang', this.currentLanguage);
    window.history.pushState({}, '', url);
  },

  navigateTo(page) {
    console.log(`التوجه إلى: ${page}.html?lang=${this.currentLanguage}`);
    window.location.href = `${page}.html?lang=${this.currentLanguage}`;
  },

  updateElement(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.textContent !== text) el.textContent = text;
    });
  },

  updateButton(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (button) {
      const textElement = button.querySelector('.btn-text') || button;
      if (textElement.textContent !== text) {
        textElement.textContent = text;
      }
    }
  },

  debugButtons() {
    const buttons = [
      'loginButton', 'signupButton', 'learnMoreButton',
      'generateButton', 'connectButton', 'aiLogButton',
      'nucleiButton', 'startNowButton', 'languageToggle'
    ];
    
    console.group('AppManager Debug');
    buttons.forEach(id => {
      const exists = !!document.getElementById(id);
      console.log(`Button ${id}:`, exists ? 'موجود' : 'غير موجود');
    });
    console.groupEnd();
  }
};

// طريقة تحميل آمنة
function initializeApp() {
  try {
    if (typeof AppManager === 'object' && AppManager.init) {
      AppManager.init();
    } else {
      console.error('AppManager غير معرف بشكل صحيح');
    }
  } catch (e) {
    console.error('خطأ في التهيئة:', e);
  }
}

// تحميل الصفحة بطرق متعددة للتأكد من التشغيل
if (document.readyState === 'complete') {
  setTimeout(initializeApp, 100);
} else {
  document.addEventListener('DOMContentLoaded', initializeApp);
}
