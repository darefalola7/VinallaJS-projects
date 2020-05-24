const clearBtn = document.getElementById('clear');
const showBtn = document.getElementById('show');
const cardContainer = document.getElementById('cards-container');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const closeBtn = document.getElementById('close');
const newQuestion = document.getElementById('question');
const newAnswer = document.getElementById('answer');
const addCard = document.getElementById('add-card');
const newCardContainer = document.getElementById('add-container');
const current = document.getElementById('current');

const storedCards = JSON.parse(localStorage.getItem('cards'));
let cards = storedCards ? storedCards : [];
const width = '640';
let currentWidth = 0;
let counter = 1;
let start = true;
let cardNumber = 1;

function addNewCard(event) {
  const question = newQuestion.value.trim();
  const answer = newAnswer.value.trim();
  if (!question || !answer) {
    alert('Fill in data!');
    return;
  }

  cards.push({ question, answer });
  localStorage.setItem('cards', JSON.stringify(cards));
  newQuestion.value = '';
  newAnswer.value = '';
  closeBtn.click();
  displayCards();
}

function displayCards() {
  cardContainer.innerHTML = '';
  if (cards.length) {
    cards.forEach((card, i) => {
      const div = document.createElement('div');
      div.classList.add('card');
      if (i === 0) div.classList.add('active');

      const cardHtml = `
        <div id="progressbar${i}"></div>
        <div class="card-inner">
          <div class="card-inner-front">
          <button>
            <img src="./img/interface.svg" />
            Flip
          </button>
          <span>Question:</span>  
          <p>
            ${card.question}
          </p>
          </div>
          <div class="card-inner-back">
            <button>
              <img src="./img/interface.svg" />
              Flip
            </button>
            <span>Answer:</span>
            <p>
              ${card.answer}
            </p>
          </div>
        </div>
      `;
      div.innerHTML = cardHtml;
      cardContainer.append(div);
    });
    current.textContent = `${cardNumber}/${cards.length}`;
    createProgressbar('progressbar0', '10s', () => {
      next.click();
    });
  } else {
    current.textContent = '0/0';
  }
}

function createProgressbar(id, duration, callback) {
  // We select the div that we want to turn into a progressbar
  var progressbar = document.getElementById(id);
  progressbar.className = 'progressbar';

  // We create the div that changes width to show progress
  var progressbarinner = document.createElement('div');
  progressbarinner.className = 'inner';

  // Now we set the animation parameters
  progressbarinner.style.animationDuration = duration;

  // Eventually couple a callback
  if (typeof callback === 'function') {
    progressbarinner.addEventListener('animationend', callback);
  }

  // Append the progressbar to the main progressbardiv
  progressbar.appendChild(progressbarinner);

  // When everything is set up we start the animation
  progressbarinner.style.animationPlayState = 'running';
}

// Event listeners
showBtn.addEventListener('click', () => {
  newCardContainer.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  newCardContainer.classList.remove('show');
});

addCard.addEventListener('click', addNewCard);

cardContainer.addEventListener('click', event => {
  const card = event.target.closest('.active');
  if (card) {
    card.querySelector('.card-inner-front').classList.toggle('flip');
    card.querySelector('.card-inner-back').classList.toggle('flip');
  }
});

prev.addEventListener('click', () => {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;
  if (currentWidth > 0) {
    counter--;
    cardNumber--;
    if (currentWidth === counter * width) counter--;
    cards.forEach((card, i) => {
      card.style.transform = `translateX(-${width * counter}px)`;
      card.classList.remove('active');
      if (cardNumber === i + 1) {
        card.classList.add('active');
      }
    });
    currentWidth = width * counter;
    current.textContent = `${cardNumber}/${cards.length}`;
  }
});

next.addEventListener('click', () => {
  const cards = document.querySelectorAll('.card');

  if (!cards.length) return;
  if (currentWidth === 0 && !start) counter++;
  start = false;
  const totalWidth = width * (cards.length - 1);
  if (currentWidth < totalWidth) {
    cardNumber++;
    cards.forEach((card, i) => {
      card.style.transform = `translateX(-${width * counter}px)`;
      card.classList.remove('active');
      if (cardNumber === i + 1) {
        card.classList.add('active');
      }
    });
    currentWidth = width * counter;
    counter++;
    current.textContent = `${cardNumber}/${cards.length}`;
    createProgressbar(`progressbar${cardNumber - 1}`, '10s', () => {
      next.click();
    });
  }
});

clearBtn.addEventListener('click', () => {
  localStorage.clear();
  cards = [];
  let currentWidth = 0;
  let counter = 1;
  let start = true;
  let cardNumber = 1;
  displayCards();
  alert('Cleared!');
});

// addEventListener('load', function () {
//   createProgressbar('progressbar', '10s');
// });

displayCards();
