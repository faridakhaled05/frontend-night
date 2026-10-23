import './scss/main.scss';
import { initMenu } from './js/menu.js';
import { initForm } from './js/form.js';

// The html.js class is set by an inline script in index.html's <head>, not here:
// it must run before first paint, or the mobile nav flashes open while this module loads.

initMenu();
initForm();
