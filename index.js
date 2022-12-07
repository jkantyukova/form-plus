/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
const name = document.querySelector('#name');
const secondName = document.querySelector('#secondName');
const email = document.querySelector('#email');
const dateOfBirth = document.querySelector('#dateOfBirth');
const btn = document.querySelector('.btn');
const users = document.querySelector('.users');
const clear = document.querySelector('.clear');

// Объект для localStorage
const storage = JSON.parse(localStorage.getItem('users')) || {};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      console.log('Карта USERS обновилась');
      setListeners();
    }
  });
});

observer.observe(users, {
  childList: true,
});

btn.addEventListener('click', getData);
clear.addEventListener('click', clearLocalStorage);

function getData(e) {
  e.preventDefault();

  if (!email.value) {
    return;
  }
  const data = {};

  data.name = name.value || '';
  data.secondName = secondName.value || '';
  data.dateOfBirth = dateOfBirth.value || '';
  data.email = email.value || '';

  const key = data.email;
  storage[key] = data;

  localStorage.setItem('users', JSON.stringify(storage));

  rerenderCard(JSON.parse(localStorage.getItem('users')));

  // eslint-disable-next-line consistent-return
  return data;
}

function createCard({ name, secondName, dateOfBirth, email }) {
  return `
        <div data-out=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p>${dateOfBirth}</p>
                <p>${email}</p>
            </div>
            <div class="menu">
                <button data-delete=${email} class="delete">Удалить</button>
                <button data-change=${email} class="change">Применить</button>
            </div>
        </div>
    `;
}

function rerenderCard(storage) {
  users.innerHTML = '';

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
     */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
     */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]
    const [email, userData] = user;
    console.log('USER  === ', user);
    console.log('EMAIL === ', email);
    console.log('DATA  === ', userData);

    const div = document.createElement('div');
    div.className = 'user';
    div.innerHTML = createCard(userData);
    users.append(div);
  });
}

function setListeners() {
  const del = document.querySelectorAll('.delete');
  const change = document.querySelectorAll('.change');
  let clicked;

  del.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('УДАЛИТЬ кнопка');
      console.log('=== NODE:', n);
      clicked = n.getAttribute('data-delete');

      const outer = document.querySelector(`[data-out="${clicked}"]`);

      outer.remove();
      delete storage[clicked];
      localStorage.setItem('users', JSON.stringify(storage));

      console.log('=== outer', outer);
    });
  });

  change.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('=== ПРИМЕНИТЬ кнопка');
      clicked = n.getAttribute('data-change');
      email.value = clicked;
      name.value = storage[clicked].name;
      secondName.value = storage[clicked].secondName;
      dateOfBirth.value = storage[clicked].dateOfBirth;
    });
  });
}

function clearLocalStorage() {
  window.location.reload();
  localStorage.removeItem('users');
}

function show(el) {
  el.style.display = 'block';
}

function hide(el) {
  el.style.display = 'none';
}

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')));
