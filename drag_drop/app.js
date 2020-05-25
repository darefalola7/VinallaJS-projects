const draggable_list = document.getElementById('draggable-list');
const check = document.getElementById('check');

const richestPeople = [
  'Jeff Bezos',
  'Bill Gates',
  'Warren Buffett',
  'Bernard Arnault',
  'Carlos Slim Helu',
  'Amancio Ortega',
  'Larry Ellison',
  'Mark Zuckerberg',
  'Michael Bloomberg',
  'Larry Page',
];

// Store listitems
const listItems = [];

let dragStartIndex;

createList();

// Insert list items into the DOM
function createList() {
  [...richestPeople]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach((person, index) => {
      const listItem = document.createElement('li');
      listItem.setAttribute('data-index', index);

      listItem.innerHTML = `<span class="number">${index + 1}</span>
    <div class="draggable" draggable="true">
    <p class="person-name">${person}</p>
    <img src="./img/menu.svg" alt="menu" />
    </div>
    `;
      draggable_list.append(listItem);
      listItems.push(listItem);
    });
  addEventListeners();
}

function dragStart() {
  // console.log('Event: dragstart');
  dragStartIndex = +this.closest('li').dataset.index;
}
function dragEnter() {
  // console.log('Event: dragEnter');
  this.classList.add('over');
}
function dragLeave() {
  // console.log('Event: dragLeave');
  this.classList.remove('over');
}
function dragOver(e) {
  // console.log('Event: dragOver');
  e.preventDefault();
}
function dragDrop() {
  // console.log('Event: drop');
  const dragEndingIndex = this.dataset.index;
  swapItems(dragStartIndex, dragEndingIndex);

  this.classList.remove('over');
}
// swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector('.draggable');
  const itemTwo = listItems[toIndex].querySelector('.draggable');

  listItems[fromIndex].append(itemTwo);
  listItems[toIndex].append(itemOne);
}

// check the order of list items
function checkOrder() {
  listItems.forEach((listItem, index) => {
    const personName = listItem
      .querySelector('.draggable .person-name')
      .innerText.trim();

    if (personName !== richestPeople[index]) {
      listItem.classList.add('wrong');
      console.log(personName, richestPeople[index]);
    } else {
      listItem.classList.remove('wrong');
      listItem.classList.add('right');
    }
  });
}

function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable-list li');
  // listItems = dragListItems;
  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
}

check.addEventListener('click', checkOrder);
