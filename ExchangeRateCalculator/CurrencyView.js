export class CurrencyView {
  constructor(data, keys, infoId, selectId1, selectId2) {
    this.data = data;
    this.keys = keys;
    this.render(infoId, selectId1, selectId2);
  }

  render(infoId, selectId1, selectId2) {
    const info = document.getElementById(infoId);
    info.innerHTML = '';
    info.insertAdjacentHTML('afterbegin', this.infoContent());

    // const select1 = document.getElementById(selectId1);
    // select1.innerHTML = '';
    // select1.insertAdjacentHTML('afterbegin', this.selectContent(this.keys));

    const select2 = document.getElementById(selectId2);
    select2.innerHTML = '';
    select2.insertAdjacentHTML('afterbegin', this.selectContent(this.keys));
  }

  infoContent() {
    let htmlText = '';
    const { usd, gbp, eur } = this.data;

    [usd, gbp, eur].forEach((d, i) => {
      let rowText = `
      <div class="row">
        <div class="slot">${this.getDate(d[i][0])}</div>
        <div class="slot">N${usd[i][1]}</div>
        <div class="slot">N${gbp[i][1]}</div>
        <div class="slot">N${eur[i][1]}</div>
      </div>
    `;
      htmlText += rowText;
    });
    return htmlText;
  }

  selectContent(keys) {
    const text = `
    <select class="currency">
      ${this.getOptions(keys)};
    </select>
    `;
    return text;
  }

  getOptions(keys) {
    return keys
      .map(key => {
        return `<option value="${key}">${key}</option>`;
      })
      .join('');
  }

  getDate(timestamp) {
    const dd = new Date(timestamp);
    return dd
      .toString()
      .replace(' GMT+0100 (West Africa Standard Time)', '')
      .replace('Wed ', '');
  }
}
