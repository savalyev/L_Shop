// src/ts/components/auth/loginComponent.ts
import '../../../CSS/style_authorization.css'; 
import { Router } from '../../main';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderLogin(container: HTMLElement) {
    container.innerHTML = `
        <div class="auth-page">
            <div class="auth-card">
                <a href="#" class="auth-logo">REUTKUPI</a>
                <h1 class="auth-title">С возвращением!</h1>
                <p class="auth-subtitle">Войдите, чтобы продолжить покупки</p>
                
                <div id="errorMessage" class="message msg-error"></div>
                <div id="successMessage" class="message msg-success"></div>

                <form class="auth-form" id="loginForm">
                    <div class="auth-input-wrapper">
                        <!-- Изменили label и placeholder под универсальный ввод -->
                        <label for="login">Телефон, email или имя</label>
                        <input type="text" id="login" name="login" class="auth-input" placeholder="+375... / почта / имя" required autocomplete="username">
                    </div>
                    
                    <div class="auth-input-wrapper">
                        <label for="password">Пароль</label>
                        <input type="password" id="password" name="password" class="auth-input" placeholder="Введите пароль" required autocomplete="current-password">
                    </div>
                    
                    <button type="submit" class="auth-btn" id="submitBtn">Войти</button>
                </form>
                
                <div class="auth-footer">
                    Ещё нет аккаунта? <a href="#" id="goToReg" class="auth-link">Зарегистрироваться</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('goToReg')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/register'); 
    });

    const form = document.getElementById('loginForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            
            // Забираем значение (это может быть телефон, почта или имя)
            const loginInput = (document.getElementById('login') as HTMLInputElement).value.trim();
            const passwordInput = (document.getElementById('password') as HTMLInputElement).value;
            
            const errorDiv = document.getElementById('errorMessage') as HTMLDivElement;
            const successDiv = document.getElementById('successMessage') as HTMLDivElement;

            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            try {
                // Отправляем как login (бэкенд сам разберется)
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: loginInput, password: passwordInput }),
                    credentials: 'include' // Важно: сохраняем куки с сессией после логина!
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    successDiv.textContent = 'Вход выполнен успешно!';
                    successDiv.style.display = 'block';
                    // Сохраняем флаг, что мы авторизованы (для фронтенда)
                    localStorage.setItem('isAuthorized', 'true');
                    setTimeout(() => Router.navigate('/main'), 1000);
                } else {
                    errorDiv.textContent = data.error || data.message || 'Ошибка входа';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Ошибка соединения с сервером';
                errorDiv.style.display = 'block';
            }
        });
    }
}