class Form {
  constructor() {
    this.username;
    this.email;
    this.password;
    this.button = document.querySelector('.form__button');

    this.button.addEventListener('click', this.formHandler.bind(this));
  }

  formHandler(event) {
    event.preventDefault();
    this.username = this._testUsername(3);
    this.email = this._testEmail();
    this.password = this._testPassword();
    const result = this._testEqualPassword();
    if (this.username && this.email && this.password && result) {
      console.log({
        username: this.username,
        email: this.email,
        password: this.password,
        correct: true,
      });
    }
  }
  _createErrorElement(text, el, isHTML = false) {
    this._removeErrorElement(el.id);
    const p = document.createElement('p');
    if (isHTML) {
      p.innerHTML = text;
    } else {
      p.textContent = text;
    }
    p.style.color = 'red';
    p.style.fontSize = '1rem';
    el.insertAdjacentElement('afterend', p);
  }

  _removeErrorElement(id) {
    const p = document.querySelector(`#${id} + p`);
    if (p) {
      p.remove();
    }
  }
  _testUsername(length) {
    const el = document.getElementById('username');

    if (el.value.trim().length < length) {
      this._createErrorElement(
        'Username must be at least 3 characters long',
        el
      );
      return '';
    }
    this._removeErrorElement('username');
    return el.value.trim();
  }

  _testEmail() {
    const el = document.getElementById('email');
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(el.value.toLowerCase())) {
      this._createErrorElement('Must be a valid email address', el);
      return '';
    }

    this._removeErrorElement('email');
    return el.value.trim();
  }

  _testPassword() {
    const el = document.getElementById('password');
    let issues;
    // Must be at least 8 characters
    issues =
      el.value.trim().length >= 8
        ? ''
        : 'Password must be at least 8 characters,';
    // Must includes capital letter character
    let re = /(?=.*[A-Z])/;
    issues += re.test(el.value.trim())
      ? ''
      : 'Password must include at least capital letter,';
    // must include symbols
    // re = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    re = /(?=.*\W)/;
    issues += re.test(el.value.trim()) ? '' : 'Password must include symbols,';
    // must include numbers
    re = /(?=.*[0-9])/;
    issues += re.test(el.value.trim())
      ? ''
      : 'Password must include at least one number';
    if (issues) {
      const msgs = issues.split(',');
      const text = `<ul style='list-style: none'>
                ${msgs
                  .map(msg => {
                    if (msg) return '<li>' + msg + '</li>';
                  })
                  .join('')}
              </ul>`;
      this._createErrorElement(text, el, true);
      return '';
    }

    this._removeErrorElement('password');
    return el.value.trim();
  }

  _testEqualPassword() {
    const el1 = document.getElementById('password');
    const el2 = document.getElementById('confirm-password');
    if (el1.value.trim() === el2.value.trim()) {
      this._removeErrorElement(el2.id);
      return true;
    } else {
      this._createErrorElement('Password must be exactly the same', el2);
      return false;
    }
  }
}

new Form();
