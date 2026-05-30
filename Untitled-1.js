document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') body.classList.add('dark-theme');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // ==========================================
    // 2. СЛАЙДЕР СОСТАВА РАБОТ
    // ==========================================
    const slidesData = [
        { title: "Выбор конфигурации", desc: "На первом этапе работы мы помогаем определиться с формой кухни, количеством и наполнением каждого модуля. Предусматриваем блоки под установку грилей и встраиваемой бытовой техники.", img: "images/slider1.png" },
        { title: "Выбор материала и цвета", desc: "Подбираем долговечные материалы, устойчивые к ультрафиолету и влаге. Огромный выбор текстур камня, дерева и металла для идеального сочетания с вашим ландшафтом.", img: "images/slider2.png" },
        { title: "Дизайн-проект и изготовление", desc: "Создаем 3D-визуализацию вашей будущей кухни. После утверждения запускаем производство на собственном цехе с контролем качества на каждом этапе.", img: "images/slider3.png" },
        { title: "Установка", desc: "Профессиональный монтаж на объекте. Подключаем коммуникации, устанавливаем технику и проводим финальную проверку работоспособности всех систем.", img: "images/slider4.png" }
    ];

    let currentSlide = 0;
    const scopeImg = document.getElementById('scopeImg');
    const scopeTitle = document.getElementById('scopeTitle');
    const scopeDesc = document.getElementById('scopeDesc');
    const steps = document.querySelectorAll('.scope__step');

    function updateSlide(index) {
        if (!scopeTitle || !scopeDesc || !scopeImg) return;
        scopeTitle.style.opacity = 0;
        scopeDesc.style.opacity = 0;
        scopeImg.style.opacity = 0.5;
        setTimeout(() => {
            scopeTitle.textContent = slidesData[index].title;
            scopeDesc.textContent = slidesData[index].desc;
            scopeImg.src = slidesData[index].img;
            scopeTitle.style.opacity = 1;
            scopeDesc.style.opacity = 1;
            scopeImg.style.opacity = 1;
        }, 300);
        steps.forEach(step => step.classList.remove('active'));
        if (steps[index]) steps[index].classList.add('active');
    }

    steps.forEach((step, index) => step.addEventListener('click', () => { currentSlide = index; updateSlide(currentSlide); }));
    
    const scopeNext = document.querySelector('.scope__arrow--next');
    const scopePrev = document.querySelector('.scope__arrow--prev');
    if (scopeNext) scopeNext.addEventListener('click', () => { currentSlide = (currentSlide + 1) % slidesData.length; updateSlide(currentSlide); });
    if (scopePrev) scopePrev.addEventListener('click', () => { currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length; updateSlide(currentSlide); });

    // ==========================================
    // 3. БУРГЕР МЕНЮ
    // ==========================================
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (burger && nav) burger.addEventListener('click', () => { nav.classList.toggle('active'); burger.classList.toggle('active'); });

    // ==========================================
    // 4. ПАРАЛЛАКС HERO
    // ==========================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImg = document.querySelector('.hero__img');
        if (heroImg) heroImg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
    });

    // ==========================================
    // 5. СЛАЙДЕР ПОРТФОЛИО
    // ==========================================
    const portfolioSlides = document.querySelectorAll('.portfolio-full__slide');
    const portfolioDots = document.querySelectorAll('.portfolio-full__dot');
    const portfolioPrev = document.querySelector('.portfolio-full__arrow--prev');
    const portfolioNext = document.querySelector('.portfolio-full__arrow--next');
    let portfolioIndex = 0;
    let portfolioTimer;

    function showPortfolioSlide(index) {
        portfolioSlides.forEach(slide => slide.classList.remove('active'));
        portfolioDots.forEach(dot => dot.classList.remove('active'));
        if (portfolioSlides[index]) portfolioSlides[index].classList.add('active');
        if (portfolioDots[index]) portfolioDots[index].classList.add('active');
        portfolioIndex = index;
        clearInterval(portfolioTimer);
        portfolioTimer = setInterval(() => showPortfolioSlide((portfolioIndex + 1) % portfolioSlides.length), 5000);
    }

    if (portfolioPrev) portfolioPrev.addEventListener('click', () => showPortfolioSlide((portfolioIndex - 1 + portfolioSlides.length) % portfolioSlides.length));
    if (portfolioNext) portfolioNext.addEventListener('click', () => showPortfolioSlide((portfolioIndex + 1) % portfolioSlides.length));
    portfolioDots.forEach((dot, i) => dot.addEventListener('click', () => showPortfolioSlide(i)));

    let touchStartX = 0;
    const portfolioTrack = document.getElementById('portfolioTrack');
    if (portfolioTrack) {
        portfolioTrack.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX, { passive: true });
        portfolioTrack.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) showPortfolioSlide((portfolioIndex + 1) % portfolioSlides.length);
                else showPortfolioSlide((portfolioIndex - 1 + portfolioSlides.length) % portfolioSlides.length);
            }
        }, { passive: true });
        portfolioTimer = setInterval(() => showPortfolioSlide((portfolioIndex + 1) % portfolioSlides.length), 5000);
    }
});