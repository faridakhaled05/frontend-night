// Registration form: accessible inline errors on top of native validation.
// novalidate is added here, not in the HTML, so without JS the browser's own validation still runs.
export function initForm() {
  const form = document.querySelector('.form');
  if (!form) return;

  const success = document.querySelector('.register__success');
  const inputs = [...form.querySelectorAll('#name, #email')];
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
    if (success) success.hidden = true;

    const invalid = inputs.filter((input) => !validateField(input));
    invalid.forEach((input) => shownError.add(input));

    if (invalid.length > 0) {
      invalid[0].focus(); // screen readers then read its error through aria-describedby
      return;
    }

    form.reset();
    shownError.clear();
    if (success) success.hidden = false; // role="status" makes screen readers announce it
  });
}

// Uses the browser's own rules (required, type="email") through the Constraint Validation API.
function validateField(input) {
  const valid = input.validity.valid;
  const error = document.getElementById(input.getAttribute('aria-describedby'));

  input.setAttribute('aria-invalid', String(!valid));
  if (error) error.hidden = valid;
  return valid;
}
