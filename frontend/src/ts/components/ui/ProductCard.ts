import { Product } from '../../types/api';

/**
 * Создаёт DOM-элемент карточки товара для сетки каталога.
 * @param {Product} product Объект товара.
 * @param {(id: number) => void} onNavigate Колбэк при клике на карточку.
 * @returns {HTMLDivElement} DOM-элемент карточки.
 */
export function createProductCard(
  product: Product,
  onNavigate: (id: number) => void
): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.cursor = 'pointer';
  card.innerHTML = `
    <img src="${product.images?.preview || ''}" alt="${product.title}" class="product-card__img" />
    <div class="product-card__body">
      <h3 class="product-card__title">${product.title}</h3>
      <p class="product-card__price">${product.price} BYN</p>
      ${product.isAvailable
        ? '<span class="product-card__badge available">В наличии</span>'
        : '<span class="product-card__badge unavailable">Нет в наличии</span>'
      }
    </div>
  `;
  card.addEventListener('click', () => onNavigate(product.id));
  return card;
}