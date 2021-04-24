"use strict"
window.addEventListener('load', () => {

  setTimeout(function () {
    document.querySelector('.overlay').classList.add('loaded');
  }, 2000);
});


window.addEventListener('DOMContentLoaded', mainHandler);

function mainHandler() {
  let personWrapper = document.querySelector('.left_wrapper');
  let popupWrapper = document.querySelector('.rigth_popup');
  let page = 1;
  let pageNextCount;
  let pagePrevCount;

  let buttonClick = document.createElement('div');
  buttonClick.classList.add('button_wrapper');

  let buttonPrev = document.createElement('div');
  buttonPrev.classList.add('button_prev');
  buttonPrev.innerHTML = 'Prev';

  let buttonNext = document.createElement('div');
  buttonNext.classList.add('button_next');
  buttonNext.innerHTML = 'Next';

  let button_back = document.createElement('div');
  button_back.classList.add('button_back');
  button_back.innerHTML = 'Back to list';

  let button_close = document.querySelector('.close_btn');

  document.querySelector('.rigth_popup').appendChild(button_back);

  buttonClick.appendChild(buttonPrev);
  buttonClick.appendChild(buttonNext);

  buttonNext.addEventListener('click', nextClick);
  buttonPrev.addEventListener('click', prevClick);
  button_back.addEventListener('click', buttonBack);
  button_close.addEventListener('click', buttonClose);

  responseGet();

  function responseGet() {
    fetch(`https://swapi.dev/api/people/?page=${page}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.results.forEach(function (item, index) {

          let personItem = document.createElement('div');
          personItem.classList.add('item');

          personItem.innerHTML = `<p>${item.name}</p>`;

          personWrapper.appendChild(personItem);

          var personage = new Person(item.name, item.birth_year, item.gender, item.films, item.homeworld, item.species, page);

          personWrapper.appendChild(buttonClick);

          pagination(data.next, data.previous);

          personItem.addEventListener('click', itemClick.bind(null, personage, personItem));
        });
        checkPage();
      });

  };


  function buttonBack() {
    if (window.innerWidth <= 1200) {
      this.parentElement.classList.remove('active');
      personWrapper.style.zIndex = '0'
    }
    page = localStorage.getItem('page')
    personWrapper.innerHTML = ''
    responseGet();
  };

  function nextClick() {
    page = pageNextCount;
    personWrapper.innerHTML = '';
    responseGet();
  };

  function prevClick() {
    page = pagePrevCount;
    personWrapper.innerHTML = '';
    responseGet();
  };

  function buttonClose() {
    this.parentElement.classList.remove('active');
    if (window.innerWidth <= 1200) {
      personWrapper.style.zIndex = '0'
    }
    setTimeout(function () {
      popupWrapper.children[0].remove();
    }, 500);
  }

  function checkPage() {
    if (window.innerWidth >= 1200) {
      if (page == localStorage.getItem('page')) {
        button_back.style.display = 'none'
      } else {
        button_back.style.display = 'block'
      }
    }

  };

  function pagination(next, prev) {
    if (next == null) {
      buttonNext.style.display = 'none';
    } else {
      buttonNext.style.display = 'block';
      pageNextCount = next.split('=')[1];
    };
    if (prev == null) {
      buttonPrev.style.display = 'none';
    } else {
      buttonPrev.style.display = 'block';
      pagePrevCount = prev.split('=')[1];
    }
  };

  function itemClick(personage, personItem) {
    document.querySelectorAll('.item').forEach((item) => {
      item.classList.remove('active');
    })
    personItem.classList.add('active')
    if (window.innerWidth <= 1200) {
      personWrapper.style.zIndex = '-1'
    }

    if (popupWrapper.children.length > 2) {
      popupWrapper.children[0].remove();
    }
    localStorage.setItem('page', `${personage.page}`);
    personage.showFinal();
    popupWrapper.classList.add('active');
    checkPage();
  };


  class Person {
    constructor(name, birth_year, gender, films, homeworld, species, page) {
      this.page = page;
      this.name = name;
      this.birth_year = birth_year;
      this.gender = gender;
      this.films = films;
      this.homeworld = homeworld;
      this.species = species;
      this.popupItem = popupWrapper;
    };

    tableBody() {
      // this.popupItem.innerHTML = ''    
      let table = document.createElement('table');
      let tableBody = document.createElement('tbody');
      table.insertAdjacentElement('afterbegin', tableBody);
      this.popupItem.insertBefore(table, button_close);
    };

    tableTr() {
      let tr = document.createElement('tr');
      let tdLeft = document.createElement('td');
      let tdRight = document.createElement('td');

      tr.insertAdjacentElement('afterbegin', tdLeft)
      tr.insertAdjacentElement('afterbegin', tdRight)
      return tr
    };


    showName() {
      if (this.name.length > 0) {
        let tr = this.tableTr();

        tr.firstElementChild.remove();
        tr.lastElementChild.setAttribute('colspan', '2')
        tr.lastElementChild.style.fontSize = '22px'
        tr.lastElementChild.innerHTML = this.name;

        this.popupItem.querySelector('tbody').insertAdjacentElement('beforeend', tr);
      }
    };

    showBirthday() {
      let tr = this.tableTr();

      tr.firstElementChild.innerHTML = 'Birthday:';

      if (this.birth_year.length > 0) {
        tr.lastElementChild.innerHTML = this.birth_year;
      } else {
        tr.lastElementChild.innerHTML = '-';
      }

      this.popupItem.querySelector('tbody').insertAdjacentElement('beforeend', tr)
    };

    showFilms() {
      let tr = this.tableTr();

      tr.firstElementChild.innerHTML = 'Films:';

      if (this.films.length > 0) {
        let ul = document.createElement('ul');
        this.films.forEach((itemFilms) => {
          let requestLink = itemFilms.replace('http:', 'https:');
          fetch(requestLink)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              let li = document.createElement('li');

              li.innerHTML = data.title;
              ul.insertAdjacentElement('beforeend', li)
              tr.lastElementChild.appendChild(ul);
            })
        })

        this.popupItem.querySelector('tbody').insertAdjacentElement('beforeend', tr);
      }
    };

    showPlanet() {
      let tr = this.tableTr();

      tr.firstElementChild.innerHTML = 'Planet:';

      if (this.homeworld.length > 0) {
        let requestLink = this.homeworld.replace('http:', 'https:');
        fetch(requestLink)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            tr.lastElementChild.innerHTML = data.name;
          })
      }
      else {
        tr.lastElementChild.innerHTML = '-';
      }

      this.popupItem.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    };

    showSpecies() {
      let tr = this.tableTr();

      tr.firstElementChild.innerHTML = 'Species:';

      if (this.species.length > 0) {
        this.species.forEach((itemSpecies) => {
          let requestLink = itemSpecies.replace('http:', 'https:');
          fetch(requestLink)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              tr.lastElementChild.innerHTML = data.name;
            })
        })
      } else {
        tr.lastElementChild.innerHTML = '-';
      }
      this.popupItem.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    };

    showFinal() {
      this.tableBody()
      this.showName()
      this.showBirthday()
      this.showFilms()
      this.showPlanet()
      this.showSpecies()
    }
  };
}



