import { Customer } from './Customer.js';
import { elements } from './base.js';
import { Movie } from './movie.js';
import { MovieView } from './movieView.js';

class App {
  constructor(customerName, movies) {
    this.capture = false;
    this.customer = new Customer(customerName, '', 0);
    elements.nameLabel.textContent = `Customer Name: ${customerName}`;
    this.currentWidth = 0;
    this.counter = 1;
    this.start = true;
    this.movies = movies;
    this.mView = new MovieView(movies);
    elements.slides = document.querySelectorAll('.mySlides');
    this.width = elements.slides[0].offsetWidth;
    this.loadData();
    elements.complete.addEventListener(
      'click',
      this.completeHandler.bind(this)
    );
    elements.clear.addEventListener('click', this.clearHandler.bind(this));
    elements.coverRow.addEventListener('click', this.runHandler.bind(this));
    elements.prev.addEventListener('click', this.prevHandler.bind(this));
    elements.next.addEventListener('click', this.nextHandler.bind(this));
    elements.slidesContainer.addEventListener(
      'click',
      this.selectMovieHandler.bind(this)
    );
    // elements.slidesContainer.addEventListener(
    //   'mouseover',
    //   this.hoverMovieHandler.bind(this)
    // );
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
      // const index = Array.from(this.select.options).findIndex(
      //   option => option.text === extractedData.name
      // );
      // this.select.selectedIndex = index >= 0 ? index : 0;
      // this.customer.movieName = extractedData.name;
      // this.setTextData(this.customer.seatCount(), this.customer.totalPrice);
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
      let temp = document.getElementById('backdrop-modal');
      let clon = temp.content.cloneNode(true);
      const modal = clon.querySelector('.modal');
      const backdrop = clon.querySelector('.backdrop');
      modal.innerHTML = text;
      // globalThis.clon = clon;
      // globalThis.modal1 = modal;
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
    if (this.customer.moviePrice === 0) {
      alert('Please select a movie first!');
    }
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

  prevHandler(event) {
    // console.log('Prev: Listening...');
    if (this.currentWidth > 0) {
      this.counter--;
      // console.log('prev', currentWidth, counter * width);
      if (this.currentWidth === this.counter * this.width) this.counter--;
      // console.log('prev', width * counter);
      elements.slides.forEach(slide => {
        slide.style.transform = `translateX(-${this.width * this.counter}px)`;
      });
      this.currentWidth = this.width * this.counter;
    }
  }

  nextHandler(event) {
    // console.log(elements.slides);
    // console.log('Next: Listening...');
    if (this.currentWidth === 0 && !this.start) this.counter++;
    this.start = false;
    // console.log('next', this.currentWidth, this.counter * this.width);
    if (
      this.currentWidth <
      this.width * elements.slides.length - this.width * 4
    ) {
      // console.log('next', this.width * this.counter);
      elements.slides.forEach(slide => {
        slide.style.transform = `translateX(-${this.width * this.counter}px)`;
      });
      this.currentWidth = this.width * this.counter;
      this.counter++;
    }
  }

  selectMovieHandler(event) {
    // Get movie id
    const div = event.target.closest('.mySlides');
    const id = div.dataset.params;
    const movie = this.movies.find(mov => mov.id == id);
    if (id) {
      this.customer.moviePrice = div.dataset.price;
      this.customer.movieName = movie.title;
      div.style.color = 'red';
      // Render movie details
      this.mView.renderMovies(movie);
      // Show movie

      console.log(movie);
      console.log(event);
    }
  }

  hoverMovieHandler(event) {
    const div = event.target.closest('.mySlides');
    const id = div.dataset.params;

    if (id && !this.capture) {
      this.capture = true;
      // Render movie details
      // div.style.transformOrigin = 'center';
      // div.style.transform = 'scale(1.5)';
      // div.style.width = div.clientWidth + 100 + 'px';
      // div.style.zIndex = 20;
      // Show movie
      const movie = this.movies.find(mov => mov.id == id);
      const movieHtml = `
        <div class="video">
          <iframe
            width="${div.clientWidth}"
            height="${div.clientHeight}"
            src="https://www.youtube.com/embed/${movie.videoID}?controls=0&loop=1&autoplay=1"
            allow="autoplay; encrypted-media" allowfullscreen>
          </iframe>
        </div>
      `;
      const temp = div.innerHTML;
      div.innerHTML = '';
      div.insertAdjacentHTML('afterbegin', movieHtml);
      div.addEventListener('mouseleave', event => {
        div.innerHTML = '';
        div.insertAdjacentHTML('afterbegin', temp);
        this.capture = false;
      });
      // console.log(id);
      // console.log(event);
    }
  }
}

const movie = new Movie(500);
movie.getMovies().then(movies => {
  console.log(movies);
  localStorage.setItem('movies', JSON.stringify(movies));
  new App('George Randolf', movies);
});
