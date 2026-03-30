// ИМПОРТИРУЕМ ПРАВИЛЬНЫЕ ФУНКЦИИ ИЗ КОМПОНЕНТОВ
import { renderLogin } from './components/auth/loginComponent';
import { renderRegistration } from './components/auth/registerComponent';
import { renderHome } from './components/shop/homeComponent';

export class Router {
    static navigate(path: string) {
        const app = document.getElementById('app');
        if (!app) return;

        // Меняем URL в браузере без перезагрузки страницы
        window.history.pushState({}, '', path);

        // Очищаем текущий контент
        app.innerHTML = '';

        // В зависимости от пути, вызываем нужный компонент
        switch (path) {
            case '/login':
                renderLogin(app); // Вызываем функцию из loginComponent.ts
                break;
            case '/register':
                renderRegistration(app); // Вызываем функцию из registerComponent.ts
                break;
            case '/main':
            case '/':
                renderHome(app); // Вызываем функцию из homeComponent.ts
                break;
            default:
                renderLogin(app); // По умолчанию кидаем на логин
                break;
        }
    }
}

// Слушаем кнопки "назад/вперед" в браузере
window.addEventListener('popstate', () => {
    Router.navigate(window.location.pathname);
});

// Запускаем роутер при первой загрузке страницы
// Запускаем роутер при первой загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    // МЕНЯЕМ ЗДЕСЬ: При первом заходе на корень сайта открываем главную
    Router.navigate(currentPath === '/' ? '/main' : currentPath); 
});