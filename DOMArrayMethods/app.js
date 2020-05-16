import { PersonView } from './PersonView.js';
import { elements, renderLoader, clearLoader } from './base.js';

class App {
  constructor(n) {
    this.getUsers(n).then(x => {
      this.pv = new PersonView(x);
    });

    elements.actions.addEventListener(
      'click',
      this.debounce(this.actionsHandler, 500)
    );
    // elements.viewarea.addEventListener('click', event => {
    //   const element = event.target.closest('.slot');
    //   if (element.className === 'slot') {
    //     element.remove();
    //   }
    // });
  }

  async getUsers(n = 1) {
    try {
      let persons = [];

      for (let i = 1; i <= n; i++) {
        const response = await axios.get(`https://randomuser.me/api/`);
        persons.push(response.data.results[0]);
      }

      return n === 1 ? persons[0] : persons;
    } catch (error) {
      console.log(error);
    }
  }

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

  actionsHandler = event => {
    const target = event.target.className;
    switch (target) {
      case 'adduser':
        this.pv.renderSkeleton();
        this.getUsers().then(x => {
          this.pv.removeSkeleton();
          this.pv.addUser(x);
        });
        break;
      case 'doublemoney':
        this.pv.persons.forEach(person => {
          person.value *= 2;
        });
        this.pv.updatePersons();
        break;
      case 'shown':
        const newPersons = this.pv.persons.filter(
          person => person.value > 1000000
        );
        this.pv.persons = newPersons;
        break;
      case 'sort':
        this.pv.orderPersons();
        break;
      case 'calcwealth':
        this.pv.calcWealth();
        break;
    }
  };
}

const app = new App(3);
