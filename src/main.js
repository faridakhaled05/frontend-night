document.documentElement.classList.add('js');

import './scss/main.scss';

// Mobile menu: toggles aria-expanded; the CSS shows the nav when it's "true".
const menuBtn = document.querySelector('.site-header__menu-btn');
const nav = document.getElementById('site-nav');

function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuBtn?.addEventListener('click', () => {
  setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
});

// Close the menu after tapping a link
nav?.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
