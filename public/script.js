// تأكد من تحميل DOM بالكامل قبل تنفيذ الجافاسكربت
document.addEventListener('DOMContentLoaded', function() {
    console.log("تم تحميل الصفحة بالكامل وجاهز للتنفيذ");
    
    // تعيين سنة حقوق النشر
    updateCopyrightYear();
    
    // تهيئة الترجمة
    initTranslations();
    
    // ربط الأزرار
    setupEventListeners();
});

// وظائف مساعدة
function updateCopyrightYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initTranslations() {
    // تحميل تفضيل اللغة من localStorage
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) {
        applyLanguage(savedLang);
    }
}

function setupEventListeners() {
    // ربط الأزرار العامة
    const buttons = {
        'loginButton': goToLogin,
        'signupButton': goToSignup,
        'learnMoreButton': learnMore,
        'generateButton': goToGenerate,
        'connectButton': goToConnect,
        'aiLogButton': goToAILogAnalyzer,
        'nucleiButton': goToNucleiAnalyzer,
        'startNowButton': goToSignup,
        'languageToggle': switchLanguage
    };

    Object.entries(buttons).forEach(([id, handler]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', handler);
        }
    });
}

// دوال التنقل
function goToLogin() {
    navigateToPage('login');
}

function goToSignup() {
    navigateToPage('signup');
}

function learnMore() {
    navigateToPage('about');
}

function goToGenerate() {
    navigateToPage('generate');
}

function goToConnect() {
    navigateToPage('connect');
}

function goToAILogAnalyzer() {
    navigateToPage('ai-log-analyzer');
}

function goToNucleiAnalyzer() {
    navigateToPage('nuclei-analyzer');
}

function navigateToPage(page) {
    const currentLang = document.documentElement.lang || 'ar';
    window.location.href = `${page}.html?lang=${currentLang}`;
}

// الترجمة
const translations = {
    ar: {
        logo: "Magnatirix",
        heroTitle: "نظام التراسل المشفر الآمن",
        heroText: "حافظ على خصوصيتك مع نظام Magnatirix للتراسل المشفر من طرف إلى طرف الذي يحمي اتصالاتك باستخدام أحدث تقنيات التشفير",
        featuresTitle: "أدوات الأمن السيبراني المدعومة بالذكاء الاصطناعي",
        feature1Title: "VirusTotal API",
        feature1Text: "افحص الملفات والروابط المشبوهة مباشرة من الموقع باستخدام قاعدة بيانات ضخمة للبرمجيات الخبيثة.",
        feature1AI: "دمج الذكاء الاصطناعي: تحليل وصف الملف أو سلوك المستخدم لتقدير درجة الخطر.",
        feature2Title: "IBM X-Force Exchange",
        feature2Text: "احصل على تحليلات فورية للتهديدات السيبرانية العالمية.",
        feature2AI: "دمج الذكاء الاصطناعي: تصنيف التهديدات أو المجالات الخطرة باستخدام تحليل لغوي (NLP).",
        feature3Title: "AI Log Analyzer",
        feature3Text: "حلّل سجلات النظام أو الشبكة لاكتشاف الأنماط الغريبة.",
        feature3AI: "دمج الذكاء الاصطناعي: اكتشاف السلوك غير الطبيعي باستخدام نماذج تعلم الآلة.",
        feature4Title: "Nuclei + AI Analyzer",
        feature4Text: "فحص المواقع لاكتشاف الثغرات الأمنية المعروفة وتقييم خطورتها.",
        feature4AI: "دمج الذكاء الاصطناعي: تحليل النتائج وتوليد توصيات تلقائية باستخدام الذكاء اللغوي.",
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
        featuresTitle: "AI-Powered Cybersecurity Tools",
        feature1Title: "VirusTotal API",
        feature1Text: "Scan suspicious files and URLs directly from the site using a huge malware database.",
        feature1AI: "AI Integration: Analyze file description or user behavior to estimate risk level.",
        feature2Title: "IBM X-Force Exchange",
        feature2Text: "Get instant analysis of global cyber threats.",
        feature2AI: "AI Integration: Classify threats or dangerous domains using NLP analysis.",
        feature3Title: "AI Log Analyzer",
        feature3Text: "Analyze system or network logs to detect unusual patterns.",
        feature3AI: "AI Integration: Detect abnormal behavior using machine learning models.",
        feature4Title: "Nuclei + AI Analyzer",
        feature4Text: "Scan websites to discover known security vulnerabilities and assess their severity.",
        feature4AI: "AI Integration: Analyze results and generate automatic recommendations using linguistic AI.",
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

// تبديل اللغة
function switchLanguage() {
    const html = document.documentElement;
    const currentLang = html.lang || 'ar';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    applyLanguage(newLang);
    updateLanguageToggle(currentLang);
    saveLanguagePreference(newLang);
}

function applyLanguage(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    const langData = translations[lang];
    if (!langData) return;

    // تحديث العناصر المشتركة في جميع الصفحات
    updateElementText('.logo', langData.logo);
    updateElementText('.copyright', `${langData.copyright} &copy; <span id="year"></span> Magnatirix`);
    
    // تحديث الأزرار المشتركة
    updateButtonTexts(langData);
    
    // تحديث السنة بعد تغيير اللغة
    updateCopyrightYear();
}

function updateElementText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = text;
    }
}

function updateButtonTexts(langData) {
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

    buttons.forEach(button => {
        const element = document.getElementById(button.id);
        if (element) {
            const textElement = element.querySelector('.btn-text') || element;
            textElement.textContent = button.text;
        }
    });
}

function updateLanguageToggle(currentLang) {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        const span = languageToggle.querySelector('span');
        if (span) {
            span.textContent = currentLang === 'ar' ? 'العربية' : 'English';
        }
    }
}

function saveLanguagePreference(lang) {
    localStorage.setItem('preferredLang', lang);
}

// تهيئة اللغة عند التحميل
const savedLang = localStorage.getItem('preferredLang');
if (savedLang) {
    applyLanguage(savedLang);
        }
