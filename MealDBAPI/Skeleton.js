import { elements } from './base.js';

export class Skeleton {
  constructor() {}

  renderMealResults() {
    const htmlText = `
      <div class="meal__results">
          <div class="meal__result skeleton loading"></div>
          <div class="meal__result skeleton loading"></div>
          <div class="meal__result skeleton loading"></div>
          <div class="meal__result skeleton loading"></div>
        </div>
    `;

    elements.mealDiv.insertAdjacentHTML('afterbegin', htmlText);
  }

  removeMealResults() {
    const mealResultsDiv = document.querySelector('.meal__results');
    mealResultsDiv.remove();
  }

  renderMealInfo() {
    const htmlText = `
      <div class="meal__info">
          <div class="meal__video skeleton loading"></div>
          <div class="meal__categories loading"></div>
          <div class="meal__instruction skeleton loading"></div>
          <div class="meal__ingredient">
            <h2 loading>Ingredients</h2>
            <div class="meal__ingredients">
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
              <span class="skeleton loading"></span>
            </div>
          </div>
        </div>
    `;

    elements.mealDiv.insertAdjacentHTML('beforeend', htmlText);
  }

  removeMealInfo() {
    const mealInfoDiv = document.querySelector('.meal__info');
    mealInfoDiv.remove();
  }
}
