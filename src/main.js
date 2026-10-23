import './scss/main.scss';
import { initMenu } from './js/menu.js';
import { initForm } from './js/form.js';

// Tells the CSS that JS is running, so JS-only styles (like the dropdown menu) apply
document.documentElement.classList.add('js');

initMenu();
initForm();
