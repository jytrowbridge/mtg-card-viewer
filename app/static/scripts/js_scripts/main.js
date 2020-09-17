cards = [];
for (var i in cards_json) {
  cards.push(cards_json[i]);
}

let cardFilters = {
  'colors': []
  , 'types': []
  , 'costs': []
  , 'text': ''
  , 'rarity': []
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
    for (let i = 0; i <= maxCost; i++) {
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

  let allowedCards = cards.filter(card => {
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
          gtSeven = card.cmc > 7;
        } else {
          gtSeven = false;
        }
        allowed = allowed && (filter.includes(card.cmc) || gtSeven);
      } else if (filterType == 'text') {
        let name = card.name.toUpperCase().includes(filter);
        let type = card.type_line.toUpperCase().includes(filter);
        let cardText = card.card_text != undefined ? card.card_text.toUpperCase().includes(filter) : false;
        allowed = allowed && (name || type || cardText);
      } else if (filterType == 'rarity') {
        allowed = allowed && filter.includes(card.rarity);
      }
    }
    return allowed;
  });

  const allowedCardIDs = allowedCards.map(card => card.id);

  console.log(allowedCardIDs)

  cardDivs.forEach(cardDiv => {
    if (allowedCardIDs.includes(cardDiv.dataset.id)) {
      cardDiv.style.display = 'inline';
    } else {
      cardDiv.style.display = 'none';
    }
  });

  // filteredCards = filteredCards.sort((a, b) => a.name < b.name ? -1 : 1);
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

const cardDivs = document.querySelectorAll('.card-img');
cardDivs.forEach(card => card.addEventListener('click', showCard));

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
    'colors': []
    , 'types': []
    , 'costs': []
    , 'text': ''
    , 'rarity': []
  };
  displayCards(cards, cardFilters);
}
