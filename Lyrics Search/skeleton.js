import { elements } from './base.js';

export class Skeleton {
  constructor() {}

  renderSearchResults() {
    const topElement = document.createElement('div');
    topElement.className = 'result__section';

    const htmlText = `
      <div class="result__row skeleton">
        <div class="result__row__image skeleton loading">          
        </div>
        <div class="result__row__info skeleton">
          <ul class="song-info">
            <li class="skeleton loading"></li>
            <li class="skeleton loading"></li>
          </ul>
          <p class="albumname skeleton loading"></p>
          <ul class="details">
            <li class="btn skeleton loading"></li>
            <li class="btn skeleton loading"></li>
          </ul>
        </div>
        <div class="result__row__preview">
          <div class="music-container skeleton loading" id="music-container">
            <div class="music-info skeleton loading">
            </div>            
            <div class="img-container skeleton loading">              
            </div>
            <div class="navigation">
              
            </div>
          </div>
        </div>
      </div>
    `;
    let all = '';
    for (let i = 0; i < 4; i++) {
      all += htmlText;
    }
    topElement.innerHTML = all;
    elements.container.insertAdjacentElement('afterbegin', topElement);
  }

  renderSpinner = parent => {
    const loader = `
    <div class="loader">
      <svg>
        <use href="./img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
    parent.insertAdjacentHTML('afterbegin', loader);
  };

  clearSpinner = parent => {
    const loader = parent.querySelector(`.loader`);
    if (loader) loader.remove(loader);
  };

  removeSearchResults() {
    const element = elements.container.querySelector('.result__section');
    if (element) {
      element.remove();
    }
  }

  renderLyrics(token) {
    let clon = elements.temp.content.cloneNode(true);
    const modal = clon.querySelector('.modal');
    const backdrop = clon.querySelector('.backdrop');

    const h2 = document.createElement('h2');
    h2.style.width = '340px';
    h2.style.height = '18px';
    h2.style.padding = '0';
    h2.className = 'loading';

    const p = document.createElement('pre');
    p.style.width = '340px';
    p.style.height = '200px';
    p.className = 'loading';
    modal.append(h2);
    modal.append(p);

    [backdrop].forEach(el => {
      el.addEventListener('click', () => {
        backdrop.remove();
        modal.remove();
        token.cancel('Cancelled by user');
      });
    });
    document.body.append(clon);
  }

  removeLyrics() {
    const modal = document.querySelector('.modal');
    const backdrop = document.querySelector('.backdrop');

    if (modal) {
      backdrop.remove();
      modal.remove();
    }
  }
}
