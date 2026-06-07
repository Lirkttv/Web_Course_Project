document.addEventListener('DOMContentLoaded', () => {
    const authAdminBtn = document.getElementById('authAdminBtn');
    if (!authAdminBtn) return;
    
    authAdminBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:999999;';
        
        modal.innerHTML = `
            <div style="background:#fff;padding:30px;border-radius:16px;max-width:400px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
                <h2 style="margin:0 0 10px;color:#667eea;font-size:1.5rem;">🔐 Вход как администратор</h2>
                <p style="color:#666;margin-bottom:20px;font-size:0.9rem;">Введите данные администратора</p>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;font-weight:600;color:#333;">Email</label>
                    <input type="email" id="adminEmailInput" placeholder="admin@grill.com" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:1rem;box-sizing:border-box;">
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:5px;font-weight:600;color:#333;">Пароль</label>
                    <input type="password" id="adminPassInput" placeholder="Введите пароль" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:1rem;box-sizing:border-box;">
                </div>
                <div id="adminError" style="color:#e74c3c;margin-bottom:15px;font-size:0.9rem;display:none;"></div>
                <div style="display:flex;gap:10px;">
                    <button id="adminCancelBtn" style="flex:1;padding:12px;background:#ddd;color:#333;border:none;border-radius:8px;cursor:pointer;font-size:1rem;font-weight:600;">Отмена</button>
                    <button id="adminConfirmBtn" style="flex:1;padding:12px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:1rem;font-weight:600;">Войти</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('adminEmailInput').focus(), 100);
        
        document.getElementById('adminCancelBtn').addEventListener('click', () => document.body.removeChild(modal));
        modal.addEventListener('click', (e) => { if (e.target === modal) document.body.removeChild(modal); });
        
        document.getElementById('adminConfirmBtn').addEventListener('click', async () => {
            const email = document.getElementById('adminEmailInput').value.trim();
            const password = document.getElementById('adminPassInput').value;
            const errorEl = document.getElementById('adminError');
            
            if (!email || !password) {
                errorEl.textContent = 'Заполните все поля';
                errorEl.style.display = 'block';
                return;
            }
            
            errorEl.style.display = 'none';
            
            try {
                const API_URL = 'http://localhost:3000';
                const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
                const users = await res.json();
                
                if (users.length === 0) {
                    errorEl.textContent = 'Пользователь не найден';
                    errorEl.style.display = 'block';
                    return;
                }
                
                const user = users[0];
                
                const encoder = new TextEncoder();
                const data = encoder.encode(password + '_grill_salt_2024');
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                
                if (user.passwordHash !== passwordHash) {
                    errorEl.textContent = 'Неверный пароль';
                    errorEl.style.display = 'block';
                    return;
                }
                
                if (user.role !== 'admin' && user.email !== 'admin@grill.com') {
                    errorEl.textContent = 'Этот аккаунт не является администратором';
                    errorEl.style.display = 'block';
                    return;
                }
                
                const arr = new Uint8Array(32);
                crypto.getRandomValues(arr);
                const token = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
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
                
                localStorage.setItem('auth_session', JSON.stringify({
                    token: token, expires_at: expires_at,
                    user: {
                        id: user.id, firstname: user.firstname,
                        lastname: user.lastname, email: user.email,
                        nickname: user.nickname
                    }
                }));
                
                document.body.removeChild(modal);
                alert('✓ Вы вошли как администратор!');
                location.reload();
                
            } catch (err) {
                errorEl.textContent = 'Ошибка: ' + err.message;
                errorEl.style.display = 'block';
            }
        });
        
        document.getElementById('adminPassInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('adminConfirmBtn').click();
        });
    });
});