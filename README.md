# Frontend Night: Event Page

A single-page event site for a frontend meetup, built with semantic HTML, a token-based SCSS architecture and a small amount of JavaScript.

- Live: https://faridakhaled05.github.io/frontend-night/
- Repo: https://github.com/faridakhaled05/frontend-night

## Run locally

```bash
npm install
npm run dev      # dev server at http://localhost:5173/frontend-night/ (path comes from `base` in vite.config.js)
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
```

## Tech stack

| Tool | Why |
|---|---|
| Vite | Fast dev server, built-in Sass support and a production build with no extra config. |
| Dart Sass (`@use` / `@forward`) | Namespaced modules with no global leaks; `@import` is deprecated. |
| Plain JavaScript | A mobile menu and form validation on one static page don't need a framework. |

## File structure

```
public/
├── favicon.svg
└── images/speakers/   salma-adel.jpg  omar-fathy.jpg  nour-hassan.jpg  karim-mostafa.jpg
src/
├── main.js
├── js/                menu.js  form.js
└── scss/
    ├── main.scss
    ├── abstracts/   _index  _breakpoints  _colors  _mixins  _radii  _spacing  _typography
    ├── base/        _root  _reset  _typography  _focus
    ├── layout/      _container  _header  _footer  _section
    ├── components/  _button  _card  _checkbox  _choice  _eyebrow  _faq  _field
    │                _icon  _logo  _section-head  _speaker  _tag
    └── sections/    _hero  _agenda  _speakers  _register
```

| Folder | Contents |
|---|---|
| `public/` | Static files copied to the build as-is (favicon, speaker photos). |
| `js/` | One module per behaviour, imported by `main.js`. |
| `abstracts/` | Tokens, mixins, breakpoints. Outputs no CSS. |
| `base/` | `:root` custom properties, reset, element typography, focus style. |
| `layout/` | Parts that appear once: container, header, footer, section. |
| `components/` | Reusable blocks, one BEM block per partial. |
| `sections/` | Page sections used once. |
| `main.scss` | Only `@use` lines. Their order is the cascade order. |

Why: a trimmed 7-1 pattern, so each file has one job and is easy to find.

## Design tokens

- **Flow:** Sass maps (`$colors`, `$spaces`, `$radii`, `$type-mobile`/`$type-desktop`) → `@each` loops in `base/_root.scss` → CSS custom properties on `:root` → components use `var()`.
- **Units:** sizes in `rem` so they respect the user's font settings; breakpoints in `em` (`$bp-tablet: 48em`, `$bp-desktop: 68.75em`).
- **Breakpoints are the only tokens kept Sass-only**, because `var()` can't be used in a media query condition.
- **Responsive type:** the `type-tokens` mixin turns px pairs into `--fs-*` / `--lh-*`. They are redefined in one media query in `:root`, so headings, body text, labels and buttons resize without their own media queries.
- **Mobile-first:** defaults first, overrides in `min-width` queries after them.
- **Exception:** border and outline widths (1px, 1.5px, 2px) stay in px so they stay crisp.

## Reusable components

| Component | Variants / elements | Used in |
|---|---|---|
| `.button` | `--primary`, `--ghost`, `--sm`, `--block` | Header nav, hero, register form |
| `.card` | `--elevated`, `__title` | Hero "At a glance", register |
| `.tag` | `--outline`, `--accent`, `--muted` | Hero, agenda |
| `.eyebrow` | none | Agenda, speakers, FAQ headings |
| `.section-head` | `__title`, `__text` | Agenda, speakers, FAQ |
| `.speaker` | `__photo`, `__name`, `__role` | Speakers |
| `.field` | `__label`, `__input`, `__error`, `__select`, `__chevron` | Register form |
| `.choice` | `.choices` wrapper, `__input` | Register form (experience level) |
| `.checkbox` | `__input` | Register form |
| `.faq` | `__intro`, `__list`, `__item`, `__question`, `__icon`, `__answer` | FAQ |
| `.logo` | `--sm`, `__mark`, `__text` | Header, footer |
| `.icon` | none (size set per use) | Header, hero, FAQ, register form |

- **BEM naming:** `block__element`, `block--modifier`, always used alongside the base class (`button button--primary`).
- **Custom properties as the API:** components expose variables such as `--btn-height`, `--card-pad` and `--tag-height`. Modifiers and media queries change those variables instead of repeating declarations (for example, `.register` resizes the card by setting `--card-pad`).
- **Shared text style:** `.tag`, `.eyebrow` and `.facts__label` share one `text-tag` mixin.

## Semantic HTML and accessibility

- **Landmarks:** `header`, `nav aria-label="Main"`, `main`, each `section` with `aria-labelledby` pointing at its heading, and `footer` with `nav aria-label="Footer"`.
- **Heading outline:** one `h1` (hero), an `h2` for each section and the "At a glance" card, and `h3` for agenda items and speaker names.
- **Element choices:**
  - `aside` + `dl`: the key facts sit beside the main content and are label/value pairs.
  - `ol` for the agenda: order matters.
  - `ul` for speakers: order doesn't matter.
  - `article` + `h3` for each speaker card: each one makes sense on its own.
  - `details` / `summary` for the FAQ: open and close work natively, with the keyboard and with screen readers.
  - `fieldset` / `legend` for the radio group: the question is read out with each option.
  - `time datetime` for dates and times: machine-readable.
- **`role="list"`** on styled lists restores the list semantics Safari drops when `list-style: none` is set.
- **Focus:** a global `:focus-visible` ring, recoloured white on dark backgrounds.
- **Form:** each input points to its error message with `aria-describedby`. JS sets `aria-invalid`, and the error styling keys off `aria-invalid="true"`, not a class.
- **Radios stay focusable:** the real input is invisible (`opacity: 0`) and laid over the pill, not `display: none`, so keyboard and screen reader access is kept.
- **`alt=""` on speaker photos:** the name is right next to the image, so alt text would be read twice.
- **Touch targets:** the menu button, small button and radio pills are at least 44px tall.
- **`prefers-reduced-motion`:** turns off button hover motion and the FAQ icon rotation.

## JavaScript

Principle: progressive enhancement. The page works without JS; JS adds the `html.js` class and behaviour on top.

`src/main.js` adds `js` to `<html>` and starts the two modules below. CSS uses the class to turn the mobile nav into a hidden dropdown and to show the menu button. Without JS, the nav stays visible as a stacked list and the button is hidden.

### Mobile menu (`src/js/menu.js`)

- Toggles `aria-expanded` and `aria-label` ("Open menu" / "Close menu") on the menu button. CSS shows the nav when `aria-expanded="true"`, so the visual state and the announced state can't drift apart.
- Closes the menu after a nav link is tapped, so the panel doesn't cover the section you jumped to.
- Escape closes the open menu and moves focus back to the button, so keyboard users aren't left in a hidden panel.

Why JS: a toggle button with a correct `aria-expanded` state can't be built in CSS alone.

### Form validation (`src/js/form.js`)

- JS adds `novalidate` to the form. It isn't in the HTML, so without JS the browser's native validation still runs.
- Checks `#name` and `#email` with the Constraint Validation API (`input.validity.valid`), so the rules come from `required` and `type="email"` in the HTML, with no regex.
- Invalid field: `aria-invalid="true"`, and the error linked by `aria-describedby` is un-hidden. Valid field: `aria-invalid="false"`, and the error is hidden again.
- On submit, focus moves to the first invalid field, so its error is read out.
- Errors appear only on submit. After that, the field is re-checked on every `input`, so its error clears as soon as it's fixed.
- A valid submit resets the form and shows `.register__success`, a `role="status"` message that screen readers announce.

Why JS: native error bubbles can't be styled or placed next to the field, and they disappear quickly.

Deliberately not JavaScript:

- FAQ open/close and the + to × icon rotation: native `details` plus `.faq__item[open]` in CSS.
- Radio pill selected and focus states: `.choice:has(:checked)` and `.choice:has(:focus-visible)`.

## Going live

- Hosted on **GitHub Pages**, deployed with **GitHub Actions** (`.github/workflows/deploy.yml`).
- `base: '/frontend-night/'` in `vite.config.js`: project sites are served from a subfolder named after the repo, so asset URLs need that prefix.
- The workflow runs `npm ci` → `npm run build` → uploads `dist/` → deploys to Pages.
- It redeploys on every push to `main` (and can be run by hand with `workflow_dispatch`).
- `dist/` is not committed (it's in `.gitignore`) because it's built on the server.

## Unclear in the design

Where the style guide didn't specify something, values were taken from the design's HTML frames (375px and 1440px). Where neither covered it, for example layouts between 768 and 1100px, I made a judgement call based on the closest frame.
