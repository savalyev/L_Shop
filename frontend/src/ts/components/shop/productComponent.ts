import '../../../CSS/style_main.css';
import { Router } from '../../main';
import { Product } from '../../types/api';
import { responseToJson } from '../../utils/api';
import productHtml from './product.html?raw';
import { injectCartModal, openCartModal, addToCartApi, updateCartCounter } from './cartComponent';
import { renderComments } from './Comments';
import { saveProductView, saveProductLike } from './Recommendations';
import { t, applyTranslations } from '../../utils/i18n';

const API_BASE_URL = 'http://localhost:3000/api';

export async function renderProduct(container: HTMLElement): Promise<void> {
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
if (!productId) {
Router.navigate('/main');
return;
}
container.innerHTML = productHtml;
applyTranslations(container);
injectCartModal(container);
initEventListeners();
await loadAndRenderProductDetails(productId);
}

function initEventListeners() {
document.getElementById('goHome')?.addEventListener('click', (e) => {
e.preventDefault();
Router.navigate('/main');
});
document.getElementById('goBackBtn')?.addEventListener('click', () => {
Router.navigate('/main');
});
document.getElementById('openCartBtn')?.addEventListener('click', async (e) => {
e.preventDefault();
const authRes = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
if (!authRes.ok) {
Router.navigate('/login');
return;
}
openCartModal();
});
}

async function loadAndRenderProductDetails(productId: string) {
const productContainer = document.getElementById('productContainer');
if (!productContainer) return;
try {
const res = await fetch(`${API_BASE_URL}/products/${productId}`);
const text = await res.text();
const rawData = text ? JSON.parse(text) : {};
const product: Product = rawData.data !== undefined ? rawData.data : rawData;
if (!product || !product.id) {
productContainer.innerHTML = `<h2>${t('error')}</h2>`;
return;
}
// Сохраняем просмотр товара для рекомендаций
saveProductView(product.id);

const authRes = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
const isLoggedIn = authRes.ok;
if (isLoggedIn) updateCartCounter();
renderProductHTML(productContainer, product, isLoggedIn, product.id);
} catch (e) {
productContainer.innerHTML = `<p style="color: red;">${t('error_load_products')}</p>`;
}
}

function renderProductHTML(container: HTMLElement, product: Product, isLoggedIn: boolean, productId: number) {
while (container.firstChild) container.removeChild(container.firstChild);
const mainDiv = document.createElement('div');
mainDiv.style.cssText = 'display: flex; gap: 40px; flex-wrap: wrap; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);';

const leftCol = document.createElement('div');
leftCol.style.cssText = 'flex: 1; min-width: 300px;';
const img = document.createElement('img');
img.src = product.images?.preview || '';
img.alt = product.title;
img.style.cssText = 'width: 100%; border-radius: 12px; object-fit: cover; aspect-ratio: 1/1; border: 1px solid #eee;';
leftCol.appendChild(img);

const rightCol = document.createElement('div');
rightCol.style.cssText = 'flex: 1.5; min-width: 300px; display: flex; flex-direction: column; gap: 20px;';
const title = document.createElement('h1');
title.style.cssText = 'margin: 0; font-size: 32px; color: #333;';
title.textContent = product.title;
rightCol.appendChild(title);

const categoriesDiv = document.createElement('div');
categoriesDiv.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';
if (product.categories) {
product.categories.forEach(c => {
const span = document.createElement('span');
span.style.cssText = 'background: #f0f0f0; padding: 5px 12px; border-radius: 20px; font-size: 14px;';
span.textContent = c;
categoriesDiv.appendChild(span);
});
}
rightCol.appendChild(categoriesDiv);

const desc = document.createElement('p');
desc.style.cssText = 'font-size: 18px; color: #555; line-height: 1.6;';
desc.textContent = product.description;
rightCol.appendChild(desc);

if (product.delivery) {
const deliveryDiv = document.createElement('div');
deliveryDiv.style.cssText = 'background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px;';
const strong = document.createElement('strong');
strong.textContent = `📦 ${t('delivery_info')}:`;
deliveryDiv.appendChild(strong);
deliveryDiv.appendChild(document.createElement('br'));
deliveryDiv.appendChild(document.createTextNode(`${t('from')}: ${product.delivery.startTown.town} (${product.delivery.startTown.country})`));
deliveryDiv.appendChild(document.createElement('br'));
deliveryDiv.appendChild(document.createTextNode(`${t('cost')}: ${product.delivery.price} BYN`));
rightCol.appendChild(deliveryDiv);
}

const actionDiv = document.createElement('div');
actionDiv.style.cssText = 'margin-top: auto; display: flex; align-items: center; gap: 30px; flex-wrap: wrap;';
const priceSpan = document.createElement('div');
priceSpan.style.cssText = 'font-size: 36px; font-weight: bold; color: #f91155;';
priceSpan.textContent = `${product.price} BYN`;
actionDiv.appendChild(priceSpan);

const addBtn = document.createElement('button');
addBtn.id = 'addToCartDetailBtn';
addBtn.setAttribute('data-id', String(product.id));
addBtn.style.cssText = 'padding: 15px 40px; font-size: 18px; background: #f91155; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;';
addBtn.textContent = t('add_to_cart');
addBtn.addEventListener('click', async () => {
if (!isLoggedIn) {
Router.navigate('/login');
return;
}
await addToCartApi(product.id, true);
});
actionDiv.appendChild(addBtn);

if (isLoggedIn) {
const likeBtn = document.createElement('button');
likeBtn.id = 'likeProductBtn';
likeBtn.style.cssText = 'padding: 15px 20px; font-size: 18px; background: #fff; color: #f91155; border: 2px solid #f91155; border-radius: 8px; cursor: pointer;';
likeBtn.textContent = '👍 Нравится';
likeBtn.addEventListener('click', async () => {
await fetch(`${API_BASE_URL}/recommendations/like/${product.id}`, { method: 'POST', credentials: 'include' });
saveProductLike(product.id); // сохраняем лайк локально
alert('Рекомендации обновлены');
});
actionDiv.appendChild(likeBtn);
}

rightCol.appendChild(actionDiv);
mainDiv.appendChild(leftCol);
mainDiv.appendChild(rightCol);
container.appendChild(mainDiv);

const commentSection = document.createElement('div');
commentSection.id = 'commentSection';
container.appendChild(commentSection);
renderComments(productId, commentSection, isLoggedIn);
}