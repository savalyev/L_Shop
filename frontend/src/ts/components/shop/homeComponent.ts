// src/ts/components/shop/homeComponent.ts
import '../../../CSS/style_main.css'; 
import { Router } from '../../main';
import homeHtml from './home.html?raw';

// ИМПОРТИРУЕМ ЛОГИКУ КОРЗИНЫ
import { injectCartModal, openCartModal, addToCartApi, updateCartCounter, Product } from './cartComponent';

const API_BASE_URL = 'http://localhost:3000/api';
let isUserAuthorized = false;

// --- АВТОРИЗАЦИЯ ---
async function checkAuthStatus(): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/users/me`, { credentials: 'include' });
        isUserAuthorized = res.ok;
        return res.ok;
    } catch (e) {
        isUserAuthorized = false;
        return false;
    }
}

// --- УТИЛИТА ---
async function responseToJson(res: Response) {
    const text = await res.text();
    if (!text) return {};
    try {
        const data = JSON.parse(text);
        return data.data !== undefined ? data.data : data; 
    } catch(e) { return {}; }
}

// --- ГЛАВНАЯ ФУНКЦИЯ РЕНДЕРА ---
export async function renderHome(container: HTMLElement) {
    await checkAuthStatus();

    // 1. Вставляем базовый HTML
    container.innerHTML = homeHtml;

    // 2. Инжектируем HTML модалки корзины
    injectCartModal(container);

    // 3. Обновляем кнопку профиля
    const profileBtnText = document.getElementById('profileBtnText');
    if (profileBtnText) {
        profileBtnText.textContent = isUserAuthorized ? 'Профиль' : 'Войти';
    }

    // 4. Инициализируем слушатели событий страницы
    initEventListeners();

    // 5. Загружаем данные
    await loadCategories(); 
    loadProducts();        
    if (isUserAuthorized) updateCartCounter();
}

// --- ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ ---
function initEventListeners() {
    // Профиль
    document.getElementById('profileButton')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate(isUserAuthorized ? '/profile' : '/login');
    });

    // Открытие корзины (через импортированную функцию)
    document.getElementById('openCartBtn')?.addEventListener('click', (e) => { 
        e.preventDefault();
        if (!isUserAuthorized) { Router.navigate('/login'); return; }
        openCartModal(); 
    });

    // Делегирование на карточки товаров
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
                if (productId > 0) await addToCartApi(productId); // Импортированная функция
            } 
            else if (card && productId > 0) {
                Router.navigate(`/product?id=${productId}`);
            }
        });
    }

    // Поиск и фильтры
    document.getElementById('applyFiltersBtn')?.addEventListener('click', loadProducts);
    document.getElementById('sortSelect')?.addEventListener('change', loadProducts);
    document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// --- ДИНАМИЧЕСКИЕ КАТЕГОРИИ ИЗ БД ---
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
            select.innerHTML = '<option value="">Все категории</option>';
            uniqueCategories.forEach(cat => {
                select.innerHTML += `<option value="${cat}">${cat}</option>`;
            });
        }
    } catch (e) {
        console.error("Не удалось загрузить категории:", e);
        const select = document.getElementById('categoryFilter');
        if (select) select.innerHTML = '<option value="">Ошибка загрузки</option>';
    }
}

// --- ПОИСК И КАТАЛОГ ---
async function handleSearch() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (!query) return loadProducts();

    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading-spinner"></div>';

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
            if (product && product.id) {
                uniqueProductsMap.set(product.id, product);
            }
        });

        const finalProducts = Array.from(uniqueProductsMap.values());
        renderProductCards(finalProducts);
    } catch (error) {
        console.error("Ошибка при поиске:", error);
        grid.innerHTML = '<p style="color: red; text-align: center;">Ошибка поиска</p>';
    }
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const sort = (document.getElementById('sortSelect') as HTMLSelectElement)?.value || '';
    const category = (document.getElementById('categoryFilter') as HTMLSelectElement)?.value || '';
    const minPrice = (document.getElementById('minPrice') as HTMLInputElement)?.value || '';
    const maxPrice = (document.getElementById('maxPrice') as HTMLInputElement)?.value || '';
    const isAvailable = (document.getElementById('isAvailable') as HTMLInputElement)?.checked || false;
    
    grid.innerHTML = '<div class="loading-spinner"></div>';

    try {
        let url = `${API_BASE_URL}/products`;
        
        if (category || minPrice || maxPrice || isAvailable) {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            if (isAvailable) params.append('isAvailable', 'true');
            
            url = `${API_BASE_URL}/products/fillters?${params.toString()}`;
        } 
        else if (sort === 'asc') {
            url = `${API_BASE_URL}/products/ascending`;
        } else if (sort === 'desc') {
            url = `${API_BASE_URL}/products/descending`;
        }

        const res = await fetch(url);
        const products: Product[] = await responseToJson(res);

        if ((category || minPrice || maxPrice || isAvailable) && sort) {
            products.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
        }

        renderProductCards(products);
    } catch (error) {
        grid.innerHTML = '<p style="color: red;">Ошибка загрузки товаров</p>';
    }
}

function renderProductCards(products: Product[]) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (!products || products.length === 0) {
        grid.innerHTML = '<p class="empty-state">Ничего не найдено по этим фильтрам</p>';
        return;
    }

    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <img src="${product.images?.preview || ''}" class="product-img" alt="${product.title}">
            <div data-title class="product-title">${product.title}</div>
            <div class="product-desc">${product.description}</div>
            <div class="product-bottom">
                <div data-price class="product-price">${product.price} BYN</div>
                <button class="add-btn" data-id="${product.id}">В корзину</button>
            </div>
        `;
        grid.appendChild(card);
    });
}