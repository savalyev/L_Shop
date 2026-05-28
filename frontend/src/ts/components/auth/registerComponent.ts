// src/ts/components/auth/registerComponent.ts
import '../../../CSS/style_registration.css'; 
import { Router } from '../../main';
import { RegisterBody, RegisterResponse } from '../../types/api';
import { responseToJson } from 'src/ts/utils/api';
import registerHtml from './register.html?raw';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderRegistration(container: HTMLElement) {
    // 1. Рендерим верстку
    container.innerHTML = registerHtml;

    // 2. Инициализируем обработчики событий
    initEventListeners();
}

function initEventListeners() {
    // Обработка перехода на логин
    const goToLoginBtn = document.getElementById('goToLogin');
    goToLoginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/login');
    });

    // Обработка формы регистрации
    const form = document.getElementById('registerForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleRegisterSubmit);
    }
}

async function handleRegisterSubmit(e: Event) {
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
}