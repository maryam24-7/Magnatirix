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
      heroTitle: "Secure Encrypted Messaging",
      heroText: "Protect your privacy with Magnatirix's end-to-end encrypted messaging system"
    }
  },

  init() {
    this.loadLanguage();
    this.setupEventListeners();
    this.updatePage();
    this.debug();
  },

  loadLanguage() {
    const savedLang = localStorage.getItem('preferredLang');
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    this.currentLanguage = urlLang || savedLang || 'ar';
    this.applyLanguage();
  },

  applyLanguage() {
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferredLang', this.currentLanguage);
  },

  setupEventListeners() {
    // معالج واحد لجميع الأحداث
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      console.log('تم النقر على:', button.id);

      switch(button.id) {
        case 'languageToggle':
          this.handleLanguageToggle();
          break;
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
      }
    });
  },

  handleLanguageToggle() {
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.applyLanguage();
    this.updatePage();
    
    const url = new URL(window.location.href);
    url.searchParams.set('lang', this.currentLanguage);
    window.history.pushState({}, '', url);
  },

  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    // تحديث النصوص
    this.updateText('.logo', 'Magnatirix');
    this.updateText('.copyright', `${langData.copyright} &copy; ${new Date().getFullYear()} Magnatirix`);
    this.updateText('.hero h1', langData.heroTitle);
    this.updateText('.hero p', langData.heroText);
    
    // تحديث الأزرار
    this.updateButtonText('loginButton', langData.login);
    this.updateButtonText('signupButton', langData.signup);
    this.updateButtonText('learnMoreButton', langData.learnMore);
    this.updateButtonText('generateButton', langData.moreDetails);
    this.updateButtonText('connectButton', langData.moreDetails);
    this.updateButtonText('aiLogButton', langData.moreDetails);
    this.updateButtonText('nucleiButton', langData.moreDetails);
    this.updateButtonText('startNowButton', langData.getStarted);
    
    // تحديث زر اللغة
    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      const span = toggle.querySelector('span');
      if (span) span.textContent = langData.language;
    }
  },

  updateText(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.textContent = text);
  },

  updateButtonText(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (button) {
      const textElement = button.querySelector('.btn-text') || button;
      textElement.textContent = text;
    }
  },

  navigateTo(page) {
    window.location.href = `${page}.html?lang=${this.currentLanguage}`;
  },

  debug() {
    console.log('حالة التطبيق:');
    console.log('اللغة الحالية:', this.currentLanguage);
    console.log('الأزرار:');
    ['loginButton', 'signupButton', 'languageToggle'].forEach(id => {
      console.log(`- ${id}:`, document.getElementById(id) ? 'موجود' : 'غير موجود');
    });
  }
};

// التهيئة بعد تحميل DOM
document.addEventListener('DOMContentLoaded', () => AppManager.init());
