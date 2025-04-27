document.addEventListener('DOMContentLoaded', () => {
  // زر تبديل اللغة
  const languageSwitch = document.getElementById('language-switch');
  if (languageSwitch) {
    languageSwitch.addEventListener('click', switchLanguage);
  }

  // زر تسجيل مستخدم جديد
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
      const result = await register(username, password);
      alert(result.message || 'تم التسجيل');
    });
  }

  // زر تسجيل دخول
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const result = await login(username, password);
      if (result.token) {
        alert('تم تسجيل الدخول بنجاح');
        window.location.href = '/dashboard.html'; // أو أي صفحة أخرى بعد تسجيل الدخول
      } else {
        alert(result.message || 'فشل تسجيل الدخول');
      }
    });
  }

  // تحميل المستخدمين النشطين (في صفحة لوحة التحكم مثلاً)
  const usersList = document.getElementById('users-list');
  if (usersList) {
    loadActiveUsers();
  }
});

// ================================
// وظائف مساعدة
// ================================

// تبديل اللغة (بسيطة مؤقتًا: بين الإنجليزية والعربية)
function switchLanguage() {
  const currentLang = document.documentElement.lang;
  if (currentLang === 'ar') {
    document.documentElement.lang = 'en';
    document.getElementById('language-switch').textContent = 'العربية';
    translatePageToEnglish();
  } else {
    document.documentElement.lang = 'ar';
    document.getElementById('language-switch').textContent = 'English';
    translatePageToArabic();
  }
}

// دوال ترجمة بسيطة (مكان مخصص لكِ لتطويرها لاحقًا)
function translatePageToEnglish() {
  // ضيفي هنا أكواد الترجمة لو تحبي
}

function translatePageToArabic() {
  // ضيفي هنا أكواد الترجمة لو تحبي
}

// تحميل قائمة المستخدمين النشطين
async function loadActiveUsers() {
  try {
    const users = await getActiveUsers();
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';

    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = user.username;
      usersList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}
