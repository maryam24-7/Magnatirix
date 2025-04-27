// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. تبديل اللغة
  const languageToggle = document.getElementById('languageToggle');
  languageToggle.addEventListener('click', switchLanguage);

  // 2. تنقّل سلس بين أقسام الصفحة (nav links)
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 3. ضبط السنة في الفوتر
  document.getElementById('year').textContent = new Date().getFullYear();

  // 4. أزرار التفاصيل في الكروت
  document.querySelectorAll('.feature-card .btn-primary').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // هنا تنقلين لصفحة تفاصيل الميزة رقم idx+1
      const lang = document.documentElement.lang;
      const page = `/feature${idx+1}${lang === 'ar' ? '-ar' : ''}.html`;
      window.location.href = page;
    });
  });

  // 5. زرّ “تعرف أكثر” في الهيرو
  const heroLearnMore = document.querySelector('.hero .btn-accent');
  if (heroLearnMore) {
    heroLearnMore.addEventListener('click', learnMore);
  }

  // 6. زرّ “ابدأ مجاناً الآن”
  const ctaStart = document.querySelector('.cta-section .btn-accent');
  if (ctaStart) {
    ctaStart.addEventListener('click', goToSignup);
  }

  // 7. روابط الفوتر
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      // توجيه عام؛ يمكنك تخصيص كل رابط حسب الـ aria-label أو نص الرابط
      const label = link.getAttribute('aria-label');
      switch (label) {
        case 'الشروط والأحكام':
          window.location.href = '/terms.html'; break;
        case 'سياسة الخصوصية':
          window.location.href = '/privacy.html'; break;
        case 'عن النظام':
          window.location.href = '/about.html'; break;
        case 'الأسئلة الشائعة':
          window.location.href = '/faq.html'; break;
        case 'اتصل بنا':
          window.location.href = '/contact.html'; break;
      }
    });
  });

  // 8. استعادة اللغة المفضّلة
  const pref = localStorage.getItem('preferredLang');
  if (pref && pref !== document.documentElement.lang) {
    switchLanguage();
  }
});

// =======================
// دوال المساعدة
// =======================

function goToLogin() {
  const lang = document.documentElement.lang;
  window.location.href = lang === 'ar' ? '/login-ar.html' : '/login.html';
}

function goToSignup() {
  const lang = document.documentElement.lang;
  window.location.href = lang === 'ar' ? '/signup-ar.html' : '/signup.html';
}

function learnMore() {
  const lang = document.documentElement.lang;
  window.location.href = lang === 'ar' ? '/about-ar.html' : '/about.html';
}

function switchLanguage() {
  const html = document.documentElement;
  const current = html.lang;
  const next = current === 'ar' ? 'en' : 'ar';
  html.lang = next;
  html.dir  = next === 'ar' ? 'rtl' : 'ltr';
  // هنا تضعين كود الترجمة باستخدام كائن translations الموجود لديك
  // مثال: document.querySelector('.hero h1').textContent = translations[next].heroTitle;
  localStorage.setItem('preferredLang', next);
}
