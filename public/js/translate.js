document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    appName: document.querySelector('.logo'),
    secureMessaging: document.querySelector('.hero h1'),
    appDescription: document.querySelector('.hero p'),
    login: document.querySelector('#loginButton .btn-text'),
    signup: document.querySelector('#signupButton .btn-text'),
    learnMore: document.querySelector('#learnMoreButton .btn-text'),
    cyberSecurityTools: document.querySelector('.features-title'),
    startFreeNow: document.querySelector('#startNowButton .btn-text'),
    copyright: document.querySelector('.copyright')
  };

  async function loadLanguage(lang) {
    try {
      const response = await fetch(`/i18n/${lang}.json`);
      const translations = await response.json();
      
      // تطبيق الترجمات
      Object.keys(elements).forEach(key => {
        if (elements[key] && translations[key]) {
          elements[key].textContent = translations[key];
        }
      });

      // تغيير اتجاه الصفحة
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      
      // تحديث نص زر اللغة
      document.querySelector('#languageToggle span').textContent = 
        lang === 'ar' ? 'English' : 'العربية';
    } catch (error) {
      console.error('Error loading language:', error);
    }
  }

  // حدث تبديل اللغة
  document.getElementById('languageToggle').addEventListener('click', () => {
    const newLang = document.documentElement.lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', newLang);
    loadLanguage(newLang);
  });

  // تحميل اللغة المحفوظة أو الافتراضية
  const savedLang = localStorage.getItem('lang') || 'ar';
  loadLanguage(savedLang);
});
