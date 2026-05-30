import { setLocale as setLocaleCookie, getLocale as getLocaleCookie } from './cookieLocale';

const translations: Record<string, Record<string, string>> = {
ru: {
// Общие
cart: "Корзина",
profile: "Профиль",
login: "Войти",
logout: "Выйти",
add_to_cart: "В корзину",
search: "Искать",
sort_default: "Сортировка: По умолчанию",
sort_asc: "Сначала дешевле",
sort_desc: "Сначала дороже",
filter_category: "Все категории",
filter_available: "Только в наличии",
apply: "Применить",
recommended: "Рекомендуем",
comments: "Комментарии",
rate: "Оценить",
leave_comment: "Оставить комментарий",
average_rating: "Средняя оценка",
loading: "Загрузка...",
nothing_found: "Ничего не найдено",
error: "Ошибка",
error_search: "Ошибка поиска",
error_load_products: "Ошибка загрузки товаров",
back_to_main: "← На главную",
back: "Назад",
catalog_title: "Каталог товаров",
apply_filters: "Применить фильтры",
in_stock: "В наличии",
out_of_stock: "Нет в наличии",
price: "Цена",
delivery_info: "Информация о доставке",
from: "Откуда",
cost: "Стоимость",
checkout: "Оформить доставку",
your_cart: "Ваша корзина",
total: "Итого",
empty_cart: "Ваша корзина пуста",
country: "Страна",
town: "Город",
street: "Улица",
house_number: "Дом/Квартира",
phone: "Телефон для связи",
payment_method: "Способ оплаты",
cash: "Наличными курьеру (онлайн оплата временно недоступна)",
confirm_order: "Подтвердить заказ",
order_success: "Заказ успешно оформлен!",
order_error: "Ошибка при оформлении доставки. Возможно, корзина пуста.",
welcome_back: "С возвращением!",
login_subtitle: "Войдите, чтобы продолжить покупки",
register: "Зарегистрироваться",
register_title: "Создать аккаунт",
register_subtitle: "Присоединяйтесь к нам для удобных покупок",
name: "Имя",
email: "Email",
phone_number: "Телефон",
password: "Пароль",
confirm_password: "Повторите пароль",
password_min: "Мин. 6 символов",
already_have_account: "Уже есть аккаунт?",
no_account: "Ещё нет аккаунта?",
edit: "Редактировать",
delete: "Удалить",
save: "Сохранить",
saving: "Сохранение...",
saved: "Сохранено!",
create_product: "Создать товар",
edit_product: "Редактировать товар",
product_name: "Название",
price_byn: "Цена (BYN)",
description: "Описание",
categories_comma: "Категории (через запятую)",
image_url: "URL изображения",
discount_percent: "Скидка (%)",
name_required: "Название обязательно",
back_to_admin: "← Назад в админку",
admin_panel: "Панель администратора",
manager_panel: "Панель менеджера",
products_management: "Товары",
role_management: "Управление ролями",
make_manager: "Сделать менеджером",
remove_manager: "Убрать менеджера",
role_updated: "Роль обновлена",
network_error: "Ошибка сети",
access_denied: "Доступ запрещён",
comment_added: "Комментарий добавлен",
comment_error: "Ошибка при добавлении комментария",
enter_comment: "Введите текст комментария",
comments_empty: "Нет комментариев. Будьте первым!"
},
en: {
// Common
cart: "Cart",
profile: "Profile",
login: "Login",
logout: "Logout",
add_to_cart: "Add to cart",
search: "Search",
sort_default: "Sort: Default",
sort_asc: "Price: Low to High",
sort_desc: "Price: High to Low",
filter_category: "All categories",
filter_available: "In stock only",
apply: "Apply",
recommended: "Recommended",
comments: "Comments",
rate: "Rate",
leave_comment: "Leave a comment",
average_rating: "Average rating",
loading: "Loading...",
nothing_found: "Nothing found",
error: "Error",
error_search: "Search error",
error_load_products: "Failed to load products",
back_to_main: "← Back to main",
back: "Back",
catalog_title: "Product Catalog",
apply_filters: "Apply filters",
in_stock: "In stock",
out_of_stock: "Out of stock",
price: "Price",
delivery_info: "Delivery info",
from: "From",
cost: "Cost",
checkout: "Checkout",
your_cart: "Your cart",
total: "Total",
empty_cart: "Your cart is empty",
country: "Country",
town: "City",
street: "Street",
house_number: "House/Apt",
phone: "Contact phone",
payment_method: "Payment method",
cash: "Cash on delivery (online payment temporarily unavailable)",
confirm_order: "Confirm order",
order_success: "Order placed successfully!",
order_error: "Error placing order. Maybe your cart is empty.",
welcome_back: "Welcome back!",
login_subtitle: "Log in to continue shopping",
register: "Register",
register_title: "Create account",
register_subtitle: "Join us for convenient shopping",
name: "Name",
email: "Email",
phone_number: "Phone",
password: "Password",
confirm_password: "Confirm password",
password_min: "Min. 6 characters",
already_have_account: "Already have an account?",
no_account: "Don't have an account?",
edit: "Edit",
delete: "Delete",
save: "Save",
saving: "Saving...",
saved: "Saved!",
create_product: "Create product",
edit_product: "Edit product",
product_name: "Name",
price_byn: "Price (BYN)",
description: "Description",
categories_comma: "Categories (comma separated)",
image_url: "Image URL",
discount_percent: "Discount (%)",
name_required: "Name is required",
back_to_admin: "← Back to admin",
admin_panel: "Admin Panel",
manager_panel: "Manager Panel",
products_management: "Products",
role_management: "Role management",
make_manager: "Make manager",
remove_manager: "Remove manager",
role_updated: "Role updated",
network_error: "Network error",
access_denied: "Access denied",
comment_added: "Comment added",
comment_error: "Error adding comment",
enter_comment: "Enter comment text",
comments_empty: "No comments. Be the first!"
}
};

export function setLocale(locale: 'ru' | 'en') {
// Сессионная кука без max-age (удаляется при закрытии браузера)
document.cookie = `locale=${locale}; path=/;`;
}

export function getLocale(): 'ru' | 'en' {
const match = document.cookie.match(/locale=([^;]+)/);
if (match && (match[1] === 'en' || match[1] === 'ru')) return match[1] as 'ru' | 'en';
return 'ru';
}

export function t(key: string): string {
const locale = getLocale();
return translations[locale]?.[key] || translations['ru'][key] || key;
}

// Применяет переводы ко всем элементам с атрибутом data-i18n
export function applyTranslations(root: HTMLElement = document.body) {
const elements = root.querySelectorAll('[data-i18n]');
elements.forEach(el => {
const key = el.getAttribute('data-i18n');
if (key) el.textContent = t(key);
});
// Также обрабатываем placeholder, если нужно
const placeholders = root.querySelectorAll('[data-i18n-placeholder]');
placeholders.forEach(el => {
const key = el.getAttribute('data-i18n-placeholder');
if (key) (el as HTMLInputElement).placeholder = t(key);
});
}

export function showLocaleModalIfNeeded() {
if (document.cookie.includes('locale')) return;

const modal = document.createElement('div');
modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%;
background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
z-index: 10000; font-family: 'Inter', sans-serif;`;
const box = document.createElement('div');
box.style.cssText = `background: white; padding: 30px; border-radius: 16px; max-width: 400px;
text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);`;
box.innerHTML = `
<h3 style="margin-top:0;">🌍 Выберите язык / Choose language</h3>
<div style="display: flex; gap: 20px; justify-content: center; margin: 20px 0;">
<button id="langRu" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #f91155; color: white; border: none; border-radius: 8px;">🇷🇺 Русский</button>
<button id="langEn" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #6c757d; color: white; border: none; border-radius: 8px;">🇬🇧 English</button>
</div>
<p style="font-size: 12px; color: #777;">Выбор сохранится на время сессии</p>
`;
modal.appendChild(box);
document.body.appendChild(modal);
const ruBtn = box.querySelector('#langRu');
const enBtn = box.querySelector('#langEn');
ruBtn?.addEventListener('click', () => {
setLocale('ru');
modal.remove();
location.reload();
});
enBtn?.addEventListener('click', () => {
setLocale('en');
modal.remove();
location.reload();
});
}
export function initLocale(): Promise<void> {
return Promise.resolve();
}