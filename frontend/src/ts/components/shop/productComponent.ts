// src/ts/components/shop/productComponent.ts
import '../../../CSS/style_main.css'; 
import { Router } from '../../main';

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
    // Получаем ID из URL (например, /product?id=5)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        Router.navigate('/main');
        return;
    }

    container.innerHTML = `
        <header class="shop-header">
            <div class="container header-inner">
                <a href="#" id="goHome" class="shop-logo">REUTKUPI</a>
                <div class="header-actions">
                    <button class="action-btn" id="goBackBtn">⬅ Назад в каталог</button>
                </div>
            </div>
        </header>
        <main class="container" id="productContainer" style="padding: 40px 15px;">
            <div class="loading-spinner"></div>
        </main>
    `;

    document.getElementById('goHome')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/main');
    });

    document.getElementById('goBackBtn')?.addEventListener('click', () => {
        Router.navigate('/main');
    });

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

        // Рендерим саму карточку (по ТЗ оставляем data-title и data-price)
        productContainer.innerHTML = `
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

        document.getElementById('addToCartDetailBtn')?.addEventListener('click', async () => {
            // Проверяем авторизацию перед добавлением
            const authRes = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
            if (!authRes.ok) {
                Router.navigate('/login');
                return;
            }

            try {
                const addRes = await fetch(`${API_BASE_URL}/basket/add-to-basket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id }), 
                    credentials: 'include'
                });
                if (addRes.ok) alert('Товар добавлен в корзину!');
            } catch (e) {
                console.error('Сбой добавления');
            }
        });

    } catch (e) {
        productContainer.innerHTML = `<p style="color: red;">Ошибка загрузки товара</p>`;
    }
}