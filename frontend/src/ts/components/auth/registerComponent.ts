// src/ts/components/auth/registerComponent.ts
import '../../../CSS/style_registration.css'; 
import { Router } from '../../main';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderRegistration(container: HTMLElement) {
    container.innerHTML = `
        <div class="auth-page">
            <div class="auth-card" style="max-width: 500px;">
                <a href="#" class="auth-logo">REUTKUPI</a>
                <h1 class="auth-title">Создать аккаунт</h1>
                <p class="auth-subtitle">Присоединяйтесь к нам для удобных покупок</p>
                
                <div id="errorMessage" class="message msg-error"></div>
                <div id="successMessage" class="message msg-success"></div>
                
                <!-- Атрибут data-registration добавлен по ТЗ -->
                <form class="auth-form" id="registerForm" data-registration>
                    <div class="auth-input-wrapper">
                        <label for="name">Имя</label>
                        <input type="text" id="name" class="auth-input" placeholder="Как к вам обращаться?" required>
                    </div>
                    
                    <div class="reg-grid">
                        <div class="auth-input-wrapper">
                            <label for="email">Email</label>
                            <input type="email" id="email" class="auth-input" placeholder="example@mail.com" required>
                        </div>
                        <div class="auth-input-wrapper">
                            <label for="phone-number">Телефон</label>
                            <input type="text" id="phone-number" class="auth-input" placeholder="+375 XX XXX-XX-XX" required>
                        </div>
                    </div>

                    <div class="reg-grid">
                        <div class="auth-input-wrapper">
                            <label for="password">Пароль</label>
                            <input type="password" id="password" class="auth-input" placeholder="Мин. 6 символов" required>
                        </div>
                        <div class="auth-input-wrapper">
                            <label for="confirmpassword">Повторите пароль</label>
                            <input type="password" id="confirmpassword" class="auth-input" placeholder="Подтвердите пароль" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="auth-btn">Зарегистрироваться</button>
                </form>
                
                <div class="auth-footer">
                    Уже есть аккаунт? <a href="#" id="goToLogin" class="auth-link">Войти</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('goToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/login');
    });

    const form = document.getElementById('registerForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            const name = (document.getElementById('name') as HTMLInputElement).value.trim();
            const phone = (document.getElementById('phone-number') as HTMLInputElement).value.trim();
            const email = (document.getElementById('email') as HTMLInputElement).value.trim();
            const password = (document.getElementById('password') as HTMLInputElement).value;
            const confirmPassword = (document.getElementById('confirmpassword') as HTMLInputElement).value;
            const errorDiv = document.getElementById('errorMessage') as HTMLDivElement;
            const successDiv = document.getElementById('successMessage') as HTMLDivElement;
            
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            if (password !== confirmPassword) {
                errorDiv.textContent = 'Пароли не совпадают';
                errorDiv.style.display = 'block';
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, password, email, phone }),
                    credentials: 'include' // Это установит HttpOnly куку
                });
                const data = await response.json();
                if (response.ok) {
                    successDiv.textContent = 'Регистрация успешна!';
                    successDiv.style.display = 'block';
                    setTimeout(() => Router.navigate('/login'), 2000);
                } else {
                    errorDiv.textContent = data.error || 'Ошибка регистрации';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Ошибка соединения';
                errorDiv.style.display = 'block';
            }
        });
    }
}