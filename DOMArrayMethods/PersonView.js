import { elements } from './base.js';
import { Person } from './Person.js';
export class PersonView {
  constructor(data) {
    this._persons = [];
    elements.viewarea.innerHTML = '';
    if (Array.isArray(data)) {
      data.forEach(d => {
        this.addUser(d);
      });
    } else {
      this.person = new Person(data);
      this._persons.push(this.person);
      this.render();
    }
  }

  render() {
    const htmlText = `
      <div class="slot" data-id="${this.person.id}" style="background-color: rgba(0, 0, 0, 0.808)">
          <div class="left">
          <div class="slot__image loading">
          <img
            src="${this.person.imageURL}"
            alt="${this.person.name}"
            />
          </div>
              <div class="info">
                <ul class="loc">
                  <li>${this.person.gender}</li>
                  <li>${this.person.city}</li>
                  <li>${this.person.country}</li>
                </ul>
                <p class="name">${this.person.name}</p>
                <ul class="bio">
                  <li>${this.person.phone}</li>
                  <li>${this.person.weeks}</li>
                  <li>${this.person.email}</li>
                </ul>
              </div>
            </div>
            <div class="right">
              <p class="networth">${this.person.networth}</p>
            </div>
          </div>
    `;
    elements.viewarea.insertAdjacentHTML('beforeend', htmlText);
  }

  renderSkeleton = () => {
    const htmlText = `
      <div class="slot" id="skeleton">
            <div class="left">
              <div class="slot__image loading">
                <!-- <img src="" alt="" /> -->
              </div>
              <div class="info">
                <ul class="loc loading"></ul>
                <p class="name loading"></p>
                <ul class="bio loading"></ul>
              </div>
            </div>
            <div class="right">
              <p class="networth loading"></p>
            </div>
          </div>
    `;
    elements.viewarea.insertAdjacentHTML('beforeend', htmlText);
  };

  removeSkeleton = () => {
    elements.viewarea.querySelector('#skeleton').remove();
  };

  addUser(person) {
    this.person = new Person(person);
    this._persons.push(this.person);
    this.render();
  }

  set persons(newPersons) {
    this._persons = newPersons;
    this.updateView();
  }

  get persons() {
    return this._persons;
  }

  updateView() {
    const ids = [];
    this.persons.forEach(person => {
      ids.push(parseInt(person.id));
    });

    const slots = Array.from(elements.viewarea.querySelectorAll('.slot'));
    slots.forEach((slot, i) => {
      if (!ids.includes(parseInt(slot.dataset.id))) {
        slot.remove();
      }
    });
  }

  updatePersons(type = '') {
    const slots = Array.from(elements.viewarea.querySelectorAll('.slot'));
    slots.forEach((slot, i) => {
      slot.querySelector('.networth').textContent = this.persons[i].networth;
    });
  }

  updateOrder() {
    this._persons.forEach((person, i) => {
      const slots = Array.from(
        elements.viewarea.getElementsByClassName('slot')
      );
      const newNode = slots.find(slot => slot.dataset.id == person.id);
      const refNode = slots[i];
      elements.viewarea.insertBefore(newNode, refNode);
    });
  }

  orderPersons() {
    this._persons.sort(this.dsc);
    this.updateOrder();
  }

  calcWealth() {
    const result = this._persons.reduce(
      (acc, curr) => acc + parseInt(curr.value),
      0
    );
    const htmlText = `
    
      <div class="slot" style="color: rgb(0, 0, 0); border-left: none;border-bottom: 4px solid rgb(182, 49, 78)">
          <div class="left">
            <h1 class="total">Total:</h1>
            </div>
            <div class="right">
              <p class="networth">$${result.toLocaleString()}</p>
            </div>
          </div>
    `;
    elements.viewarea.insertAdjacentHTML('beforeend', htmlText);
  }

  asc(a, b) {
    return a.value - b.value;
  }

  dsc(a, b) {
    return b.value - a.value;
  }
}
