let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameMode = 2;
let isGameOver = false;
let playerNames = { X: "Player 1", O: "Player 2" };

function chooseMode(mode) {
  gameMode = mode;
  document.getElementById('modeSelection').style.display = 'none';
  document.getElementById('playerInput').style.display = 'block';
  document.getElementById('difficultyLevel').style.display = mode === 1 ? 'block' : 'none';
  document.getElementById('player2').style.display = mode === 2 ? 'block' : 'none';
}

function proceedToGame() {
  const name1 = document.getElementById('player1').value.trim();
  const name2 = document.getElementById('player2').value.trim();
  playerNames.X = name1 || 'Player 1';
  playerNames.O = gameMode === 2 ? (name2 || 'Player 2') : 'Computer';

  document.getElementById('playerInput').style.display = 'none';
  document.getElementById('difficultyLevel').style.display = 'none';
  document.getElementById('gameSection').style.display = 'block';
  resetGame();
}

function resetGame() {
  board.fill(null);
  currentPlayer = 'X';
  isGameOver = false;
  document.getElementById('status').textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
  renderBoard();
  document.getElementById('thankYou').style.display = 'none';
  document.getElementById('homeButton').style.display = 'none';
}

function renderBoard() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = value;
    cell.onclick = () => makeMove(index);
    boardDiv.appendChild(cell);
  });
}

function makeMove(index) {
  if (isGameOver || board[index]) return;
  board[index] = currentPlayer;
  renderBoard();
  if (checkWinner()) {
    document.getElementById('status').textContent = `${playerNames[currentPlayer]} Wins! (${currentPlayer})`;
    isGameOver = true;
    showThankYou(`${playerNames[currentPlayer]} Wins!`);
    return;
  }
  if (board.every(cell => cell)) {
    document.getElementById('status').textContent = "It's a Draw!";
    isGameOver = true;
    showThankYou("It's a Draw!");
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('status').textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
  if (gameMode === 1 && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let emptyIndices = board.map((v, i) => v === null ? i : null).filter(i => i !== null);
  const difficulty = document.getElementById('difficulty').value;
  let move;
  if (difficulty === 'easy') {
    move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  } else {
    move = bestMove();
  }
  makeMove(move);
}

function bestMove() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = 'X';
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  let emptyIndices = board.map((v, i) => v === null ? i : null).filter(i => i !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function checkWinner() {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winCombos.some(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function showThankYou(message) {
  const thankYou = document.getElementById('thankYou');
  thankYou.textContent = `🎉 ${message} - Thank you for playing! 🎉`;
  thankYou.style.display = 'block';
  document.getElementById('homeButton').style.display = 'block';
}

function goHome() {
  document.getElementById('thankYou').style.display = 'none';
  document.getElementById('homeButton').style.display = 'none';
  document.getElementById('gameSection').style.display = 'none';
  document.getElementById('playerInput').style.display = 'none';
  document.getElementById('modeSelection').style.display = 'block';
}
