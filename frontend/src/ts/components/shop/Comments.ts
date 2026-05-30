import { t, applyTranslations } from '../../utils/i18n';

export interface Comment {
id: number;
productId: number;
userId: number;
userName: string;
rating: number;
text: string;
date: string;
}

export async function renderComments(productId: number, container: HTMLElement, isLoggedIn: boolean) {
try {
const commentsRes = await fetch(`http://localhost:3000/api/comments/product/${productId}`);
const comments: Comment[] = await commentsRes.json();
const avgRes = await fetch(`http://localhost:3000/api/comments/product/${productId}/avg`);
const avgData = await avgRes.json();
const avg = avgData.averageRating || 0;

const block = document.createElement('div');
block.className = 'comments-section';
block.style.marginTop = '30px';
const title = document.createElement('h3');
title.textContent = `${t('comments')} (${avg.toFixed(1)}⭐)`;
block.appendChild(title);

if (isLoggedIn) {
const form = document.createElement('div');
form.className = 'comment-form';
form.style.margin = '20px 0';
form.style.padding = '15px';
form.style.border = '1px solid #eee';
form.style.borderRadius = '8px';

const ratingSelect = document.createElement('select');
ratingSelect.id = 'ratingSelect';
ratingSelect.style.marginBottom = '10px';
ratingSelect.style.padding = '5px';
for (let i = 5; i >= 1; i--) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = `${i} ⭐`;
ratingSelect.appendChild(opt);
}
form.appendChild(ratingSelect);

const textarea = document.createElement('textarea');
textarea.id = 'commentText';
textarea.placeholder = t('leave_comment');
textarea.rows = 3;
textarea.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px;';
form.appendChild(textarea);

const submitBtn = document.createElement('button');
submitBtn.id = 'submitComment';
submitBtn.textContent = t('rate');
submitBtn.style.cssText = 'padding: 8px 16px; background: #f91155; color: white; border: none; border-radius: 4px; cursor: pointer;';
submitBtn.addEventListener('click', async () => {
const rating = parseInt(ratingSelect.value);
const text = textarea.value.trim();
if (!text) {
alert(t('enter_comment'));
return;
}
try {
const res = await fetch('http://localhost:3000/api/comments', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ productId, rating, text }),
credentials: 'include'
});
if (res.ok) {
alert(t('comment_added'));
// Обновляем комментарии
while (block.lastChild && block.lastChild !== title) block.removeChild(block.lastChild);
await renderComments(productId, block, isLoggedIn);
} else {
alert(t('comment_error'));
}
} catch (err) {
alert(t('network_error'));
}
});
form.appendChild(submitBtn);
block.appendChild(form);
}

const list = document.createElement('div');
list.className = 'comments-list';
if (comments.length === 0) {
const emptyP = document.createElement('p');
emptyP.textContent = t('comments_empty');
list.appendChild(emptyP);
} else {
comments.forEach((c: Comment) => {
const commentDiv = document.createElement('div');
commentDiv.style.borderBottom = '1px solid #eee';
commentDiv.style.padding = '10px 0';
const strong = document.createElement('strong');
strong.textContent = `${c.userName} (${c.rating}⭐) – ${new Date(c.date).toLocaleDateString()}`;
const p = document.createElement('p');
p.style.margin = '5px 0 0 20px';
p.textContent = c.text;
commentDiv.append(strong, p);
list.appendChild(commentDiv);
});
}
block.appendChild(list);
container.appendChild(block);
applyTranslations(block); // применяем переводы к блоку
} catch (err) {
console.error('Failed to load comments', err);
const errorDiv = document.createElement('div');
errorDiv.textContent = t('error_load_products');
errorDiv.style.color = 'red';
container.appendChild(errorDiv);
}
}