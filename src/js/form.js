// Registration form: accessible inline errors on top of native validation.
// novalidate is added here, not in the HTML, so without JS the browser's own validation still runs.
const SUCCESS_MESSAGE = "Thanks! Your seat is reserved. We'll email your confirmation.";

export function initForm() {
  const form = document.querySelector('.form');
  if (!form) return;

  const success = document.querySelector('.register__success');
  const inputs = [...form.querySelectorAll('[required]')]; // the HTML decides what's validated
  const shownError = new Set(); // fields that have shown an error since the last successful submit

  form.noValidate = true;

  // Once a field has shown an error, re-check it while typing so the error clears as soon as it's fixed.
  // Fields that haven't errored yet stay quiet, so nobody is told off mid-typing.
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (shownError.has(input)) validateField(input);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // nothing is sent: there's no backend yet
    if (success) success.textContent = ''; // cleared first so the same message is announced again next time

    const invalid = inputs.filter((input) => !validateField(input));
    invalid.forEach((input) => shownError.add(input));

    if (invalid.length > 0) {
      invalid[0].focus(); // screen readers then read its error through aria-describedby
      return;
    }

    form.reset();
    shownError.clear();
    // The role="status" region is always in the page, so changing its text is announced
    if (success) success.textContent = SUCCESS_MESSAGE;
  });
}

// Uses the browser's own rules (required, type="email") through the Constraint Validation API.
function validateField(input) {
  const valid = input.validity.valid;
  const errorId = `${input.id}-error`;
  const error = document.getElementById(errorId);

  input.setAttribute('aria-invalid', String(!valid));
  if (error) error.hidden = valid;

  // A description linked by aria-describedby is read even when it's hidden,
  // so the link only exists while the error is actually shown.
  if (valid) {
    input.removeAttribute('aria-describedby');
  } else if (error) {
    input.setAttribute('aria-describedby', errorId);
  }
  return valid;
}
