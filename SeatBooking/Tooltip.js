export class Tooltip {
  constructor(movie) {
    this.movie = movie;
  }

  attach() {
    let temp = document.getElementById('movie-hover');
    let clon = temp.content.cloneNode(true);
    const modal = clon.querySelector('.element-container');
    const backdrop = clon.querySelector('.backdrop');

    // Youtube Video
    const movieHtml = `
        <div class="video">
          <iframe
            width="500"
            height="320"
            src="https://www.youtube.com/embed/${this.movie.videoID}?controls=1&loop=1&autoplay=1"
            allow="autoplay; encrypted-media" allowfullscreen>
          </iframe>
        </div>
      `;
    modal.insertAdjacentHTML('afterbegin', movieHtml);

    // Add extra image
    // const img = document.createElement('img');
    // img.setAttribute('src', this.movie.addImg);
    // img.setAttribute('alt', this.movie.title);
    // Add Overview
    const p = document.createElement('p');
    p.className = 'overview';
    p.textContent = this.movie.overview;
    modal.append(p);
    const infoHtml = `
      <ul class="movielist">
        <li>Budget: ${
          this.movie.budget === 0 ? '(NA)' : this.movie.budget
        } USD</li>
        <li>Revenue: ${
          this.movie.revenue === 0 ? '(NA)' : this.movie.revenue
        } USD</li>
        <li>Production Companies: ${this.movie.prodCompanies}</li>
        <li>Production Countries: ${this.movie.prodCountries}</li>
        <li>Release Date: ${this.movie.release_date}</li>
        <li>Generes: ${this.movie.resData}</li>      
        <li>Runtime: ${this.movie.runtime}</li>
        <li>${this.movie.tagline}</li>
        <li><a href="${this.movie.homepage}">Movie Home Page</a></li>
    </ul>
    `;

    modal.insertAdjacentHTML('beforeend', infoHtml);

    const button = document.createElement('button');
    button.textContent = 'Book Seats';
    button.className = 'bookseats';
    modal.append(button);

    [backdrop, button].forEach(el => {
      el.addEventListener('click', () => {
        backdrop.remove();
        modal.remove();
      });
    });

    document.body.appendChild(clon);
  }
}
