import { Router } from '../../main';
import cartModalHtml from './cartModal.html?raw';
import { responseToJson } from '../../utils/api';

const API_BASE_URL = 'http://localhost:3000/api';

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

export function injectCartModal(container: HTMLElement) {
    if (!document.getElementById('cartModal')) {
        container.insertAdjacentHTML('beforeend', cartModalHtml);
        initCartListeners();
    }
}

function initCartListeners() {
    const cartModal = document.getElementById('cartModal');
    document.getElementById('closeCartBtn')?.addEventListener('click', () => {
        if (cartModal) cartModal.style.display = 'none';
    });
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cartModal) cartModal.style.display = 'none';
        Router.navigate('/delivery');
    });

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
            if (showAlert) alert('Товар добавлен!');
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
    } catch (error) { }
}

async function removeProductFromCartApi(productId: number) {
    try {
        await fetch(`${API_BASE_URL}/basket/remove-product`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
            credentials: 'include'
        });
    } catch (error) { }
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
    } catch (e) { }
}

async function loadCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    clearContainer(container);
    container.appendChild(createLoader());

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
        clearContainer(container);
        cartArray.forEach((cartItem) => {
            const product = productsInfo.find(p => Number(p.id) === Number(cartItem.productId));
            if (!product) return;
            const itemTotal = product.price * cartItem.count;
            total += itemTotal;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #eee;';
            
            const leftDiv = document.createElement('div');
            leftDiv.style.cssText = 'display:flex; align-items:center; gap:10px;';
            const img = document.createElement('img');
            img.src = product.images?.preview || '';
            img.style.cssText = 'width:50px; height:50px; object-fit:cover; border-radius:4px;';
            const infoDiv = document.createElement('div');
            const titleH4 = document.createElement('h4');
            titleH4.textContent = product.title;
            titleH4.style.cssText = 'margin:0; font-size:14px;';
            const priceSpan = document.createElement('span');
            priceSpan.textContent = `${product.price} BYN`;
            priceSpan.style.cssText = 'color:#f91155; font-weight:bold; font-size:14px;';
            infoDiv.append(titleH4, priceSpan);
            leftDiv.append(img, infoDiv);
            
            const rightDiv = document.createElement('div');
            rightDiv.style.cssText = 'display:flex; align-items:center; gap:10px;';
            const qtyDiv = document.createElement('div');
            qtyDiv.style.cssText = 'display:flex; align-items:center; border:1px solid #ccc; border-radius:4px;';
            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.className = 'cart-minus-btn';
            minusBtn.setAttribute('data-id', String(cartItem.productId));
            minusBtn.style.cssText = 'padding:2px 8px; border:none; background:none; cursor:pointer;';
            const countSpan = document.createElement('span');
            countSpan.textContent = String(cartItem.count);
            countSpan.style.padding = '0 8px';
            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.className = 'cart-add-btn';
            plusBtn.setAttribute('data-id', String(cartItem.productId));
            plusBtn.style.cssText = 'padding:2px 8px; border:none; background:none; cursor:pointer;';
            qtyDiv.append(minusBtn, countSpan, plusBtn);
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '🗑️';
            removeBtn.className = 'cart-remove-btn';
            removeBtn.setAttribute('data-id', String(cartItem.productId));
            removeBtn.style.cssText = 'border:none; background:none; color:red; cursor:pointer; font-size:16px;';
            rightDiv.append(qtyDiv, removeBtn);
            
            itemDiv.append(leftDiv, rightDiv);
            container.appendChild(itemDiv);
        });
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) cartTotal.textContent = `Итого: ${total.toFixed(2)} BYN`;
    } catch (e) {
        clearContainer(container);
        const errMsg = document.createElement('p');
        errMsg.style.color = 'red';
        errMsg.textContent = 'Ошибка загрузки корзины';
        container.appendChild(errMsg);
    }
}

function setEmptyCart(container: HTMLElement) {
    clearContainer(container);
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Ваша корзина пуста';
    emptyMsg.style.textAlign = 'center';
    container.appendChild(emptyMsg);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.textContent = 'Итого: 0 BYN';
}

function clearContainer(container: HTMLElement) {
    while (container.firstChild) container.removeChild(container.firstChild);
}

function createLoader(): HTMLElement {
    const loader = document.createElement('p');
    loader.textContent = 'Загрузка...';
    return loader;
}