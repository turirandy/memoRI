const symbols = ['A', 'B', 'C', 'D','1', '2', '3', '4',];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let timer = 0;
let timerInterval = null;
let matchedPairs = 0;
const totalPairs = symbols.length;

function startTimer() {
  timer = 0;
  document.getElementById('timer').textContent = `Time: 0s`;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = `Time: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetGame() {
  stopTimer();
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  loadGame();
  startTimer();
}

function loadGame() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';

  const gameSymbols = [...symbols, ...symbols];
  shuffle(gameSymbols);

  gameSymbols.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function flipCard() {
  if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) return;

  this.classList.add('flipped');
  this.textContent = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      stopTimer();
      updateLeaderboard(timer);
    }
    resetTurn();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetTurn();
    }, 280);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Leaderboard using localStorage
function updateLeaderboard(currentTime) {
  let scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
  scores.push(currentTime);
  scores.sort((a, b) => a - b);
  scores = scores.slice(0, 100); // Top 100 scores only
  localStorage.setItem('leaderboard', JSON.stringify(scores));
  renderLeaderboard();
}

function renderLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const list = document.getElementById('leaderboard');
  list.innerHTML = '';
  scores.forEach((time, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${time}s`;
    list.appendChild(li);
  });
}

document.getElementById('restartBtn').addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  startTimer();
  renderLeaderboard();
});
