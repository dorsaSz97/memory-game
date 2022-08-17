'use strict';

// an array of img sources
const cardsData = [
  'assets/images/front1.png',
  'assets/images/front2.png',
  'assets/images/front3.png',
  'assets/images/front4.png',
  'assets/images/front5.png',
  'assets/images/front6.png',
  'assets/images/front7.png',
  'assets/images/front8.png',
  'assets/images/front1.png',
  'assets/images/front2.png',
  'assets/images/front3.png',
  'assets/images/front4.png',
  'assets/images/front5.png',
  'assets/images/front6.png',
  'assets/images/front7.png',
  'assets/images/front8.png',
];

// ------ ELEMENTS ------
const playerLives = document.querySelector('.game__lives');
const gameSection = document.querySelector('.game__cards');

// display the number of lives dynamically
let playerLivesNumber = 8;
playerLives.textContent = '❤️'.repeat(playerLivesNumber); //LESSON

cardGenerator();

// ------ FUNCTIONS ------

// shuffle cards
function randomizeCards() {
  // returns a value between -0.5 and 0.5. if its -, a is before but if its +, a is after b in the array
  return cardsData.sort(() => Math.random() - 0.5); //LESSON
}

// generate cards
function cardGenerator() {
  const randomCards = randomizeCards();

  // create card elements with two faces in the HTML
  randomCards.forEach(randomCard => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardBack = document.createElement('img');
    cardBack.classList.add('card__back');
    cardBack.setAttribute('src', 'assets/images/back.png');

    const cardFront = document.createElement('img');
    cardFront.classList.add('card__front');
    cardFront.setAttribute('src', randomCard);

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    gameSection.appendChild(card);

    card.addEventListener('click', e => {
      const selectedCard = e.target.closest('.card');

      // prevent clicking on the same card again and again
      selectedCard.style.pointerEvents = 'none';

      // show the front face of the card
      selectedCard.classList.add('selected');
      selectedCard.querySelector('.card__front').classList.add('selected');

      checkCards(selectedCard);

      setTimeout(() => {
        document.querySelectorAll('.card:not(.selected)').forEach(card => {
          card.style.pointerEvents = 'all';
        });
      }, 1200);
    });
  });
}

// restart the game
function restart(message) {
  alert(message);

  // shuffle the cards and select them
  const randomCards = randomizeCards();
  const cards = document.querySelectorAll('.card');
  const cardFronts = document.querySelectorAll('.card__front');

  // prevent clicks when things are restarting in the background
  gameSection.style.pointerEvents = 'none';
  cards.forEach(card => (card.style.pointerEvents = 'none'));

  randomCards.forEach((randomCard, i) => {
    // show the back face of the cards
    cards[i].classList.remove('selected');

    // set the new src of the front images
    cardFronts[i].setAttribute('src', randomCard);

    // reset the hearts number
    playerLivesNumber = 8;
    playerLives.textContent = '❤️'.repeat(playerLivesNumber);

    setTimeout(() => {
      // allow clicks on the board and cards after they are face down and their images are set
      cards[i].style.pointerEvents = 'all';
      gameSection.style.pointerEvents = 'all';
    }, 1000);
  });
}

// check the two selected cards
function checkCards(selectedCard) {
  // keep track of the flipped cards (we create another class because we need the selected class for the front of the cards to be displayed and we dont want to mess with that - there will be <16 selected cards and its not useful for our comparison)
  selectedCard.classList.add('flipped');

  const flippedCards = document.querySelectorAll('.flipped');
  const cards = document.querySelectorAll('.card');

  // prevent displaying more than two fronts at a time
  if (flippedCards.length === 2) {
    cards.forEach(card => {
      card.style.pointerEvents = 'none';
    });

    // nonmatching cards
    if (
      flippedCards[0].querySelector('.card__front').getAttribute('src') !==
      flippedCards[1].querySelector('.card__front').getAttribute('src')
    ) {
      // update the lives
      playerLivesNumber--;
      playerLives.textContent = '❤️'.repeat(playerLivesNumber);

      // prevent the cards to be turned over immediately
      setTimeout(() => {
        flippedCards.forEach(flippedCard => {
          // turn the cards over
          flippedCard.classList.remove('selected');
          flippedCard
            .querySelector('.card__front')
            .classList.remove('selected');

          // make them clickable again
          flippedCard.style.pointerEvents = 'all';
        });

        // case: completely losing
        playerLivesNumber === 0 && restart('You lost');
      }, 800);
    }
    // matching cards
    else {
      // case: completely winning
      document.querySelectorAll('.card.selected').length ===
        cardsData.length * 2 &&
        setTimeout(() => {
          restart('You won');
        }, 800);
    }

    flippedCards.forEach(flippedCard => {
      // they have the selected class so they stay the same but we dont want to keep track of them anymore
      flippedCard.classList.remove('flipped');
    });
  }
}
