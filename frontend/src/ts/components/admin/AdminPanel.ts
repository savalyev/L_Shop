import { Router } from '../../main';
import '../../../CSS/style_main.css';
import '../../../CSS/style_admin.css';
import { t } from '../../utils/i18n';

let currentUserRole: string | null = null;

async function getUserRole(): Promise<string | null> {
try {
const res = await fetch('http://localhost:3000/api/users/me', { credentials: 'include' });
if (res.ok) {
const user = await res.json();
return user.role || 'user';
}
return null;
} catch { return null; }
}

// Загрузка всех товаров для списка с правильной обработкой ответа сервера
async function loadProductsList(container: HTMLElement) {
try {
const res = await fetch('http://localhost:3000/api/products');
if (!res.ok) throw new Error('Failed to load products');
const rawData = await res.json();
// Сервер возвращает { data: [...] }
const products = rawData.data || (Array.isArray(rawData) ? rawData : []);
const list = document.createElement('div');
list.className = 'products-list';
list.style.display = 'grid';
list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
list.style.gap = '20px';
list.style.marginTop = '20px';

if (!products.length) {
const emptyMsg = document.createElement('p');
emptyMsg.textContent = t('nothing_found');
emptyMsg.style.textAlign = 'center';
list.appendChild(emptyMsg);
container.appendChild(list);
return;
}

products.forEach((product: any) => {
const card = document.createElement('div');
card.className = 'product-list-card';
card.style.cssText = 'border: 1px solid #eee; border-radius: 12px; padding: 15px; background: #fff;';
card.innerHTML = `
<img src="${product.images?.preview || ''}" style="width: 100%; height: 150px; object-fit: contain; margin-bottom: 10px;">
        <h4 style="margin: 0 0 8px;">${product.title}</h4>
        <p style="margin: 0 0 8px; color: #f91155; font-weight: bold;">${product.price} BYN</p>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button class="edit-product-btn btn-admin" data-id="${product.id}">${t('edit')}</button>
          <button class="delete-product-btn btn-admin btn-secondary" data-id="${product.id}">${t('delete')}</button>
        </div>
      `;
      list.appendChild(card);
    });
// Обработчики кнопок
list.querySelectorAll('.edit-product-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
e.stopPropagation();
const id = btn.getAttribute('data-id');
Router.navigate(`/admin/products?id=${id}`);
});
});
list.querySelectorAll('.delete-product-btn').forEach(btn => {
btn.addEventListener('click', async (e) => {
e.stopPropagation();
const id = btn.getAttribute('data-id');
if (confirm('Удалить товар?')) {
const delRes = await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE', credentials: 'include' });
if (delRes.ok) {
alert('Товар удалён');
location.reload();
} else {
const err = await delRes.json();
alert('Ошибка удаления: ' + (err.error || 'Неизвестная ошибка'));
}
}
});
});

container.appendChild(list);
} catch (err) {
console.error('loadProductsList error:', err);
const errorDiv = document.createElement('div');
errorDiv.className = 'message-banner error';
errorDiv.textContent = t('error_load_products');
container.appendChild(errorDiv);
}
}

export async function renderAdminPanel(container: HTMLElement) {
while (container.firstChild) container.removeChild(container.firstChild);

const role = await getUserRole();
currentUserRole = role;
const isAdmin = role === 'admin';
const isManager = role === 'manager';

if (!isAdmin && !isManager) {
const errorDiv = document.createElement('div');
errorDiv.className = 'admin-container';
errorDiv.innerHTML = `<div class="message-banner error">${t('access_denied')}</div>`;
container.appendChild(errorDiv);
return;
}

const mainDiv = document.createElement('div');
mainDiv.className = 'admin-container';

const header = document.createElement('div');
header.className = 'admin-header';
const title = document.createElement('h2');
title.textContent = isAdmin ? t('admin_panel') : t('manager_panel');
header.appendChild(title);

const actions = document.createElement('div');
actions.className = 'admin-actions';
const backBtn = document.createElement('button');
backBtn.textContent = t('back_to_main');
backBtn.className = 'btn-admin btn-outline';
backBtn.addEventListener('click', () => Router.navigate('/main'));
actions.appendChild(backBtn);

const createBtn = document.createElement('button');
createBtn.textContent = t('create_product');
createBtn.className = 'btn-admin';
createBtn.addEventListener('click', () => Router.navigate('/admin/products'));
actions.appendChild(createBtn);

header.appendChild(actions);
mainDiv.appendChild(header);

// Карточка со списком товаров
const productsCard = document.createElement('div');
productsCard.className = 'admin-card';
const productsTitle = document.createElement('h3');
productsTitle.textContent = t('products_management');
productsCard.appendChild(productsTitle);
mainDiv.appendChild(productsCard);
container.appendChild(mainDiv);

await loadProductsList(productsCard);

// Карточка управления ролями (только для админа)
if (isAdmin) {
const rolesCard = document.createElement('div');
rolesCard.className = 'admin-card';
const rolesTitle = document.createElement('h3');
rolesTitle.textContent = t('role_management');
rolesCard.appendChild(rolesTitle);

const usersContainer = document.createElement('div');
usersContainer.id = 'usersListContainer';
const loader = document.createElement('div');
loader.className = 'loader';
usersContainer.appendChild(loader);
rolesCard.appendChild(usersContainer);
mainDiv.appendChild(rolesCard);

try {
const usersRes = await fetch('http://localhost:3000/api/roles/users', { credentials: 'include' });
if (!usersRes.ok) throw new Error('Не удалось загрузить пользователей');
const users = await usersRes.json();

usersContainer.innerHTML = '';
if (!users.length) {
usersContainer.textContent = 'Нет пользователей';
return;
}

const list = document.createElement('ul');
list.className = 'user-list';
users.forEach((u: any) => {
const li = document.createElement('li');
const userSpan = document.createElement('span');
userSpan.className = 'user-info';
userSpan.textContent = `${u.name} (${u.email})`;
const roleSpan = document.createElement('span');
roleSpan.className = 'user-role';
roleSpan.textContent = u.role || 'user';
userSpan.appendChild(roleSpan);

const btnGroup = document.createElement('div');
btnGroup.style.display = 'flex';
btnGroup.style.gap = '8px';

const grantBtn = document.createElement('button');
grantBtn.textContent = t('make_manager');
grantBtn.className = 'btn-admin';
grantBtn.style.background = '#28a745';
grantBtn.addEventListener('click', async () => {
try {
const res = await fetch('http://localhost:3000/api/roles/grant-manager', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ userId: u.id }),
credentials: 'include'
});
if (res.ok) {
alert(t('role_updated'));
location.reload();
} else alert(t('error'));
} catch { alert(t('network_error')); }
});

const revokeBtn = document.createElement('button');
revokeBtn.textContent = t('remove_manager');
revokeBtn.className = 'btn-admin btn-secondary';
revokeBtn.addEventListener('click', async () => {
try {
const res = await fetch('http://localhost:3000/api/roles/revoke-manager', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ userId: u.id }),
credentials: 'include'
});
if (res.ok) {
alert(t('role_updated'));
location.reload();
} else alert(t('error'));
} catch { alert(t('network_error')); }
});

btnGroup.appendChild(grantBtn);
btnGroup.appendChild(revokeBtn);
li.appendChild(userSpan);
li.appendChild(btnGroup);
list.appendChild(li);
});
usersContainer.appendChild(list);
} catch (err) {
usersContainer.innerHTML = '<div class="message-banner error">Ошибка загрузки пользователей</div>';
}
}
}