// Translation Manager
const TranslationManager = {
  translations: {
    ar: {
      logo: "Magnatirix",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      learnMore: "تعرف أكثر",
      moreDetails: "المزيد من التفاصيل",
      getStarted: "ابدأ مجاناً الآن",
      language: "English",
      copyright: "جميع الحقوق محفوظة",
      back: "العودة"
    },
    en: {
      logo: "Magnatirix",
      login: "Login",
      signup: "Sign Up",
      learnMore: "Learn More",
      moreDetails: "More Details",
      getStarted: "Get Started for Free",
      language: "العربية",
      copyright: "All Rights Reserved",
      back: "Back"
    }
  },

  init() {
    this.loadLanguagePreference();
    this.setupEventListeners();
    this.updateCopyrightYear();
  },

  loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLang') || 'ar';
    this.applyLanguage(savedLang);
  },

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    const langData = this.translations[lang];
    if (!langData) return;

    this.updateElements(langData);
    this.updateButtons(langData);
  },

  updateElements(langData) {
    const elements = {
      '.logo': langData.logo,
      '.copyright': `${langData.copyright} &copy; <span id="year"></span> Magnatirix`,
      '#backButton span': langData.back
    };

    Object.entries(elements).forEach(([selector, text]) => {
      const element = document.querySelector(selector);
      if (element) element.innerHTML = text;
    });
  },

  updateButtons(langData) {
    const buttons = [
      { id: 'loginButton', text: langData.login },
      { id: 'signupButton', text: langData.signup },
      { id: 'learnMoreButton', text: langData.learnMore },
      { id: 'generateButton', text: langData.moreDetails },
      { id: 'connectButton', text: langData.moreDetails },
      { id: 'aiLogButton', text: langData.moreDetails },
      { id: 'nucleiButton', text: langData.moreDetails },
      { id: 'startNowButton', text: langData.getStarted }
    ];

    buttons.forEach(btn => {
      const element = document.getElementById(btn.id);
      if (element) {
        const textElement = element.querySelector('.btn-text') || element;
        textElement.textContent = btn.text;
      }
    });
  },

  updateLanguageToggle(currentLang) {
    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      const span = toggle.querySelector('span');
      if (span) span.textContent = this.translations[currentLang].language;
    }
  },

  updateCopyrightYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
  },

  setupEventListeners() {
    // Navigation Buttons
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

    Object.entries(navButtons).forEach(([id, handler]) => {
      const element = document.getElementById(id);
      if (element) element.addEventListener('click', handler);
    });
  },

  navigateTo(page) {
    const lang = document.documentElement.lang || 'ar';
    window.location.href = `${page}.html?lang=${lang}`;
  },

  switchLanguage() {
    const currentLang = document.documentElement.lang || 'ar';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    this.applyLanguage(newLang);
    this.updateLanguageToggle(currentLang);
    localStorage.setItem('preferredLang', newLang);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => TranslationManager.init());
