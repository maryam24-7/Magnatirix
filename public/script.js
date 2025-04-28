// Set current year in footer
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Translations object
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
        aboutTitle: "عن Magnatirix",
        aboutText: "Magnatirix هو نظام مراسلة آمن يوفر حماية كاملة لبياناتك واتصالاتك باستخدام تقنيات التشفير الحديثة.",
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
        aboutTitle: "About Magnatirix",
        aboutText: "Magnatirix is a secure messaging system providing full protection for your data and communications using modern encryption technologies.",
        language: "العربية",
        copyright: "All Rights Reserved"
    }
};

// Navigation functions
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

// Language switching function
function switchLanguage() {
    const html = document.documentElement;
    const currentLang = html.lang;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    // Update HTML attributes
    html.lang = newLang;
    html.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    // Get the translation object for the new language
    const langData = translations[newLang];
    
    // Update logo
    const logo = document.querySelector('.logo');
    if (logo) logo.textContent = langData.logo;

    // Update hero section
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    if (heroTitle) heroTitle.textContent = langData.heroTitle;
    if (heroText) heroText.textContent = langData.heroText;
    
    // Update feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length >= 3) {
        featureCards[0].querySelector('h3 span').textContent = langData.feature1Title;
        featureCards[0].querySelector('p').textContent = langData.feature1Text;
        featureCards[1].querySelector('h3 span').textContent = langData.feature2Title;
        featureCards[1].querySelector('p').textContent = langData.feature2Text;
        featureCards[2].querySelector('h3 span').textContent = langData.feature3Title;
        featureCards[2].querySelector('p').textContent = langData.feature3Text;
    }

    // Update CTA section
    const ctaTitle = document.querySelector('.cta-section h2');
    const ctaText = document.querySelector('.cta-section p');
    if (ctaTitle) ctaTitle.textContent = langData.ctaTitle;
    if (ctaText) ctaText.textContent = langData.ctaText;
    
    // Update buttons
    const btnTexts = document.querySelectorAll('.btn-text');
    if (btnTexts.length >= 7) {
        btnTexts[0].textContent = langData.login;
        btnTexts[1].textContent = langData.signup;
        btnTexts[2].textContent = langData.learnMore;
        btnTexts[3].textContent = langData.moreDetails;
        btnTexts[4].textContent = langData.moreDetails;
        btnTexts[5].textContent = langData.moreDetails;
        btnTexts[6].textContent = langData.getStarted;
    }

    // Update About Page if exists
    const aboutTitle = document.querySelector('.about-title');
    const aboutText = document.querySelector('.about-text');
    if (aboutTitle) aboutTitle.textContent = langData.aboutTitle;
    if (aboutText) aboutText.textContent = langData.aboutText;
    
    // Update footer
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.innerHTML = langData.copyright + ' &copy; <span id="year"></span> Magnatirix';
        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    }
    
    // Update language switcher button
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.querySelector('span').textContent = currentLang === 'ar' ? 'العربية' : 'English';
    }
    
    // Save language preference
    localStorage.setItem('preferredLang', newLang);
}

// Initialize language switcher
const languageToggleButton = document.getElementById('languageToggle');
if (languageToggleButton) {
    languageToggleButton.addEventListener('click', switchLanguage);
}

// Check for preferred language in localStorage
document.addEventListener('DOMContentLoaded', () => {
    const preferredLang = localStorage.getItem('preferredLang');
    if (preferredLang && preferredLang !== document.documentElement.lang) {
        switchLanguage();
    }
});
