import { setLocale, getLocale, showLocaleModalIfNeeded } from '../../utils/i18n';

let switcherAdded = false;

export function initLanguageSwitcher() {
if (switcherAdded) return;

// Показываем модальное окно выбора страны, если ещё не выбрано
showLocaleModalIfNeeded();

const current = getLocale();
const switcher = document.createElement('div');
switcher.className = 'language-switcher';
switcher.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: white; border: 1px solid #ccc; border-radius: 8px; padding: 8px 12px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
switcher.innerHTML = `        <button data-lang="ru" style="margin-right: 8px; ${current === 'ru' ? 'font-weight: bold; color: #f91155;' : ''}">🇷🇺 RU</button>
        <button data-lang="en" ${current === 'en' ? 'font-weight: bold; color: #f91155;' : ''}>🇬🇧 EN</button>
   `;
switcher.querySelectorAll('button').forEach(btn => {
btn.addEventListener('click', () => {
const lang = btn.getAttribute('data-lang') as 'ru' | 'en';
if (lang && lang !== getLocale()) {
setLocale(lang);
location.reload();
}
});
});
document.body.appendChild(switcher);
switcherAdded = true;
}