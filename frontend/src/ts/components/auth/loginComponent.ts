// src/ts/components/auth/loginComponent.ts
import '../../../CSS/style_authorization.css'; 
import { Router } from '../../main';
// Импортируем HTML как сырую строку
import loginHtml from './login.html?raw';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderLogin(container: HTMLElement) {
    // 1. Рендерим верстку
    container.innerHTML = loginHtml;

    // 2. Инициализируем обработчики событий после добавления HTML в DOM
    initEventListeners();
}

function initEventListeners() {
    // Обработка перехода на регистрацию
    const goToRegBtn = document.getElementById('goToReg');
    goToRegBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/register'); 
    });

    // Обработка формы
    const form = document.getElementById('loginForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleLoginSubmit);
    }
}

async function handleLoginSubmit(e: Event) {
    e.preventDefault();
    
    const loginInput = (document.getElementById('login') as HTMLInputElement).value.trim();
    const passwordInput = (document.getElementById('password') as HTMLInputElement).value;
    
    const errorDiv = document.getElementById('errorMessage') as HTMLDivElement;
    const successDiv = document.getElementById('successMessage') as HTMLDivElement;

    // Сбрасываем сообщения
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
}