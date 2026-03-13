// src/ts/main.ts

// API constants
const API_BASE_URL = '/api';

// Интерфейсы для типизации
interface Product {
    id: number;
    title: string;
    price: number;
    isAvailable: boolean;
    description: string;
    categories: string[];
    images: {
        preview: string;
        gallery?: string[];
    };
    discount?: number;
    delivery?: {
        startTown: {
            country: string;
            town: string;
            street: string;
            houseNumber: string;
        };
        earlyDate: string;
        price: number;
    };
}

interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    preview: string;
}

// Класс для управления магазином
class ShopManager {
    private currentUser: any = null;
    private cart: CartItem[] = [];
    private currentSort: 'asc' | 'desc' | null = null;
    private currentFilters: any = {};

    constructor() {
        this.init();
    }

    // В методе init, после загрузки данных:
    private async init(): Promise<void> {
        this.loadUserData();
        this.loadCart();
        this.updateAuthButton();

        // Проверяем, нужно ли добавить товар после авторизации
        const addToCartOnLoad = localStorage.getItem('addToCartOnLoad');
        if (addToCartOnLoad && this.checkAuthorization()) {
            const productId = parseInt(addToCartOnLoad);
            localStorage.removeItem('addToCartOnLoad');
            setTimeout(() => {
                this.addToCart(productId);
            }, 500);
        }

        if (!this.checkAuthorization() && this.cart.length > 0) {
            this.cart = [];
            this.saveCart();
            this.showNotification('Корзина очищена. Войдите в систему', 'warning');
        }

        this.updateCartCounter();
        await this.loadHomePage();
        this.initializeEventListeners();
    }

    private loadUserData(): void {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    private loadCart(): void {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    private saveCart(): void {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCounter();
    }

    private updateCartCounter(): void {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems.toString();
        }
    }

    private initializeEventListeners(): void {
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('cartModal');
            if (event.target === modal) {
                this.closeCart();
            }
        });
    }

    // ============= AUTHORIZATION CHECK =============

    /**
     * Проверка авторизации пользователя
     */
    private checkAuthorization(): boolean {
        const userData = localStorage.getItem('currentUser');
        if (!userData) return false;

        try {
            const user = JSON.parse(userData);
            return !!(user && user.id);
        } catch {
            return false;
        }
    }

    // ============= PRODUCT API REQUESTS =============

    /**
     * GET /api/products - Все товары
     */
    public async getAllProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                return data;
            } else if (data && Array.isArray(data.products)) {
                return data.products;
            } else if (data && Array.isArray(data.data)) {
                return data.data;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    /**
     * GET /api/products/:id - Товар по ID
     */
    public async getProductById(id: number): Promise<Product | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            const data = await response.json();

            let product: Product | null = null;

            if (data && typeof data === 'object') {
                if (data.id) {
                    product = data as Product;
                } else if (data.product) {
                    product = data.product as Product;
                } else if (data.data) {
                    product = data.data as Product;
                }
            }

            return product;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }
    }

    /**
     * GET /api/products/by-name?name= - Поиск по названию
     */
    public async searchProductsByName(name: string): Promise<Product[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/products/by-name?name=${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error('Failed to search products');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    /**
     * GET /api/products/by-description?description= - Поиск по описанию
     */
    public async searchProductsByDescription(description: string): Promise<Product[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/products/by-description?description=${encodeURIComponent(description)}`);
            if (!response.ok) throw new Error('Failed to search products by description');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error searching products by description:', error);
            return [];
        }
    }

    /**
     * GET /api/products/ascending - Все товары, цена ↑
     */
    public async getProductsAscending(): Promise<Product[]> {
        try {
            console.log('Fetching ascending products...');
            const response = await fetch(`${API_BASE_URL}/products/ascending`);

            if (!response.ok) {
                console.warn('Ascending endpoint failed, using client sort');
                const products = await this.getAllProducts();
                return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
            }

            const data = await response.json();
            console.log('Ascending products raw:', data);

            if (Array.isArray(data)) {
                return data;
            } else if (data && Array.isArray(data.products)) {
                return data.products;
            } else if (data && Array.isArray(data.data)) {
                return data.data;
            } else {
                console.warn('Unexpected ascending format, using client sort');
                const products = await this.getAllProducts();
                return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
            }
        } catch (error) {
            console.error('Error fetching products ascending:', error);
            const products = await this.getAllProducts();
            return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
        }
    }

    /**
     * GET /api/products/descending - Все товары, цена ↓
     */
    public async getProductsDescending(): Promise<Product[]> {
        try {
            console.log('Fetching descending products...');
            const response = await fetch(`${API_BASE_URL}/products/descending`);

            if (!response.ok) {
                console.warn('Descending endpoint failed, using client sort');
                const products = await this.getAllProducts();
                return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
            }

            const data = await response.json();
            console.log('Descending products raw:', data);

            if (Array.isArray(data)) {
                return data;
            } else if (data && Array.isArray(data.products)) {
                return data.products;
            } else if (data && Array.isArray(data.data)) {
                return data.data;
            } else {
                console.warn('Unexpected descending format, using client sort');
                const products = await this.getAllProducts();
                return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
            }
        } catch (error) {
            console.error('Error fetching products descending:', error);
            const products = await this.getAllProducts();
            return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
        }
    }

    /**
     * GET /api/products/filters?... - Товары с фильтрами
     */
    public async getProductsWithFilters(filters: any): Promise<Product[]> {
        const queryParams = new URLSearchParams(filters).toString();
        try {
            const response = await fetch(`${API_BASE_URL}/products/filters?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch products with filters');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching products with filters:', error);
            return [];
        }
    }

    /**
     * POST /api/products/for-basket - Получение товаров по массиву ID
     */
    public async getProductsForBasket(productIds: number[]): Promise<Product[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/products/for-basket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: productIds })
            });
            if (!response.ok) throw new Error('Failed to fetch products for basket');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching products for basket:', error);
            return [];
        }
    }

    // ============= PAGE RENDERING =============

    /**
     * Загрузка главной страницы с товарами
     */
    public async loadHomePage(sort?: 'asc' | 'desc'): Promise<void> {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="home-page">
                <div class="categories-section">
                    <h2 class="section-title">Категории</h2>
                    <div class="categories-grid" id="categoriesGrid">
                        <div class="loading">Загрузка категорий...</div>
                    </div>
                </div>
                
                <div class="products-header">
                    <h2>Товары</h2>
                    <div class="sort-controls">
                        <select id="sortSelect" onchange="window.handleSortChange(event)">
                            <option value="">Сортировка</option>
                            <option value="asc" ${sort === 'asc' ? 'selected' : ''}>Цена ↑ (по возрастанию)</option>
                            <option value="desc" ${sort === 'desc' ? 'selected' : ''}>Цена ↓ (по убыванию)</option>
                        </select>
                    </div>
                </div>
                
                <div class="products-grid" id="productsGrid">
                    <div class="loading"><div class="loading-spinner"></div>Загрузка товаров...</div>
                </div>
            </div>
        `;

        await this.loadProducts(sort);
        await this.loadCategories();
    }

    /**
     * Загрузка товаров с учетом сортировки
     */
    private async loadProducts(sort?: 'asc' | 'desc'): Promise<void> {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Загрузка товаров...</div>';

        let products: Product[] = [];

        try {
            if (sort === 'asc') {
                console.log('Loading ascending products...');
                products = await this.getProductsAscending();
            } else if (sort === 'desc') {
                console.log('Loading descending products...');
                products = await this.getProductsDescending();
            } else {
                console.log('Loading all products...');
                products = await this.getAllProducts();
            }

            console.log('Products loaded:', products);

            if (!products || products.length === 0) {
                productsGrid.innerHTML = '<p class="no-products">Товары не найдены</p>';
                return;
            }

            if (!Array.isArray(products)) {
                console.error('Products is not an array:', products);
                productsGrid.innerHTML = '<p class="error">Ошибка формата данных</p>';
                return;
            }

            productsGrid.innerHTML = products.map(product => {
                const finalPrice = product.discount
                    ? Math.round(product.price * (1 - product.discount / 100))
                    : product.price;

                const previewImage = product.images?.preview || 'https://via.placeholder.com/300x200?text=No+Image';

                return `
                    <div class="product-card" 
                         data-title="${product.title || 'Без названия'}" 
                         data-price="${finalPrice || 0}"
                         data-product-id="${product.id || 0}">
                        <img src="${previewImage}" 
                             alt="${product.title || 'Товар'}" 
                             class="product-image"
                             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                        <div class="product-info">
                            <h3 class="product-title">${product.title || 'Без названия'}</h3>
                            <p class="product-price">
                                ${product.discount ? `
                                    <span class="old-price">${product.price} BYN</span>
                                    <span class="discount-price">${finalPrice} BYN</span>
                                    <span class="discount-badge">-${product.discount}%</span>
                                ` : `
                                    <span>${product.price || 0} BYN</span>
                                `}
                            </p>
                            <p class="product-availability ${product.isAvailable ? 'available' : 'not-available'}">
                                ${product.isAvailable ? 'В наличии' : 'Нет в наличии'}
                            </p>
                            <button class="add-to-cart-btn" 
                                    onclick="window.addToCart(${product.id})"
                                    ${!product.isAvailable ? 'disabled' : ''}>
                                В корзину
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Error loading products:', error);
            productsGrid.innerHTML = '<p class="error">Ошибка загрузки товаров</p>';
        }
    }

    /**
     * Загрузка категорий
     */
    private async loadCategories(): Promise<void> {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        try {
            const products = await this.getAllProducts();

            if (!Array.isArray(products) || products.length === 0) {
                categoriesGrid.innerHTML = '<p>Нет категорий</p>';
                return;
            }

            const categoriesSet = new Set<string>();
            products.forEach(product => {
                if (product.categories && Array.isArray(product.categories)) {
                    product.categories.forEach(cat => categoriesSet.add(cat));
                }
            });

            const categories = Array.from(categoriesSet);

            if (categories.length === 0) {
                categoriesGrid.innerHTML = '<p>Нет категорий</p>';
                return;
            }

            categoriesGrid.innerHTML = categories.map(category => `
                <div class="category-card" onclick="window.filterByCategory('${category}')">
                    <h4>${category}</h4>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading categories:', error);
            categoriesGrid.innerHTML = '<p>Ошибка загрузки категорий</p>';
        }
    }

    // ============= SEARCH FUNCTIONS =============

    /**
     * Поиск товаров
     */
    public async searchProducts(): Promise<void> {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (!query) {
            await this.loadHomePage();
            return;
        }

        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="search-results">
                    <h2>Результаты поиска: "${query}"</h2>
                    <div class="products-grid" id="searchResultsGrid">
                        <div class="loading"><div class="loading-spinner"></div>Поиск...</div>
                    </div>
                </div>
            `;
        }

        try {
            const [byName, byDescription] = await Promise.all([
                this.searchProductsByName(query),
                this.searchProductsByDescription(query)
            ]);

            const allResults = [...byName, ...byDescription];
            const uniqueResults = Array.from(new Map(allResults.map(p => [p.id, p])).values());

            const resultsGrid = document.getElementById('searchResultsGrid');
            if (resultsGrid) {
                if (uniqueResults.length === 0) {
                    resultsGrid.innerHTML = '<p class="no-results">Товары не найдены</p>';
                    return;
                }

                resultsGrid.innerHTML = uniqueResults.map(product => {
                    const finalPrice = product.discount
                        ? Math.round(product.price * (1 - product.discount / 100))
                        : product.price;

                    return `
                        <div class="product-card" 
                             data-title="${product.title}" 
                             data-price="${finalPrice}"
                             data-product-id="${product.id}">
                            <img src="${product.images?.preview || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                                 alt="${product.title}" 
                                 class="product-image"
                                 onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                            <div class="product-info">
                                <h3 class="product-title">${product.title}</h3>
                                <p class="product-price">${finalPrice} BYN</p>
                                <button class="add-to-cart-btn" onclick="window.addToCart(${product.id})">
                                    В корзину
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    // ============= CART FUNCTIONS =============

    /**
     * Добавление товара в корзину
     */
    public async addToCart(productId: number): Promise<void> {
        try {
            // Проверяем авторизацию пользователя
            const isAuthorized = this.checkAuthorization();

            if (!isAuthorized) {
                // Сохраняем информацию о том, что пользователь хотел добавить товар
                localStorage.setItem('pendingCartItem', productId.toString());

                // Показываем уведомление
                this.showNotification('Необходимо войти в систему', 'warning');

                // Перенаправляем на страницу авторизации через 1 секунду
                setTimeout(() => {
                    window.location.href = 'Authorization.html';
                }, 1000);
                return;
            }

            const product = await this.getProductById(productId);
            if (!product) {
                console.error('Product not found');
                return;
            }

            // Проверяем наличие товара
            if (!product.isAvailable) {
                this.showNotification('Товар временно отсутствует', 'error');
                return;
            }

            const previewImage = product.images?.preview || 'https://via.placeholder.com/100x100?text=No+Image';

            const finalPrice = product.discount
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price;

            const existingItem = this.cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    id: product.id,
                    title: product.title || 'Товар без названия',
                    price: finalPrice,
                    quantity: 1,
                    preview: previewImage
                });
            }

            this.saveCart();
            this.showNotification(`Товар "${product.title || 'Без названия'}" добавлен в корзину`, 'success');

            const modal = document.getElementById('cartModal');
            if (modal && modal.style.display === 'block') {
                this.renderCartItems();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Ошибка при добавлении товара в корзину', 'error');
        }
    }

    /**
     * Открытие корзины
     */
    public openCart(): void {
        const isAuthorized = this.checkAuthorization();

        if (!isAuthorized) {
            this.showNotification('Необходимо войти в систему', 'warning');
            setTimeout(() => {
                window.location.href = 'Authorization.html';
            }, 1000);
            return;
        }

        const modal = document.getElementById('cartModal');
        if (modal) {
            this.renderCartItems();
            modal.style.display = 'block';
        }
    }

    /**
     * Закрытие корзины
     */
    public closeCart(): void {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Отображение товаров в корзине
     */
    private renderCartItems(): void {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartItems || !cartTotal) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
            cartTotal.textContent = 'Итого: 0 BYN';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item" 
                 data-title="basket" 
                 data-price="basket"
                 data-item-id="${item.id}">
                <img src="${item.preview}" 
                     alt="${item.title}" 
                     class="cart-item-image"
                     onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.price} BYN x ${item.quantity}</p>
                    <p class="item-total">Сумма: ${item.price * item.quantity} BYN</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="window.updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="window.updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button onclick="window.removeFromCart(${item.id})" class="remove-btn">×</button>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Итого: ${total} BYN`;
    }

    /**
     * Обновление количества товара в корзине
     */
    public updateCartItemQuantity(productId: number, newQuantity: number): void {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCartItems();
        }
    }

    /**
     * Удаление товара из корзины
     */
    public removeFromCart(productId: number): void {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartItems();
    }


    // ============= UI FUNCTIONS =============

    /**
     * Обработка изменения сортировки
     */
    public handleSortChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const sort = select.value as 'asc' | 'desc' | '';

        console.log('Sort changed to:', sort);

        this.currentSort = sort || null;

        if (sort) {
            this.loadHomePage(sort);
        } else {
            this.loadHomePage();
        }
    }

    /**
     * Фильтрация по категории
     */
    public async filterByCategory(category: string): Promise<void> {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="category-page">
                <h2>Категория: ${category}</h2>
                <div class="products-grid" id="filteredProductsGrid">
                    <div class="loading"><div class="loading-spinner"></div>Загрузка...</div>
                </div>
                <button class="back-btn" onclick="window.loadHomePage()">← Назад к категориям</button>
            </div>
        `;

        try {
            const allProducts = await this.getAllProducts();
            const filteredProducts = allProducts.filter(p => p.categories.includes(category));

            const productsGrid = document.getElementById('filteredProductsGrid');
            if (productsGrid) {
                if (filteredProducts.length === 0) {
                    productsGrid.innerHTML = '<p class="no-products">Нет товаров в этой категории</p>';
                    return;
                }

                productsGrid.innerHTML = filteredProducts.map(product => {
                    const finalPrice = product.discount
                        ? Math.round(product.price * (1 - product.discount / 100))
                        : product.price;

                    return `
                        <div class="product-card" 
                             data-title="${product.title}" 
                             data-price="${finalPrice}"
                             data-product-id="${product.id}">
                            <img src="${product.images?.preview || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                                 alt="${product.title}" 
                                 class="product-image"
                                 onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                            <div class="product-info">
                                <h3>${product.title}</h3>
                                <p class="price">${finalPrice} BYN</p>
                                <button class="add-to-cart-btn" onclick="window.addToCart(${product.id})">В корзину</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Error filtering by category:', error);
        }
    }

    /**
     * Обработка клика по авторизации
     */
    public handleAuthClick(): void {
        if (this.currentUser) {
            if (confirm(`Вы вошли как ${this.currentUser.name}. Выйти?`)) {
                this.logout();
            }
        } else {
            window.location.href = 'Authorization.html';
        }
    }

    /**
     * Выход из системы
     */
    private async logout(): Promise<void> {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('cart');
            this.currentUser = null;
            this.cart = [];
            this.updateAuthButton();
            this.updateCartCounter();

            this.showNotification('Вы вышли из системы', 'success');
            this.loadHomePage();
        }
    }

    /**
     * Обновление кнопки авторизации
     */
    private updateAuthButton(): void {
        const authButton = document.getElementById('authButtonText');
        if (authButton) {
            authButton.textContent = this.currentUser ? this.currentUser.name : 'Войти';
        }
    }

    /**
     * Оформление заказа
     */
    public checkout(): void {
        if (this.currentUser) {
            if (this.cart.length === 0) {
                this.showNotification('Корзина пуста', 'warning');
                return;
            }
            window.location.href = 'delivery.html';
        } else {
            this.showNotification('Необходимо войти в систему', 'warning');
            setTimeout(() => {
                window.location.href = 'Authorization.html';
            }, 1000);
        }
    }

    /**
     * Смена страницы
     */
    public async changePage(page: string): Promise<void> {
        switch (page) {
            case 'home':
                await this.loadHomePage();
                break;
            case 'profile':
                if (this.currentUser) {
                    this.loadProfilePage();
                } else {
                    this.showNotification('Необходимо войти в систему', 'warning');
                    setTimeout(() => {
                        window.location.href = 'Authorization.html';
                    }, 1000);
                }
                break;
            case 'delivery':
                this.loadDeliveryPage();
                break;
            default:
                this.loadPage(page);
        }
    }

    /**
     * Загрузка страницы профиля
     */
    private loadProfilePage(): void {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="profile-page">
                    <h1>Личный кабинет</h1>
                    <div class="profile-info">
                        <p><strong>Имя:</strong> ${this.currentUser?.name || 'Не указано'}</p>
                        <p><strong>Email:</strong> ${this.currentUser?.email || 'Не указан'}</p>
                        <p><strong>Телефон:</strong> ${this.currentUser?.phone || 'Не указан'}</p>
                    </div>
                    <div class="profile-stats">
                        <div class="stat-card stat-card-blue">
                            <div class="stat-number">${this.cart.length}</div>
                            <div class="stat-label">Товаров в корзине</div>
                        </div>
                        <div class="stat-card stat-card-green">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Заказов</div>
                        </div>
                    </div>
                    <button class="profile-action-btn logout" onclick="window.handleAuthClick()">Выйти</button>
                </div>
            `;
        }
    }

    /**
     * Загрузка страницы доставки с data-delivery атрибутом
     */
    private loadDeliveryPage(): void {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="delivery-page">
                    <h1>Оформление доставки</h1>
                    <form class="delivery-form" data-delivery>
                        <div class="form-group">
                            <label for="country">Страна</label>
                            <input type="text" id="country" name="country" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="city">Город</label>
                            <input type="text" id="city" name="city" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="street">Улица</label>
                            <input type="text" id="street" name="street" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="house">Дом</label>
                            <input type="text" id="house" name="house" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="apartment">Квартира</label>
                            <input type="text" id="apartment" name="apartment">
                        </div>
                        
                        <div class="form-group">
                            <label for="deliveryDate">Дата доставки</label>
                            <input type="date" id="deliveryDate" name="deliveryDate" required>
                        </div>
                        
                        <button type="submit" class="submit-delivery">Оформить доставку</button>
                    </form>
                </div>
            `;

            const form = document.querySelector('.delivery-form');
            form?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification('Заказ оформлен!', 'success');
                setTimeout(() => {
                    this.loadHomePage();
                }, 2000);
            });
        }
    }

    /**
     * Загрузка обычной страницы
     */
    private loadPage(page: string): void {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="page-${page}">
                    <h1>${page.charAt(0).toUpperCase() + page.slice(1)}</h1>
                    <p>Страница в разработке</p>
                    <button class="back-btn" onclick="window.loadHomePage()">← На главную</button>
                </div>
            `;
        }
    }

    /**
     * Показать уведомление с разными типами
     */
    private showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        let backgroundColor = '#4CAF50';
        if (type === 'error') {
            backgroundColor = '#f44336';
        } else if (type === 'warning') {
            backgroundColor = '#ff9800';
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Скролл к категориям
     */
    public scrollToCategories(): void {
        const categoriesSection = document.querySelector('.categories-section');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Обработка ввода поиска
     */
    public handleSearchInput(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.searchProducts();
        }
    }
}

// ============= СОЗДАЕМ ЭКЗЕМПЛЯР И ГЛОБАЛЬНЫЕ ФУНКЦИИ =============

let shopManager: ShopManager;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    shopManager = new ShopManager();

    // Делаем функции глобальными
    window.handleSearchInput = (event: KeyboardEvent) => shopManager.handleSearchInput(event);
    window.searchProducts = () => shopManager.searchProducts();
    window.openCart = () => shopManager.openCart();
    window.closeCart = () => shopManager.closeCart();
    window.handleAuthClick = () => shopManager.handleAuthClick();
    window.changePage = (page: string) => shopManager.changePage(page);
    window.scrollToCategories = () => shopManager.scrollToCategories();
    window.checkout = () => shopManager.checkout();
    window.addToCart = (productId: number) => shopManager.addToCart(productId);
    window.updateCartItemQuantity = (productId: number, quantity: number) => shopManager.updateCartItemQuantity(productId, quantity);
    window.removeFromCart = (productId: number) => shopManager.removeFromCart(productId);
    window.filterByCategory = (category: string) => shopManager.filterByCategory(category);
    window.handleSortChange = (event: Event) => shopManager.handleSortChange(event);
    window.loadHomePage = () => shopManager.loadHomePage();
});

// Объявляем типы для глобальных функций
declare global {
    interface Window {
        shopManager: ShopManager;
        handleSearchInput: (event: KeyboardEvent) => void;
        searchProducts: () => void;
        openCart: () => void;
        closeCart: () => void;
        handleAuthClick: () => void;
        changePage: (page: string) => void;
        scrollToCategories: () => void;
        checkout: () => void;
        addToCart: (productId: number) => void;
        updateCartItemQuantity: (productId: number, quantity: number) => void;
        removeFromCart: (productId: number) => void;
        filterByCategory: (category: string) => void;
        handleSortChange: (event: Event) => void;
        loadHomePage: () => void;
    }
}

export default ShopManager;