// src/ts/components/shop/deliveryComponent.ts
import '../../../CSS/style_main.css';
import { Router } from '../../main';

const API_BASE_URL = 'http://localhost:3000/api';

// Интерфейс адреса, как в твоем бэкенде
interface Address {
    country?: string;
    town?: string;
    street?: string;
    houseNumber?: string;
}

export function renderDelivery(container: HTMLElement) {
    container.innerHTML = `
        <header class="shop-header">
            <div class="container header-inner">
                <a href="#" id="goHome" class="shop-logo">REUTKUPI</a>
                <div class="header-actions">
                    <button class="action-btn" id="goBackBtn">Назад</button>
                </div>
            </div>
        </header>

        <div class="container" style="max-width: 600px; margin-top: 40px; margin-bottom: 40px;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 24px;">Оформление доставки</h2>
                
                <div id="deliveryError" style="display: none; background: #ffebee; color: #ff4757; padding: 10px; border-radius: 6px; margin-bottom: 15px;"></div>
                <div id="deliverySuccess" style="display: none; background: #e8f5e9; color: #2ed573; padding: 10px; border-radius: 6px; margin-bottom: 15px;">Заказ успешно оформлен!</div>

                <!-- ВАЖНО: Атрибут data-delivery по требованиям ТЗ -->
                <form id="deliveryForm" data-delivery style="display: flex; flex-direction: column; gap: 15px;">
                    
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label for="country" style="font-weight: 500; font-size: 14px;">Страна</label>
                        <input type="text" id="country" required placeholder="Например: Belarus" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label for="town" style="font-weight: 500; font-size: 14px;">Город</label>
                        <input type="text" id="town" required placeholder="Например: Minsk" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                    </div>

                    <div style="display: flex; gap: 15px;">
                        <div style="display: flex; flex-direction: column; gap: 5px; flex: 2;">
                            <label for="street" style="font-weight: 500; font-size: 14px;">Улица</label>
                            <input type="text" id="street" required placeholder="Например: Ленина" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 5px; flex: 1;">
                            <label for="houseNumber" style="font-weight: 500; font-size: 14px;">Дом/Квартира</label>
                            <input type="text" id="houseNumber" required placeholder="12-4" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 10px 0;">

                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label for="phone" style="font-weight: 500; font-size: 14px;">Телефон для связи</label>
                        <input type="text" id="phone" required placeholder="+375 XX XXX-XX-XX" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="payment" style="font-weight: 500; font-size: 14px;">Способ оплаты</label>
    <select id="payment" disabled style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background-color: #f5f5f5;">
        <option value="cash" selected>Наличными курьеру (онлайн оплата временно недоступна)</option>
    </select>
</div>

                    <button type="submit" style="margin-top: 10px; padding: 12px; background: #ff4757; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;">
                        Подтвердить заказ
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('goHome')?.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('/main');
    });

    document.getElementById('goBackBtn')?.addEventListener('click', () => {
        Router.navigate('/main');
    });

    const form = document.getElementById('deliveryForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();

            const errorDiv = document.getElementById('deliveryError') as HTMLDivElement;
            const successDiv = document.getElementById('deliverySuccess') as HTMLDivElement;
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            const address: Address = {
                country: (document.getElementById('country') as HTMLInputElement).value.trim(),
                town: (document.getElementById('town') as HTMLInputElement).value.trim(),
                street: (document.getElementById('street') as HTMLInputElement).value.trim(),
                houseNumber: (document.getElementById('houseNumber') as HTMLInputElement).value.trim()
            };

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Оформление...';

                const response = await fetch(`${API_BASE_URL}/delivery/createDeliv`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Исправлено: отправляем объект в свойстве Address (с большой буквы)
                    body: JSON.stringify({ Address: address }),
                    credentials: 'include'
                });

                if (response.ok) {
                    successDiv.style.display = 'block';
                    form.reset();
                    // Перенаправляем на главную через 2 секунды.
                    setTimeout(() => {
                        Router.navigate('/main');
                    }, 2000);
                } else {
                    const data = await response.json().catch(() => ({}));
                    errorDiv.textContent = data.error || 'Ошибка при оформлении доставки. Возможно, корзина пуста.';
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Подтвердить заказ';
                }
            } catch (error) {
                errorDiv.textContent = 'Ошибка сети. Проверьте подключение.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Подтвердить заказ';
            }
        });
    }
}