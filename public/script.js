// تأكد من تحميل DOM بالكامل قبل تنفيذ الجافاسكربت
document.addEventListener('DOMContentLoaded', function() {
    console.log("تم تحميل الصفحة بالكامل وجاهز للتنفيذ");
    
    // تعيين سنة حقوق النشر
    document.getElementById('year').textContent = new Date().getFullYear();

    // ربط الأزرار بالدوال
    document.getElementById('loginButton').addEventListener('click', goToLogin);
    document.getElementById('signupButton').addEventListener('click', goToSignup);
    document.getElementById('learnMoreButton').addEventListener('click', learnMore);
    document.getElementById('generateButton').addEventListener('click', goToGenerate);
    document.getElementById('connectButton').addEventListener('click', goToConnect);
    document.getElementById('aiLogButton').addEventListener('click', goToAILogAnalyzer);
    document.getElementById('nucleiButton').addEventListener('click', goToNucleiAnalyzer);
    document.getElementById('startNowButton').addEventListener('click', goToSignup);
    document.getElementById('languageToggle').addEventListener('click', switchLanguage);

    // دوال التنقل
    function goToLogin() {
        console.log("الذهاب إلى صفحة تسجيل الدخول");
        const lang = document.documentElement.lang;
        window.location.href = lang === 'ar' ? 'login-ar.html' : 'login.html';
    }

    function goToSignup() {
        console.log("الذهاب إلى صفحة إنشاء حساب");
        const lang = document.documentElement.lang;
        window.location.href = lang === 'ar' ? 'signup-ar.html' : 'signup.html';
    }

    function learnMore() {
        console.log("الذهاب إلى صفحة المزيد");
        const lang = document.documentElement.lang;
        window.location.href = lang === 'ar' ? 'about-ar.html' : 'about.html';
    }

    function goToGenerate() {
        console.log("الذهاب إلى صفحة VirusTotal API");
        const lang = document.documentElement.lang;
        window.location.href = 'generate.html?lang=' + (lang === 'ar' ? 'ar' : 'en');
    }

    function goToConnect() {
        console.log("الذهاب إلى صفحة IBM X-Force Exchange");
        const lang = document.documentElement.lang;
        window.location.href = 'connect.html?lang=' + (lang === 'ar' ? 'ar' : 'en');
    }

    function goToAILogAnalyzer() {
        console.log("الذهاب إلى صفحة AI Log Analyzer");
        const lang = document.documentElement.lang;
        window.location.href = 'ai-log-analyzer.html?lang=' + (lang === 'ar' ? 'ar' : 'en');
    }

    function goToNucleiAnalyzer() {
        console.log("الذهاب إلى صفحة Nuclei Analyzer");
        const lang = document.documentElement.lang;
        window.location.href = 'nuclei-analyzer.html?lang=' + (lang === 'ar' ? 'ar' : 'en');
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
        const currentLang = html.lang;
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        
        // تحديث خصائص HTML
        html.lang = newLang;
        html.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        
        // الحصول على كائن الترجمة للغة الجديدة
        const langData = translations[newLang];
        
        // تحديث جميع عناصر النص
        document.querySelector('.logo').textContent = langData.logo;
        document.querySelector('.hero h1').textContent = langData.heroTitle;
        document.querySelector('.hero p').textContent = langData.heroText;
        document.querySelector('.features-title').textContent = langData.featuresTitle;
        
        // تحديث بطاقات الميزات
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards[0].querySelector('h3 span').textContent = langData.feature1Title;
        featureCards[0].querySelectorAll('p')[0].textContent = langData.feature1Text;
        featureCards[0].querySelectorAll('p')[1].innerHTML = '<strong>' + (newLang === 'ar' ? 'دمج الذكاء الاصطناعي:' : 'AI Integration:') + '</strong> ' + langData.feature1AI;
        
        featureCards[1].querySelector('h3 span').textContent = langData.feature2Title;
        featureCards[1].querySelectorAll('p')[0].textContent = langData.feature2Text;
        featureCards[1].querySelectorAll('p')[1].innerHTML = '<strong>' + (newLang === 'ar' ? 'دمج الذكاء الاصطناعي:' : 'AI Integration:') + '</strong> ' + langData.feature2AI;
        
        featureCards[2].querySelector('h3 span').textContent = langData.feature3Title;
        featureCards[2].querySelectorAll('p')[0].textContent = langData.feature3Text;
        featureCards[2].querySelectorAll('p')[1].innerHTML = '<strong>' + (newLang === 'ar' ? 'دمج الذكاء الاصطناعي:' : 'AI Integration:') + '</strong> ' + langData.feature3AI;
        
        featureCards[3].querySelector('h3 span').textContent = langData.feature4Title;
        featureCards[3].querySelectorAll('p')[0].textContent = langData.feature4Text;
        featureCards[3].querySelectorAll('p')[1].innerHTML = '<strong>' + (newLang === 'ar' ? 'دمج الذكاء الاصطناعي:' : 'AI Integration:') + '</strong> ' + langData.feature4AI;
        
        // تحديث قسم CTA
        document.querySelector('.cta-section h2').textContent = langData.ctaTitle;
        document.querySelector('.cta-section p').textContent = langData.ctaText;
        
        // تحديث الأزرار
        document.querySelectorAll('.btn-text')[0].textContent = langData.login;
        document.querySelectorAll('.btn-text')[1].textContent = langData.signup;
        document.querySelectorAll('.btn-text')[2].textContent = langData.learnMore;
        document.querySelectorAll('.btn-text')[3].textContent = langData.moreDetails;
        document.querySelectorAll('.btn-text')[4].textContent = langData.moreDetails;
        document.querySelectorAll('.btn-text')[5].textContent = langData.moreDetails;
        document.querySelectorAll('.btn-text')[6].textContent = langData.moreDetails;
        document.querySelectorAll('.btn-text')[7].textContent = langData.getStarted;
        
        // تحديث التذييل
        document.querySelector('.copyright').innerHTML = langData.copyright + ' &copy; <span id="year"></span> Magnatirix';
        
        // تحديث زر تبديل اللغة
        const languageToggle = document.getElementById('languageToggle');
        languageToggle.querySelector('span').textContent = currentLang === 'ar' ? 'العربية' : 'English';
        
        // تحديث السنة مرة أخرى بعد تبديل اللغة
        document.getElementById('year').textContent = new Date().getFullYear();
        
        // حفظ تفضيل اللغة
        localStorage.setItem('preferredLang', newLang);
    }

    // التحقق من تفضيل اللغة في localStorage
    const preferredLang = localStorage.getItem('preferredLang');
    if (preferredLang && preferredLang !== document.documentElement.lang) {
        switchLanguage();
    }
});
