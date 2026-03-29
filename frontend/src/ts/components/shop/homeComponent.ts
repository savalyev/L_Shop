import '../../../CSS/style_main.css';
import { Router } from '../../main';

// Используем alias, который мы настроили в tsconfig.json
import type { Product } from '@backend/models/model';

const API_BASE_URL = 'http://localhost:3000/api';


export function renderHome(container: HTMLElement) {
    container.innerHTML = `
        <!-- Top Header -->
        <div class="top-header">
            <div class="container">
                <div class="location-info">
                    <span>📍</span>
                    <span class="location-text">Минск</span>
                </div>
                <div class="user-links">
                    <a href="#" onclick="return false"><span>📦</span> Заказы</a>
                    <a href="#" onclick="return false"><span>👤</span> Личный кабинет</a>
                    <a href="#" id="openCartTop" onclick="return false"><span>🛒</span> Корзина</a>
                </div>
            </div>
        </div>

        <!-- Main Header -->
        <div class="main-header">
            <div class="container">
                <a href="#" class="logo" onclick="return false">REUTKUPI</a>
                
                <button class="catalog-btn">
                    <span>☰</span> Каталог
                </button>
                
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Найти товар...">
                    <button id="searchBtn">🔍</button>
                </div>
                
                <div class="header-icons">
                    <div class="header-icon" id="openCartBtn">
                        <span>🛒</span>
                        <span>Корзина</span>
                        <span class="cart-count" id="cartCount">0</span>
                    </div>
                    <div class="auth-buttons">
                        <button class="login-btn" id="loginButton">
                            <span>🔑</span>
                            <span id="authButtonText">Войти</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container" id="mainContent">
            <h2>Каталог товаров</h2>
            <!-- Сетка для динамических товаров -->
            <div id="productsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; padding: 20px 0;">
                <p id="loadingText">Загрузка товаров...</p>
            </div>
        </div>

        <!-- Footer -->
        <footer>
            <!-- Твой футер... (я оставил структуру для краткости) -->
            <div class="container">
                <p>© 2025 REUTKUPI - Ваш интернет-магазин.</p>
            </div>
        </footer>

        <!-- Cart Modal -->
        <div id="cartModal" class="modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 500px; border-radius: 8px;">
                <span class="close" id="closeCartBtn" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                <h2>Корзина</h2>
                <div id="cartItems">
                    <p>Ваша корзина пуста</p>
                </div>
                <div class="cart-total" id="cartTotal" style="margin-top: 20px; font-weight: bold; font-size: 18px;">Итого: 0 BYN</div>
                <button class="checkout-btn" id="checkoutBtn" style="margin-top: 15px; width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Перейти к оформлению</button>
            </div>
        </div>
    `;

    // Логика перехода на авторизацию
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            Router.navigate('/login');
        });
    }

    // Логика модалки
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.getElementById('closeCartBtn');
    
    document.getElementById('openCartBtn')?.addEventListener('click', () => {
        if (cartModal) cartModal.style.display = 'block';
    });
    
    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) cartModal.style.display = 'none';
        });
    }

    // 2. ВЫЗЫВАЕМ ЗАГРУЗКУ ТОВАРОВ
    loadProducts();
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        // 3. ИСПРАВЛЕННЫЙ ПАРСИНГ
        const data = await response.json();
        
        // В зависимости от того, как контроллер отправляет (res.json(data) или res.json({data: data}))
        const products: Product[] = Array.isArray(data) ? data : data.data;

        if (!products || products.length === 0) {
            grid.innerHTML = '<p>Товары не найдены.</p>';
            return;
        }

        grid.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('div');
            card.style.cssText = 'border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; background: white;';
            
            card.innerHTML = `
                <img src="${product.images?.preview || ''}" alt="${product.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;">
                <h3 data-title style="font-size: 16px; margin: 10px 0;">${product.title}</h3>
                <p style="font-size: 12px; color: #666; height: 40px; overflow: hidden;">${product.description}</p>
                <div data-price style="font-size: 18px; font-weight: bold; margin: 10px 0;">
                    ${product.price} BYN
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    В корзину
                </button>
            `;
            grid.appendChild(card);
        });

        // Слушатели кнопок корзины
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const productId = target.getAttribute('data-id');
                alert(`Товар с ID ${productId} добавлен! (тут будет POST запрос)`);
            });
        });

    } catch (error) {
        console.error('Ошибка:', error);
        grid.innerHTML = '<p style="color: red;">Не удалось загрузить товары.</p>';
    }
}