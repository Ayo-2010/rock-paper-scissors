const MOVES = ['rock', 'paper', 'scissors'];
const EMOJI = { rock: '✊', paper: '✋', scissors: '✌️' };

const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

let playerScore = 0;
let cpuScore = 0;
let targetScore = 5;
let roundLocked = false;
let gameOver = false;

const playerScoreEl = document.getElementById('playerScore');
const cpuScoreEl = document.getElementById('cpuScore');
const playerHand = document.getElementById('playerHand');
const cpuHand = document.getElementById('cpuHand');
const resultText = document.getElementById('resultText');
const controls = document.getElementById('controls');
const moveButtons = document.querySelectorAll('.move-btn');
const resetBtn = document.getElementById('resetBtn');
const targetSelect = document.getElementById('targetSelect');
const targetScoreEl = document.getElementById('targetScore');
const overlay = document.getElementById('overlay');
const overlayEmoji = document.getElementById('overlayEmoji');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const playAgainBtn = document.getElementById('playAgainBtn');

function randomMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function setResult(text, type) {
  resultText.textContent = text;
  resultText.className = 'result-text flash' + (type ? ' ' + type : '');

  void resultText.offsetWidth;
}

function bumpScore(el) {
  const card = el.closest('.score-card');
  card.classList.add('pop');
  setTimeout(() => card.classList.remove('pop'), 220);
}

function playRound(playerMove) {
  if (roundLocked || gameOver) return;
  roundLocked = true;

  const cpuMove = randomMove();

  playerHand.textContent = '✊';
  cpuHand.textContent = '✊';
  playerHand.classList.add('shake-you');
  cpuHand.classList.add('shake-cpu');
  setResult('Rock… paper… scissors…', '');

  moveButtons.forEach((b) => (b.disabled = true));

  setTimeout(() => {
    playerHand.classList.remove('shake-you');
    cpuHand.classList.remove('shake-cpu');
    playerHand.textContent = EMOJI[playerMove];
    cpuHand.textContent = EMOJI[cpuMove];

    let outcome;
    if (playerMove === cpuMove) {
      outcome = 'draw';
    } else if (BEATS[playerMove] === cpuMove) {
      outcome = 'win';
    } else {
      outcome = 'lose';
    }

    if (outcome === 'win') {
      playerScore++;
      playerScoreEl.textContent = playerScore;
      bumpScore(playerScoreEl);
      setResult(`You win! ${cap(playerMove)} beats ${cpuMove}.`, 'win');
    } else if (outcome === 'lose') {
      cpuScore++;
      cpuScoreEl.textContent = cpuScore;
      bumpScore(cpuScoreEl);
      setResult(`You lose. ${cap(cpuMove)} beats ${playerMove}.`, 'lose');
    } else {
      setResult(`It's a draw — both played ${playerMove}.`, 'draw');
    }

    roundLocked = false;
    moveButtons.forEach((b) => (b.disabled = false));
    checkGameOver();
  }, 650);
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function checkGameOver() {
  if (playerScore < targetScore && cpuScore < targetScore) return;

  gameOver = true;

  const playerWon = playerScore > cpuScore;
  overlayEmoji.textContent = playerWon ? '🏆' : '😵';
  overlayTitle.textContent = playerWon ? 'You win!' : 'Computer wins';
  overlayTitle.style.color = playerWon ? 'var(--you)' : 'var(--cpu)';
  overlayText.textContent = `Final score ${playerScore} – ${cpuScore}`;

  setTimeout(() => (overlay.hidden = false), 500);
}

function resetGame() {
  playerScore = 0;
  cpuScore = 0;
  gameOver = false;
  roundLocked = false;
  playerScoreEl.textContent = '0';
  cpuScoreEl.textContent = '0';
  playerHand.textContent = '✊';
  cpuHand.textContent = '✊';
  resultText.textContent = 'Make your move';
  resultText.className = 'result-text';
  overlay.hidden = true;
  moveButtons.forEach((b) => (b.disabled = false));
}

moveButtons.forEach((btn) => {
  btn.addEventListener('click', () => playRound(btn.dataset.move));
});

resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

targetSelect.addEventListener('change', () => {
  targetScore = Number(targetSelect.value);
  targetScoreEl.textContent = targetScore;
  resetGame();
});

const KEY_MAP = { r: 'rock', p: 'paper', s: 'scissors' };
document.addEventListener('keydown', (e) => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
  if (e.key === 'Escape' && !overlay.hidden) {
    resetGame();
    return;
  }
  const move = KEY_MAP[e.key.toLowerCase()];
  if (move) playRound(move);
});
