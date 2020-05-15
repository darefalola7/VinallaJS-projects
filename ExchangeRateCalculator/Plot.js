export class Plot {
  constructor(id, data, days) {
    this.ctx = document.getElementById(id).getContext('2d');
    this.labels = [];
    this.datasets = [];
    this.days = days;
    this.data = data;
    // console.log(data);
    this.parseData();
    // console.log(this.datasets, this.labels);
    this.plot();
  }

  grn(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  parseData() {
    const keys = ['GBP', 'EUR', 'USD'];

    const { gbp, eur, usd } = this.data;
    this.labels = gbp.map(dd => this.getDate(dd[0]));

    const result = [gbp, eur, usd];
    this.datasets = result.map((currency, i) => {
      let value = {};
      value.fill = false;
      value.label = keys[i];
      value.borderColor = `rgb(${this.grn(0, 255)}, ${this.grn(
        0,
        255
      )}, ${this.grn(0, 255)})`;
      value.data = currency.map(dd => dd[1]);
      return value;
    });
  }

  getDate(timestamp) {
    const dd = new Date(timestamp);
    return dd.toDateString();
  }

  plot() {
    var chart = new Chart(this.ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: `${this.days} days`,
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Naira',
              },
            },
          ],
        },
      },
    });
  }
}
