// كائن إدارة التطبيق المحسن
const AppManager = {
  currentLanguage: 'ar',
  previousLanguage: null,
  
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

  // تحميل اللغة المحفوظة مع تحسينات
  loadLanguage() {
    const savedLang = localStorage.getItem('preferredLang');
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    this.previousLanguage = this.currentLanguage;
    this.currentLanguage = urlLang || savedLang || 'ar';
    
    // تحديث DOM فقط إذا تغيرت اللغة
    if (this.previousLanguage !== this.currentLanguage) {
      document.documentElement.lang = this.currentLanguage;
      document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('preferredLang', this.currentLanguage);
    }
  },

  // إعداد مستمعي الأحداث مع تحسينات
  setupEventListeners() {
    // استخدام事件委托 لجميع الأزرار
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      // إضافة تأثير النقر
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), 200);

      switch(button.id) {
        case 'loginButton': this.navigateTo('login'); break;
        case 'signupButton': this.navigateTo('signup'); break;
        case 'learnMoreButton': this.navigateTo('about'); break;
        case 'generateButton': this.navigateTo('generate'); break;
        case 'connectButton': this.navigateTo('connect'); break;
        case 'aiLogButton': this.navigateTo('ai-log-analyzer'); break;
        case 'nucleiButton': this.navigateTo('nuclei-analyzer'); break;
        case 'startNowButton': this.navigateTo('signup'); break;
        case 'languageToggle': this.switchLanguage(); break;
        case 'backButton': window.history.back(); break;
      }
    });

    // تحسين إمكانية الوصول بلوحة المفاتيح
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
        e.target.classList.add('keyboard-active');
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.target.tagName === 'BUTTON') {
        e.target.classList.remove('keyboard-active');
      }
    });
  },

  // الحصول على الترجمة مع fallback
  getTranslation(key) {
    return this.translations[this.currentLanguage][key] || 
           this.translations[this.currentLanguage === 'ar' ? 'en' : 'ar'][key] || 
           key;
  },

  // تحديث الصفحة حسب اللغة مع تحسينات الأداء
  updatePage() {
    // تحديث العناصر فقط إذا تغيرت اللغة
    if (this.previousLanguage === this.currentLanguage) return;

    const langData = this.translations[this.currentLanguage];
    
    // العناصر العامة
    this.updateElementIfExists('.logo', 'Magnatirix');
    this.updateElementIfExists('.copyright', `${this.getTranslation('copyright')} &copy; ${new Date().getFullYear()} Magnatirix`);
    
    // الأزرار
    this.updateButtonTextIfExists('loginButton', langData.login);
    this.updateButtonTextIfExists('signupButton', langData.signup);
    this.updateButtonTextIfExists('learnMoreButton', langData.learnMore);
    this.updateButtonTextIfExists('generateButton', langData.moreDetails);
    this.updateButtonTextIfExists('connectButton', langData.moreDetails);
    this.updateButtonTextIfExists('aiLogButton', langData.moreDetails);
    this.updateButtonTextIfExists('nucleiButton', langData.moreDetails);
    this.updateButtonTextIfExists('startNowButton', langData.getStarted);
    this.updateButtonTextIfExists('backButton', langData.back);
    
    // زر تبديل اللغة
    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      const span = toggle.querySelector('span');
      if (span) span.textContent = langData.language;
      toggle.setAttribute('aria-label', `Switch to ${this.currentLanguage === 'ar' ? 'English' : 'Arabic'}`);
    }
    
    // النصوص الخاصة بالصفحة الرئيسية
    this.updateElementIfExists('.hero h1', langData.heroTitle);
    this.updateElementIfExists('.hero p', langData.heroText);

    this.previousLanguage = this.currentLanguage;
  },

  // تبديل اللغة مع تأثيرات انتقالية
  async switchLanguage() {
    // تأثير fade-out
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.7';
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    localStorage.setItem('preferredLang', this.currentLanguage);
    
    // تحديث URL بدون إعادة تحميل
    const url = new URL(window.location.href);
    url.searchParams.set('lang', this.currentLanguage);
    window.history.pushState({}, '', url);
    
    // إشعار تقنيات المساعدة
    this.announceLanguageChange();
    
    // تحديث الصفحة
    this.updatePage();
    
    // تأثير fade-in
    document.body.style.opacity = '1';
    setTimeout(() => document.body.style.transition = '', 300);
  },

  // إعلام تقنيات المساعدة بتغيير اللغة
  announceLanguageChange() {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('role', 'status');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.textContent = `Language switched to ${this.currentLanguage === 'ar' ? 'Arabic' : 'English'}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  },

  // التنقل بين الصفحات مع التحقق من الصلاحية
  navigateTo(page) {
    const validPages = ['login', 'signup', 'about', 'generate', 'connect', 'ai-log-analyzer', 'nuclei-analyzer'];
    if (!validPages.includes(page)) page = 'index';
    
    window.location.href = `${page}.html?lang=${this.currentLanguage}`;
  },

  // تحديث العنصر مع التحقق من الوجود
  updateElementIfExists(selector, text) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    elements.forEach(element => {
      element.textContent = text;
    });
  },

  // تحديث نص الزر مع التحقق من الوجود
  updateButtonTextIfExists(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const textElement = button.querySelector('.btn-text') || button;
    textElement.textContent = text;
  }
};

// بدء التشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // إضافة فحص للوضع المظلم إذا كان مدعوماً
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark-mode');
  }
  
  AppManager.init();
});

// دعم التنقل عبر زر الرجوع في المتصفح
window.addEventListener('popstate', () => {
  AppManager.loadLanguage();
  AppManager.updatePage();
});
