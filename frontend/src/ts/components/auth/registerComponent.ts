import '../../../CSS/style_registration.css'; // Твои стили
import { Router } from '../../main';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderRegistration(container: HTMLElement) {
    // 1. Вставляем твой HTML
    container.innerHTML = `
        <div class="background">
            <div class="substrate">
                <div class="logo">
                    <img class="logo-img" src="/src/images/logo1.png" alt="Logo">
                </div>
                <section class="login-section">
                    <h1 class="login-title">Зарегистрируйтесь</h1>
                    <p class="login-subtitle">Создайте аккаунт для доступа к системе</p>
                    
                    <form class="login-form" id="registerForm" data-registration>
                        <div class="input-group">
                            <input type="text" id="name" class="login-input" placeholder="Имя" required>
                        </div>
                        <div class="input-group">
                            <input type="text" id="phone-number" class="login-input" placeholder="+375 XX XXX-XX-XX" required>
                        </div>
                        <div class="input-group">
                            <input type="email" id="email" class="login-input" placeholder="Ваш email" required>
                        </div>
                        <div class="input-group">
                            <input type="password" id="password" class="login-input" placeholder="Пароль (мин. 6 символов)" required>
                        </div>
                        <div class="input-group">
                            <input type="password" id="confirmpassword" class="login-input" placeholder="Повторите пароль" required>
                        </div>
                        
                        <div id="errorMessage" style="color: red; margin-bottom: 10px; display: none;"></div>
                        <div id="successMessage" style="color: green; margin-bottom: 10px; display: none;"></div>
                        
                        <button type="submit" class="login-button">Зарегистрироваться</button>
                    </form>
                    
                    <div class="register-link">
                        <a href="#" id="goToLogin" class="register-link-text">Войти</a>
                    </div>
                </section>
            </div>
        </div>
    `;

    // 2. Навешиваем логику на кнопки (SPA переходы)
    const goToLoginBtn = document.getElementById('goToLogin');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Отменяем стандартный переход по ссылке
            Router.navigate('/login'); // Вызываем наш роутер
        });
    }

    // 3. Логика формы (твой fetch)
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
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    successDiv.textContent = 'Регистрация прошла успешно!';
                    successDiv.style.display = 'block';
                    // SPA переход на логин через 2 секунды
                    setTimeout(() => Router.navigate('/login'), 2000);
                } else {
                    errorDiv.textContent = data.error || 'Ошибка регистрации';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Ошибка соединения с сервером';
                errorDiv.style.display = 'block';
            }
        });
    }
}