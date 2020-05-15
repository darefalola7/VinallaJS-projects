import { Plot } from './Plot.js';
import { Currency } from './Currency.js';
import { CurrencyView } from './CurrencyView.js';
class App {
  // API_KEY = 'd9f9b5915c18ce3fc281b71b';
  constructor() {
    // this.currency = 'USD';
    // this.api_url = ` https://prime.exchangerate-api.com/v5/${this.API_KEY}/latest/${currency}`;
    // this.renderLoader(document.body);
    Promise.all([
      this.getParse(1),
      this.getParse(10),
      this.getParse(20),
      this.getParse(30),
    ]).then(data => {
      this.currency = new Currency(data[0]);
      this.plotVar = new Plot('sevendays-chart', data[1], 10);
      this.plotVar2 = new Plot('thirtydays-chart', data[2], 20);
      this.plotVar3 = new Plot('sixtydays-chart', data[3], 30);
      this.cView = new CurrencyView(
        data[0],
        this.currency.keys,
        'row-content',
        'currency__name1',
        'currency__name2'
      );
      this.clearLoader(document.body);

      this.inputOne = document.querySelectorAll('.currency__input')[0];
      this.inputTwo = document.querySelectorAll('.currency__input')[1];
      this.mainSection = document.querySelector('.main__convert');
      this.selectOne = document.querySelector('#currency__name1 .currency');
      this.selectTwo = document.querySelector('#currency__name2 .currency');

      this.mainSection.addEventListener(
        'keyup',
        this.debounce(event => {
          if (event.target.className === 'currency__input') {
            this.handleConvert.call(this, event);
          }
        }, 1000)
      );
      this.selectTwo.addEventListener(
        'change',
        this.debounce(this.handleConvert)
      );

      document.querySelector('button').addEventListener('click', () => {
        this.inputOne.value = '';
        this.inputTwo.value = '';
      });
    });
  }

  async getParse(days) {
    try {
      const response = await axios.get(
        `https://abokifx.com/usd_to_ngn.json?days=${days}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  handleConvert = event => {
    const toNaira =
      event.target.id === 'currency__name1' ||
      event.target.className === 'currency'
        ? false
        : true;

    const amount =
      event.target.className === 'currency__input'
        ? event.target.value
        : this.inputOne.value;
    const result = this.currency.convertCurrency(
      this.selectTwo.value,
      amount,
      toNaira
    );
    console.log(toNaira, amount, result, this.selectTwo.value);
    if (result && toNaira) {
      // if (event.target.className === 'currency') {
      this.inputOne.value = result;
      // } else {
      //   this.inputTwo.value = result;
      // }
    } else if (result && !toNaira) {
      this.inputTwo.value = result;
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

  renderLoader = parent => {
    const loader = `
    <div class="loader">
      <svg>
        <use href="./img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
    parent.insertAdjacentHTML('afterbegin', loader);
  };

  clearLoader = parent => {
    const loader = document.querySelector(`.loader`);
    if (loader) loader.remove(loader);
  };
}

const app = new App();
