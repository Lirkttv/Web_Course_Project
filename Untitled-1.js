document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Главная загружена');

    const API_URL = 'http://localhost:3000';

    // 1. АВТОРИЗАЦИЯ В ШАПКЕ
    const authLink = document.querySelector('.header__auth-link');
    (async function updateAuthUI() {
        const sessionData = localStorage.getItem('auth_session');
        if (!sessionData || !authLink) return;
        try {
            const session = JSON.parse(sessionData);
            if (new Date(session.expires_at) < new Date()) {
                localStorage.removeItem('auth_session');
                return;
            }
            const res = await fetch(`${API_URL}/sessions?token=${session.token}`);
            const sessions = await res.json();
            if (sessions.length > 0) {
                authLink.innerHTML = `
                    <span style="display:flex;align-items:center;gap:8px;">
                        <span style="width:28px;height:28px;border-radius:50%;background:var(--color-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;">
                            ${(session.user.firstname || 'U')[0]}
                        </span>
                        <span>${session.user.firstname || session.user.nickname || 'Профиль'}</span>
                    </span>
                `;
                authLink.href = 'auth.html';
            }
        } catch (e) {}
    })();

    // 2. ТЕМА
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-theme');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // 3. СЛАЙДЕР СОСТАВА РАБОТ
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

    // 4. БУРГЕР
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (burger && nav) burger.addEventListener('click', () => { nav.classList.toggle('active'); burger.classList.toggle('active'); });

    // 5. ПАРАЛЛАКС
    window.addEventListener('scroll', () => {
        const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
        if (settings.parallax === false) return;
        const scrolled = window.pageYOffset;
        const heroImg = document.querySelector('.hero__img');
        if (heroImg) heroImg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
    });

    // 6. ПОРТФОЛИО
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
    portfolioTimer = setInterval(() => showPortfolioSlide((portfolioIndex + 1) % portfolioSlides.length), 5000);

    // 7. FAQ
    document.querySelectorAll('.faq__question').forEach(question => {
        question.addEventListener('click', function() {
            const item = this.closest('.faq__item');
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 8. ДЕЛЕРЫ
    const dealersSlides = document.querySelectorAll('.dealers__slide');
    const dealersDots = document.querySelectorAll('.dealers__dot');
    let dealersIndex = 0;

    function showDealersSlide(index) {
        dealersSlides.forEach(slide => slide.classList.remove('active'));
        dealersDots.forEach(dot => dot.classList.remove('active'));
        if (dealersSlides[index]) dealersSlides[index].classList.add('active');
        if (dealersDots[index]) dealersDots[index].classList.add('active');
        dealersIndex = index;
    }

    document.querySelector('.dealers__arrow--prev')?.addEventListener('click', () => showDealersSlide((dealersIndex - 1 + dealersSlides.length) % dealersSlides.length));
    document.querySelector('.dealers__arrow--next')?.addEventListener('click', () => showDealersSlide((dealersIndex + 1) % dealersSlides.length));
    dealersDots.forEach((dot, i) => dot.addEventListener('click', () => showDealersSlide(i)));

    // 9. МЕНЮ "ВСЕ РАЗДЕЛЫ"
    const headerMenuBtn = document.getElementById('headerMenuBtn');
    const headerDropdown = document.getElementById('headerDropdown');

    if (headerMenuBtn && headerDropdown) {
        headerMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            headerMenuBtn.classList.toggle('active');
            headerDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!headerDropdown.contains(e.target) && !headerMenuBtn.contains(e.target)) {
                headerMenuBtn.classList.remove('active');
                headerDropdown.classList.remove('active');
            }
        });
    }

    // 10. ПЛАВНАЯ ПРОКРУТКА
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#callback') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (nav?.classList.contains('active')) {
                    nav.classList.remove('active');
                    burger?.classList.remove('active');
                }
            }
        });
    });

    // 11. МОДАЛКИ
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(trigger.getAttribute('data-modal'));
        });
    });

    document.querySelectorAll('a[href="#callback"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('callbackModal');
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeAllModals));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal__overlay')) closeAllModals();
        });
    });

    // 12. ВИДЕО
    document.querySelector('.video-section__container')?.addEventListener('click', () => openModal('videoModal'));

    // 13. ОТЗЫВЫ
    document.querySelectorAll('.reviews__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.reviews__card');
            if (card) {
                document.getElementById('modalReviewImg').src = card.querySelector('.reviews__img')?.src || '';
                document.getElementById('modalReviewName').textContent = card.querySelector('.reviews__name')?.textContent || '';
                document.getElementById('modalReviewText').textContent = card.querySelector('.reviews__text')?.textContent || '';
                openModal('reviewModal');
            }
        });
    });

    // 14. КАЛЕНДАРЬ
    document.querySelector('.floating-btn[href="#calendar"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('calculationModal');
        if (modal) {
            modal.querySelector('.modal__title').textContent = 'Запись на замер';
            modal.querySelector('.modal__subtitle').textContent = 'Оставьте заявку, и мы согласуем удобное время для выезда специалиста';
            openModal('calculationModal');
        }
    });

    // 15. ОТПРАВКА ФОРМ
    async function submitRequest(type, data) {
        const request = { type, ...data, created_at: new Date().toISOString(), status: 'new' };
        try {
            const res = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            return res.ok;
        } catch (e) {
            const local = JSON.parse(localStorage.getItem('local_requests') || '[]');
            local.push(request);
            localStorage.setItem('local_requests', JSON.stringify(local));
            return true;
        }
    }

    function setupForm(formId, type) {
        const form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            const inputs = form.querySelectorAll('.form-input');
            const data = {};
            inputs.forEach((input, i) => {
                data[input.placeholder || `field${i}`] = input.value;
            });
            btn.textContent = 'Отправка...';
            btn.disabled = true;
            const success = await submitRequest(type, data);
            if (success) {
                btn.textContent = '✓ Отправлено!';
                btn.style.background = '#27ae60';
                setTimeout(() => {
                    closeAllModals();
                    form.reset();
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 2000);
            } else {
                btn.textContent = 'Ошибка';
                btn.disabled = false;
            }
        });
    }

    setupForm('callbackForm', 'callback');
    setupForm('calculationForm', 'calculation');
    setupForm('managerForm', 'manager');
    setupForm('faqForm', 'faq');

    // 16. TELEGRAM / WHATSAPP
    document.querySelectorAll('.action-btn, .floating-btn, .faq__contact-btn, .modal__social-btn, .footer__social').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes('telegram')) {
            btn.addEventListener('click', (e) => { e.preventDefault(); window.open('https://t.me/grill_premium', '_blank'); });
        }
        if (text.includes('whatsapp') || text.includes('whats')) {
            btn.addEventListener('click', (e) => { e.preventDefault(); window.open('https://wa.me/375257486784', '_blank'); });
        }
    });

    // 17. ПРЕЛОАДЕР
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.style.display = 'none', 500);
            }
        }, 800);
    });

    // 19. ЯНДЕКС КАРТА
    function initYandexMap() {
        if (typeof ymaps === 'undefined') return;
        ymaps.ready(() => {
            const map = new ymaps.Map('yandexMap', {
                center: [55.751244, 37.618423],
                zoom: 5,
                controls: ['zoomControl', 'fullscreenControl']
            });
            const stores = [
                { coords: [55.5533, 37.4533], name: 'Магазин "Grill" - Сосенское', address: 'Москва, Калужское шоссе, ул. Сосновская 3Б', phone: '+375 25 748 67 84' },
                { coords: [55.5233, 37.4233], name: 'Магазин "Grill" - Десна', address: 'Москва, Калужское шоссе, ул. Рябиновая 15', phone: '+375 25 748 67 84' },
                { coords: [59.9343, 30.3351], name: 'Магазин "Grill" - Санкт-Петербург', address: 'Санкт-Петербург, Межевой канал 5 АХ', phone: '+375 25 748 67 84' }
            ];
            stores.forEach(store => {
                map.geoObjects.add(new ymaps.Placemark(store.coords, {
                    balloonContentHeader: store.name,
                    balloonContentBody: `<div style="padding:10px;"><p style="margin:0 0 10px;font-size:14px;"><strong>Адрес:</strong><br>${store.address}</p><p style="margin:0;font-size:14px;"><strong>Телефон:</strong><br>${store.phone}</p></div>`,
                    hintContent: store.name
                }, { preset: 'islands#redIcon', iconColor: '#8B2E35' }));
            });
            map.setBounds(map.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 50 });
        });
    }

    if (document.getElementById('yandexMap')) {
        if (typeof ymaps !== 'undefined') initYandexMap();
        else window.addEventListener('load', () => setTimeout(initYandexMap, 500));
    }

    console.log('✅ Всё готово!');
});