document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Конфигуратор загружен');

    const API_URL = 'http://localhost:3000';

    // ===== ПРЕЛОАДЕР =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 800);
        });
        if (document.readyState === 'complete') {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 800);
        }
    }

    // ===== МОДАЛКИ =====
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

    // Форма звонка
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = callbackForm.querySelector('button[type="submit"]');
            btn.textContent = '✓ Отправлено!';
            btn.style.background = '#27ae60';
            setTimeout(() => {
                closeAllModals();
                callbackForm.reset();
                btn.textContent = 'Перезвоните мне';
                btn.style.background = '';
            }, 2000);
        });
    }
    
    // ===== ТЕМА =====
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-theme');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // ===== БУРГЕР =====
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (burger && nav) burger.addEventListener('click', () => { nav.classList.toggle('active'); burger.classList.toggle('active'); });

    // ===== МЕНЮ "ВСЕ РАЗДЕЛЫ" =====
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

    // ===== ДАННЫЕ =====
    const configData = {
        config: {
            'straight': { name: 'Прямая', price: 150000, img: 'images/кухня1.png' },
            'corner': { name: 'Угловая', price: 195000, img: 'images/кухня2.jpg' },
            'u-shape': { name: 'П-образная', price: 240000, img: 'images/кухня3.png' },
            'island': { name: 'С островком', price: 270000, img: 'images/кухня4.jpg' }
        },
        material: {
            'steel': { name: 'Нержавеющая сталь', price: 0 },
            'composite': { name: 'Композит HPL', price: 45000 }
        },
        grill: {
            'none': { name: 'Без гриля', price: 0 },
            'electric': { name: 'Электрический', price: 50000 },
            'gas': { name: 'Газовый', price: 80000 },
            'ceramic': { name: 'Керамический', price: 120000 }
        },
        size: {
            '2.2': { name: '2,2 п.м', price: 0 },
            '2.8': { name: '2,8 п.м', price: 35000 },
            '3+': { name: '3+ п.м', price: 70000 }
        },
        extras: {
            'lighting': { name: 'LED-подсветка', price: 30000 },
            'hood': { name: 'Вытяжка', price: 40000 },
            'sink': { name: 'Мойка', price: 25000 },
            'storage': { name: 'Система хранения', price: 35000 }
        }
    };

    // ===== СОСТОЯНИЕ =====
    let currentStep = 1;
    const totalSteps = 5;

    // ===== ЭЛЕМЕНТЫ =====
    const steps = document.querySelectorAll('.configurator-step');
    const progressSteps = document.querySelectorAll('.configurator-progress__step');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const previewImage = document.getElementById('previewImage');
    const sidebarPrice = document.getElementById('sidebarPrice');
    const totalPrice = document.getElementById('totalPrice');
    const summaryList = document.getElementById('summaryList');

    // ===== НАВИГАЦИЯ =====
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        currentStep = step;
        steps.forEach(s => s.classList.remove('active'));
        const target = document.querySelector(`.configurator-step[data-step="${step}"]`);
        if (target) target.classList.add('active');
        progressSteps.forEach((ps, i) => {
            ps.classList.remove('active', 'completed');
            if (i + 1 === step) ps.classList.add('active');
            else if (i + 1 < step) ps.classList.add('completed');
        });
        if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'block';
        if (nextBtn) nextBtn.textContent = step === totalSteps ? 'Отправить заявку' : 'Далее →';
        if (step === totalSteps) updateSummary();
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep === totalSteps) {
                const form = document.getElementById('configuratorForm');
                if (form) form.requestSubmit();
            } else {
                goToStep(currentStep + 1);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
    }

    progressSteps.forEach(ps => {
        ps.addEventListener('click', () => {
            const step = parseInt(ps.dataset.step);
            if (step <= currentStep + 1) goToStep(step);
        });
    });

    // ===== РАСЧЁТ ЦЕНЫ =====
    function calculatePrice() {
        let total = 0;
        const config = document.querySelector('input[name="config"]:checked')?.value || 'straight';
        total += configData.config[config].price;
        const material = document.querySelector('input[name="material"]:checked')?.value || 'steel';
        total += configData.material[material].price;
        const grill = document.querySelector('input[name="grill"]:checked')?.value || 'none';
        total += configData.grill[grill].price;
        const size = document.querySelector('input[name="size"]:checked')?.value || '2.2';
        total += configData.size[size].price;
        document.querySelectorAll('input[name="extra"]:checked').forEach(extra => {
            total += configData.extras[extra.value].price;
        });
        return total;
    }

    // ===== ОБНОВЛЕНИЕ UI =====
    function updateUI() {
        const price = calculatePrice();
        const formattedPrice = price.toLocaleString('ru-RU') + ' BYN';
        if (sidebarPrice) sidebarPrice.textContent = formattedPrice;
        if (totalPrice) totalPrice.textContent = formattedPrice;
        const config = document.querySelector('input[name="config"]:checked')?.value || 'straight';
        const material = document.querySelector('input[name="material"]:checked')?.value || 'steel';
        const grill = document.querySelector('input[name="grill"]:checked')?.value || 'none';
        const size = document.querySelector('input[name="size"]:checked')?.value || '2.2';
        const specConfig = document.getElementById('specConfig');
        const specMaterial = document.getElementById('specMaterial');
        const specGrill = document.getElementById('specGrill');
        const specSize = document.getElementById('specSize');
        if (specConfig) specConfig.textContent = configData.config[config].name;
        if (specMaterial) specMaterial.textContent = configData.material[material].name;
        if (specGrill) specGrill.textContent = configData.grill[grill].name;
        if (specSize) specSize.textContent = configData.size[size].name;
        if (previewImage) previewImage.src = configData.config[config].img;
    }

    // ===== СВОДКА =====
    function updateSummary() {
        const config = document.querySelector('input[name="config"]:checked')?.value || 'straight';
        const material = document.querySelector('input[name="material"]:checked')?.value || 'steel';
        const grill = document.querySelector('input[name="grill"]:checked')?.value || 'none';
        const size = document.querySelector('input[name="size"]:checked')?.value || '2.2';
        let html = `
            <div class="configurator-summary__item">
                <span class="configurator-summary__item-label">Конфигурация:</span>
                <span class="configurator-summary__item-value">${configData.config[config].name}</span>
            </div>
            <div class="configurator-summary__item">
                <span class="configurator-summary__item-label">Материал:</span>
                <span class="configurator-summary__item-value">${configData.material[material].name}</span>
            </div>
            <div class="configurator-summary__item">
                <span class="configurator-summary__item-label">Гриль:</span>
                <span class="configurator-summary__item-value">${configData.grill[grill].name}</span>
            </div>
            <div class="configurator-summary__item">
                <span class="configurator-summary__item-label">Размер:</span>
                <span class="configurator-summary__item-value">${configData.size[size].name}</span>
            </div>
        `;
        const extras = document.querySelectorAll('input[name="extra"]:checked');
        if (extras.length > 0) {
            html += `<div class="configurator-summary__item" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
                <span class="configurator-summary__item-label" style="font-weight: 600;">Дополнения:</span>
                <span></span>
            </div>`;
            extras.forEach(extra => {
                html += `
                    <div class="configurator-summary__item">
                        <span class="configurator-summary__item-label">• ${configData.extras[extra.value].name}</span>
                        <span class="configurator-summary__item-value">+${configData.extras[extra.value].price.toLocaleString('ru-RU')} BYN</span>
                    </div>
                `;
            });
        }
        if (summaryList) summaryList.innerHTML = html;
    }

    // ===== СЛУШАТЕЛИ =====
    document.querySelectorAll('input[name="config"], input[name="material"], input[name="grill"], input[name="size"], input[name="extra"]').forEach(input => {
        input.addEventListener('change', updateUI);
    });

    // ===== ДОБАВИТЬ В КОРЗИНУ =====
    const addToCartBtn = document.getElementById('addToCartBtn');
    const goToCartBtn = document.getElementById('goToCartBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async () => {
            const config = document.querySelector('input[name="config"]:checked')?.value || 'straight';
            const material = document.querySelector('input[name="material"]:checked')?.value || 'steel';
            const grill = document.querySelector('input[name="grill"]:checked')?.value || 'none';
            const size = document.querySelector('input[name="size"]:checked')?.value || '2.2';
            const extras = Array.from(document.querySelectorAll('input[name="extra"]:checked')).map(e => e.value);
            
            const cartItem = {
                title: `Гриль-кухня ${configData.config[config].name}`,
                img: configData.config[config].img,
                configuration: {
                    config: configData.config[config].name,
                    material: configData.material[material].name,
                    grill: configData.grill[grill].name,
                    size: configData.size[size].name,
                    extras: extras.map(e => configData.extras[e].name)
                },
                totalPrice: calculatePrice(),
                created_at: new Date().toISOString()
            };
            
            try {
                await fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cartItem)
                });
                
                addToCartBtn.textContent = '✓ Добавлено!';
                addToCartBtn.style.background = '#27ae60';
                
                // Обновляем счётчик корзины
                const countEl = document.getElementById('cartCount');
                if (countEl) {
                    const currentCount = parseInt(countEl.textContent) || 0;
                    countEl.textContent = currentCount + 1;
                }
                
                setTimeout(() => {
                    addToCartBtn.textContent = '🛒 Добавить в корзину';
                    addToCartBtn.style.background = '';
                }, 2000);
            } catch (err) {
                alert('Ошибка добавления в корзину');
            }
        });
    }
    
    if (goToCartBtn) {
        goToCartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    // ===== ОТПРАВКА ФОРМЫ =====
    const form = document.getElementById('configuratorForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            const config = document.querySelector('input[name="config"]:checked')?.value || 'straight';
            const material = document.querySelector('input[name="material"]:checked')?.value || 'steel';
            const grill = document.querySelector('input[name="grill"]:checked')?.value || 'none';
            const size = document.querySelector('input[name="size"]:checked')?.value || '2.2';
            const extras = Array.from(document.querySelectorAll('input[name="extra"]:checked')).map(e => e.value);
            const request = {
                type: 'configurator',
                name: data.name,
                phone: data.phone,
                email: data.email || '',
                comment: data.comment || '',
                configuration: {
                    config: configData.config[config].name,
                    material: configData.material[material].name,
                    grill: configData.grill[grill].name,
                    size: configData.size[size].name,
                    extras: extras.map(e => configData.extras[e].name)
                },
                totalPrice: calculatePrice(),
                created_at: new Date().toISOString(),
                status: 'new'
            };
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;
            try {
                const res = await fetch(`${API_URL}/requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request)
                });
                if (res.ok) {
                    btn.textContent = '✓ Заявка отправлена!';
                    btn.style.background = '#27ae60';
                    setTimeout(() => {
                        alert('Спасибо! Мы свяжемся с вами в течение 15 минут.');
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    throw new Error('Ошибка сервера');
                }
            } catch (err) {
                const local = JSON.parse(localStorage.getItem('local_requests') || '[]');
                local.push(request);
                localStorage.setItem('local_requests', JSON.stringify(local));
                btn.textContent = '✓ Заявка отправлена!';
                btn.style.background = '#27ae60';
                setTimeout(() => {
                    alert('Спасибо! Мы свяжемся с вами в течение 15 минут.');
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }

    // Инициализация
    updateUI();
    console.log('✅ Конфигуратор готов');
});