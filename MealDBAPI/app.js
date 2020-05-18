import { elements } from './base.js';
import { Skeleton } from './Skeleton.js';

class App {

  constructor() {
    this.dataObj = [];
    // Skeletons
    this.skeleton = new Skeleton();
    // Youtube API

    // add event listeners
    elements.form.addEventListener('submit', this.searchHandler);
    elements.mealDiv.addEventListener('click', this.mealHandler);
    elements.randomBtn.addEventListener('click', this.randomHandler);
  }

  searchHandler = async event => {
    event.preventDefault();
    elements.mealDiv.innerHTML = '';
    this.dataObj = [];
    const searchText = elements.formInput.value.trim();
    elements.formInput.value = '';
    // console.log(searchText);
    if (searchText) {
      this.skeleton.renderMealResults();
      // Async call
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
      try {
        await this.handleAsync(url);
        this.skeleton.removeMealResults();
        this.renderMealResults();
      } catch (error) {
        console.log(error);
        this.displayError(error.message);
        this.skeleton.removeMealResults();
      }
    }
  };

  randomHandler = async event => {
    event.preventDefault();
    elements.mealDiv.innerHTML = '';
    this.dataObj = [];
    const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
    this.skeleton.renderMealInfo();
    try {
      await this.handleAsync(url);
      this.skeleton.removeMealInfo();
      this.renderMealInfo(this.dataObj[0]);
    } catch (error) {
      console.log(error);
      this.skeleton.removeMealInfo();
      this.displayError(error.message);
    }
  };

  handleAsync = async url => {
    const response = await axios.get(url);

    const meals = response.data.meals;
    if (response.status === 200 && !meals)
      throw new Error(`Query ${searchText} not found!`);

    const regex1 = /Ingredient\d+/i;
    const regex2 = /Measure\d+/i;
    const videoRegex = /\.*\?v=([a-zA-Z0-9_-]+)/;
    for (const meal of meals) {
      const {
        idMeal: id,
        strMeal: title,
        strInstructions: instructions,
        strMealThumb: imageURL,
        strYoutube,
        strCategory: category,
        strArea: area,
      } = meal;

      let videoURL = '';
      if (strYoutube) {
        if (videoRegex.test(strYoutube)) {
          const match = strYoutube.match(videoRegex)[1];
          let apiURL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${match}&key=${this.APIKEY}`;
          const response = await axios.get(apiURL);
          if (response.data.pageInfo.totalResults)
            videoURL = `https://www.youtube.com/embed/${match}`;
        }
      }

      const ingredients = [];
      const measure = [];
      for (const key in meal) {
        if (meal.hasOwnProperty(key)) {
          if (regex1.test(key) && meal[key]) {
            ingredients.push(meal[key]);
          }
          if (regex2.test(key) && meal[key]) {
            measure.push(meal[key]);
          }
        }
      }
      this.dataObj.push({
        id,
        title,
        instructions,
        imageURL,
        videoURL,
        category,
        area,
        ingredients,
        measure,
      });
    }
  };

  displayError(errorMessage) {
    const div = document.querySelector('.error');
    div.textContent = errorMessage;
    div.style.transform = 'translateY(0)';

    setTimeout(() => {
      div.style.transform = 'translateY(-100%)';
    }, 3000);
  }

  renderMealResults() {
    // console.log('In render ', this.dataObj);
    const htmlText = `
      <div class="meal__results">
          ${this.dataObj
            .map(data => {
              return `<div class="meal__result" data-id="${data.id}">
              <figure>
                <img src="${data.imageURL}"
                    alt="${data.title}">
                <figcaption>${data.title}</figcaption>
            </figure>
            </div>`;
            })
            .join('')}          
      </div>
    `;
    // console.log('About to append!');
    // console.log(htmlText);
    elements.mealDiv.insertAdjacentHTML('afterbegin', htmlText);
  }

  mealHandler = event => {
    if (event.target.dataset.id) {
      const id = event.target.dataset.id;
      const object = this.dataObj.find(data => data.id == id);
      if (object) {
        this.renderMealInfo(object);
      } else {
        this.displayError('Invalid selection');
      }
    }
  };

  renderMealInfo = data => {
    const div = elements.mealDiv.querySelector('.meal__info');
    if (div) {
      div.remove();
    }

    const htmlText = `
      <div class="meal__info">
      <h1>${data.title}</h1>
        ${
          data.videoURL
            ? `<div class="meal__video">
              <iframe
                width="560"
                height="315"
                src="${data.videoURL}?controls=1&loop=1&autoplay=1"
                allow="autoplay; encrypted-media" allowfullscreen >
              </iframe>
            </div>`
            : `<div class="meal__video">
              <img src="${data.imageURL}" alt="${data.title}" />
            </div>`
        }        
        <div class="meal__categories">
          <p>${data.category}</p>
          <p>${data.area}</p>
        </div>
        <div class="meal__instruction">
          ${data.instructions}
        </div>
        <div class="meal__ingredient">
          <h2>Ingredients</h2>
          <div class="meal__ingredients">            
              ${data.ingredients
                .map((value, i) => {
                  return `<span>${value} - ${data.measure[i]}</span>`;
                })
                .join('')}            
          </div>
        </div>         
      </div>
    `;

    elements.mealDiv.insertAdjacentHTML('beforeend', htmlText);
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
const app = new App();
globalThis.app = app;
