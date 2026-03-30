// src/ts/main.ts
import { renderLogin } from './components/auth/loginComponent';
import { renderRegistration } from './components/auth/registerComponent';
import { renderHome } from './components/shop/homeComponent';
import { renderProfile } from './components/user/profileComponent';
// ИМПОРТИРУЕМ ДОСТАВКУ
import { renderDelivery } from './components/shop/deliveryComponent';
import { renderProduct } from './components/shop/productComponent';

export class Router {
    static navigate(path: string) {
        const app = document.getElementById('app');
        if (!app) return;

        window.history.pushState({}, '', path);
        app.innerHTML = '';

        // ИСПРАВЛЕНИЕ: Отрезаем параметры запроса (всё, что после '?')
        const basePath = path.split('?')[0];

        switch (basePath) {
            case '/login':
                renderLogin(app);
                break;
            case '/register':
                renderRegistration(app);
                break;
            case '/main':
            case '/':
                renderHome(app);
                break;
            case '/profile':
                renderProfile(app);
                break;
            case '/delivery':
                renderDelivery(app);
                break;
            case '/product': // ДОБАВЛЕН РОУТ ДЛЯ КАРТОЧКИ ТОВАРА
                renderProduct(app);
                break;
            default:
                renderLogin(app);
                break;
        }
    }
}

window.addEventListener('popstate', () => {
    Router.navigate(window.location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    Router.navigate(currentPath === '/' ? '/main' : currentPath); 
});