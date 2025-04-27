// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // ——— تبديل اللغة ———
  document
    .getElementById('languageToggle')
    .addEventListener('click', switchLanguage);

  // ——— أزرار التسجيل/الدخول في الهيدر ———
  document.querySelectorAll('.nav-actions button[aria-label]').forEach(btn => {
    btn.addEventListener('click', () => handleNav(btn.getAttribute('aria-label')));
  });

  // ——— زر "تعرف أكثر" في الهيرو ———
  document
    .querySelector('.hero .btn-accent')
    .addEventListener('click', () => (window.location.href = '/about'));

  // ——— زر "ابدأ مجاناً الآن" في CTA ———
  document
    .querySelector('.cta-section .btn-accent')
    .addEventListener('click', () => (window.location.href = '/signup'));

  // ——— أزرار "المزيد من التفاصيل" في البطاقات ———
  const featurePages = ['/generate', '/connect', '/sender'];
  document.querySelectorAll('.feature-card .btn-primary').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const target = featurePages[idx] || '/';
      window.location.href = target;
    });
  });

  // ——— روابط الفوتر ———
  const footerMap = {
    'الشروط والأحكام': '/terms',
    'سياسة الخصوصية': '/privacy',
    'عن النظام': '/about',
    'الأسئلة الشائعة': '/faq',
    'اتصل بنا': '/contact'
  };
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const to = footerMap[link.getAttribute('aria-label')];
      window.location.href = to || '/';
    });
  });

  // ——— اضبط السنة في الفوتر ———
  document.getElementById('year').textContent = new Date().getFullYear();
});


// دوال مساعدة:

function handleNav(label) {
  const map = {
    'تسجيل الدخول': '/login',
    'Login': '/login',
    'إنشاء حساب': '/signup',
    'Sign Up': '/signup'
  };
  if (map[label]) window.location.href = map[label];
}

function switchLanguage() {
  const html = document.documentElement;
  const next = html.lang === 'ar' ? 'en' : 'ar';
  html.lang = next;
  html.dir  = next === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('preferredLang', next);
  // TODO: طبق ترجماتك هنا باستخدام كائن translations الموجود لديك
}
