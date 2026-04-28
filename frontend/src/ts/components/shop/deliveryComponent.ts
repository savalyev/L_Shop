// src/ts/components/shop/deliveryComponent.ts
import '../../../CSS/style_main.css';
import { Router } from '../../main';
// Импортируем HTML-шаблон
import deliveryHtml from './delivery.html?raw';

const API_BASE_URL = 'http://localhost:3000/api';

// Интерфейс адреса, как в твоем бэкенде
interface Address {
    country?: string;
    town?: string;
    street?: string;
    houseNumber?: string;
}

export function renderDelivery(container: HTMLElement) {
    // 1. Вставляем HTML
    container.innerHTML = deliveryHtml;
    
    // 2. Инициализируем события
    initEventListeners();
}

function initEventListeners() {
    // Кнопки навигации
    document.getElementById('goHome')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/main');
    });

    document.getElementById('goBackBtn')?.addEventListener('click', () => {
        Router.navigate('/main');
    });

    // Форма доставки
    const form = document.getElementById('deliveryForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleDeliverySubmit);
    }
}

async function handleDeliverySubmit(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const errorDiv = document.getElementById('deliveryError') as HTMLDivElement;
    const successDiv = document.getElementById('deliverySuccess') as HTMLDivElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Формируем объект адреса
    const address: Address = {
        country: (document.getElementById('country') as HTMLInputElement).value.trim(),
        town: (document.getElementById('town') as HTMLInputElement).value.trim(),
        street: (document.getElementById('street') as HTMLInputElement).value.trim(),
        houseNumber: (document.getElementById('houseNumber') as HTMLInputElement).value.trim()
    };

    try {
        // Меняем состояние кнопки
        submitBtn.disabled = true;
        submitBtn.textContent = 'Оформление...';

        const response = await fetch(`${API_BASE_URL}/delivery/createDeliv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Address: address }),
            credentials: 'include'
        });

        if (response.ok) {
            successDiv.style.display = 'block';
            form.reset();
            // Перенаправляем на главную через 2 секунды
            setTimeout(() => {
                Router.navigate('/main');
            }, 2000);
        } else {
            const data = await response.json().catch(() => ({}));
            errorDiv.textContent = data.error || 'Ошибка при оформлении доставки. Возможно, корзина пуста.';
            errorDiv.style.display = 'block';
            
            // Возвращаем кнопку в исходное состояние
            submitBtn.disabled = false;
            submitBtn.textContent = 'Подтвердить заказ';
        }
    } catch (error) {
        errorDiv.textContent = 'Ошибка сети. Проверьте подключение.';
        errorDiv.style.display = 'block';
        
        // Возвращаем кнопку в исходное состояние
        submitBtn.disabled = false;
        submitBtn.textContent = 'Подтвердить заказ';
    }
}