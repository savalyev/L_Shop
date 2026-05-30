import '../../../CSS/style_profile.css';
import { Router } from '../../main';
import { UserProfile } from '../../types/api';
import { responseToJson } from '../../utils/api';
import profileHtml from './profile.html?raw';

const API_BASE_URL = 'http://localhost:3000/api';

export function renderProfile(container: HTMLElement) {
    container.innerHTML = profileHtml;
    initProfileListeners();
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
        const textResponse = await res.text();
        if (!textResponse) {
            throw new Error("Бэкенд вернул пустой ответ");
        }
        const rawData = JSON.parse(textResponse);
        const user: UserProfile = rawData.data ? rawData.data : rawData;
        if (!user || (!user.name && !user.email)) {
            throw new Error("Бэкенд вернул объект без данных пользователя");
        }
        renderUserInfo(content, user);
    } catch (e: any) {
        console.error("Ошибка загрузки профиля:", e.message);
        renderProfileError(content, e.message);
    }
}

function renderUserInfo(content: HTMLElement, user: UserProfile) {
    while (content.firstChild) content.removeChild(content.firstChild);
    
    const avatar = document.createElement('div');
    avatar.className = 'profile-avatar';
    avatar.textContent = (user.name?.[0] || 'П').toUpperCase();
    
    const name = document.createElement('h1');
    name.className = 'profile-name';
    name.textContent = user.name || 'Пользователь';
    
    const role = document.createElement('p');
    role.className = 'profile-role';
    role.textContent = 'Зарегистрированный покупатель';
    
    const infoGrid = document.createElement('div');
    infoGrid.className = 'profile-info-grid';
    
    const emailItem = document.createElement('div');
    emailItem.className = 'info-item';
    const emailLabel = document.createElement('span');
    emailLabel.className = 'info-label';
    emailLabel.textContent = 'Email';
    const emailValue = document.createElement('span');
    emailValue.className = 'info-value';
    emailValue.textContent = user.email || 'Не указан';
    emailItem.append(emailLabel, emailValue);
    
    const phoneItem = document.createElement('div');
    phoneItem.className = 'info-item';
    const phoneLabel = document.createElement('span');
    phoneLabel.className = 'info-label';
    phoneLabel.textContent = 'Телефон';
    const phoneValue = document.createElement('span');
    phoneValue.className = 'info-value';
    phoneValue.textContent = user.phone || 'Не указан';
    phoneItem.append(phoneLabel, phoneValue);
    
    infoGrid.append(emailItem, phoneItem);
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.textContent = 'Выйти из аккаунта';
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
            localStorage.removeItem('isAuthorized');
        } catch (e) { console.error(e); }
        finally { Router.navigate('/login'); }
    });
    
    content.append(avatar, name, role, infoGrid, logoutBtn);
}

function renderProfileError(content: HTMLElement, errorMessage: string) {
    while (content.firstChild) content.removeChild(content.firstChild);
    const errorDiv = document.createElement('div');
    errorDiv.style.textAlign = 'center';
    errorDiv.style.color = 'red';
    const h3 = document.createElement('h3');
    h3.textContent = 'Упс, ошибка на стороне сервера!';
    const p = document.createElement('p');
    p.style.fontSize = '14px';
    p.style.marginTop = '10px';
    p.textContent = errorMessage;
    const btn = document.createElement('button');
    btn.textContent = 'Вернуться на страницу входа';
    btn.style.marginTop = '20px';
    btn.style.padding = '10px 20px';
    btn.style.background = '#ff4757';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => Router.navigate('/login'));
    errorDiv.append(h3, p, btn);
    content.appendChild(errorDiv);
}