export class Person {
  constructor(personData) {
    // console.log(personData);
    const {
      email,
      gender,
      location: { city = 'NA', country = 'NA' },
      name,
      phone,
      picture: { medium },
      registered: { date },
    } = personData;

    this.email = email;
    this.gender = gender;
    this.city = city;
    this.country = country;
    this.name = Object.values(name).join(' ');
    this.phone = phone;
    this.imageURL = medium;
    this.weeks = this.inWeeks(new Date(date), new Date());
    this.value = this.getNetWorth();
    this.id = this.getRandomInt(1001, 9999);
    // console.log(this);
  }

  get networth() {
    return `$${this.value.toLocaleString()}`;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getNetWorth() {
    const min = 500000;
    const max = 2000000;
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand;
  }

  inDays(d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000));
  }

  inWeeks(d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
  }

  inMonths(d1, d2) {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();

    return d2M + 12 * d2Y - (d1M + 12 * d1Y);
  }

  inYears(d1, d2) {
    return d2.getFullYear() - d1.getFullYear();
  }
}
