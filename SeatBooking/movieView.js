import { elements } from './base.js';
import { Tooltip } from './Tooltip.js';

export class MovieView {
  hasActiveTooltip = false;
  constructor(movies) {
    this.movies = movies;
    this.addMovies();
  }

  addMovies() {
    elements.slidesContainer.innerHTML = '';
    this.movies.forEach(movie => {
      elements.slidesContainer.append(this.createElements(movie));
    });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createElements(params) {
    const mainDiv = document.createElement('div');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figCaption = document.createElement('figcaption');

    // Add data to elements
    const price = this.getRandomInt(10, 20);
    figCaption.textContent = `Price: $${price}`;
    img.setAttribute('src', params.mainImg);
    img.setAttribute('alt', params.title);
    figure.append(img);
    figure.append(figCaption);
    mainDiv.append(figure);
    mainDiv.className = 'mySlides';
    mainDiv.setAttribute('data-params', params.id);
    mainDiv.dataset.price = price;
    return mainDiv;
  }

  renderMovies(movie) {
    // Get movie

    // Show tooltip
    const tooltip = new Tooltip(movie);
    tooltip.attach();
  }

  // detachMovies(id) {

  // }
}
