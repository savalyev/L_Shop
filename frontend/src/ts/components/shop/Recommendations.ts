import { Product } from '../../types/api';
import { createProductCard } from '../ui/ProductCard';
import { Router } from '../../main';
import { t } from '../../utils/i18n';

const VIEWED_KEY = 'viewed_products';
const LIKES_KEY = 'liked_products';

// Сохраняем просмотр товара
export function saveProductView(productId: number) {
const viewed = getViewedProducts();
const now = Date.now();
const existingIndex = viewed.findIndex(v => v.id === productId);
if (existingIndex !== -1) {
viewed[existingIndex].timestamp = now;
} else {
viewed.push({ id: productId, timestamp: now });
}
// Ограничим массив 50 последними
if (viewed.length > 50) viewed.shift();
localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
}

// Сохраняем лайк товара
export function saveProductLike(productId: number) {
const likes = getLikedProducts();
const now = Date.now();
const existingIndex = likes.findIndex(l => l.id === productId);
if (existingIndex !== -1) {
likes[existingIndex].timestamp = now;
} else {
likes.push({ id: productId, timestamp: now });
}
localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
}

function getViewedProducts(): { id: number; timestamp: number }[] {
const raw = localStorage.getItem(VIEWED_KEY);
return raw ? JSON.parse(raw) : [];
}

function getLikedProducts(): { id: number; timestamp: number }[] {
const raw = localStorage.getItem(LIKES_KEY);
return raw ? JSON.parse(raw) : [];
}

// Получить рекомендуемые товары с учётом "умирания" и частых просмотров
export async function loadRecommendations(container: HTMLElement) {
try {
const res = await fetch('http://localhost:3000/api/recommendations/my', { credentials: 'include' });
if (!res.ok) return;
let products: Product[] = await res.json();
if (!products.length) return;

const now = Date.now();
const threeDays = 3 * 24 * 60 * 60 * 1000;
const lastVisit = getLastVisit();

// Фильтрация по "умиранию": если пользователь не заходил 3 дня, убираем старые лайки/просмотры
let activeLikes = getLikedProducts();
if (lastVisit && (now - lastVisit) > threeDays) {
// Если не заходил больше 3 дней – сбрасываем историю лайков и просмотров
localStorage.removeItem(LIKES_KEY);
localStorage.removeItem(VIEWED_KEY);
activeLikes = [];
} else {
// Убираем лайки старше 3 дней
activeLikes = activeLikes.filter(like => (now - like.timestamp) <= threeDays);
localStorage.setItem(LIKES_KEY, JSON.stringify(activeLikes));
}

// Сортировка: сначала товары, которые были лайкнуты, потом часто просматриваемые
const likedIds = activeLikes.map(l => l.id);
const viewed = getViewedProducts();
const viewedIds = viewed.map(v => v.id);

products.sort((a, b) => {
const aLiked = likedIds.includes(a.id);
const bLiked = likedIds.includes(b.id);
if (aLiked && !bLiked) return -1;
if (!aLiked && bLiked) return 1;
const aViewed = viewedIds.includes(a.id);
const bViewed = viewedIds.includes(b.id);
if (aViewed && !bViewed) return -1;
if (!aViewed && bViewed) return 1;
return 0;
});

// Показываем не более 6 рекомендаций
const recsToShow = products.slice(0, 6);

const recTitle = document.createElement('h3');
recTitle.textContent = t('recommended');
recTitle.style.margin = '40px 0 20px';
recTitle.setAttribute('data-i18n', 'recommended');
container.appendChild(recTitle);
const grid = document.createElement('div');
grid.className = 'products-grid';
recsToShow.forEach(p => {
const card = createProductCard(p, (id) => Router.navigate(`/product?id=${id}`));
grid.appendChild(card);
});
container.appendChild(grid);
} catch (e) {
console.error('Recommendations error', e);
}
}

function getLastVisit(): number | null {
const last = localStorage.getItem('last_visit');
return last ? parseInt(last) : null;
}

// Вызывать при каждом заходе на главную
export function updateLastVisit() {
localStorage.setItem('last_visit', Date.now().toString());
}