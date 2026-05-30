import '../../../CSS/style_main.css';
import { Router } from '../../main';
import { Product } from '../../types/api';
import { responseToJson } from '../../utils/api';
import { createProductCard } from '../ui/ProductCard';
import homeHtml from './home.html?raw';
import { injectCartModal, openCartModal, addToCartApi, updateCartCounter } from './cartComponent';
import { loadRecommendations, updateLastVisit } from './Recommendations';
import { applyTranslations, t } from '../../utils/i18n';

const API_BASE_URL = 'http://localhost:3000/api';
let isUserAuthorized = false;
let currentUserRole: string | null = null;

async function checkAuthStatus(): Promise<boolean> {
try {
const res = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
if (res.ok) {
const user = await res.json();
currentUserRole = user.role || 'user';
isUserAuthorized = true;
return true;
}
isUserAuthorized = false;
return false;
} catch (e) {
isUserAuthorized = false;
return false;
}
}

export async function renderHome(container: HTMLElement) {
await checkAuthStatus();
updateLastVisit();

container.innerHTML = homeHtml;
applyTranslations(container); // применяем локализацию к HTML
injectCartModal(container);

const profileBtnText = document.getElementById('profileBtnText');
if (profileBtnText) {
profileBtnText.textContent = isUserAuthorized ? t('profile') : t('login');
}

// Показываем админ-ссылку для admin И manager
if (currentUserRole === 'admin' || currentUserRole === 'manager') {
const adminLink = document.createElement('a');
adminLink.href = '#';
adminLink.textContent = currentUserRole === 'admin' ? t('admin_panel') : t('manager_panel');
adminLink.style.marginLeft = '15px';
adminLink.style.color = '#f91155';
adminLink.style.fontWeight = 'bold';
adminLink.addEventListener('click', (e) => {
e.preventDefault();
Router.navigate('/admin');
});
const headerActions = document.querySelector('.header-actions');
if (headerActions) headerActions.appendChild(adminLink);
}

initEventListeners();
await loadCategories();
await loadProducts();

if (isUserAuthorized) {
updateCartCounter();
const productsGrid = document.getElementById('productsGrid');
if (productsGrid && productsGrid.parentElement) {
await loadRecommendations(productsGrid.parentElement);
}
}
}

function initEventListeners() {
document.getElementById('profileButton')?.addEventListener('click', (e) => {
e.preventDefault();
Router.navigate(isUserAuthorized ? '/profile' : '/login');
});

document.getElementById('openCartBtn')?.addEventListener('click', async (e) => {
e.preventDefault();
if (!isUserAuthorized) { Router.navigate('/login'); return; }
openCartModal();
});

const productsGrid = document.getElementById('productsGrid');
if (productsGrid) {
productsGrid.addEventListener('click', async (e) => {
const target = e.target as HTMLElement;
const card = target.closest('.product-card');
const addBtn = card?.querySelector('.add-btn');
const productId = parseInt(addBtn?.getAttribute('data-id') || '0');

if (target.classList.contains('add-btn')) {
e.preventDefault();
if (!isUserAuthorized) { Router.navigate('/login'); return; }
if (productId > 0) await addToCartApi(productId);
} else if (card && productId > 0) {
Router.navigate(`/product?id=${productId}`);
}
});
}

document.getElementById('applyFiltersBtn')?.addEventListener('click', loadProducts);
document.getElementById('sortSelect')?.addEventListener('change', loadProducts);
document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
if (e.key === 'Enter') handleSearch();
});
}

async function loadCategories() {
try {
const res = await fetch(`${API_BASE_URL}/products`);
const data = await responseToJson(res);
const productsArray: Product[] = Array.isArray(data) ? data : (data ? [data] : []);
const uniqueCategories = new Set<string>();
productsArray.forEach(p => {
if (p.categories && Array.isArray(p.categories)) {
p.categories.forEach(c => uniqueCategories.add(c));
}
});

const select = document.getElementById('categoryFilter');
if (select) {
select.innerHTML = `<option value="">${t('filter_category')}</option>`;
uniqueCategories.forEach(cat => {
select.innerHTML += `<option value="${cat}">${cat}</option>`;
});
}
} catch (e) {
console.error("Не удалось загрузить категории:", e);
const select = document.getElementById('categoryFilter');
if (select) select.innerHTML = `<option value="">${t('error')}</option>`;
}
}

async function handleSearch() {
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const query = searchInput ? searchInput.value.trim() : '';
if (!query) return loadProducts();

const grid = document.getElementById('productsGrid');
if (!grid) return;
clearContainer(grid);
grid.appendChild(createLoader());

try {
const [nameRes, descRes] = await Promise.all([
fetch(`${API_BASE_URL}/products/by-name?name=${encodeURIComponent(query)}`),
fetch(`${API_BASE_URL}/products/by-description?description=${encodeURIComponent(query)}`)
]);
const nameData = await responseToJson(nameRes);
const descData = await responseToJson(descRes);
const nameProducts: Product[] = Array.isArray(nameData) ? nameData : (nameData ? [nameData] : []);
const descProducts: Product[] = Array.isArray(descData) ? descData : (descData ? [descData] : []);
const combinedProducts = [...nameProducts, ...descProducts];
const uniqueProductsMap = new Map<number, Product>();
combinedProducts.forEach(product => {
if (product && product.id) uniqueProductsMap.set(product.id, product);
});
renderProductCards(Array.from(uniqueProductsMap.values()));
} catch (error) {
console.error("Ошибка при поиске:", error);
clearContainer(grid);
const errorMsg = document.createElement('p');
errorMsg.style.color = 'red';
errorMsg.style.textAlign = 'center';
errorMsg.textContent = t('error_search');
grid.appendChild(errorMsg);
}
}

async function loadProducts(): Promise<void> {
const grid = document.getElementById('productsGrid');
if (!grid) return;
const sort = (document.getElementById('sortSelect') as HTMLSelectElement)?.value || '';
const category = (document.getElementById('categoryFilter') as HTMLSelectElement)?.value || '';
const minPrice = (document.getElementById('minPrice') as HTMLInputElement)?.value || '';
const maxPrice = (document.getElementById('maxPrice') as HTMLInputElement)?.value || '';
const isAvailable = (document.getElementById('isAvailable') as HTMLInputElement)?.checked || false;

clearContainer(grid);
grid.appendChild(createLoader());

try {
let url = `${API_BASE_URL}/products`;
if (category || minPrice || maxPrice || isAvailable) {
const params = new URLSearchParams();
if (category) params.append('category', category);
if (minPrice) params.append('minPrice', minPrice);
if (maxPrice) params.append('maxPrice', maxPrice);
if (isAvailable) params.append('isAvailable', 'true');
url = `${API_BASE_URL}/products/fillters?${params.toString()}`;
} else if (sort === 'asc') {
url = `${API_BASE_URL}/products/ascending`;
} else if (sort === 'desc') {
url = `${API_BASE_URL}/products/descending`;
}
const res = await fetch(url);
let products: Product[] = await responseToJson(res);
if ((category || minPrice || maxPrice || isAvailable) && sort) {
products.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
}
renderProductCards(products);
} catch (error) {
clearContainer(grid);
const errorMsg = document.createElement('p');
errorMsg.style.color = 'red';
errorMsg.textContent = t('error_load_products');
grid.appendChild(errorMsg);
}
}

function renderProductCards(products: Product[]): void {
const grid = document.getElementById('productsGrid');
if (!grid) return;
clearContainer(grid);
if (!products || products.length === 0) {
const emptyMsg = document.createElement('p');
emptyMsg.className = 'empty-state';
emptyMsg.textContent = t('nothing_found');
grid.appendChild(emptyMsg);
return;
}
products.forEach(product => {
const card = createProductCard(product, (id) => Router.navigate(`/product?id=${id}`));
grid.appendChild(card);
});
}

function clearContainer(container: HTMLElement) {
while (container.firstChild) {
container.removeChild(container.firstChild);
}
}

function createLoader(): HTMLElement {
const loader = document.createElement('div');
loader.className = 'loading-spinner';
loader.textContent = t('loading');
return loader;
}