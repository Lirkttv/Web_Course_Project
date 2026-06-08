// ===== ГЛОБАЛЬНАЯ СИСТЕМА НАСТРОЕК =====
(function() {
    'use strict';

    const API_URL = 'http://localhost:3000';

    // ==========================================
    // 🌐 СИСТЕМА ПЕРЕВОДОВ
    // ==========================================
    const translations = {
        ru: {
            '.hero__title': 'Премиальные<br>гриль-кухни',
            '.hero__subtitle': 'Проектирование. Изготовление. Установка.',
            '.section-title': {
                '.advantages': 'Преимущества',
                '.scope': 'Состав работ',
                '.calculator': 'Предварительный расчёт',
                '.portfolio-full': 'Наши работы',
                '.video-section': 'Видеообзор',
                '.reviews': 'Отзывы наших клиентов',
                '.faq': 'Ответы на вопросы',
                '.dealers': 'Мы являемся дилером',
                '.stores': 'Наши магазины'
            },
            '.header-menu-btn__text': 'Все разделы',
            '.btn--primary[href="#callback"]': 'Заказать звонок',
            '.nav__link[href="#works"]': 'Состав работ',
            '.nav__link[href="#calc"]': 'Рассчитать',
            '.nav__link[href="products.html"]': 'Каталог',
            '.nav__link[href="#portfolio"]': 'Наши работы',
            '.nav__link[href="#video"]': 'Видеообзор',
            '.nav__link[href="#reviews"]': 'Отзывы',
            '.nav__link[href="#faq"]': 'Вопросы',
            '.header-dropdown__link[href="#works"]': 'Состав работ',
            '.header-dropdown__link[href="#calc"]': 'Рассчитать',
            '.header-dropdown__link[href="products.html"]': 'Каталог',
            '.header-dropdown__link[href="#portfolio"]': 'Наши работы',
            '.header-dropdown__link[href="#video"]': 'Видеообзор',
            '.header-dropdown__link[href="#reviews"]': 'Отзывы',
            '.header-dropdown__link[href="#faq"]': 'Ответы на вопросы',
            '.header-dropdown__link[href="#stores"]': 'Наши магазины',
            '.settings-panel__title': 'Настройки',
            '.settings-group:nth-child(1) .settings-label': 'Язык интерфейса',
            '.settings-group:nth-child(2) .settings-label': 'Цветовая палитра',
            '.settings-group:nth-child(3) .settings-label': 'Размер шрифта',
            '.settings-group:nth-child(4) .settings-label': 'Анимации',
            '.settings-group:nth-child(5) .settings-label': 'Эффект параллакса',
            '#resetSettings': 'Сбросить настройки',
            '.footer__col--nav .footer__title': 'Навигация по сайту',
            '.footer__col--stores .footer__title': 'Магазины',
            '.footer__legal-link:nth-child(1)': 'Политика конфиденциальности',
            '.footer__legal-link:nth-child(2)': 'Пользовательское соглашение',
            '.footer__legal-link:nth-child(3)': 'Публичная оферта',
            '.preloader__text': 'Загрузка...',
            '.catalog-hero__title': 'Каталог гриль-кухонь',
            '.catalog-hero__subtitle': 'Выберите идеальную гриль-кухню из нашей коллекции. Все модели изготавливаются по индивидуальным размерам с учётом ваших пожеланий.',
            '.catalog-hero__badge': 'Премиум качество',
            '.catalog-cta__title': 'Не нашли подходящую модель?',
            '.catalog-cta__text': 'Мы изготовим гриль-кухню по вашему индивидуальному проекту. Оставьте заявку, и наш дизайнер свяжется с вами для обсуждения деталей.',
            '.catalog-filters__count': 'Показано:',
            '.catalog-filters__sort label': 'Сортировка:',
            '.catalog-filter-btn[data-filter="all"]': 'Все модели',
            '.catalog-filter-btn[data-filter="steel"]': 'Нержавеющая сталь',
            '.catalog-filter-btn[data-filter="composite"]': 'Композит HPL',
            '.catalog-filter-btn[data-filter="straight"]': 'Прямые',
            '.catalog-filter-btn[data-filter="corner"]': 'Угловые',
            '.catalog-filter-btn[data-filter="island"]': 'С островком',
            '.catalog-filter-btn[data-filter="p-shape"]': 'П-образные'
        },
        en: {
            '.hero__title': 'Premium<br>Grill Kitchens',
            '.hero__subtitle': 'Design. Manufacturing. Installation.',
            '.section-title': {
                '.advantages': 'Advantages',
                '.scope': 'Scope of Work',
                '.calculator': 'Preliminary Calculation',
                '.portfolio-full': 'Our Works',
                '.video-section': 'Video Review',
                '.reviews': 'Client Reviews',
                '.faq': 'FAQ',
                '.dealers': 'We Are a Dealer',
                '.stores': 'Our Stores'
            },
            '.header-menu-btn__text': 'All Sections',
            '.btn--primary[href="#callback"]': 'Request a Call',
            '.nav__link[href="#works"]': 'Scope',
            '.nav__link[href="#calc"]': 'Calculate',
            '.nav__link[href="products.html"]': 'Catalog',
            '.nav__link[href="#portfolio"]': 'Works',
            '.nav__link[href="#video"]': 'Video',
            '.nav__link[href="#reviews"]': 'Reviews',
            '.nav__link[href="#faq"]': 'FAQ',
            '.header-dropdown__link[href="#works"]': 'Scope of Work',
            '.header-dropdown__link[href="#calc"]': 'Calculate',
            '.header-dropdown__link[href="products.html"]': 'Catalog',
            '.header-dropdown__link[href="#portfolio"]': 'Our Works',
            '.header-dropdown__link[href="#video"]': 'Video Review',
            '.header-dropdown__link[href="#reviews"]': 'Reviews',
            '.header-dropdown__link[href="#faq"]': 'FAQ',
            '.header-dropdown__link[href="#stores"]': 'Our Stores',
            '.settings-panel__title': 'Settings',
            '.settings-group:nth-child(1) .settings-label': 'Language',
            '.settings-group:nth-child(2) .settings-label': 'Color Palette',
            '.settings-group:nth-child(3) .settings-label': 'Font Size',
            '.settings-group:nth-child(4) .settings-label': 'Animations',
            '.settings-group:nth-child(5) .settings-label': 'Parallax Effect',
            '#resetSettings': 'Reset Settings',
            '.footer__col--nav .footer__title': 'Navigation',
            '.footer__col--stores .footer__title': 'Stores',
            '.footer__legal-link:nth-child(1)': 'Privacy Policy',
            '.footer__legal-link:nth-child(2)': 'User Agreement',
            '.footer__legal-link:nth-child(3)': 'Public Offer',
            '.preloader__text': 'Loading...',
            '.catalog-hero__title': 'Catalog of Grill Kitchens',
            '.catalog-hero__subtitle': 'Choose the ideal grill kitchen from our collection. All models are made to individual sizes according to your wishes.',
            '.catalog-hero__badge': 'Premium Quality',
            '.catalog-cta__title': 'Didn\'t find a suitable model?',
            '.catalog-cta__text': 'We will make a grill kitchen according to your individual project. Leave a request and our designer will contact you to discuss the details.',
            '.catalog-filters__count': 'Showing:',
            '.catalog-filters__sort label': 'Sort:',
            '.catalog-filter-btn[data-filter="all"]': 'All models',
            '.catalog-filter-btn[data-filter="steel"]': 'Stainless steel',
            '.catalog-filter-btn[data-filter="composite"]': 'Composite HPL',
            '.catalog-filter-btn[data-filter="straight"]': 'Straight',
            '.catalog-filter-btn[data-filter="corner"]': 'Corner',
            '.catalog-filter-btn[data-filter="island"]': 'With island',
            '.catalog-filter-btn[data-filter="p-shape"]': 'U-shaped'
        },
        by: {
            '.hero__title': 'Прэміум<br>грыль-кухні',
            '.hero__subtitle': 'Праектаванне. Выраб. Усталёўка.',
            '.section-title': {
                '.advantages': 'Перавагі',
                '.scope': 'Склад работ',
                '.calculator': 'Папярэдні разлік',
                '.portfolio-full': 'Нашы працы',
                '.video-section': 'Відэаагляд',
                '.reviews': 'Водгукі кліентаў',
                '.faq': 'Адказы на пытанні',
                '.dealers': 'Мы з\'яўляемся дылерам',
                '.stores': 'Нашы крамы'
            },
            '.header-menu-btn__text': 'Усе раздзелы',
            '.btn--primary[href="#callback"]': 'Замовіць званок',
            '.nav__link[href="#works"]': 'Склад работ',
            '.nav__link[href="#calc"]': 'Разлічыць',
            '.nav__link[href="products.html"]': 'Каталог',
            '.nav__link[href="#portfolio"]': 'Нашы працы',
            '.nav__link[href="#video"]': 'Відэаагляд',
            '.nav__link[href="#reviews"]': 'Водгукі',
            '.nav__link[href="#faq"]': 'Пытанні',
            '.header-dropdown__link[href="#works"]': 'Склад работ',
            '.header-dropdown__link[href="#calc"]': 'Разлічыць',
            '.header-dropdown__link[href="products.html"]': 'Каталог',
            '.header-dropdown__link[href="#portfolio"]': 'Нашы працы',
            '.header-dropdown__link[href="#video"]': 'Відэаагляд',
            '.header-dropdown__link[href="#reviews"]': 'Водгукі',
            '.header-dropdown__link[href="#faq"]': 'Адказы на пытанні',
            '.header-dropdown__link[href="#stores"]': 'Нашы крамы',
            '.settings-panel__title': 'Налады',
            '.settings-group:nth-child(1) .settings-label': 'Мова інтэрфейсу',
            '.settings-group:nth-child(2) .settings-label': 'Колеравая палітра',
            '.settings-group:nth-child(3) .settings-label': 'Памер шрыфта',
            '.settings-group:nth-child(4) .settings-label': 'Анімацыі',
            '.settings-group:nth-child(5) .settings-label': 'Эфект паралакса',
            '#resetSettings': 'Скінуць налады',
            '.footer__col--nav .footer__title': 'Навігацыя',
            '.footer__col--stores .footer__title': 'Крамы',
            '.footer__legal-link:nth-child(1)': 'Палітыка канфідэнцыяльнасці',
            '.footer__legal-link:nth-child(2)': 'Карыстальніцкае пагадненне',
            '.footer__legal-link:nth-child(3)': 'Публічная аферта',
            '.preloader__text': 'Загрузка...',
            '.catalog-hero__title': 'Каталог грыль-кухняў',
            '.catalog-hero__subtitle': 'Выберыце ідэальную грыль-кухню з нашай калекцыі. Усе мадэлі вырабляюцца па індывідуальных памерах з улікам вашых пажаданняў.',
            '.catalog-hero__badge': 'Прэміум якасць',
            '.catalog-cta__title': 'Не знайшлі падыходзячую мадэль?',
            '.catalog-cta__text': 'Мы вырабім грыль-кухню па вашым індывідуальным праекце. Пакіньце заяўку, і наш дызайнер звяжацца з вамі для абмеркавання дэталяў.',
            '.catalog-filters__count': 'Паказана:',
            '.catalog-filters__sort label': 'Сартаванне:',
            '.catalog-filter-btn[data-filter="all"]': 'Усе мадэлі',
            '.catalog-filter-btn[data-filter="steel"]': 'Нержавеючая сталь',
            '.catalog-filter-btn[data-filter="composite"]': 'Кампазіт HPL',
            '.catalog-filter-btn[data-filter="straight"]': 'Простыя',
            '.catalog-filter-btn[data-filter="corner"]': 'Вуглавыя',
            '.catalog-filter-btn[data-filter="island"]': 'З востраўком',
            '.catalog-filter-btn[data-filter="p-shape"]': 'П-вобразныя'
        }
    };

    function applyLanguage(lang) {
        const dict = translations[lang];
        if (!dict) return;

        Object.keys(dict).forEach(selector => {
            if (selector === '.section-title') return;
            const value = dict[selector];
            if (typeof value === 'string') {
                const el = document.querySelector(selector);
                if (el) {
                    if (value.includes('<')) {
                        el.innerHTML = value;
                    } else {
                        el.textContent = value;
                    }
                }
            }
        });

        if (dict['.section-title']) {
            Object.keys(dict['.section-title']).forEach(sectionSelector => {
                const section = document.querySelector(sectionSelector);
                if (section) {
                    const title = section.querySelector('.section-title');
                    if (title) title.textContent = dict['.section-title'][sectionSelector];
                }
            });
        }

        console.log(`🌐 Language applied: ${lang}`);
    }

    function applyFontSize(size) {
        document.documentElement.style.fontSize = size + 'px';
        console.log(`📏 Font size: ${size}px`);
    }

    function adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    // ==========================================
    // 👤 ОБНОВЛЕНИЕ ШАПКИ (АВАТАР ПОЛЬЗОВАТЕЛЯ)
    // ==========================================
    function updateAuthUI() {
        const authLink = document.querySelector('.header__auth-link');
        if (!authLink) return;

        const sessionData = localStorage.getItem('auth_session');
        if (!sessionData) return;

        try {
            const session = JSON.parse(sessionData);
            
            // Проверка срока действия
            if (session.expires_at && new Date(session.expires_at) < new Date()) {
                localStorage.removeItem('auth_session');
                return;
            }

            const user = session.user;
            if (!user) return;

            const firstName = user.firstname || user.nickname || 'Пользователь';
            const initial = firstName[0].toUpperCase();

            authLink.innerHTML = `
                <span style="display:flex;align-items:center;gap:8px;">
                    <span style="width:32px;height:32px;border-radius:50%;background:var(--color-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;flex-shrink:0;">
                        ${initial}
                    </span>
                    <span style="font-weight:600;">${firstName}</span>
                </span>
            `;
            authLink.href = 'profile.html';
            authLink.title = 'Перейти в личный кабинет';
            
            console.log('👤 Пользователь авторизован:', firstName);
        } catch (e) {
            console.warn('Ошибка загрузки сессии:', e);
        }
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
        
        if (settings.lang) {
            const langSelect = document.getElementById('langSelect');
            if (langSelect) langSelect.value = settings.lang;
            applyLanguage(settings.lang);
        }
        
        if (settings.color) {
            document.documentElement.style.setProperty('--color-primary', settings.color);
            document.documentElement.style.setProperty('--color-primary-hover', adjustColor(settings.color, -20));
            const colorButtons = document.querySelectorAll('.settings-color');
            colorButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.color === settings.color));
        }
        
        if (settings.fontSize) {
            const fontSizeRange = document.getElementById('fontSizeRange');
            const fontSizeValue = document.getElementById('fontSizeValue');
            if (fontSizeRange) fontSizeRange.value = settings.fontSize;
            if (fontSizeValue) fontSizeValue.textContent = settings.fontSize + 'px';
            applyFontSize(settings.fontSize);
        } else {
            applyFontSize(16);
        }
        
        if (settings.animations === false) {
            const animationsToggle = document.getElementById('animationsToggle');
            if (animationsToggle) animationsToggle.checked = false;
            document.body.classList.add('no-animations');
        }
        
        if (settings.parallax === false) {
            const parallaxToggle = document.getElementById('parallaxToggle');
            if (parallaxToggle) parallaxToggle.checked = false;
        }

        // Обновляем шапку (показываем аватар вместо "Войти")
        updateAuthUI();

        console.log('⚙️ Settings loaded:', settings);
    }

    function saveSettings() {
        const langSelect = document.getElementById('langSelect');
        const fontSizeRange = document.getElementById('fontSizeRange');
        const animationsToggle = document.getElementById('animationsToggle');
        const parallaxToggle = document.getElementById('parallaxToggle');

        const settings = {
            lang: langSelect?.value || 'ru',
            color: document.querySelector('.settings-color.active')?.dataset.color || '#8B2E35',
            fontSize: fontSizeRange?.value || '16',
            animations: !animationsToggle || animationsToggle.checked,
            parallax: !parallaxToggle || parallaxToggle.checked
        };
        localStorage.setItem('site_settings', JSON.stringify(settings));
        console.log('💾 Settings saved:', settings);
    }

    function initSettingsPanel() {
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsToggle = document.getElementById('settingsToggle');
        const settingsClose = document.getElementById('settingsClose');
        const langSelect = document.getElementById('langSelect');
        const fontSizeRange = document.getElementById('fontSizeRange');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const animationsToggle = document.getElementById('animationsToggle');
        const parallaxToggle = document.getElementById('parallaxToggle');
        const resetSettingsBtn = document.getElementById('resetSettings');
        const colorButtons = document.querySelectorAll('.settings-color');

        if (!settingsPanel || !settingsToggle) return;

        console.log('⚙️ Settings panel initialized');

        settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('active');
        });

        if (settingsClose) {
            settingsClose.addEventListener('click', () => settingsPanel.classList.remove('active'));
        }

        document.addEventListener('click', (e) => {
            if (settingsPanel.classList.contains('active') && 
                !settingsPanel.contains(e.target) && 
                e.target !== settingsToggle) {
                settingsPanel.classList.remove('active');
            }
        });

        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                applyLanguage(e.target.value);
                saveSettings();
            });
        }

        if (fontSizeRange) {
            fontSizeRange.addEventListener('input', (e) => {
                const size = e.target.value;
                if (fontSizeValue) fontSizeValue.textContent = size + 'px';
                applyFontSize(size);
                saveSettings();
            });
        }

        if (animationsToggle) {
            animationsToggle.addEventListener('change', (e) => {
                document.body.classList.toggle('no-animations', !e.target.checked);
                saveSettings();
            });
        }

        if (parallaxToggle) {
            parallaxToggle.addEventListener('change', saveSettings);
        }

        colorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                colorButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const color = btn.dataset.color;
                document.documentElement.style.setProperty('--color-primary', color);
                document.documentElement.style.setProperty('--color-primary-hover', adjustColor(color, -20));
                saveSettings();
            });
        });

        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', () => {
                if (confirm('Сбросить все настройки?')) {
                    localStorage.removeItem('site_settings');
                    localStorage.removeItem('theme');
                    
                    document.documentElement.style.removeProperty('--color-primary');
                    document.documentElement.style.removeProperty('--color-primary-hover');
                    colorButtons.forEach(b => b.classList.remove('active'));
                    if (colorButtons[0]) colorButtons[0].classList.add('active');
                    
                    if (fontSizeRange) {
                        fontSizeRange.value = 16;
                        if (fontSizeValue) fontSizeValue.textContent = '16px';
                    }
                    applyFontSize(16);
                    
                    if (animationsToggle) animationsToggle.checked = true;
                    if (parallaxToggle) parallaxToggle.checked = true;
                    document.body.classList.remove('no-animations', 'dark-theme');
                    
                    if (langSelect) {
                        langSelect.value = 'ru';
                        applyLanguage('ru');
                    }
                    
                    alert('Настройки сброшены!');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadSettings();
            initSettingsPanel();
        });
    } else {
        loadSettings();
        initSettingsPanel();
    }

    window.AppSettings = {
        applyLanguage,
        applyFontSize,
        loadSettings,
        saveSettings,
        adjustColor,
        updateAuthUI
    };

    // ==========================================
    // 👁️ ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
    // ==========================================
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const accessibilityClose = document.getElementById('accessibilityClose');
    const fontBtns = document.querySelectorAll('.accessibility-font-btn');
    const colorBtns = document.querySelectorAll('.accessibility-color-btn');
    const imagesToggle = document.getElementById('imagesToggle');
    const imagesToggleText = document.getElementById('imagesToggleText');
    const resetAccessibilityBtn = document.getElementById('resetAccessibility');

    function applyAccessibility(settings) {
        document.body.className = document.body.className.replace(/access-\S+/g, '').trim();

        if (settings.accessFontSize) {
            document.documentElement.style.fontSize = settings.accessFontSize + 'px';
            fontBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.size === settings.accessFontSize);
            });
        }

        if (settings.accessColorScheme) {
            document.body.classList.add(`access-${settings.accessColorScheme}`);
            colorBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.scheme === settings.accessColorScheme);
            });
        }

        if (settings.accessHideImages) {
            document.body.classList.add('access-no-images');
            if (imagesToggle) {
                imagesToggle.checked = false;
                if (imagesToggleText) imagesToggleText.textContent = 'Скрыты';
            }
        } else {
            if (imagesToggle) {
                imagesToggle.checked = true;
                if (imagesToggleText) imagesToggleText.textContent = 'Показаны';
            }
        }
    }

    function saveAccessibility() {
        const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
        
        const activeFontBtn = document.querySelector('.accessibility-font-btn.active');
        const activeColorBtn = document.querySelector('.accessibility-color-btn.active');
        
        settings.accessFontSize = activeFontBtn?.dataset.size || '26';
        settings.accessColorScheme = activeColorBtn?.dataset.scheme || null;
        settings.accessHideImages = imagesToggle ? !imagesToggle.checked : false;
        
        localStorage.setItem('site_settings', JSON.stringify(settings));
        console.log('💾 Accessibility settings saved');
    }

    function initAccessibilityPanel() {
        if (!accessibilityToggle || !accessibilityPanel) return;

        console.log('👁️ Accessibility panel initialized');

        accessibilityToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            accessibilityPanel.classList.toggle('active');
            accessibilityToggle.classList.toggle('active');
        });

        if (accessibilityClose) {
            accessibilityClose.addEventListener('click', () => {
                accessibilityPanel.classList.remove('active');
                accessibilityToggle.classList.remove('active');
            });
        }

        document.addEventListener('click', (e) => {
            if (accessibilityPanel.classList.contains('active') &&
                !accessibilityPanel.contains(e.target) &&
                e.target !== accessibilityToggle) {
                accessibilityPanel.classList.remove('active');
                accessibilityToggle.classList.remove('active');
            }
        });

        fontBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                fontBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyAccessibility({
                    accessFontSize: btn.dataset.size,
                    accessColorScheme: document.querySelector('.accessibility-color-btn.active')?.dataset.scheme,
                    accessHideImages: imagesToggle ? !imagesToggle.checked : false
                });
                saveAccessibility();
            });
        });

        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyAccessibility({
                    accessFontSize: document.querySelector('.accessibility-font-btn.active')?.dataset.size,
                    accessColorScheme: btn.dataset.scheme,
                    accessHideImages: imagesToggle ? !imagesToggle.checked : false
                });
                saveAccessibility();
            });
        });

        if (imagesToggle) {
            imagesToggle.addEventListener('change', (e) => {
                if (imagesToggleText) {
                    imagesToggleText.textContent = e.target.checked ? 'Показаны' : 'Скрыты';
                }
                applyAccessibility({
                    accessFontSize: document.querySelector('.accessibility-font-btn.active')?.dataset.size,
                    accessColorScheme: document.querySelector('.accessibility-color-btn.active')?.dataset.scheme,
                    accessHideImages: !e.target.checked
                });
                saveAccessibility();
            });
        }

        if (resetAccessibilityBtn) {
            resetAccessibilityBtn.addEventListener('click', () => {
                if (confirm('Сбросить настройки для слабовидящих?')) {
                    const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
                    delete settings.accessFontSize;
                    delete settings.accessColorScheme;
                    delete settings.accessHideImages;
                    localStorage.setItem('site_settings', JSON.stringify(settings));
                    
                    document.body.className = document.body.className.replace(/access-\S+/g, '').trim();
                    document.documentElement.style.fontSize = '';
                    
                    fontBtns.forEach(b => b.classList.remove('active'));
                    colorBtns.forEach(b => b.classList.remove('active'));
                    if (imagesToggle) {
                        imagesToggle.checked = true;
                        if (imagesToggleText) imagesToggleText.textContent = 'Показаны';
                    }
                    
                    alert('Настройки сброшены!');
                }
            });
        }

        const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
        if (settings.accessFontSize || settings.accessColorScheme || settings.accessHideImages) {
            applyAccessibility(settings);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibilityPanel);
    } else {
        initAccessibilityPanel();
    }

    // ==========================================
    // 🛒 КНОПКА КОРЗИНЫ (слева снизу)
    // ==========================================
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-floating-btn';
    cartBtn.id = 'cartFloatingBtn';
    cartBtn.setAttribute('aria-label', 'Корзина');
    cartBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span class="cart-floating-btn__count" id="cartCount">0</span>
    `;
    cartBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
    document.body.appendChild(cartBtn);

    async function updateCartCount() {
        try {
            const res = await fetch(`${API_URL}/cart`);
            const cart = await res.json();
            const countEl = document.getElementById('cartCount');
            if (countEl) countEl.textContent = cart.length;
        } catch (e) {
            console.warn('Не удалось загрузить корзину');
        }
    }
    updateCartCount();

    // Обновляем счётчик корзины каждые 5 секунд
    setInterval(updateCartCount, 5000);
    
})();