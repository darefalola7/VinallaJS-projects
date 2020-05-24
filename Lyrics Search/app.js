import { elements } from './base.js';
import { Skeleton } from './skeleton.js';
import { Audio } from './audio.js';
class App {
  constructor(page) {
    this.dataObj = [];
    this.cardsEl = [];
    this.currentActiveCard = 0;
    this.prevpage = 0;
    this.pageSize = page;
    this.layout = 'list';
    // Skeletons
    this.skeleton = new Skeleton();

    // Audio
    this.audio;
    // add event listeners
    elements.form.addEventListener('submit', this.searchHandler);

    elements.nextBtn.addEventListener('click', this.handleNext);

    elements.prevBtn.addEventListener('click', this.handlePrev);

    elements.cards.addEventListener('click', this.handlePagination);

    elements.container.addEventListener(
      'click',
      this.debounce(this.handleContainer, 400)
    );

    elements.listBtn.addEventListener('click', () => {
      const resultRow = document.querySelector('.result__row');
      if (resultRow) {
        resultRow.parentElement.classList.remove('result__section__grid');
        resultRow.parentElement.classList.add('result__section__list');
        this.layout = 'list';
      }
    });

    elements.gridBtn.addEventListener('click', () => {
      const resultRow = document.querySelector('.result__row');
      if (resultRow) {
        resultRow.parentElement.classList.remove('result__section__list');
        resultRow.parentElement.classList.add('result__section__grid');
        this.layout = 'grid';
      }
    });
  }

  searchHandler = async event => {
    event.preventDefault();
    const resultrow = elements.container.querySelector('.result__row');
    if (resultrow) resultrow.parentElement.remove();

    this.dataObj = [];
    const searchText = elements.formInput.value.trim();
    elements.formInput.value = '';
    // console.log(searchText);
    if (searchText) {
      this.skeleton.renderSpinner(elements.container);
      // Async call
      const url = `http://api.deezer.com/search?limit=${this.pageSize}&q=${searchText}`;
      this.pageURL = `${url}&index=`;
      try {
        await this.handleAsync(url, searchText);
        this.skeleton.clearSpinner(elements.container);
        this.renderSearchResults();
        this.createIndicators();
        this.cardsEl = document.querySelectorAll('.card');
      } catch (error) {
        console.log(error);
        this.displayError(error.message);
        this.skeleton.clearSpinner(elements.container);
      }
    } else {
      this.displayError('Please enter search query');
    }
  };

  handleNext = () => {
    if (!this.cardsEl.length) return;

    this.cardsEl[this.currentActiveCard].className = 'card left';

    this.currentActiveCard += 1;

    if (this.currentActiveCard > this.cardsEl.length - 1) {
      // this.currentActiveCard = this.cardsEl.length - 1;
      this.currentActiveCard = 0;
      this.cardsEl.forEach(card => (card.className = 'card right'));
    }

    this.cardsEl[this.currentActiveCard].className = 'card active';
  };

  handlePrev = () => {
    if (!this.cardsEl.length) return;

    this.cardsEl[this.currentActiveCard].className = 'card right';

    this.currentActiveCard -= 1;

    if (this.currentActiveCard < 0) {
      this.currentActiveCard = this.cardsEl.length - 1;
      this.cardsEl.forEach(card => (card.className = 'card left'));
    }

    this.cardsEl[this.currentActiveCard].className = 'card active';
  };

  handleAsync = async (url, searchText = '') => {
    const response = await axios.get(url);

    const results = response.data.data;
    if (response.status === 200 && !results.length)
      throw new Error(`Query ${searchText} not found!`);

    this.total = response.data.total;
    for (const result of results) {
      const {
        id,
        title,
        preview,
        link,
        duration,
        album: {
          cover,
          cover_big,
          cover_medium,
          cover_small,
          title: album_name,
        },
        artist: {
          name: artist_name,
          picture,
          picture_big,
          picture_medium,
          picture_small,
          picture_xl,
        },
      } = result;

      this.dataObj.push({
        id,
        title,
        preview,
        link,
        duration,
        cover,
        cover_big,
        cover_medium,
        cover_small,
        album_name,
        artist_name,
        picture,
        picture_big,
        picture_medium,
        picture_small,
        picture_xl,
      });
    }
  };

  displayError(errorMessage) {
    const div = document.getElementById('error');
    div.textContent = errorMessage;
    const scrolltop = document.documentElement.scrollTop;
    div.style.transform = `translateY(${scrolltop}px)`;

    setTimeout(() => {
      const scrolltop = document.documentElement.scrollTop;
      const scroll = div.clientHeight + scrolltop;
      // console.log(scroll, div.clientHeight, scrolltop);
      div.style.transform = `translateY(-${scroll}px)`;
    }, 3000);
  }

  renderSearchResults() {
    // console.log('In render ', this.dataObj);
    const htmlText = `
      <div class="result__section__${this.layout}">
          ${this.dataObj
            .map(data => {
              return `
          <div class="result__row">
          <div class='block'>
          <div class="result__row__image">
          <figure>
            <img
            srcset="
              ${data.picture_small} 56w,
              ${data.picture_medium} 250w,
              ${data.picture_big} 500w,
              ${data.picture_xl} 1000w
            "
            sizes="(max-width: 500px) 360px, (max-width: 760px) 300px, (min-width: 1200px) 250px, (max-width: 900px) 250px, 300px"
            alt="artist"
            class="artist__photo"
            src="${data.picture_medium}"
          />
            <figcaption>${data.artist_name}</figcaption>
          </figure>          
        </div>
        <div class="result__row__info">
          <ul class="song-info">
            <li>Songname: ${data.title}</li>
            <li>Duration: ${Math.floor(data.duration / 60)} mins</li>
          </ul>
          <p class="albumname">Album: ${data.album_name}</p>
          <ul class="details">
            <li><a href="${
              data.link
            }" target="_blank" class="btn btn__detail">More Info</a></li>
            <li><button style="font-size: 1rem;" data-artist='${
              data.artist_name
            }' data-title='${
                data.title
              }' class="btn btn__detail">Get Lyrics</button></li>
          </ul>
        </div>
        </div>
        <div class="result__row__preview" data-mid='${data.id}'>
          <div class="music-container" id="music-container">
            <div class="music-info">
              <h4 class="" id="title">Song preview</h4>
              <div class="progress-container" id="progress-container">
                <div class="progress" id="progress"></div>
              </div>
            </div>
            <audio
              src="${data.preview}"
              class="audio"
            ></audio>
            <div class="img-container">
              <img
                srcset="
                  ${data.cover_small} 56w,
                  ${data.cover_medium} 250w,
                  ${data.cover_big} 500w,
                  ${data.cover_xl} 1000w
                "
                sizes="(max-width: 900px) 20vw, (max-width: 600px) 30vw, 150px"
                alt="album"
                class="album__photo"
                src="${data.cover_medium}"
                id="cover"
              />
            </div>
            <div class="navigation">
              <button id="play" class="action-btn">
                <img src="./img/play.svg" alt="play" class="play_image" />
              </button>
            </div>
          </div>
        </div>
        </div>
        `;
            })
            .join('')}                  
      </div>
    `;
    // console.log('About to append!');
    // console.log(htmlText);
    elements.container.insertAdjacentHTML('afterbegin', htmlText);
  }

  createIndicators = () => {
    elements.cards.innerHTML = '';
    let div = document.createElement('div');
    div.className = 'card';
    [...Array(this.total).keys()]
      .filter(num => num % this.pageSize === 0)
      .forEach((key, i) => {
        if (i % 4 === 0 && i !== 0) {
          elements.cards.appendChild(div);
          div = document.createElement('div');
          div.className = 'card';
        }
        const span = document.createElement('span');
        if (i === 0) {
          span.className = 'indicator';
          div.classList.add('active');
        }
        span.dataset.next = key;
        span.textContent = i;
        div.append(span);
      });
  };

  handlePagination = async event => {
    const { target } = event;
    if (
      target.dataset.hasOwnProperty('next') &&
      target.parentElement.classList.contains('active')
    ) {
      if (target.classList.contains('indicator')) return;

      const resultrow = elements.container.querySelector('.result__row');
      if (resultrow) {
        resultrow.parentElement.remove();
      } else {
        this.displayError('Error loading page... try later');
        return;
      }

      this.dataObj = [];
      this.skeleton.renderSpinner(elements.container);
      // Async call
      const url = `${this.pageURL}${target.dataset.next}`;
      try {
        await this.handleAsync(url);
        this.skeleton.clearSpinner(elements.container);
        this.renderSearchResults();
        target
          .closest('.cards')
          .querySelector(`[data-next="${this.prevpage}"]`)
          .classList.remove('indicator');
        target.classList.add('indicator');
        this.prevpage = target.dataset.next;
      } catch (error) {
        console.log(error);
        this.displayError(error.message);
        this.skeleton.clearSpinner(elements.container);
      }
    }
  };

  getLyrics = async (artist_name, songname) => {
    // Token to cancel request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    let clon = elements.temp.content.cloneNode(true);
    const modal = clon.querySelector('.modal');
    const backdrop = clon.querySelector('.backdrop');
    if (!artist_name && !songname) {
      this.displayError('Cannot get Lyrics');
      return;
    }
    this.skeleton.renderLyrics(source);
    const url = `https://api.lyrics.ovh/v1/${artist_name}/${songname}`;
    try {
      const response = await axios.get(url, { cancelToken: source.token });

      const lyrics = response.data.lyrics;

      if (response.status === 200 && !lyrics)
        throw new Error(`No lyrics found!`);

      const h2 = document.createElement('h2');
      h2.textContent = `${artist_name} - ${songname}`;

      const p = document.createElement('pre');
      p.textContent = lyrics.trim().replace('↵', '\n');

      const close = document.createElement('span');
      close.textContent = 'X';
      close.style.cursor = 'pointer';
      modal.append(h2);
      modal.append(p);
      modal.append(close);
      [backdrop, close].forEach(el => {
        el.addEventListener('click', () => {
          backdrop.remove();
          modal.remove();
        });
      });
      this.skeleton.removeLyrics();
      document.body.appendChild(clon);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled ', error.message);
        this.skeleton.removeLyrics();
        this.displayError('Request canceled ' + error.message);
      } else {
        // handle error
        console.log(error);
        this.skeleton.removeLyrics();
        this.displayError(
          error.message.includes('404') ? 'No lyrics found' : error.message
        );
      }
    }
  };

  handleContainer = e => {
    const { target } = e;
    if (target.matches('#play, #play *')) {
      const parentElement = target.closest('.result__row__preview');

      if (this.audio) {
        if (parentElement.dataset.mid == this.audio.pid) {
          this.audio.play();
          return;
        } else {
          this.audio.pauseSong();
        }
      }
      this.audio = new Audio(parentElement);
      this.audio.play();
    }

    if (target.dataset.artist && target.dataset.title) {
      this.getLyrics(target.dataset.artist, target.dataset.title);
    }
  };

  debounce(fn, delay = 2000) {
    let timeoutID;
    const func = (...args) => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
        fn(...args);
      }, delay);
    };

    return func;
  }
}

const app = new App(16);
