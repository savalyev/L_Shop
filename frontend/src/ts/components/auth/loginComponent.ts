import '../../../CSS/style_authorization.css'; // Твои стили
import { Router } from '../../main';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderLogin(container: HTMLElement) {
    // 1. Вставляем твой HTML
    container.innerHTML = `
        <div class="background">
            <div class="substrate">
                <div class="logo">
                    <img class="logo-img" src="/src/images/logo1.png" alt="Logo">
                </div>
                <section class="login-section">
                    <h1 class="login-title">Войдите по имени и паролю</h1>
                    <p class="login-subtitle">Только для зарегистрированных пользователей</p>
                    
                    <form class="login-form" id="loginForm">
                        <div class="input-group">
                            <input type="text" id="login" name="login" class="login-input" placeholder="Ваш email" required autocomplete="username">
                        </div>
                        <div class="input-group">
                            <input type="password" id="password" name="password" class="login-input" placeholder="Пароль" required autocomplete="current-password">
                        </div>
                        
                        <div id="errorMessage" class="error-message" style="color: red; margin-bottom: 10px; display: none;"></div>
                        <div id="successMessage" class="success-message" style="color: green; margin-bottom: 10px; display: none;"></div>
                        
                        <button type="submit" class="login-button" id="submitBtn">
                            <span class="button-text">Войти</span>
                        </button>
                    </form>
                    
                    <div class="register-link">
                        <a href="#" id="goToReg" class="register-link-text">Зарегистрироваться</a>
                    </div>
                </section>
            </div>
        </div>
    `;

    // 2. Навешиваем логику на кнопку перехода
    const goToRegBtn = document.getElementById('goToReg');
    if (goToRegBtn) {
        goToRegBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Router.navigate('/register'); // SPA переход
        });
    }

    // 3. Логика формы
    const form = document.getElementById('loginForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            
            const loginInput = (document.getElementById('login') as HTMLInputElement).value.trim();
            const passwordInput = (document.getElementById('password') as HTMLInputElement).value;
            const errorDiv = document.getElementById('errorMessage') as HTMLDivElement;
            const successDiv = document.getElementById('successMessage') as HTMLDivElement;

            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: loginInput, password: passwordInput }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    successDiv.textContent = 'Вход выполнен успешно!';
                    successDiv.style.display = 'block';
                    // SPA переход на главную
                    setTimeout(() => Router.navigate('/main'), 1000);
                } else {
                    errorDiv.textContent = data.error || 'Ошибка входа';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Ошибка соединения с сервером';
                errorDiv.style.display = 'block';
            }
        });
    }
}