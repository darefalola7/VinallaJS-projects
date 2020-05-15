export class Currency {
  constructor(data) {
    this.data = data;
    this._keys = [];
    this._resultData = [];
    this.parseData();
  }

  parseData() {
    // console.log(this.data);
    // globalThis.dd = this;
    for (const it in this.data) {
      if (this.data.hasOwnProperty(it)) {
        this._resultData.push({ currency: it, price: this.data[it][0][1] });
        this._keys.push(it.toUpperCase());
      }
    }
  }

  get resultData() {
    if (this._resultData) {
      return this._resultData;
    }
    return [];
  }

  get keys() {
    return this._keys;
  }

  convertCurrency(currency, amount, toNaira = true) {
    const testCurrency = this.resultData.find(
      data => data.currency === currency.toLowerCase()
    );

    if (!toNaira && testCurrency.price && amount) {
      // console.log('!toNaira executed');
      return Number(
        (parseFloat(amount) / parseFloat(testCurrency.price)).toFixed(2)
      );
    }

    if (toNaira && testCurrency.price && amount) {
      // console.log('toNaira executed');
      return Number(
        (parseFloat(testCurrency.price) * parseFloat(amount)).toFixed(2)
      );
    }
    return 0;
  }
}
