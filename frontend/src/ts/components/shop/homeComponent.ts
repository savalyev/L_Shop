// src/ts/components/shop/homeComponent.ts
import '../../../CSS/style_main.css'; 
import { Router } from '../../main';

// --- СТРОГАЯ ТИПИЗАЦИЯ ---
interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    categories?: string[];
    images?: { preview: string; };
    discount?: number;
    isAvailable?: boolean;
}

interface BasketItem {
    productId: number;
    count: number;
}

interface BasketData {
    id?: number;
    userId?: number;
    basket?: BasketItem[];
}

const API_BASE_URL = 'http://localhost:3000/api';
let isUserAuthorized = false;

// --- ПРОВЕРКА АВТОРИЗАЦИИ ---
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

// --- ГЛАВНАЯ ФУНКЦИЯ РЕНДЕРА ---
export async function renderHome(container: HTMLElement) {
    await checkAuthStatus();

    container.innerHTML = `
        <header class="shop-header">
            <div class="container header-inner">
                <a href="#" class="shop-logo">REUTKUPI</a>
                
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Искать товары (нажмите Enter)...">
                    <button id="searchBtn">🔍</button>
                </div>
                
                <div class="header-actions">
                    <button class="action-btn" id="profileButton">
                        <span>👤</span>
                        <span id="profileBtnText">${isUserAuthorized ? 'Профиль' : 'Войти'}</span>
                    </button>
                    <button class="action-btn" id="openCartBtn">
                        <span>🛒</span>
                        Корзина
                        <div class="cart-badge" id="cartCount">0</div>
                    </button>
                </div>
            </div>
        </header>

        <main class="container">
            <div class="shop-controls" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <h2 class="catalog-title" style="margin: 0;">Каталог товаров</h2>
                    <select id="sortSelect" class="modern-select" style="padding: 8px 12px; border-radius: 6px; border: 1px solid #ddd;">
                        <option value="">Сортировка: По умолчанию</option>
                        <option value="asc">Сначала дешевле</option>
                        <option value="desc">Сначала дороже</option>
                    </select>
                </div>

                <!-- ПАНЕЛЬ ФИЛЬТРОВ (ДИНАМИЧЕСКАЯ) -->
                <div class="filters-panel" style="display: flex; gap: 15px; flex-wrap: wrap; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); align-items: center;">
                    <select id="categoryFilter" class="modern-select" style="flex: 1; min-width: 150px; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
                        <option value="">Загрузка категорий...</option>
                    </select>
                    
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <input type="number" id="minPrice" placeholder="Мин. цена" style="width: 100px; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
                        <span>-</span>
                        <input type="number" id="maxPrice" placeholder="Макс. цена" style="width: 100px; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
                    </div>
                    
                    <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 14px;">
                        <input type="checkbox" id="isAvailable">
                        Только в наличии
                    </label>
                    
                    <button id="applyFiltersBtn" style="padding: 8px 15px; background: #f91155; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-left: auto;">
                        Применить фильтры
                    </button>
                </div>
            </div>

            <div class="products-grid" id="productsGrid">
                <div class="loading-spinner"></div>
            </div>
        </main>

        <!-- Модальное окно корзины -->
        <div class="modal-overlay" id="cartModal">
            <div class="modal-box">
                <button class="modal-close" id="closeCartBtn">✖</button>
                <h2>Ваша корзина</h2>
                <div id="cartItems" class="cart-items-container">Загрузка...</div>
                <div class="cart-footer">
                    <div class="cart-total" id="cartTotal">Итого: 0 BYN</div>
                    <button class="checkout-btn" id="checkoutBtn">Оформить доставку</button>
                </div>
            </div>
        </div>
    `;

    // Слушатели профиля и корзины
    document.getElementById('profileButton')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate(isUserAuthorized ? '/profile' : '/login');
    });

    const cartModal = document.getElementById('cartModal');
    document.getElementById('openCartBtn')?.addEventListener('click', (e) => { 
        e.preventDefault();
        if (!isUserAuthorized) { Router.navigate('/login'); return; }
        if (cartModal) { cartModal.style.display = 'flex'; loadCartItems(); }
    });

    document.getElementById('closeCartBtn')?.addEventListener('click', () => { 
        if(cartModal) cartModal.style.display = 'none'; 
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if(cartModal) cartModal.style.display = 'none'; 
        Router.navigate('/delivery');
    });

    // Делегирование событий на сетку товаров (Клик по карточке / Добавление в корзину)
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
            } 
            else if (card && productId > 0) {
                Router.navigate(`/product?id=${productId}`);
            }
        });
    }

    // Слушатели внутри корзины
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', async (e) => {
            const target = e.target as HTMLElement;
            const productId = parseInt(target.getAttribute('data-id') || '0');
            
            if (productId > 0) {
                if (target.classList.contains('cart-add-btn')) await addToCartApi(productId, false); 
                else if (target.classList.contains('cart-minus-btn')) await removeCountFromCartApi(productId);
                else if (target.classList.contains('cart-remove-btn')) await removeProductFromCartApi(productId);
                
                if (target.tagName === 'BUTTON') {
                    await loadCartItems();
                    await updateCartCounter();
                }
            }
        });
    }

    // Слушатели поиска и фильтров
    document.getElementById('applyFiltersBtn')?.addEventListener('click', loadProducts);
    document.getElementById('sortSelect')?.addEventListener('change', loadProducts);
    document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Инициализация
    await loadCategories(); // Сначала грузим динамические категории
    loadProducts();         // Затем грузим сами товары
    if (isUserAuthorized) updateCartCounter();
}

// --- ДИНАМИЧЕСКИЕ КАТЕГОРИИ ИЗ БД ---
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await responseToJson(res);
        const productsArray: Product[] = Array.isArray(data) ? data : (data ? [data] : []);
        
        // Вытягиваем уникальные категории с помощью Set
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
// --- ПОИСК И КАТАЛОГ ---
async function handleSearch() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const query = searchInput ? searchInput.value.trim() : '';
    
    // Если поле пустое, просто загружаем обычный каталог с учетом фильтров
    if (!query) return loadProducts();

    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading-spinner"></div>';

    try {
        // Запускаем оба запроса параллельно для скорости
        const [nameRes, descRes] = await Promise.all([
            fetch(`${API_BASE_URL}/products/by-name?name=${encodeURIComponent(query)}`),
            fetch(`${API_BASE_URL}/products/by-description?description=${encodeURIComponent(query)}`)
        ]);

        const nameData = await responseToJson(nameRes);
        const descData = await responseToJson(descRes);

        const nameProducts: Product[] = Array.isArray(nameData) ? nameData : (nameData ? [nameData] : []);
        const descProducts: Product[] = Array.isArray(descData) ? descData : (descData ? [descData] : []);

        // Объединяем результаты в один массив
        const combinedProducts = [...nameProducts, ...descProducts];

        // Убираем дубликаты по ID (чтобы товар не выводился дважды)
        const uniqueProductsMap = new Map<number, Product>();
        combinedProducts.forEach(product => {
            if (product && product.id) {
                uniqueProductsMap.set(product.id, product);
            }
        });

        // Превращаем обратно в массив
        const finalProducts = Array.from(uniqueProductsMap.values());

        // Отрисовываем
        renderProductCards(finalProducts);
    } catch (error) {
        console.error("Ошибка при поиске:", error);
        grid.innerHTML = '<p style="color: red; text-align: center;">Ошибка поиска</p>';
    }
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // Собираем значения со всех фильтров
    const sort = (document.getElementById('sortSelect') as HTMLSelectElement)?.value || '';
    const category = (document.getElementById('categoryFilter') as HTMLSelectElement)?.value || '';
    const minPrice = (document.getElementById('minPrice') as HTMLInputElement)?.value || '';
    const maxPrice = (document.getElementById('maxPrice') as HTMLInputElement)?.value || '';
    const isAvailable = (document.getElementById('isAvailable') as HTMLInputElement)?.checked || false;
    
    grid.innerHTML = '<div class="loading-spinner"></div>';

    try {
        let url = `${API_BASE_URL}/products`;
        
        // Если использован хотя бы один фильтр, используем роут /fillters
        if (category || minPrice || maxPrice || isAvailable) {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            if (isAvailable) params.append('isAvailable', 'true');
            
            url = `${API_BASE_URL}/products/fillters?${params.toString()}`;
        } 
        // Если фильтров нет, но есть сортировка - используем чистые роуты сортировки
        else if (sort === 'asc') {
            url = `${API_BASE_URL}/products/ascending`;
        } else if (sort === 'desc') {
            url = `${API_BASE_URL}/products/descending`;
        }

        const res = await fetch(url);
        const products: Product[] = await responseToJson(res);

        // Если мы использовали роут /fillters, бэкенд может не отсортировать их,
        // поэтому мы дополнительно сортируем массив на фронте, если выбрана сортировка
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
        card.style.cursor = 'pointer'; // Добавили курсор-пальчик
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

// --- API КОРЗИНЫ ---
async function addToCartApi(productId: number, showAlert: boolean = true) {
    try {
        const res = await fetch(`${API_BASE_URL}/basket/add-to-basket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }), 
            credentials: 'include'
        });
        if (res.ok) {
            updateCartCounter();
            if(showAlert) alert('Товар добавлен!');
        }
    } catch (error) { console.error('Сбой сети при добавлении в корзину'); }
}

async function removeCountFromCartApi(productId: number) {
    try {
        await fetch(`${API_BASE_URL}/basket/remove-count`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }), 
            credentials: 'include'
        });
    } catch (error) {}
}

async function removeProductFromCartApi(productId: number) {
    try {
        await fetch(`${API_BASE_URL}/basket/remove-product`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }), 
            credentials: 'include'
        });
    } catch (error) {}
}

async function updateCartCounter() {
    try {
        const res = await fetch(`${API_BASE_URL}/basket/mybasket`, { credentials: 'include' });
        if (!res.ok) {
            const badge = document.getElementById('cartCount');
            if (badge) badge.textContent = '0';
            return;
        }
        const data: BasketData = await responseToJson(res);
        const cartArray: BasketItem[] = data.basket || [];
        const count = cartArray.reduce((sum, item) => sum + item.count, 0);
        
        const badge = document.getElementById('cartCount');
        if (badge) badge.textContent = count.toString();
    } catch (e) {}
}

async function loadCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    container.innerHTML = '<p>Загрузка...</p>';

    try {
        const res = await fetch(`${API_BASE_URL}/basket/mybasket`, { credentials: 'include' });
        if (!res.ok) {
            container.innerHTML = '<p style="text-align:center;">Ваша корзина пуста</p>';
            const cartTotal = document.getElementById('cartTotal');
            if (cartTotal) cartTotal.textContent = 'Итого: 0 BYN';
            return;
        }

        const cartData: BasketData = await responseToJson(res);
        const cartArray: BasketItem[] = (cartData as any).userbasket?.basket || cartData.basket || [];
        
        if (cartArray.length === 0) {
            container.innerHTML = '<p style="text-align:center;">Ваша корзина пуста</p>';
            const cartTotal = document.getElementById('cartTotal');
            if (cartTotal) cartTotal.textContent = 'Итого: 0 BYN';
            return;
        }

        const productIds = cartArray.map(item => item.productId);
        const prodRes = await fetch(`${API_BASE_URL}/products/for-basket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: productIds })
        });
        const prodData = await responseToJson(prodRes);
        const productsInfo: Product[] = prodData.products ? prodData.products : (Array.isArray(prodData) ? prodData : []);

        let total = 0;
        
        container.innerHTML = cartArray.map((cartItem) => {
            const product = productsInfo.find((p) => Number(p.id) === Number(cartItem.productId));
            if (!product) return '';
            
            const itemTotal = product.price * cartItem.count;
            total += itemTotal;
            
            return `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <div style="display:flex; align-items:center; gap: 10px;">
                        <img src="${product.images?.preview || ''}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                        <div>
                            <h4 data-title="basket" style="margin:0; font-size: 14px;">${product.title}</h4>
                            <span data-price="basket" style="color:#f91155; font-weight:bold; font-size: 14px;">${product.price} BYN</span>
                        </div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap: 10px;">
                        <div class="quantity-controls" style="display:flex; align-items:center; border: 1px solid #ccc; border-radius: 4px;">
                            <button class="cart-minus-btn" data-id="${cartItem.productId}" style="padding: 2px 8px; border:none; background:none; cursor:pointer;">-</button>
                            <span style="padding: 0 8px;">${cartItem.count}</span>
                            <button class="cart-add-btn" data-id="${cartItem.productId}" style="padding: 2px 8px; border:none; background:none; cursor:pointer;">+</button>
                        </div>
                        <button class="cart-remove-btn" data-id="${cartItem.productId}" style="border:none; background:none; color:red; cursor:pointer; font-size: 16px;">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
        
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) cartTotal.textContent = `Итого: ${total.toFixed(2)} BYN`;

    } catch (e) {
        container.innerHTML = '<p style="color:red; text-align:center;">Ошибка загрузки корзины</p>';
    }
}

// Утилита для разбора ответа сервера
async function responseToJson(res: Response) {
    const text = await res.text();
    if (!text) return {};
    try {
        const data = JSON.parse(text);
        return data.data !== undefined ? data.data : data; 
    } catch(e) { return {}; }
}