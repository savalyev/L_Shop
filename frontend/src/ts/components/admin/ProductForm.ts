import { Router } from '../../main';
import { Product } from '../../types/api';
import '../../../CSS/style_main.css';
import '../../../CSS/style_admin.css';
import { t } from '../../utils/i18n';

export async function renderProductForm(container: HTMLElement, productId?: number) {
while (container.firstChild) container.removeChild(container.firstChild);

const mainDiv = document.createElement('div');
mainDiv.className = 'admin-container';

const header = document.createElement('div');
header.className = 'admin-header';
const title = document.createElement('h2');
title.textContent = productId ? t('edit_product') : t('create_product');
header.appendChild(title);

const backBtn = document.createElement('button');
backBtn.textContent = t('back_to_admin');
backBtn.className = 'btn-admin btn-outline';
backBtn.addEventListener('click', () => Router.navigate('/admin'));
header.appendChild(backBtn);
mainDiv.appendChild(header);

const card = document.createElement('div');
card.className = 'admin-card';

let product: Product | null = null;
if (productId) {
const loader = document.createElement('div');
loader.className = 'loader';
card.appendChild(loader);
mainDiv.appendChild(card);
container.appendChild(mainDiv);
try {
const res = await fetch(`http://localhost:3000/api/products/${productId}`);
if (!res.ok) throw new Error('Товар не найден');
const rawData = await res.json();
// Сервер возвращает { data: {...} }
product = rawData.data || rawData;
} catch (err) {
card.innerHTML = '<div class="message-banner error">Ошибка загрузки товара</div>';
return;
}
card.innerHTML = '';
}

const form = document.createElement('form');
form.className = 'admin-form';

const fields = [
{ label: t('product_name'), id: 'title', type: 'text', value: product?.title || '' },
{ label: t('price_byn'), id: 'price', type: 'number', value: product?.price || 0, step: '0.01' },
{ label: t('description'), id: 'description', type: 'textarea', value: product?.description || '' },
{ label: t('categories_comma'), id: 'categories', type: 'text', value: product?.categories?.join(',') || '' },
{ label: t('image_url'), id: 'preview', type: 'text', value: product?.images?.preview || '' },
{ label: t('discount_percent'), id: 'discount', type: 'number', value: product?.discount || 0, step: '1' }
];

fields.forEach(f => {
const group = document.createElement('div');
group.className = 'admin-form-group';
const label = document.createElement('label');
label.htmlFor = f.id;
label.textContent = f.label;
group.appendChild(label);

if (f.type === 'textarea') {
const textarea = document.createElement('textarea');
textarea.id = f.id;
textarea.value = String(f.value);
textarea.rows = 4;
group.appendChild(textarea);
} else {
const input = document.createElement('input');
input.id = f.id;
input.type = f.type;
input.value = String(f.value);
if (f.step) input.step = f.step;
group.appendChild(input);
}
form.appendChild(group);
});

const availGroup = document.createElement('div');
availGroup.className = 'admin-form-group admin-form-checkbox';
const availLabel = document.createElement('label');
availLabel.htmlFor = 'isAvailable';
availLabel.textContent = t('in_stock');
const availCheck = document.createElement('input');
availCheck.id = 'isAvailable';
availCheck.type = 'checkbox';
availCheck.checked = product?.isAvailable ?? true;
availGroup.appendChild(availLabel);
availGroup.appendChild(availCheck);
form.appendChild(availGroup);

const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.textContent = t('save');
submitBtn.className = 'btn-admin';
form.appendChild(submitBtn);

card.appendChild(form);
mainDiv.appendChild(card);
container.appendChild(mainDiv);

form.addEventListener('submit', async (e) => {
e.preventDefault();
submitBtn.disabled = true;
submitBtn.textContent = t('saving');

const payload = {
title: (document.getElementById('title') as HTMLInputElement).value.trim(),
price: parseFloat((document.getElementById('price') as HTMLInputElement).value),
description: (document.getElementById('description') as HTMLTextAreaElement).value.trim(),
categories: (document.getElementById('categories') as HTMLInputElement).value.split(',').map(c => c.trim()).filter(c => c),
images: { preview: (document.getElementById('preview') as HTMLInputElement).value.trim() },
discount: parseInt((document.getElementById('discount') as HTMLInputElement).value) || 0,
isAvailable: (document.getElementById('isAvailable') as HTMLInputElement).checked,
};

if (!payload.title) {
alert(t('name_required'));
submitBtn.disabled = false;
submitBtn.textContent = t('save');
return;
}

try {
const url = productId ? `http://localhost:3000/api/products/${productId}` : `http://localhost:3000/api/products`;
const method = productId ? 'PUT' : 'POST';
const res = await fetch(url, {
method,
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
credentials: 'include'
});
if (res.ok) {
alert(t('saved'));
Router.navigate('/admin');
} else {
const errData = await res.json();
alert(t('error') + ': ' + (errData.error || errData.message || 'Unknown error'));
}
} catch (err) {
alert(t('network_error'));
} finally {
submitBtn.disabled = false;
submitBtn.textContent = t('save');
}
});
}