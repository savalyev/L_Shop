import { Product } from '../../types/api';
import { t } from '../../utils/i18n';

export function createProductCard(
product: Product,
onNavigate: (id: number) => void
): HTMLDivElement {
const card = document.createElement('div');
card.className = 'product-card';
card.style.cursor = 'pointer';

const img = document.createElement('img');
img.src = product.images?.preview || '';
img.alt = product.title;
img.className = 'product-card__img';
img.style.cssText = 'width:100%; height:200px; object-fit:contain; margin-bottom:15px;';

const body = document.createElement('div');
body.className = 'product-card__body';

const title = document.createElement('h3');
title.className = 'product-card__title';
title.textContent = product.title;
title.style.cssText = 'font-size:15px; font-weight:600; margin:0 0 8px; height:44px; overflow:hidden;';

const price = document.createElement('p');
price.className = 'product-card__price';
price.textContent = `${product.price} BYN`;
price.style.cssText = 'font-size:20px; font-weight:800; margin:0;';

const badge = document.createElement('span');
badge.className = `product-card__badge ${product.isAvailable ? 'available' : 'unavailable'}`;
badge.textContent = product.isAvailable ? t('in_stock') : t('out_of_stock');
badge.style.cssText = 'display:inline-block; margin-top:8px; padding:4px 8px; border-radius:4px; font-size:12px; background:#e0e0e0;';

// Кнопка "В корзину"
const addBtn = document.createElement('button');
addBtn.textContent = t('add_to_cart');
addBtn.className = 'add-btn';
addBtn.setAttribute('data-id', String(product.id));
addBtn.style.cssText = 'margin-top: 10px; background: #f91155; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer;';
addBtn.addEventListener('click', (e) => {
e.stopPropagation();
// Эмуляция добавления в корзину (обработчик в homeComponent)
const event = new CustomEvent('add-to-cart', { detail: { productId: product.id } });
card.dispatchEvent(event);
});

body.append(title, price, badge, addBtn);
card.append(img, body);

card.addEventListener('click', () => onNavigate(product.id));
return card;
}