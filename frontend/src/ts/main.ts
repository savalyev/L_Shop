import { renderLogin } from './components/auth/loginComponent';
import { renderRegistration } from './components/auth/registerComponent';
import { renderHome } from './components/shop/homeComponent';
import { renderProfile } from './components/user/profileComponent';
import { renderDelivery } from './components/shop/deliveryComponent';
import { renderProduct } from './components/shop/productComponent';
import { renderAdminPanel } from './components/admin/AdminPanel';
import { renderProductForm } from './components/admin/ProductForm';
import { initLocale, applyTranslations, showLocaleModalIfNeeded } from './utils/i18n';
import { initLanguageSwitcher } from './components/ui/LanguageSwitcher';

export class Router {
static navigate(path: string) {
const app = document.getElementById('app');
if (!app) return;
window.history.pushState({}, '', path);
app.innerHTML = '';
const basePath = path.split('?')[0];
try {
switch (basePath) {
case '/login': renderLogin(app); break;
case '/register': renderRegistration(app); break;
case '/main': case '/': renderHome(app); break;
case '/profile': renderProfile(app); break;
case '/delivery': renderDelivery(app); break;
case '/product': renderProduct(app); break;
case '/admin': renderAdminPanel(app); break;
case '/admin/products':
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
renderProductForm(app, id ? parseInt(id) : undefined);
break;
default: renderLogin(app);
}
// После рендера применяем переводы
applyTranslations(app);
} catch (err) {
console.error('Render error:', err);
app.innerHTML = '<div style="color:red; padding:20px;">Ошибка загрузки страницы. Проверьте консоль.</div>';
}
}
}

window.addEventListener('popstate', () => Router.navigate(window.location.pathname));

document.addEventListener('DOMContentLoaded', async () => {
await initLocale();
showLocaleModalIfNeeded();
initLanguageSwitcher();
const currentPath = window.location.pathname;
Router.navigate(currentPath === '/' ? '/main' : currentPath);
});