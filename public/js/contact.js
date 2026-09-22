// contact forms validation.

const form = document.getElementById('contact-form');
const errorList = document.getElementById('form-errors');

form.addEventListener('submit', function (event) {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const errors = [];
// check name
  if (name.length < 2) {
    errors.push('Please enter your name (at least 2 characters).');
  }

  // simple pattern: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.push('Please enter a valid email address, e.g. name@example.com.');
  }

  if (message.length < 10) {
    errors.push('Your message should be at least 10 characters long.');
  }

  // If there are errors, stop the form sending and list them
  errorList.innerHTML = '';
  if (errors.length > 0) {
    event.preventDefault();
    errors.forEach(function (text) {
      const item = document.createElement('li');
      item.textContent = text;
      errorList.appendChild(item);
    });
  }
});