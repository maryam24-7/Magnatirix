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
    // حل مشكلة الأزرار بإستخدام event delegation بشكل صحيح
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      // إضافة console.log للتأكد من أن الأزرار تصل إلى هنا
      console.log('Button clicked:', button.id);

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
        default:
          console.log('Unknown button:', button.id);
      }
    });
  },

  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    this.updateElement('.logo', 'Magnatirix');
    this.updateElement('.copyright', `${langData.copyright} &copy; ${new Date().getFullYear()} Magnatirix`);
    
    this.updateButton('loginButton', langData.login);
    this.updateButton('signupButton', langData.signup);
    this.updateButton('learnMoreButton', langData.learnMore);
    this.updateButton('generateButton', langData.moreDetails);
    this.updateButton('connectButton', langData.moreDetails);
    this.updateButton('aiLogButton', langData.moreDetails);
    this.updateButton('nucleiButton', langData.moreDetails);
    this.updateButton('startNowButton', langData.getStarted);
    this.updateButton('backButton', langData.back);
    
    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      const span = toggle.querySelector('span');
      if (span) span.textContent = langData.language;
      toggle.setAttribute('aria-label', `Switch to ${this.currentLanguage === 'ar' ? 'English' : 'Arabic'}`);
    }
    
    if (document.querySelector('.hero h1')) {
      this.updateElement('.hero h1', langData.heroTitle);
      this.updateElement('.hero p', langData.heroText);
    }
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
    console.log(`Navigating to: ${page}.html?lang=${this.currentLanguage}`);
    window.location.href = `${page}.html?lang=${this.currentLanguage}`;
  },

  updateElement(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.textContent !== text) {
        element.textContent = text;
      }
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
  }
};

// التأكد من تحميل DOM بالكامل قبل التنفيذ
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AppManager.init());
} else {
  AppManager.init();
}
