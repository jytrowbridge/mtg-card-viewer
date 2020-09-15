let cards = [];

const getCards = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  myJson = await response.json(); //extract JSON from the http response
  
  cards.push(...myJson.data);

  if (myJson.has_more) {  // request only returns 175 cards at a time
    getCards(myJson.next_page);
  }
}

let cardFilters = {
    'colors' : []
  , 'types'  : []
  , 'costs'  : []
  , 'text'   : ''
  , 'rarity' : []
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
  cardFilters['text'] = this.value.toUpperCase();
  displayCards(cards, cardFilters);
}

function displayCards(cards, filters) {
  // remove current children
  while (cardsDisplay.lastElementChild) {
    cardsDisplay.removeChild(cardsDisplay.lastElementChild);
  }

  let filteredCards = cards.filter(card => {
    allowed = true;
    for (let filterType in filters) {
      let filter = filters[filterType];
      if (filter.length == 0) {
        continue;
      } else if (filterType == 'colors') {
        allowed = allowed && card.colors.filter(color => filter.includes(color)).length > 0;
      } else if (filterType == 'types') {
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
        let cardText = card.oracle_text != undefined ? card.oracle_text.toUpperCase().includes(filter) : false;
        allowed = allowed && (name || type || cardText);
      } else if (filterType == 'rarity') {
        allowed = allowed && filter.includes(card.rarity);
      }
    }
    return allowed;
  }); 

  filteredCards = filteredCards.sort((a, b) => a.name < b.name ? -1 : 1);

  filteredCards.forEach(card => {
    let cardDisp = document.createElement('img');
    cardDisp.classList.add('card-img');
    cardDisp.classList.add('noselect');
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

function showCard() {
  bigCardWrapper.classList.add('visible');
  bigCardImg.src = this.src;
  wrapper.classList.add('blurred')
  document.body.classList.add('locked')
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

const rarity = document.querySelectorAll('.rarity');
rarity.forEach(btn => btn.addEventListener('click', toggleRarity));

function toggleRarity() {
  this.classList.toggle('selected');

  if (this.classList.contains('selected')) {
    cardFilters['rarity'].push(this.id);
    displayCards(cards, cardFilters);
  } else {
    removeFromArr(cardFilters['rarity'], this.id)
    displayCards(cards, cardFilters);
  }
}

const magicSet = document.querySelector('#set-select');
magicSet.addEventListener('change', updateSet);

function updateSet(e) {
  cards = [];
  init();
  resetFilters();
}

const resetBtn = document.querySelector('#reset-button');
resetBtn.addEventListener('click', resetFilters);

function resetFilters() {
  colorIcons.forEach(icon => {
    icon.classList.remove('color-selected');
  });

  typeButtons.forEach(type => {
    type.classList.remove('button-selected');
  });
  
  costButtons.forEach(type => {
    type.classList.remove('button-selected');
  });

  rarity.forEach(btn => {
    btn.classList.remove('selected');
  });

  costLessThan.value = '-1';

  searchInput.value = '';

  cardFilters = {
    'colors' : []
  , 'types'  : []
  , 'costs'  : []
  , 'text'   : ''
  , 'rarity' : []
  };
  displayCards(cards, cardFilters);
}


// ---------------------------------------

async function init() {
  // video on async funtions: https://www.youtube.com/watch?v=PoRJizFvM7s
  const setValue = document.querySelector('#set-select').value;
  const url = `https://api.scryfall.com/cards/search?order=cmc&q=set%3A${setValue}`;
  await getCards(url);

  displayCards(cards, cardFilters);
} 

init();