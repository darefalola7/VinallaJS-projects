export const elements = {
  // adduser: document.querySelector('.adduser'),
  // doublemoney: document.querySelector('.doublemoney'),
  // shown: document.querySelector('.shown'),
  // sort: document.querySelector('.sort'),
  // calcwealth: document.querySelector('.calcwealth'),
  actions: document.querySelector('.actions'),
  viewarea: document.querySelector('.view-area'),
};

export const renderLoader = () => {
  const loader = `
    <div class="loader">
      <svg>
        <use href="./img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  elements.viewarea.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = elements.viewarea.querySelector(`.loader`);
  if (loader) loader.remove();
};
