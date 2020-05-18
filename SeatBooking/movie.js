// import axios from './node_modules/axios';
// const axios = require('axios');

export class Movie {
  apiKey='Remember to replace this';
  constructor(imagesize) {
    this.movies = JSON.parse(localStorage.getItem('movies'));
    this.minimumDate = JSON.parse(localStorage.getItem('minimum'));
    this.maximumDate = JSON.parse(localStorage.getItem('maximum'));
    if (!this.movies) {
      this.movies = [];
      this.minimumDate = '';
      this.maximumDate = '';
    }

    this.imageSize = imagesize;
    this.imageUrl = `https://image.tmdb.org/t/p/w${imagesize}`;
    this.url = 'https://api.themoviedb.org/3';
    this.moviesquery = `${this.url}/movie/upcoming?api_key=${this.apiKey}`;
  }
  // Make HTTP calls
  async getMovies() {
    if (this.movies.length === 0) {
      try {
        const response = await axios.get(this.moviesquery);
        // handle success
        // response.data.results.forEach(movie => {
        for (const movie of response.data.results) {
          const {
            poster_path,
            id,
            backdrop_path,
            original_title: title,
            overview,
            release_date,
          } = movie;
          const mainImg = this.imageUrl + poster_path;
          const addImg = this.imageUrl + backdrop_path;
          if (id) {
            const data = await Promise.all([
              this.getVideo(id),
              this.getMovie(id),
            ]);
            const [video, movieInfo] = data;

            this.movies.push({
              mainImg,
              id,
              addImg,
              title,
              overview,
              release_date,
              ...video,
              ...movieInfo,
            });
          } else {
            this.movies.push({
              mainImg,
              id,
              addImg,
              title,
              overview,
              release_date,
            });
          }
        }
        // Extract additional data
        ({
          maximum: this.maximumDate,
          minimum: this.minimumDate,
        } = response.data.dates);
      } catch (error) {
        this.errorFunction(error);
      } finally {
        localStorage.setItem('maximum', JSON.stringify(this.maximumDate));
        localStorage.setItem('minimum', JSON.stringify(this.minimumDate));
      }
    }
    return this.movies;
  }

  async getVideo(id) {
    const vidoeQuery = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${this.apiKey}`;
    try {
      const response = await axios.get(vidoeQuery, {
        params: {
          api_key: this.apiKey,
          type: 'Trailer',
          size: 480,
        },
      });
      const arr = response.data.results.map(result => {
        const { key: videoID, site } = result;
        return { videoID, site };
      });
      return arr[0];
    } catch (error) {
      throw error;
    }
  }

  async getMovie(id) {
    const movieQuery = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`;
    try {
      const response = await axios.get(movieQuery);
      let {
        budget = 'NA',
        // genres: [
        //   { name: genre1 = 'NA' },
        //   { name: genre2 = 'NA' },
        //   { name: genre3 = 'NA' },
        // ],
        homepage = 'NA',
        // production_companies: [
        //   { name: company1 = 'NA' },
        //   { name: company2 = 'NA' },
        //   { name: company3 = 'NA' },
        // ],
        runtime = 'NA',
        tagline = 'NA',
        revenue = 'NA',
        // production_countries: [{ name: country = 'NA' }],
      } = response.data;
      let resData;
      if (response.data.genres) {
        resData = response.data.genres.map(genre => genre.name).join(',');
      }
      let prodCountries;
      if (response.data.production_countries) {
        prodCountries = response.data.production_countries
          .map(g => g.name)
          .join(',');
      }
      let prodCompanies;
      if (response.data.production_companies) {
        prodCompanies = response.data.production_companies
          .map(g => g.name)
          .join(',');
      }
      runtime += ' minutes';
      return {
        budget,
        resData,
        homepage,
        prodCountries,
        runtime,
        tagline,
        revenue,
        prodCompanies,
      };
    } catch (error) {
      throw error;
    }
  }

  errorFunction(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
}

// const res = await axios.get('https://api.themoviedb.org/3/movie/514847?api_key=18a78b2a4ad87b25a7d21b4880b35ddc')
