const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
const scores = { X: 0, O: 0, draw: 0 };

function checkWinner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  return null;
}

function setStatus(text) {
  statusEl.innerHTML = text;
}

function updateTurnStatus() {
  const cls = currentPlayer === 'X' ? 'player-x' : 'player-o';
  setStatus(`Turno de <span class="${cls}">${currentPlayer}</span>`);
}

function handleCellClick(event) {
  const index = Number(event.currentTarget.dataset.index);
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const cellEl = cells[index];
  cellEl.textContent = currentPlayer;
  cellEl.classList.add(currentPlayer.toLowerCase());
  cellEl.disabled = true;

  const result = checkWinner();
  if (result) {
    endGame(result);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnStatus();
}

function endGame(result) {
  gameOver = true;
  cells.forEach((cell) => (cell.disabled = true));

  if (result.winner === 'draw') {
    scores.draw += 1;
    scoreDrawEl.textContent = scores.draw;
    setStatus('Empate');
  } else {
    scores[result.winner] += 1;
    (result.winner === 'X' ? scoreXEl : scoreOEl).textContent = scores[result.winner];
    result.line.forEach((i) => cells[i].classList.add('win'));
    const cls = result.winner === 'X' ? 'player-x' : 'player-o';
    setStatus(`Ganó <span class="${cls}">${result.winner}</span>`);
  }
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('x', 'o', 'win');
  });
  updateTurnStatus();
}

function resetScore() {
  scores.X = 0;
  scores.O = 0;
  scores.draw = 0;
  scoreXEl.textContent = 0;
  scoreOEl.textContent = 0;
  scoreDrawEl.textContent = 0;
  restartGame();
}

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScore);

updateTurnStatus();
