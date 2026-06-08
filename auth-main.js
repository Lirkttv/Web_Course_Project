const API_URL = 'http://localhost:3000';

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_grill_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function showMessage(type, text) {
    const authMessage = document.getElementById('authMessage');
    authMessage.className = `auth-message ${type}`;
    authMessage.textContent = text;
    authMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showFieldError(input, show) {
    if (!input) return;
    input.classList.toggle('error', show);
    const errEl = input.parentElement.querySelector('.error-message');
    if (errEl) errEl.classList.toggle('visible', show);
}

function showUserInfo(user) {
    document.getElementById('userAvatar').textContent = (user.firstname || user.nickname || 'U')[0];
    document.getElementById('userName').textContent = 
        `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.nickname || 'Пользователь';
    document.getElementById('userEmail').textContent = user.email || '';
    document.getElementById('userNick').textContent = user.nickname ? `@${user.nickname}` : '';
    document.getElementById('userInfoBlock').style.display = 'block';
    document.getElementById('authFormsBlock').style.display = 'none';
}

// Маска телефона
const regPhoneInput = document.getElementById('regPhone');
if (regPhoneInput) {
    regPhoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (!val.startsWith('375')) {
            if (val.startsWith('80') || val.startsWith('8')) val = '375' + val.replace(/^80?/, '');
            else val = '375' + val;
        }
        val = val.substring(0, 12);
        let formatted = '+375';
        if (val.length > 3) formatted += ' (' + val.substring(3, 5);
        if (val.length >= 5) formatted += ') ' + val.substring(5, 8);
        if (val.length >= 8) formatted += '-' + val.substring(8, 10);
        if (val.length >= 10) formatted += '-' + val.substring(10, 12);
        e.target.value = formatted;
    });
    regPhoneInput.addEventListener('focus', (e) => {
        if (!e.target.value) e.target.value = '+375 ';
    });
}

// Проверка сессии
(async function checkSession() {
    const sessionData = localStorage.getItem('auth_session');
    if (!sessionData) return;
    try {
        const session = JSON.parse(sessionData);
        if (new Date(session.expires_at) < new Date()) {
            localStorage.removeItem('auth_session');
            return;
        }
        showUserInfo(session.user);
    } catch (e) {
        const session = JSON.parse(sessionData);
        if (new Date(session.expires_at) > new Date()) showUserInfo(session.user);
    }
})();

// Выход
document.getElementById('logoutBtn').addEventListener('click', async () => {
    const sessionData = localStorage.getItem('auth_session');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const res = await fetch(`${API_URL}/sessions?token=${session.token}`);
            const sessions = await res.json();
            if (sessions.length > 0) {
                await fetch(`${API_URL}/sessions/${sessions[0].id}`, { method: 'DELETE' });
            }
        } catch (e) {}
    }
    localStorage.removeItem('auth_session');
    document.getElementById('userInfoBlock').style.display = 'none';
    document.getElementById('authFormsBlock').style.display = 'block';
    showMessage('success', 'Вы успешно вышли из аккаунта');
});

// Вкладки
const tabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        loginForm.classList.toggle('active', target === 'login');
        registerForm.classList.toggle('active', target === 'register');
        document.getElementById('authMessage').className = 'auth-message';
        document.getElementById('authMessage').textContent = '';
        document.querySelectorAll('.error-message').forEach(e => e.classList.remove('visible'));
        document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    });
});

// Способ пароля
const manualPassFields = document.getElementById('manualPassFields');
document.querySelectorAll('input[name="passMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        manualPassFields.style.display = e.target.value === 'manual' ? 'block' : 'none';
    });
});

// Никнейм
const prefixes = ['Grill', 'Fire', 'Smoke', 'Chef', 'Baron', 'King', 'Master', 'Pro', 'Elite', 'Urban'];
const suffixes = ['Kitchen', 'Griller', 'Smoker', 'Cook', 'Zone', 'House', 'Studio', 'Lab', 'Craft', 'Base'];
const regenNickBtn = document.getElementById('regenNick');
const nicknameInput = document.getElementById('nicknameInput');
const customNickInput = document.getElementById('customNickInput');
let regenCount = 0;

function generateNickname() {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    const n = Math.floor(Math.random() * 900) + 100;
    return `${p}${s}${n}`;
}

function updateNicknameUI() {
    nicknameInput.value = generateNickname();
    regenCount++;
    if (regenCount >= 5) {
        regenNickBtn.style.display = 'none';
        customNickInput.style.display = 'block';
        customNickInput.focus();
    }
}

regenNickBtn.addEventListener('click', updateNicknameUI);
updateNicknameUI();

// Сила пароля
const passInput = document.querySelector('input[name="password"]');
const passStrength = document.getElementById('passStrength');
if (passInput && passStrength) {
    passInput.addEventListener('input', (e) => {
        const val = e.target.value;
        passStrength.className = 'password-strength';
        if (val.length === 0) return;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
        if (/\d/.test(val)) score++;
        if (/[@$!%*?&]/.test(val)) score++;
        if (val.length >= 12) score++;
        if (score <= 2) passStrength.classList.add('weak');
        else if (score <= 3) passStrength.classList.add('medium');
        else passStrength.classList.add('strong');
    });
}

const badPasswords = new Set(['123456','password','qwerty','12345678','12345','123456789','qwerty123','admin123']);

// РЕГИСТРАЦИЯ
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let hasError = false;
    const formData = new FormData(registerForm);
    const data = {};
    formData.forEach((val, key) => data[key] = val);

    const lastnameInput = registerForm.querySelector('input[name="lastname"]');
    const firstnameInput = registerForm.querySelector('input[name="firstname"]');
    if (!data.lastname.trim()) { showFieldError(lastnameInput, true); hasError = true; }
    else showFieldError(lastnameInput, false);
    if (!data.firstname.trim()) { showFieldError(firstnameInput, true); hasError = true; }
    else showFieldError(firstnameInput, false);

    const dobInput = registerForm.querySelector('input[name="dob"]');
    if (data.dob) {
        const age = Math.floor((new Date() - new Date(data.dob)) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 16) { showFieldError(dobInput, true); hasError = true; }
        else showFieldError(dobInput, false);
    } else { showFieldError(dobInput, true); hasError = true; }

    const phoneInput = document.getElementById('regPhone');
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length !== 12 || !phoneDigits.startsWith('375')) {
        showFieldError(phoneInput, true);
        hasError = true;
    } else {
        showFieldError(phoneInput, false);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showFieldError(registerForm.querySelector('input[name="email"]'), true);
        hasError = true;
    } else {
        showFieldError(registerForm.querySelector('input[name="email"]'), false);
    }

    if (data.passMethod === 'manual') {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        const passField = registerForm.querySelector('input[name="password"]');
        const confirmField = registerForm.querySelector('input[name="confirm_password"]');
        if (!passRegex.test(data.password)) { showFieldError(passField, true); hasError = true; }
        else showFieldError(passField, false);
        if (data.password !== data.confirm_password) { showFieldError(confirmField, true); hasError = true; }
        else showFieldError(confirmField, false);
        if (badPasswords.has(data.password.toLowerCase())) {
            showMessage('error', 'Пароль слишком распространённый');
            hasError = true;
        }
    } else {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        let autoPass = '';
        for (let i = 0; i < 12; i++) autoPass += chars[Math.floor(Math.random() * chars.length)];
        data.password = autoPass;
        data.confirm_password = autoPass;
        showMessage('success', `Ваш пароль: ${autoPass}. Сохраните его!`);
    }

    let nickname = customNickInput.style.display === 'block' ? customNickInput.value : nicknameInput.value;
    if (nickname.length < 3 || !/^[a-zA-Z0-9_]+$/.test(nickname)) {
        document.getElementById('regNickError').classList.add('visible');
        hasError = true;
    } else {
        document.getElementById('regNickError').classList.remove('visible');
    }
    data.nickname = nickname;

    if (!data.consent) {
        document.getElementById('regConsentError').classList.add('visible');
        hasError = true;
    } else {
        document.getElementById('regConsentError').classList.remove('visible');
    }

    if (hasError) {
        showMessage('error', 'Пожалуйста, исправьте ошибки в форме');
        return;
    }

    const btn = document.getElementById('registerSubmit');
    btn.disabled = true;
    btn.textContent = 'Регистрация...';

    try {
        const allUsersRes = await fetch(`${API_URL}/users`);
        const allUsers = await allUsersRes.json();
        
        if (allUsers.some(u => u.email === data.email)) { showMessage('error', 'Email уже зарегистрирован'); btn.disabled = false; btn.textContent = 'Зарегистрироваться'; return; }
        if (allUsers.some(u => (u.phone || '').replace(/\D/g, '') === phoneDigits)) { showMessage('error', 'Телефон уже зарегистрирован'); btn.disabled = false; btn.textContent = 'Зарегистрироваться'; return; }
        if (allUsers.some(u => u.nickname === data.nickname)) { showMessage('error', 'Никнейм занят'); btn.disabled = false; btn.textContent = 'Зарегистрироваться'; return; }

        const passwordHash = await hashPassword(data.password);
        const newUser = {
            lastname: data.lastname, firstname: data.firstname,
            patronymic: data.patronymic || '', dob: data.dob,
            phone: phoneInput.value, email: data.email,
            passwordHash: passwordHash, nickname: data.nickname,
            created_at: new Date().toISOString()
        };

        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (res.ok) {
            showMessage('success', 'Регистрация успешна! Теперь войдите.');
            registerForm.reset();
            updateNicknameUI();
            regenCount = 0;
            regenNickBtn.style.display = 'block';
            customNickInput.style.display = 'none';
            setTimeout(() => { tabs[0].click(); }, 2000);
        } else {
            showMessage('error', 'Ошибка при регистрации');
        }
    } catch (err) {
        showMessage('error', 'Сервер недоступен. Запустите: npm run server');
    }
    
    btn.disabled = false;
    btn.textContent = 'Зарегистрироваться';
});

// ВХОД
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = loginForm.login.value.trim();
    const pass = loginForm.password.value;
    let err = false;
    
    if (!login) { showFieldError(loginForm.login, true); err = true; }
    else showFieldError(loginForm.login, false);
    if (!pass) { showFieldError(loginForm.password, true); err = true; }
    else showFieldError(loginForm.password, false);
    if (err) return;

    const btn = document.getElementById('loginSubmit');
    btn.disabled = true;
    btn.textContent = 'Входим...';

    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        const normalizedLogin = login.replace(/\D/g, '');
        
        const user = users.find(u => {
            if (u.email === login) return true;
            const userPhoneDigits = (u.phone || '').replace(/\D/g, '');
            return userPhoneDigits === normalizedLogin;
        });
        
        if (!user) {
            showMessage('error', 'Пользователь не найден');
            btn.disabled = false; btn.textContent = 'Войти';
            return;
        }

        const passwordHash = await hashPassword(pass);
        if (user.passwordHash !== passwordHash) {
            showMessage('error', 'Неверный пароль');
            btn.disabled = false; btn.textContent = 'Войти';
            return;
        }

        const token = generateToken();
        const expires_at = new Date(Date.now() + 7*24*60*60*1000).toISOString();
        
        await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token, user_id: user.id,
                nickname: user.nickname, expires_at: expires_at,
                created_at: new Date().toISOString()
            })
        });

        const sessionInfo = {
            token: token, expires_at: expires_at,
            user: {
                id: user.id, firstname: user.firstname,
                lastname: user.lastname, email: user.email,
                nickname: user.nickname
            }
        };
        localStorage.setItem('auth_session', JSON.stringify(sessionInfo));

        showMessage('success', 'Успешный вход!');
        setTimeout(() => { showUserInfo(sessionInfo.user); }, 1000);
    } catch (err) {
        showMessage('error', 'Сервер недоступен');
    }
    
    btn.disabled = false;
    btn.textContent = 'Войти';
});

// Сброс ошибок
document.querySelectorAll('.form-input').forEach(inp => {
    inp.addEventListener('input', function() {
        this.classList.remove('error');
        const errEl = this.parentElement.querySelector('.error-message');
        if (errEl) errEl.classList.remove('visible');
    });
});