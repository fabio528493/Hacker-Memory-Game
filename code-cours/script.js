

let game = {
    elCurrentScore: null,
    elWinScore: null,
    elHiscore: null,
    elBtnClear: null,
    elBtnPlayAgain: null,
    elDeck: null,
    elWinPanel: null,
    cardTypes: 10,
    arrCard: [],
    storageName: 'memory-hiscore',
    canPlay: true,
    firstCard: null,
    currentScore: 0,
    timer: null,
    showTime: 1000,
    foundPairs: 0,
    hiscore: 0,
};

function shuffleArray(arr) {
    let currentIndex = arr.length - 1;

    while (currentIndex >= 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        [arr[randomIndex], arr[currentIndex]] = [arr[currentIndex], arr[randomIndex]];
        currentIndex--;

    }
}



function getCardHTML(numeroCarte) {

    let elCard = document.createElement('div');
    elCard.classList.add('card')
    elCard.dataset.id = numeroCarte;
    let innerCard = `<div class="image" style="background-image:url('./images/card-${numeroCarte}.jpg')"></div>`;
    innerCard += '<div class="back"></div>';
    elCard.innerHTML = innerCard;
    elCard.addEventListener('click', handlerCardClick);
    return elCard;
}

function handlerCardClick(evt) {

    let elCard = evt.target.offsetParent;
    if (!game.canPlay) {
        return;
    }
    clearTimeout(game.timer);
    let cardIsNotPlayable = elCard.classList.contains('flipped');
    if (cardIsNotPlayable) {
        return;
    }

    elCard.classList.add('flipped');
    let cardIsFirst = game.firstCard === null;
    if (cardIsFirst) {

        game.firstCard = elCard;

        return;
    }

    game.currentScore++;
    game.elCurrentScore.textContent = game.currentScore;
    let cardIsDifferent = elCard.dataset.id !== game.firstCard.dataset.id;

    if (cardIsDifferent) {

        game.canPlay = false;
        game.timer = setTimeout(function () {

            elCard.classList.remove('flipped');

            game.firstCard.classList.remove('flipped');
            game.firstCard = null;
            game.canPlay = true;

        }, game.showTime);

        return;
    }

    game.firstCard = null;
    game.foundPairs++;
    let allFound = game.foundPairs >= game.cardTypes;
    console.log(allFound);
    if (!allFound) {
        return;
    }

    wonGame();

}

function initGame() {

    game.elCurrentScore = document.getElementById("the-score-display");
    game.elWinScore = document.getElementById("the-winscore-display");
    game.elHiscore = document.getElementById("the-highscore-display");
    game.elBtnClear = document.getElementById("the-deleter-button");
    game.elBtnPlayAgain = document.getElementById("the-play-again-button");
    game.elDeck = document.getElementById("the-deck");
    game.elWinPanel = document.getElementById("the-win-panel");

    game.elBtnClear.addEventListener('click', function () {
        console.log('Effacement du record...');
        localStorage.removeItem(game.storageName);
        game.hiscore = 0;
        game.elHiscore.textContent = game.hiscore;

    });

    game.elBtnPlayAgain.addEventListener('click', function () {

        newGame();

    });

    let storedHiscore = localStorage.getItem(game.storageName);

    if (storedHiscore === null) {
        storedHiscore = 0;
    }

    game.hiscore = storedHiscore;
    game.elHiscore.textContent = game.hiscore;

    newGame();

}

function newGame() {

    console.log('partie démarée...');
    game.elDeck.innerHTML = '';
    game.arrCard = [];
    game.foundPairs = 0;
    for (let numeroCarte = 1; numeroCarte <= game.cardTypes; numeroCarte++) {

        game.arrCard.push(numeroCarte, numeroCarte);

    }

    shuffleArray(game.arrCard);

    for (let numeroCarte of game.arrCard) {
        let elCard = getCardHTML(numeroCarte);
        game.elDeck.append(elCard);

    }

    game.currentScore = 0;
    game.elCurrentScore.textContent = game.currentScore;
    game.elWinPanel.classList.add('hidden');
    game.elDeck.classList.remove('hidden');

}

function wonGame() {
    game.elWinScore.textContent = game.currentScore;
    if (game.currentScore < game.hiscore || game.hiscore <= 0) {
        game.hiscore = game.currentScore;
        game.elHiscore.textContent = game.hiscore;
        localStorage.setItem(game.storageName, game.hiscore);

    }
    game.elDeck.classList.add('hidden');
    game.elWinPanel.classList.remove('hidden');
}


initGame();