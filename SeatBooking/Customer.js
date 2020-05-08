export class Customer {
  constructor(name, movieName, moviePrice) {
    this._name = name;
    this._movieName = movieName;
    this.seats = [];
    this._moviePrice = moviePrice;
    this.totalprice = 0.0;
  }

  seatCount() {
    return this.seats.length;
  }

  addSeat(id) {
    this.seats.push(id);

    this.storeData();
  }

  removeSeat(id) {
    const seatLoc = this.seats.findIndex(seat => seat === id);

    this.seats = this.seats.splice(seatLoc, 1);

    this.storeData();
  }

  storeData() {
    const storeValue = {
      name: this.movieName,
      seats: this.seats,
    };
    localStorage.setItem('seats', JSON.stringify(storeValue));
  }

  get name() {
    return this._name;
  }

  set name(newName) {
    this._name = newName;
  }

  get movieName() {
    return this._movieName;
  }

  set movieName(newName) {
    this._movieName = newName;
    this.storeData();
  }

  get moviePrice() {
    return this._moviePrice;
  }

  set moviePrice(newPrice) {
    this._moviePrice = newPrice;
  }

  get totalPrice() {
    return +this.moviePrice * +this.seats.length;
  }
}
