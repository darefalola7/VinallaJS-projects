import { Customer } from './Customer.js';

class App {
  constructor(customerName) {
    this.select = document.querySelector('#movie');
    this.customer = new Customer(
      customerName,
      this.select.options[this.select.selectedIndex].text,
      this.select.options[this.select.selectedIndex].value
    );
    this.nameLabel = document.getElementById(
      'cust-name'
    ).textContent = `Customer Name: ${customerName}`;
    // globalThis.cust = this.customer;
    this.textCount = document.getElementById('count');
    this.textPrice = document.getElementById('total');
    this.coverRow = document.getElementById('cover-row');
    this.complete = document.getElementById('complete');
    this.clear = document.getElementById('clear');
    this.loadData();
    this.complete.addEventListener('click', this.completeHandler.bind(this));
    this.clear.addEventListener('click', this.clearHandler.bind(this));
    this.coverRow.addEventListener('click', this.runHandler.bind(this));
    this.select.addEventListener('change', this.changeHandler.bind(this));
  }

  loadData() {
    // Get seats
    const seats = document.querySelectorAll('.row .seat');
    // Load Data
    const extractedData = JSON.parse(localStorage.getItem('seats'));
    let i = 0;
    let j = 0;
    let movieid = '';
    let index = 0;
    const rownames = ['A', 'B', 'C', 'D', 'E', 'F'];
    seats.forEach(seat => {
      movieid = rownames[i] + (j + 1);
      seat.setAttribute('data-movieid', movieid);
      if (extractedData) {
        index = extractedData.seats.findIndex(data => movieid === data);
        if (index >= 0) {
          seat.classList.toggle('selected');
          seat.textContent = movieid;
          this.customer.addSeat(movieid);
        }
      }
      j++;
      if (j % 8 == 0) {
        i++;
        j = 0;
      }
    });

    if (extractedData) {
      const index = Array.from(this.select.options).findIndex(
        option => option.text === extractedData.name
      );
      this.select.selectedIndex = index >= 0 ? index : 0;
      this.customer.movieName = extractedData.name;
      this.setTextData(this.customer.seatCount(), this.customer.totalPrice);
    }
  }

  setTextData(count, price) {
    this.textCount.textContent = count;
    this.textPrice.textContent = price;
  }

  seatLists() {
    return this.customer.seats
      .map(seat => {
        return `<li>${seat}</li>`;
      })
      .join('');
  }

  completeHandler() {
    if (this.customer.seats.length !== 0) {
      const text = `
    <div>
      <h2>Customer name: ${this.customer.name}</h2>
      <h2>Movie Title: ${this.customer.movieName}</h2>
    </div>
    <div>
      <p class="seats">Seats: ${this.customer.seatCount()}</p>
      <ul>
        ${this.seatLists()}
      </ul>
    </div>
    <div>
      <p class="cost">Total Cost: $${this.customer.totalPrice}</p>
    </div>
    <div>
      <button>Cancel</button>
      <button>Pay</button>
    </div>
    `;
      let temp = document.getElementsByTagName('template')[0];
      let clon = temp.content.cloneNode(true);
      const modal = clon.querySelector('.modal');
      const backdrop = clon.querySelector('.backdrop');
      modal.innerHTML = text;
      globalThis.clon = clon;
      globalThis.modal1 = modal;
      document.body.appendChild(clon);

      const cancelbutton = document.body.querySelector(
        '.modal div:last-of-type button:nth-of-type(1)'
      );
      const confirmbutton = document.body.querySelector(
        '.modal div:last-of-type button:nth-of-type(2)'
      );
      // console.log(backdrop, cancelbutton, confirmbutton);
      [backdrop, cancelbutton, confirmbutton].forEach(el => {
        el.addEventListener('click', () => {
          backdrop.remove();
          modal.remove();
          this.clear.click();
        });
      });
    } else {
      alert('Make a seat selection first');
    }
  }

  clearHandler(event) {
    if (this.customer.seats.length !== 0) {
      this.customer.seats.forEach(seat => {
        const element = document.querySelector(`[data-movieid="${seat}"]`);
        element.classList.toggle('selected');
        element.textContent = '';
      });
      this.customer.seats = [];
      localStorage.clear();
      this.setTextData(this.customer.seatCount(), this.customer.totalPrice);
      this.select.selectedIndex = 0;
      console.log('cleared!');
    } else {
      alert('Make a seat selection first');
    }
  }

  runHandler(event) {
    const element = event.target;
    const elementId = element.dataset.movieid;
    if (elementId) {
      if (element.classList.contains('occupied')) return;

      if (element.classList.contains('selected')) {
        // Element has been selected previously
        element.classList.toggle('selected');
        element.textContent = '';
        this.customer.removeSeat(elementId);
        this.setTextData(this.customer.seatCount(), this.customer.totalPrice);
      } else {
        // Element has not been selected previously
        element.classList.toggle('selected');
        element.textContent = elementId;
        this.customer.addSeat(elementId);
        this.setTextData(this.customer.seatCount(), this.customer.totalPrice);
      }
    }
  }

  changeHandler(event) {
    this.customer.movieName = this.select.options[
      this.select.selectedIndex
    ].text;
    this.customer.moviePrice = +this.select.options[this.select.selectedIndex]
      .value;
    this.setTextData(this.customer.seatCount(), this.customer.totalPrice);
  }
}

new App('George Randolf');
