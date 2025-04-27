// زر تبديل اللغة
document.getElementById("language-switch").addEventListener("click", function() {
    alert("Language switch button clicked!"); // اختبار عمل الزر
    // يمكنك استبدال هذا الكود بوظيفة تبديل اللغة الفعلية
});

// التنقل بين الأقسام
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: "smooth" });
    });
});

// تحديد السنة الحالية في الفوتر
document.getElementById('year').textContent = new Date().getFullYear();

// كائن التراجم
const translations = {
    ar: {
        logo: "Magnatirix",
        heroTitle: "نظام التراسل المشفر الآمن",
        heroText: "حافظ على خصوصيتك مع نظام Magnatirix للتراسل المشفر من طرف إلى طرف الذي يحمي اتصالاتك باستخدام أحدث تقنيات التشفير",
        feature1Title: "تشفير من طرف إلى طرف",
        feature1Text: "رسائلك مشفرة قبل مغادرة جهازك ولا يمكن فك تشفيرها إلا من قبل المستقبل المقصود، مما يضمن خصوصية اتصالاتك",
        feature2Title: "خصوصية مطلقة",
        feature2Text: "لا نقوم بتخزين رسائلك على خوادمنا، مما يضمن عدم إمكانية الوصول إليها من قبل أي طرف ثالث، بما في ذلك نحن",
        feature3Title: "مشاركة ملفات آمنة",
        feature3Text: "أرسل ملفاتك مع نفس مستوى التشفير القوي الذي نستخدمه للرسائل النصية، بحجم يصل إلى 2GB لكل ملف",
        ctaTitle: "جاهز لبدء استخدام Magnatirix؟",
        ctaText: "انضم إلى آلاف المستخدمين الذين يثقون بنا لحماية اتصالاتهم اليومية",
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        learnMore: "تعرف أكثر",
        getStarted: "ابدأ مجاناً الآن",
        moreDetails: "المزيد من التفاصيل",
        language: "English",
        copyright: "جميع الحقوق محفوظة"
    },
    en: {
        logo: "Magnatirix",
        heroTitle: "Secure Encrypted Messaging",
        heroText: "Protect your privacy with Magnatirix's end-to-end encrypted messaging system that secures your communications using the latest encryption technologies",
        feature1Title: "End-to-End Encryption",
        feature1Text: "Your messages are encrypted before leaving your device and can only be decrypted by the intended recipient, ensuring complete privacy for your communications",
        feature2Title: "Absolute Privacy",
        feature2Text: "We don't store your messages on our servers, ensuring they can't be accessed by any third parties, including us",
        feature3Title: "Secure File Sharing",
        feature3Text: "Send your files with the same strong encryption level we use for text messages, with files up to 2GB each",
        ctaTitle: "Ready to start using Magnatirix?",
        ctaText: "Join thousands of users who trust us to protect their daily communications",
        login: "Login",
        signup: "Sign Up",
        learnMore: "Learn More",
        getStarted: "Get Started for Free",
        moreDetails: "More Details",
        language: "العربية",
        copyright: "All Rights Reserved"
    }
};

// وظائف التنقل
function goToLogin() {
    const lang = document.documentElement.lang;
    window.location.href = lang === 'ar' ? '/login-ar' : '/login';
}

function goToSignup() {
    const lang = document.documentElement.lang;
    window.location.href = lang === 'ar' ? '/signup-ar' : '/signup';
}

function learnMore() {
    const lang = document.documentElement.lang;
    window.location.href = lang === 'ar' ? '/about-ar' : '/about';
}

// وظيفة تبديل اللغة
function switchLanguage() {
    const html = document.documentElement;
    const currentLang = html.lang;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';

    // تحديث صفات HTML
    html.lang = newLang;
    html.dir = newLang === 'ar' ? 'rtl' : 'ltr';

    // الحصول على كائن الترجمة للغة الجديدة
    const langData = translations[newLang];

    // تحديث النصوص
    document.querySelector('.logo').textContent = langData.logo;
    document.querySelector('.hero h1').textContent = langData.heroTitle;
    document.querySelector('.hero p').textContent = langData.heroText;

    // تحديث بطاقات الميزات
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards[0].querySelector('h3 span').textContent = langData.feature1Title;
    featureCards[0].querySelector('p').textContent = langData.feature1Text;
    featureCards[1].querySelector('h3 span').textContent = langData.feature2Title;
    featureCards[1].querySelector('p').textContent = langData.feature2Text;
    featureCards[2].querySelector('h3 span').textContent = langData.feature3Title;
    featureCards[2].querySelector('p').textContent = langData.feature3Text;

    // تحديث قسم الدعوة إلى العمل
    document.querySelector('.cta-section h2').textContent = langData.ctaTitle;
    document.querySelector('.cta-section p').textContent = langData.ctaText;

    // تحديث أزرار النصوص
    const btnTexts = document.querySelectorAll('.btn-text');
    btnTexts[0].textContent = langData.login;
    btnTexts[1].textContent = langData.signup;
    btnTexts[2].textContent = langData.learnMore;
    btnTexts[3].textContent = langData.moreDetails;
    btnTexts[4].textContent = langData.moreDetails;
    btnTexts[5].textContent = langData.moreDetails;
    btnTexts[6].textContent = langData.getStarted;

    // تحديث الفوتر
    document.querySelector('.copyright').innerHTML = langData.copyright + ' &copy; <span id="year"></span> Magnatirix';

    // تحديث زر تبديل اللغة
    const languageToggle = document.getElementById('languageToggle');
    languageToggle.querySelector('span').textContent = currentLang === 'ar' ? 'العربية' : 'English';

    // إعادة تعيين السنة بعد التبديل
    document.getElementById('year').textContent = new Date().getFullYear();

    // حفظ تفضيل اللغة
    localStorage.setItem('preferredLang', newLang);
}

// تفعيل تبديل اللغة عند الضغط
document.getElementById('languageToggle').addEventListener('click', switchLanguage);

// التحقق من تفضيل اللغة المحفوظ
document.addEventListener('DOMContentLoaded', () => {
    const preferredLang = localStorage.getItem('preferredLang');
    if (preferredLang && preferredLang !== document.documentElement.lang) {
        switchLanguage();
    }
});
