// src/ts/components/user/profileComponent.ts
import '../../../CSS/style_profile.css';
import { Router } from '../../main';
import { UserProfile } from '../../types/api';
import { responseToJson } from '../../utils/api';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderProfile(container: HTMLElement) {
    // 1. Вставляем каркас страницы профиля
    container.innerHTML = profileHtml;

    // 2. Инициализируем базовые события
    initProfileListeners();

    // 3. Запускаем загрузку данных пользователя
    loadUserData();
}

function initProfileListeners() {
    document.getElementById('goHome')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/main');
    });
}

async function loadUserData() {
    const content = document.getElementById('profileContent');
    if (!content) return;

    try {
        const res = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
        
        if (!res.ok) {
            Router.navigate('/login'); 
            return;
        }

        // Защита от "Unexpected end of JSON input"
        const textResponse = await res.text();
        if (!textResponse) {
            throw new Error("Бэкенд вернул пустой ответ! Проверьте usersRouter.ts (нужно res.json(res.locals.user))");
        }

        const rawData = JSON.parse(textResponse);
        const user: UserProfile = rawData.data ? rawData.data : rawData;

        // Защита от пустого объекта
        if (!user || (!user.name && !user.email)) {
             throw new Error("Бэкенд вернул объект без данных пользователя");
        }

        // Рендерим успешные данные
        renderUserInfo(content, user);

    } catch (e: any) {
        console.error("Ошибка загрузки профиля:", e.message);
        renderProfileError(content, e.message);
    }
}

// Функция для отрисовки успешного состояния
function renderUserInfo(content: HTMLElement, user: UserProfile) {
    const userName = user.name || 'Пользователь';
    const firstLetter = userName.charAt(0).toUpperCase();
    const userEmail = user.email || 'Не указан';
    const userPhone = user.phone || 'Не указан';

    content.innerHTML = `
        <div class="profile-avatar">${firstLetter}</div>
        <h1 class="profile-name">${userName}</h1>
        <p class="profile-role">Зарегистрированный покупатель</p>

        <div class="profile-info-grid">
            <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">${userEmail}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Телефон</span>
                <span class="info-value">${userPhone}</span>
            </div>
        </div>

        <button class="logout-btn" id="logoutBtn">Выйти из аккаунта</button>
    `;

    // Обработчик кнопки выхода
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, { 
                method: 'POST', 
                credentials: 'include' 
            });
            // Очищаем локальные флаги авторизации, если они были
            localStorage.removeItem('isAuthorized');
        } catch (e) {
            console.error("Ошибка при выходе");
        } finally {
            Router.navigate('/login');
        }
    });
}

// Функция для отрисовки состояния ошибки
function renderProfileError(content: HTMLElement, errorMessage: string) {
    content.innerHTML = `
        <div style="text-align: center; color: red;">
            <h3>Упс, ошибка на стороне сервера!</h3>
            <p style="font-size: 14px; margin-top: 10px;">${errorMessage}</p>
            <button id="emergencyLogout" style="margin-top: 20px; padding: 10px 20px; background: #ff4757; color: white; border: none; border-radius: 5px; cursor: pointer;">Вернуться на страницу входа</button>
        </div>
    `;
    
    document.getElementById('emergencyLogout')?.addEventListener('click', () => {
        Router.navigate('/login');
    });
}