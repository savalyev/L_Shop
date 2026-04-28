// src/ts/components/shop/cartComponent.ts
import { Router } from '../../main';
import cartModalHtml from './cartModal.html?raw';

const API_BASE_URL = 'http://localhost:3000/api';

// --- ИНТЕРФЕЙСЫ ---
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    categories?: string[];
    images?: { preview: string; };
    discount?: number;
    isAvailable?: boolean;
}

export interface BasketItem {
    productId: number;
    count: number;
}

export interface BasketData {
    id?: number;
    userId?: number;
    basket?: BasketItem[];
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

// --- ИНИЦИАЛИЗАЦИЯ КОРЗИНЫ ---
export function injectCartModal(container: HTMLElement) {
    // Вставляем HTML корзины в конец текущего контейнера, если её еще нет
    if (!document.getElementById('cartModal')) {
        container.insertAdjacentHTML('beforeend', cartModalHtml);
        initCartListeners();
    }
}

function initCartListeners() {
    const cartModal = document.getElementById('cartModal');
    
    // Закрытие корзины
    document.getElementById('closeCartBtn')?.addEventListener('click', () => { 
        if(cartModal) cartModal.style.display = 'none'; 
    });

    // Оформление заказа
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if(cartModal) cartModal.style.display = 'none'; 
        Router.navigate('/delivery');
    });

    // Клики внутри корзины (плюс, минус, удалить)
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
}

// --- API ФУНКЦИИ ---
export async function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) { 
        cartModal.style.display = 'flex'; 
        await loadCartItems(); 
    }
}

export async function addToCartApi(productId: number, showAlert: boolean = true) {
    try {
        const res = await fetch(`${API_BASE_URL}/basket/add-to-basket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }), 
            credentials: 'include'
        });
        if (res.ok) {
            await updateCartCounter();
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

export async function updateCartCounter() {
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
            setEmptyCart(container);
            return;
        }

        const cartData: BasketData = await responseToJson(res);
        const cartArray: BasketItem[] = (cartData as any).userbasket?.basket || cartData.basket || [];
        
        if (cartArray.length === 0) {
            setEmptyCart(container);
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

function setEmptyCart(container: HTMLElement) {
    container.innerHTML = '<p style="text-align:center;">Ваша корзина пуста</p>';
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.textContent = 'Итого: 0 BYN';
}