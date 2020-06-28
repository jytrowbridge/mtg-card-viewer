let cards = [];
let url = 'https://api.scryfall.com/cards/search?order=cmc&q=set%3Am21';

const getCards = async () => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  myJson = await response.json(); //extract JSON from the http response
  cards.push(...myJson.data)
  if (myJson.has_more) {  // request only returns 175 cards at a time
    url = myJson.next_page;
    getCards();
  }
}

let cardFilters = {
    'colors' : []
  , 'types'  : []
  , 'costs'  : []
  , 'text'   : ''
  };

const colorIcons = document.querySelectorAll('.color-icon')
colorIcons.forEach(icon => icon.addEventListener('click', toggleColor));

function toggleColor() {
  this.classList.toggle('color-selected')
  let color = this.dataset.color;
  if (this.classList.contains('color-selected')) {
    cardFilters['colors'].push(color);
    displayCards(cards, cardFilters);
  } else {
    removeFromArr(cardFilters['colors'], color)
    displayCards(cards, cardFilters);
  }
}

function removeFromArr(array, item) {
  if (array.indexOf(item) == -1) {
    return array;
  } else {
    return array.splice(array.indexOf(item), 1);
  }
}

const typeButtons = document.querySelectorAll('.card-type');
typeButtons.forEach(btn => btn.addEventListener('click', toggleButton));

const costButtons = document.querySelectorAll('.cost-button');
costButtons.forEach(btn => btn.addEventListener('click', toggleButton));

function toggleButton() {
  this.classList.toggle('button-selected')

  let filterType = this.classList.contains('card-type') ? 'types' : 
                   this.classList.contains('cost-button') ? 'costs' : '';
  let filterValue = this.classList.contains('cost-button') ? parseInt(this.innerHTML) : this.innerHTML;                   
  if (this.classList.contains('button-selected')) {
    cardFilters[filterType].push(filterValue);
    displayCards(cards, cardFilters);
  } else {
    removeFromArr(cardFilters[filterType], filterValue);
    displayCards(cards, cardFilters);
  }
}

const costLessThan = document.querySelector('#max-cost');
costLessThan.addEventListener('change', e => {
  let maxCost = e.target.value;
  cardFilters['costs'] = [];
  if (maxCost != -1) {
    for(let i = 0; i <= maxCost; i++) {
      cardFilters['costs'].push(i);
    }
  }
  displayCards(cards, cardFilters);
  costButtons.forEach(btn => {
    if (btn.innerHTML <= maxCost) {
      btn.classList.add('button-selected');
    } else {
      btn.classList.remove('button-selected');
    }
  })
})

const cardsDisplay = document.querySelector('#card-display');

const searchInput = document.querySelector('#search');
searchInput.addEventListener('keyup', search);
searchInput.value = "";
function search() {
  console.log(this.value);
  cardFilters['text'] = this.value.toUpperCase();
  displayCards(cards, cardFilters);
}

function displayCards(cards, filters) {
  // remove current children
  while (cardsDisplay.lastElementChild) {
    cardsDisplay.removeChild(cardsDisplay.lastElementChild);
  }

  console.log('made it here');

  let filteredCards;


  filteredCards = cards.filter(card => {
    allowed = true;
    for (let filterType in filters) {
      let filter = filters[filterType];
      if (filter.length == 0) {
        continue;
      } else if (filterType == 'colors') {
        allowed = allowed && card.colors.filter(color => filter.includes(color)).length > 0;
      } else if (filterType == 'types') {
        //return card.type_line.toUpperCase().contains(filters[filterType]);
        allowed = allowed && filter.reduce((found, curr) => found || card.type_line.toUpperCase().includes(curr), false)
      } else if (filterType == 'costs') {
        if (filter.includes(7)) {
          gtSeven = getCMC(card.mana_cost) > 7;
        } else {
          gtSeven = false;
        }
        allowed = allowed && (filter.includes(getCMC(card.mana_cost)) || gtSeven);
      } else if (filterType == 'text') {
        let name = card.name.toUpperCase().includes(filter);
        let type = card.type_line.toUpperCase().includes(filter);
        let cardText = card.oracle_text.toUpperCase().includes(filter);
        allowed = allowed && (name || type || cardText);
      }
    }
    return allowed;
  })

  filteredCards = filteredCards.sort((a, b) => a.name < b.name ? -1 : 1);

  filteredCards.forEach(card => {
    let cardDisp = document.createElement('img');
    cardDisp.classList.add('card-img');
    cardDisp.addEventListener('click', showCard)
    cardDisp.src = card.image_uris.normal;
    cardsDisplay.appendChild(cardDisp);
  });
}

const bigCardWrapper = document.querySelector('#big-card-wrapper')
const bigCardImg = document.querySelector('.big-card')
const wrapper = document.querySelector('#wrapper')


bigCardWrapper.addEventListener('click', () => {
  bigCardWrapper.classList.remove('visible');
  wrapper.classList.remove('blurred')
  document.body.classList.remove('locked')
})
//   bigCardWrapper.classList.remove('visible');
// })

function showCard() {
  bigCardWrapper.classList.add('visible');
  bigCardImg.src = this.src;
  wrapper.classList.add('blurred')
  document.body.classList.add('locked')
  //console.log(this)
}

function getCMC(costStr) {
  // {4}{B}{B}{B}
  regex = /[{}X]/gi;
  parts = costStr.replaceAll(regex, '').split('');
  if (parts.length == 0) return 0;
  first_char = parts.shift();
  if (isNaN(parseInt(first_char))) {
    return 1 + parts.length;
  } else {
    return parseInt(first_char) + parts.length;
  }
}

getCards();
displayCards(cards, cardFilters);
