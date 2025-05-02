// كائن إدارة التطبيق
const AppManager = {
  currentLanguage: 'ar',
  previousTranslations: {},
  
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

  // الحصول على الترجمة مع fallback
  getTranslation(key) {
    return this.translations[this.currentLanguage][key] || 
           this.translations[this.currentLanguage === 'ar' ? 'en' : 'ar'][key] || 
           key;
  },

  // تحديث الصفحة حسب اللغة
  updatePage() {
    const langData = this.translations[this.currentLanguage];
    
    // حفظ الترجمات السابقة للمقارنة
    const previousLangData = this.previousTranslations;
    this.previousTranslations = JSON.parse(JSON.stringify(langData));
    
    // تحديث العناصر العامة فقط إذا تغيرت
    if (previousLangData.copyright !== langData.copyright) {
      this.updateElement('.logo', 'Magnatirix');
      this.updateElement('.copyright', `${langData.copyright} &copy; ${new Date().getFullYear()} Magnatirix`);
    }
    
    // تحديث الأزرار
    this.updateButtonTextIfChanged('loginButton', langData.login, previousLangData.login);
    this.updateButtonTextIfChanged('signupButton', langData.signup, previousLangData.signup);
    this.updateButtonTextIfChanged('learnMoreButton', langData.learnMore, previousLangData.learnMore);
    this.updateButtonTextIfChanged('generateButton', langData.moreDetails, previousLangData.moreDetails);
    this.updateButtonTextIfChanged('connectButton', langData.moreDetails, previousLangData.moreDetails);
    this.updateButtonTextIfChanged('aiLogButton', langData.moreDetails, previousLangData.moreDetails);
    this.updateButtonTextIfChanged('nucleiButton', langData.moreDetails, previousLangData.moreDetails);
    this.updateButtonTextIfChanged('startNowButton', langData.getStarted, previousLangData.getStarted);
    this.updateButtonTextIfChanged('backButton', langData.back, previousLangData.back);
    
    // تحديث زر تبديل اللغة
    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      const span = toggle.querySelector('span');
      if (span && span.textContent !== langData.language) {
        span.textContent = langData.language;
      }
      toggle.setAttribute('aria-label', this.getTranslation('switchLanguage'));
    }
    
    // تحديث النصوص الخاصة بالصفحة الرئيسية
    if (document.querySelector('.hero h1')) {
      this.updateElementIfChanged('.hero h1', langData.heroTitle, previousLangData.heroTitle);
      this.updateElementIfChanged('.hero p', langData.heroText, previousLangData.heroText);
    }
  },

  // تبديل اللغة مع تأثيرات انتقال
  async switchLanguage() {
    // تأثير fade-out
    document.body.style.transition = 'opacity 0.2s ease';
    document.body.style.opacity = '0.5';
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    localStorage.setItem('preferredLang', this.currentLanguage);
    
    // تحديث معلمة اللغة في URL بدون إعادة تحميل الصفحة
    const url = new URL(window.location.href);
    url.searchParams.set('lang', this.currentLanguage);
    window.history.pushState({}, '', url);
    
    // إعلام تقنيات المساعدة بالتغيير
    const langAlert = document.createElement('div');
    langAlert.textContent = `Language switched to ${this.currentLanguage}`;
    langAlert.setAttribute('role', 'alert');
    langAlert.style.position = 'absolute';
    langAlert.style.left = '-9999px';
    document.body.appendChild(langAlert);
    setTimeout(() => document.body.removeChild(langAlert), 1000);
    
    this.updatePage();
    
    // تأثير fade-in
    document.body.style.opacity = '1';
  },

  // التنقل بين الصفحات
  navigateTo(page) {
    window.location.href = `${page}.html?lang=${this.currentLanguage}`;
  },

  // تحديث عنصر HTML إذا تغير النص
  updateElementIfChanged(selector, newText, oldText) {
    if (newText === oldText) return;
    
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    elements.forEach(element => {
      element.textContent = newText;
    });
  },

  // تحديث نص الزر إذا تغير
  updateButtonTextIfChanged(buttonId, newText, oldText) {
    if (newText === oldText) return;
    
    const button = document.getElementById(buttonId);
    if (button) {
      const textElement = button.querySelector('.btn-text') || button;
      textElement.textContent = newText;
    }
  },

  // تحديث عنصر HTML (النسخة الأصلية المحتفظ بها للتوافق)
  updateElement(selector, text) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    elements.forEach(element => {
      element.textContent = text;
    });
  },

  // تحديث نص الزر (النسخة الأصلية المحتفظ بها للتوافق)
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
