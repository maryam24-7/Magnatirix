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
    this.debugButtons(); // إضافة للتحقق من الأزرار
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
    // استخدام event delegation بشكل أكثر دقة
    document.addEventListener('click', (e) => {
      // البحث عن أقرب زر أو عنصر قابل للنقر
      const button = e.target.closest('button, [data-action]');
      if (!button) return;

      // التحقق من ID أو data-action
      const buttonId = button.id || button.getAttribute('data-action');
      if (!buttonId) return;

      console.log('تم النقر على:', buttonId); // لأغراض debugging

      switch(buttonId) {
        case 'loginButton':
        case 'nav-login':
          this.navigateTo('login');
          break;
        case 'signupButton':
        case 'nav-signup':
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
        case 'lang-switcher':
          this.switchLanguage();
          break;
        case 'backButton':
          window.history.back();
          break;
      }
    });
  },

  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    // تحديث النصوص مع التحقق من وجود العناصر
    this.safeUpdate('.logo', 'Magnatirix');
    this.safeUpdate('.copyright', `${langData.copyright} &copy; ${new Date().getFullYear()} Magnatirix`);
    
    // تحديث الأزرار مع دعم عدة أنماط للعناصر
    this.updateButton('loginButton', langData.login);
    this.updateButton('signupButton', langData.signup);
    this.updateButton('learnMoreButton', langData.learnMore);
    this.updateButton('generateButton', langData.moreDetails);
    this.updateButton('connectButton', langData.moreDetails);
    this.updateButton('aiLogButton', langData.moreDetails);
    this.updateButton('nucleiButton', langData.moreDetails);
    this.updateButton('startNowButton', langData.getStarted);
    this.updateButton('backButton', langData.back);
    
    // تحديث زر اللغة مع دعم عدة أنماط
    const toggle = document.getElementById('languageToggle') || 
                  document.querySelector('[data-action="lang-switcher"]');
    if (toggle) {
      const span = toggle.querySelector('span') || toggle;
      span.textContent = langData.language;
      toggle.setAttribute('aria-label', `Switch to ${langData.language}`);
    }
    
    // تحديث النصوص الأخرى
    this.safeUpdate('.hero h1', langData.heroTitle);
    this.safeUpdate('.hero p', langData.heroText);
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

  safeUpdate(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      try {
        if (el.textContent !== text) el.textContent = text;
      } catch (e) {
        console.error(`Error updating ${selector}:`, e);
      }
    });
  },

  updateButton(buttonId, text) {
    const button = document.getElementById(buttonId) || 
                   document.querySelector(`[data-action="${buttonId}"]`);
    if (button) {
      const textElement = button.querySelector('.btn-text') || button;
      if (textElement.textContent !== text) {
        textElement.textContent = text;
      }
    } else {
      console.warn(`Button not found: ${buttonId}`);
    }
  },

  debugButtons() {
    const importantButtons = [
      'loginButton', 'signupButton', 'learnMoreButton',
      'generateButton', 'connectButton', 'aiLogButton',
      'nucleiButton', 'startNowButton', 'languageToggle', 'backButton'
    ];
    
    console.group('AppManager Debug');
    console.log('Current Language:', this.currentLanguage);
    
    importantButtons.forEach(id => {
      const exists = document.getElementById(id) || 
                    document.querySelector(`[data-action="${id}"]`);
      console.log(`Button ${id}:`, exists ? 'Found' : 'NOT FOUND');
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
      console.error('AppManager is not properly defined');
    }
  } catch (e) {
    console.error('Initialization error:', e);
  }
}

// تحميل الصفحة بطرق متعددة للتأكد من التشغيل
if (document.readyState === 'complete') {
  setTimeout(initializeApp, 100);
} else if (document.readyState === 'interactive') {
  initializeApp();
} else {
  document.addEventListener('DOMContentLoaded', initializeApp);
  window.addEventListener('load', initializeApp);
}
