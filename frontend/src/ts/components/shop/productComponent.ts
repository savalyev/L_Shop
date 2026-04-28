// src/ts/components/shop/productComponent.ts
import '../../../CSS/style_main.css'; 
import { Router } from '../../main';
import productHtml from './product.html?raw';

// Импортируем нашу общую логику корзины
import { injectCartModal, openCartModal, addToCartApi, updateCartCounter } from './cartComponent';

const API_BASE_URL = 'http://localhost:3000/api';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    categories?: string[];
    images?: { preview: string; };
    delivery?: { startTown: { town: string; country: string }; earlyDate: Date; price: number };
    discount?: number;
    isAvailable?: boolean;
}

export async function renderProduct(container: HTMLElement) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        Router.navigate('/main');
        return;
    }

    // 1. Вставляем каркас страницы
    container.innerHTML = productHtml;

    // 2. Инжектируем модалку корзины
    injectCartModal(container);

    // 3. Инициализируем навигацию и корзину
    initEventListeners();

    // 4. Загружаем данные товара
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

    // Открытие модалки корзины
    document.getElementById('openCartBtn')?.addEventListener('click', async (e) => { 
        e.preventDefault();
        // Проверяем авторизацию перед открытием
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
            productContainer.innerHTML = `<h2>Товар не найден</h2>`;
            return;
        }

        // Обновляем счетчик корзины, если пользователь авторизован
        const authRes = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
        if (authRes.ok) {
            updateCartCounter();
        }

        // Рендерим детали товара
        renderProductHTML(productContainer, product);

        // Вешаем слушатель на кнопку добавления
        document.getElementById('addToCartDetailBtn')?.addEventListener('click', async () => {
            if (!authRes.ok) {
                Router.navigate('/login');
                return;
            }
            // Используем импортированную функцию из cartComponent!
            await addToCartApi(product.id, true);
        });

    } catch (e) {
        productContainer.innerHTML = `<p style="color: red;">Ошибка загрузки товара</p>`;
    }
}

function renderProductHTML(container: HTMLElement, product: Product) {
    container.innerHTML = `
        <div style="display: flex; gap: 40px; flex-wrap: wrap; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="flex: 1; min-width: 300px;">
                <img src="${product.images?.preview || ''}" alt="${product.title}" style="width: 100%; border-radius: 12px; object-fit: cover; aspect-ratio: 1/1; border: 1px solid #eee;">
            </div>
            
            <div style="flex: 1.5; min-width: 300px; display: flex; flex-direction: column; gap: 20px;">
                <h1 data-title style="margin: 0; font-size: 32px; color: #333;">${product.title}</h1>
                
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${product.categories?.map(c => `<span style="background: #f0f0f0; padding: 5px 12px; border-radius: 20px; font-size: 14px; color: #666;">${c}</span>`).join('') || ''}
                </div>

                <p style="font-size: 18px; color: #555; line-height: 1.6; margin: 0;">${product.description}</p>
                
                ${product.delivery ? `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px; color: #555;">
                    <strong>📦 Информация о доставке:</strong><br>
                    Откуда: ${product.delivery.startTown.town} (${product.delivery.startTown.country})<br>
                    Стоимость: ${product.delivery.price} BYN
                </div>` : ''}

                <div style="margin-top: auto; display: flex; align-items: center; gap: 30px;">
                    <div data-price style="font-size: 36px; font-weight: bold; color: #f91155;">${product.price} BYN</div>
                    <button id="addToCartDetailBtn" data-id="${product.id}" style="padding: 15px 40px; font-size: 18px; background: #f91155; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.3s;">
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    `;
}