let gameMode = '';
let gridSize = 4;
let playerNames = ['', ''];
let playerScores = [0, 0];
let playerTurn = 0; 
let revealedCards = [];
let gridValues = [];

function selectMode(mode) {
  gameMode = mode;
  document.querySelector('.menu').classList.add('hidden');
  document.getElementById('grid-size-selection').classList.remove('hidden');
}

function selectGridSize(size) {
  gridSize = size;
  document.getElementById('grid-size-selection').classList.add('hidden');
  document.getElementById('name-input').classList.remove('hidden');
  if (gameMode === 'multi') {
    document.getElementById('player2-name-input').classList.remove('hidden');
  }
}

function startGame() {
  playerNames[0] = document.getElementById('player1-name').value || 'Player 1';
  if (gameMode === 'multi') {
    playerNames[1] = document.getElementById('player2-name').value || 'Player 2';
  }

  playerScores = [0, 0];
  playerTurn = 0;
  revealedCards = [];
  gridValues = generateGridValues(gridSize);

  document.getElementById('name-input').classList.add('hidden');
  document.getElementById('scoreboard').classList.remove('hidden');
  document.getElementById('grid').classList.remove('hidden');
  document.getElementById('restart-btn').classList.remove('hidden');

  document.getElementById('player1-score').textContent = `${playerNames[0]}: 0`;
  if (gameMode === 'multi') {
    document.getElementById('player2-score').classList.remove('hidden');
    document.getElementById('current-turn').classList.remove('hidden');
    document.getElementById('player2-score').textContent = `${playerNames[1]}: 0`;
    document.getElementById('current-turn').textContent = `Turn: ${playerNames[playerTurn]}`;
  }
  renderGrid();
}

function generateGridValues(size) {
  const totalPairs = (size * size) / 2;
  const values = [];
  for (let i = 1; i <= totalPairs; i++) {
    values.push(i, i);
  }
  return values.sort(() => Math.random() - 0.5);
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  grid.innerHTML = '';
  for (let i = 0; i < gridValues.length; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    cell.onclick = () => revealCard(i);
    grid.appendChild(cell);
  }
}

function revealCard(index) {
  if (revealedCards.length === 2 || revealedCards.includes(index)) return;

  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.textContent = gridValues[index];
  cell.style.backgroundColor = '#28a745';
  revealedCards.push(index);

  if (revealedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  const [first, second] = revealedCards;
  if (gridValues[first] === gridValues[second]) {
    playerScores[playerTurn]++;
    updateScore();
    document.querySelector(`[data-index="${first}"]`).onclick = null;
    document.querySelector(`[data-index="${second}"]`).onclick = null;
  } else {
    document.querySelector(`[data-index="${first}"]`).textContent = '';
    document.querySelector(`[data-index="${second}"]`).textContent = '';
    document.querySelector(`[data-index="${first}"]`).style.backgroundColor = '#007bff';
    document.querySelector(`[data-index="${second}"]`).style.backgroundColor = '#007bff';
    if (gameMode === 'multi') switchTurn();
  }
  revealedCards = [];
  checkGameEnd();
}

function updateScore() {
  document.getElementById('player1-score').textContent = `${playerNames[0]}: ${playerScores[0]}`;
  if (gameMode === 'multi') {
    document.getElementById('player2-score').textContent = `${playerNames[1]}: ${playerScores[1]}`;
  }
}

function switchTurn() {
  playerTurn = 1 - playerTurn;
  document.getElementById('current-turn').textContent = `Turn: ${playerNames[playerTurn]}`;
}

function checkGameEnd() {
  const remainingCells = document.querySelectorAll('#grid div:not([onclick])');
  if (remainingCells.length === gridValues.length) {
    document.getElementById('winner-display').classList.remove('hidden');
    const winner =
      playerScores[0] === playerScores[1]
        ? "It's a tie!"
        : playerScores[0] > playerScores[1]
        ? `${playerNames[0]} wins!`
        : `${playerNames[1]} wins!`;
    document.getElementById('winner-text').textContent = winner;
  }
}

function restartGame() {
  document.getElementById('scoreboard').classList.add('hidden');
  document.getElementById('grid').classList.add('hidden');
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('winner-display').classList.add('hidden');
  document.querySelector('.menu').classList.remove('hidden');
}
