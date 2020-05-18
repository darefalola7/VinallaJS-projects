const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -10 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -20 },
//   { id: 4, text: 'Camera', amount: 150 },
// ];

let localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

if (!localStorageTransactions) {
  localStorageTransactions = [];
}

let transactions = localStorageTransactions;

// Add transaction
function addTransaction(event) {
  event.preventDefault();

  if (!text.value.trim() && !amount.value.trim()) {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: genRandomId(),
      text: text.value,
      amount: +amount.value,
    };
    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
  }
}

function genRandomId() {
  return Math.floor(Math.random() * 100000);
}

// Add transactions to DOM List
function addTransactionDOM(transaction) {
  // Get Sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span><button onclick="removeTransaction(${
    transaction.id
  })" class="delete-btn">x</button>
  `;

  list.appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  init();
}

// Update the balance income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(amount => amount > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter(amount => amount < 0)
      .reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);
  // console.log(income, expense, total);
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init App
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
