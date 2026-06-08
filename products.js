document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';

    let allProducts = [];
    let currentFilters = { category: 'all', search: '', sort: 'default' };

    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const catalogEmpty = document.getElementById('catalogEmpty');
    const filterButtons = document.querySelectorAll('.catalog-filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const resetFiltersBtn = document.getElementById('resetFilters');

    // Проверка админа
    function isAdmin() {
        try {
            const s = JSON.parse(localStorage.getItem('auth_session'));
            return s && s.user && s.user.email === 'admin@grill.com';
        } catch { return false; }
    }

    async function loadProducts() {
        try {
            const res = await fetch(`${API_URL}/products`);
            allProducts = await res.json();
            renderProducts(allProducts);
        } catch (err) {
            productsGrid.innerHTML = '<p>Ошибка загрузки. Запустите: npm run server</p>';
        }
    }

    function renderProducts(products) {
        productsGrid.innerHTML = '';
        productsGrid.style.display = products.length > 0 ? 'grid' : 'none';
        
        if (catalogEmpty) catalogEmpty.style.display = products.length === 0 ? 'block' : 'none';
        if (products.length === 0) {
            if (productsCount) productsCount.textContent = '0';
            return;
        }

        const admin = isAdmin();

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.product = p.id;
            card.dataset.category = p.categories.join(' ');
            card.dataset.price = p.price;
            card.dataset.name = p.title;

            const badgeHtml = p.badge ? `<span class="product-card__badge ${p.badgeClass || ''}">${p.badge}</span>` : '';
            const specsHtml = Object.entries(p.specs || {}).map(([k, v]) => `<span class="product-card__spec">${v}</span>`).join('');

            card.innerHTML = `
                <div class="product-card__image">
                    <img src="${p.img}" alt="${p.title}" class="product-card__img">
                    ${badgeHtml}
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${p.title}</h3>
                    <p class="product-card__desc">${p.desc}</p>
                    <div class="product-card__specs">${specsHtml}</div>
                    <div class="product-card__footer">
                        <div class="product-card__price">${p.priceFormatted}</div>
                        <button class="product-card__btn" data-product="${p.id}">Подробнее</button>
                    </div>
                </div>
                ${admin ? `
                <div class="admin-card-actions">
                    <button class="admin-card-btn admin-card-btn--edit" data-id="${p.id}" title="Редактировать">✏️</button>
                    <button class="admin-card-btn admin-card-btn--delete" data-id="${p.id}" title="Удалить">🗑️</button>
                </div>` : ''}
            `;

            productsGrid.appendChild(card);
        });

        // Кнопки "Подробнее"
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', () => openProductModal(btn.dataset.product));
        });

        // Кнопки АДМИНА — редактирование и удаление
        if (admin) {
            document.querySelectorAll('.admin-card-btn--edit').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    const res = await fetch(`${API_URL}/products/${id}`);
                    const product = await res.json();
                    openAdminProductModal(product);
                });
            });

            document.querySelectorAll('.admin-card-btn--delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    const title = btn.closest('.product-card').querySelector('.product-card__title').textContent;
                    if (confirm(`Удалить товар "${title}"?`)) {
                        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
                        await loadProducts();
                    }
                });
            });
        }

        if (productsCount) productsCount.textContent = products.length;
    }

    function applyFilters() {
        let filtered = [...allProducts];
        if (currentFilters.category !== 'all') {
            filtered = filtered.filter(p => p.categories.includes(currentFilters.category));
        }
        if (currentFilters.search) {
            const s = currentFilters.search.toLowerCase();
            filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s));
        }
        switch (currentFilters.sort) {
            case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
            case 'name-asc': filtered.sort((a, b) => a.title.localeCompare(b.title, 'ru')); break;
            case 'name-desc': filtered.sort((a, b) => b.title.localeCompare(a.title, 'ru')); break;
        }
        renderProducts(filtered);
    }

    function openProductModal(productId) {
        const p = allProducts.find(x => x.id === parseInt(productId));
        if (!p) return;
        const modal = document.getElementById('productModal');
        if (!modal) return;
        document.getElementById('productModalImg').src = p.img;
        document.getElementById('productModalImg').alt = p.title;
        document.getElementById('productModalBadge').textContent = p.badge || '';
        document.getElementById('productModalBadge').className = 'product-modal__badge ' + (p.badgeClass || '');
        document.getElementById('productModalTitle').textContent = p.title;
        document.getElementById('productModalDesc').textContent = p.desc;
        document.getElementById('productModalPrice').textContent = p.priceFormatted;
        const specsList = document.getElementById('productModalSpecs');
        specsList.innerHTML = '';
        Object.entries(p.specs || {}).forEach(([k, v]) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${k}:</span> <strong>${v}</strong>`;
            specsList.appendChild(li);
        });
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Фильтры
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.category = btn.dataset.filter;
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value.toLowerCase().trim();
            if (searchClear) searchClear.style.display = currentFilters.search ? 'flex' : 'none';
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
            }
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            applyFilters();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            currentFilters = { category: 'all', search: '', sort: 'default' };
            filterButtons.forEach(b => b.classList.remove('active'));
            filterButtons[0]?.classList.add('active');
            if (searchInput) searchInput.value = '';
            if (searchClear) searchClear.style.display = 'none';
            if (sortSelect) sortSelect.value = 'default';
            applyFilters();
        });
    }

    // Модалки
    function openModal(id) {
        const m = document.getElementById(id);
        if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
    }
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }
    document.querySelectorAll('[data-modal]').forEach(t => t.addEventListener('click', e => { e.preventDefault(); openModal(t.getAttribute('data-modal')); }));
    document.querySelectorAll('a[href="#callback"]').forEach(l => l.addEventListener('click', e => { e.preventDefault(); openModal('callbackModal'); }));
    document.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeAllModals));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });
    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m || e.target.classList.contains('modal__overlay')) closeAllModals(); }));

    // Формы
    async function submitRequest(type, data) {
        const req = { type, ...data, created_at: new Date().toISOString(), status: 'new' };
        try {
            const res = await fetch(`${API_URL}/requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) });
            return res.ok;
        } catch {
            const local = JSON.parse(localStorage.getItem('local_requests') || '[]');
            local.push(req);
            localStorage.setItem('local_requests', JSON.stringify(local));
            return true;
        }
    }

    function setupForm(id, type) {
        const f = document.getElementById(id);
        if (!f) return;
        f.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = f.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            const data = {};
            f.querySelectorAll('.form-input').forEach(i => data[i.placeholder || 'field'] = i.value);
            btn.textContent = 'Отправка...'; btn.disabled = true;
            if (await submitRequest(type, data)) {
                btn.textContent = '✓ Отправлено!'; btn.style.background = '#27ae60';
                setTimeout(() => { closeAllModals(); f.reset(); btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 2000);
            } else { btn.textContent = 'Ошибка'; btn.disabled = false; }
        });
    }
    setupForm('callbackForm', 'callback');
    setupForm('calculationForm', 'calculation');

    // Telegram / WhatsApp
    document.querySelectorAll('.footer__social, .modal__social-btn').forEach(btn => {
        const t = btn.textContent.toLowerCase();
        if (t.includes('telegram')) btn.addEventListener('click', e => { e.preventDefault(); window.open('https://t.me/grill_premium', '_blank'); });
        if (t.includes('whatsapp') || t.includes('whats')) btn.addEventListener('click', e => { e.preventDefault(); window.open('https://wa.me/375257486784', '_blank'); });
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const h = this.getAttribute('href');
            if (h === '#' || h === '#callback') return;
            const t = document.querySelector(h);
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // ===== АДМИН-ПАНЕЛЬ В КАТАЛОГЕ =====
    if (isAdmin()) {
        const panel = document.createElement('div');
        panel.className = 'admin-catalog-panel';
        panel.innerHTML = `
            <h3 class="admin-catalog-panel__title">🛠 Панель администратора</h3>
            <button class="admin-catalog-panel__add-btn" id="adminAddProductBtn">+ Добавить товар</button>
        `;
        const container = productsGrid.parentElement;
        container.insertBefore(panel, productsGrid);

        document.getElementById('adminAddProductBtn').addEventListener('click', () => openAdminProductModal(null));
    }

    // Модалка редактирования/добавления товара
    function openAdminProductModal(product) {
        const isEdit = !!product;
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="admin-modal__content">
                <h3 class="admin-modal__title">${isEdit ? 'Редактировать товар' : 'Добавить товар'}</h3>
                <form class="admin-modal__form" id="adminProductForm">
                    <div><label>Название *</label><input type="text" name="title" value="${product?.title || ''}" required></div>
                    <div><label>Описание</label><textarea name="desc">${product?.desc || ''}</textarea></div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div><label>Цена (BYN) *</label><input type="number" name="price" value="${product?.price || ''}" required></div>
                        <div><label>Бейдж</label><input type="text" name="badge" value="${product?.badge || ''}" placeholder="Хит, Новинка..."></div>
                    </div>
                    <div><label>Путь к картинке</label><input type="text" name="img" value="${product?.img || 'images/кухня1.png'}"></div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div><label>Материал</label>
                            <select name="material">
                                <option value="Нержавеющая сталь" ${product?.specs?.Материал === 'Нержавеющая сталь' ? 'selected' : ''}>Нержавеющая сталь</option>
                                <option value="Композит HPL" ${product?.specs?.Материал === 'Композит HPL' ? 'selected' : ''}>Композит HPL</option>
                                <option value="Композит + дерево" ${product?.specs?.Материал === 'Композит + дерево' ? 'selected' : ''}>Композит + дерево</option>
                            </select>
                        </div>
                        <div><label>Конфигурация</label>
                            <select name="config">
                                <option value="Прямая" ${product?.specs?.Конфигурация === 'Прямая' ? 'selected' : ''}>Прямая</option>
                                <option value="Угловая" ${product?.specs?.Конфигурация === 'Угловая' ? 'selected' : ''}>Угловая</option>
                                <option value="П-образная" ${product?.specs?.Конфигурация === 'П-образная' ? 'selected' : ''}>П-образная</option>
                                <option value="С островком" ${product?.specs?.Конфигурация === 'С островком' ? 'selected' : ''}>С островком</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div><label>Длина</label><input type="text" name="length" value="${product?.specs?.Длина || '2.2 п.м'}"></div>
                        <div><label>Размещение</label><input type="text" name="placement" value="${product?.specs?.Размещение || 'Открытая терраса'}"></div>
                    </div>
                    <div class="admin-modal__actions">
                        <button type="button" class="admin-modal__btn-cancel" id="adminModalCancel">Отмена</button>
                        <button type="submit" class="admin-modal__btn-save">${isEdit ? 'Сохранить' : 'Добавить'}</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('adminModalCancel').addEventListener('click', () => document.body.removeChild(modal));
        modal.addEventListener('click', e => { if (e.target === modal) document.body.removeChild(modal); });

        document.getElementById('adminProductForm').addEventListener('submit', async e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const price = parseInt(fd.get('price'));
            const productData = {
                title: fd.get('title'), desc: fd.get('desc'), price,
                priceFormatted: price.toLocaleString('ru-RU') + ' BYN',
                badge: fd.get('badge') || '',
                badgeClass: fd.get('badge') === 'Новинка' ? 'product-card__badge--new' :
                    (fd.get('badge') === 'Премиум' || fd.get('badge') === 'Люкс') ? 'product-card__badge--premium' : '',
                img: fd.get('img'),
                specs: { Материал: fd.get('material'), Конфигурация: fd.get('config'), Длина: fd.get('length'), Размещение: fd.get('placement') },
                categories: [
                    fd.get('material') === 'Нержавеющая сталь' ? 'steel' : 'composite',
                    fd.get('config') === 'Прямая' ? 'straight' : fd.get('config') === 'Угловая' ? 'corner' : fd.get('config') === 'П-образная' ? 'p-shape' : 'island'
                ]
            };
            try {
                if (isEdit) {
                    await fetch(`${API_URL}/products/${product.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
                } else {
                    await fetch(`${API_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
                }
                document.body.removeChild(modal);
                await loadProducts();
            } catch (err) { alert('Ошибка: ' + err.message); }
        });
    }

    loadProducts();
});