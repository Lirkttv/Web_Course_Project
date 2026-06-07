document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Каталог загружен');

    const API_URL = 'http://localhost:3000';

    // ===== ДАННЫЕ ТОВАРОВ =====
    const productsData = {
        '1': {
            title: 'Гриль-кухня Классик',
            badge: 'Хит продаж',
            badgeClass: '',
            desc: 'Прямая гриль-кухня из нержавеющей стали. Идеальное решение для открытой террасы.',
            price: 285000,
            priceFormatted: '285 000 BYN',
            specs: { 'Материал': 'Нержавеющая сталь', 'Конфигурация': 'Прямая', 'Длина': '2.2 п.м', 'Размещение': 'Открытая терраса' },
            categories: ['steel', 'straight'],
            img: 'images/кухня1.png'
        },
        '2': {
            title: 'Гриль-кухня Модерн',
            badge: 'Новинка',
            badgeClass: 'product-card__badge--new',
            desc: 'Угловая кухня из композитного HPL материала. Современный дизайн.',
            price: 420000,
            priceFormatted: '420 000 BYN',
            specs: { 'Материал': 'Композит HPL', 'Конфигурация': 'Угловая', 'Длина': '2.8 п.м', 'Размещение': 'Закрытая терраса' },
            categories: ['composite', 'corner'],
            img: 'images/кухня2.png'
        },
        '3': {
            title: 'Гриль-кухня Премиум',
            badge: 'Премиум',
            badgeClass: 'product-card__badge--premium',
            desc: 'П-образная кухня из нержавеющей стали премиум-класса.',
            price: 680000,
            priceFormatted: '680 000 BYN',
            specs: { 'Материал': 'Нержавеющая сталь', 'Конфигурация': 'П-образная', 'Длина': '3.5 п.м', 'Размещение': 'Закрытая терраса' },
            categories: ['steel', 'p-shape'],
            img: 'images/кухня3.png'
        },
        '4': {
            title: 'Гриль-кухня Остров',
            badge: 'Эксклюзив',
            badgeClass: 'product-card__badge--premium',
            desc: 'Кухня с островком из композита и натурального дерева.',
            price: 750000,
            priceFormatted: '750 000 BYN',
            specs: { 'Материал': 'Композит + дерево', 'Конфигурация': 'С островком', 'Длина': '3.0 п.м', 'Размещение': 'Открытая площадка' },
            categories: ['composite', 'island'],
            img: 'images/кухня4.png'
        },
        '5': {
            title: 'Гриль-кухня Компакт',
            badge: 'Выгодно',
            badgeClass: '',
            desc: 'Компактная прямая кухня из композитного HPL.',
            price: 220000,
            priceFormatted: '220 000 BYN',
            specs: { 'Материал': 'Композит HPL', 'Конфигурация': 'Прямая', 'Длина': '2.0 п.м', 'Размещение': 'Любое' },
            categories: ['composite', 'straight'],
            img: 'images/кухня5.png'
        },
        '6': {
            title: 'Гриль-кухня Люкс',
            badge: 'Люкс',
            badgeClass: 'product-card__badge--premium',
            desc: 'Угловая кухня из нержавеющей стали с расширенной комплектацией.',
            price: 520000,
            priceFormatted: '520 000 BYN',
            specs: { 'Материал': 'Нержавеющая сталь', 'Конфигурация': 'Угловая', 'Длина': '3.2 п.м', 'Размещение': 'Закрытая терраса' },
            categories: ['steel', 'corner'],
            img: 'images/кухня6.png'
        }
    };

    // ===== ЭЛЕМЕНТЫ =====
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const productsCount = document.getElementById('productsCount');
    const catalogEmpty = document.getElementById('catalogEmpty');
    const productsGrid = document.getElementById('productsGrid');
    const sortSelect = document.getElementById('sortSelect');
    const productCards = document.querySelectorAll('.product-card');

    console.log('📦 Товаров в данных:', Object.keys(productsData).length);
    console.log('🃏 Карточек на странице:', productCards.length);

    // ===== СОСТОЯНИЕ =====
    let currentFilters = {
        category: 'all',
        search: '',
        sort: 'default'
    };

    // ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: получить ID товара из карточки =====
    function getProductId(card) {
        // Сначала пробуем взять с самой карточки
        let id = card.getAttribute('data-product');
        // Если нет — ищем на кнопке внутри
        if (!id) {
            const btn = card.querySelector('[data-product]');
            if (btn) id = btn.getAttribute('data-product');
        }
        return id;
    }

    // ===== ФИЛЬТРЫ =====
    const filterButtons = document.querySelectorAll('.catalog-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.category = btn.dataset.filter;
            applyFilters();
        });
    });

    // ===== ПОИСК =====
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value.toLowerCase().trim();
            if (searchClear) {
                searchClear.style.display = currentFilters.search ? 'flex' : 'none';
            }
            applyFilters();
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                currentFilters.search = '';
                searchClear.style.display = 'none';
                applyFilters();
                searchInput.focus();
            }
        });
    }

    // ===== СОРТИРОВКА =====
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            applyFilters();
        });
    }

    // ===== ГЛАВНАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ =====
    function applyFilters() {
        let visibleProducts = [];

        productCards.forEach(card => {
            const productId = getProductId(card);
            const product = productsData[productId];
            
            // Если продукта нет в данных — скрываем (чтобы не было мусора)
            if (!product) {
                card.style.display = 'none';
                return;
            }

            // Проверка категории
            const matchesCategory = currentFilters.category === 'all' || 
                                   product.categories.includes(currentFilters.category);

            // Проверка поиска (по названию И описанию)
            const searchLower = currentFilters.search;
            const titleLower = product.title.toLowerCase();
            const descLower = product.desc.toLowerCase();
            
            const matchesSearch = searchLower === '' || 
                                 titleLower.includes(searchLower) ||
                                 descLower.includes(searchLower);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleProducts.push({ 
                    id: productId, 
                    element: card, 
                    price: product.price, 
                    title: product.title 
                });
            } else {
                card.style.display = 'none';
            }
        });

        // Сортировка
        sortProducts(visibleProducts);

        // Обновление счётчика
        if (productsCount) {
            productsCount.textContent = visibleProducts.length;
        }

        // Пустое состояние
        if (catalogEmpty && productsGrid) {
            if (visibleProducts.length === 0) {
                catalogEmpty.style.display = 'block';
                productsGrid.style.display = 'none';
            } else {
                catalogEmpty.style.display = 'none';
                productsGrid.style.display = 'grid';
            }
        }
    }

    // ===== СОРТИРОВКА =====
    function sortProducts(products) {
        const { sort } = currentFilters;
        
        products.sort((a, b) => {
            switch(sort) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.title.localeCompare(b.title, 'ru');
                case 'name-desc': return b.title.localeCompare(a.title, 'ru');
                default: return 0;
            }
        });

        if (productsGrid) {
            products.forEach(p => productsGrid.appendChild(p.element));
        }
    }

    // ===== МОДАЛКА ТОВАРА =====
    document.querySelectorAll('[data-product]').forEach(btn => {
        // Только кнопки "Подробнее", не карточки
        if (!btn.classList.contains('product-card__btn') && btn.tagName !== 'BUTTON') return;
        
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product');
            const product = productsData[productId];
            const card = btn.closest('.product-card');
            
            if (!product) {
                console.error('Товар #' + productId + ' не найден');
                return;
            }

            const modal = document.getElementById('productModal');
            if (!modal) return;

            const imgSrc = card?.querySelector('.product-card__img')?.src || product.img;
            
            document.getElementById('productModalImg').src = imgSrc;
            document.getElementById('productModalBadge').textContent = product.badge;
            document.getElementById('productModalBadge').className = 'product-modal__badge ' + (product.badgeClass || '');
            document.getElementById('productModalTitle').textContent = product.title;
            document.getElementById('productModalDesc').textContent = product.desc;
            document.getElementById('productModalPrice').textContent = product.priceFormatted;

            const specsList = document.getElementById('productModalSpecs');
            specsList.innerHTML = '';
            Object.entries(product.specs).forEach(([key, value]) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${key}:</span> <strong>${value}</strong>`;
                specsList.appendChild(li);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // ===== ЗАКРЫТИЕ МОДАЛОК =====
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.querySelectorAll('a[href="#callback"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('callbackModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal__overlay')) {
                closeAllModals();
            }
        });
    });

    // ===== ФОРМЫ =====
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
            inputs.forEach(input => {
                data[input.placeholder || 'field'] = input.value;
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

    // ===== TELEGRAM / WHATSAPP =====
    document.querySelectorAll('.footer__social, .modal__social-btn').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes('telegram')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://t.me/grill_premium', '_blank');
            });
        }
        if (text.includes('whatsapp') || text.includes('whats')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://wa.me/375257486784', '_blank');
            });
        }
    });

    // ===== ПЛАВНАЯ ПРОКРУТКА =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#callback') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('✅ Каталог полностью готов');
});