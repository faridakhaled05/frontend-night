// Mobile menu. JS only flips aria-expanded on the button;
// the CSS shows the nav when it's "true", so the visual and announced states always match.
export function initMenu() {
  const button = document.querySelector('.site-header__menu-btn');
  const nav = document.getElementById('site-nav');
  if (!button || !nav) return;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  function setMenu(open) {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  button.addEventListener('click', () => setMenu(!isOpen()));

  // Close after tapping a link, so the panel doesn't cover the section you jumped to
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  // Escape closes the menu and returns focus to the button, so keyboard users aren't left inside a hidden panel
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setMenu(false);
    button.focus();
  });
}
