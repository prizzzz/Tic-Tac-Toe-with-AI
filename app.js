const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-game-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const gameModeRadios = document.querySelectorAll('input[name="gameMode"]');

let turnO = true;
let gameBoard = Array(9).fill("");
let isGameOver = false;
let gameMode = "player";

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Initialize the game
const initGame = () => {
  isGameOver = false;
  gameBoard.fill("");
  msgContainer.classList.add("hide");
  enableBoxes();
  gameMode = document.querySelector('input[name="gameMode"]:checked').value;
  turnO = gameMode === "ai" ? false : true;
  if (gameMode === "ai" && !turnO) aiMove();
};
const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("text-green", "text-red", "text-blue");
  });
};

const disableBoxes = () => {
  boxes.forEach((box) => box.disabled = true);
};

const showWinner = (winner) => {
  if (winner === "draw") {
    msg.innerText = "It's a Draw!";
  } else {
    if (gameMode === "ai") {
      msg.innerText = `🎉 Winner is ${winner === "O" ? "AI" : "Player"} ${winner}`;
    } else {
      msg.innerText = `🎉 Winner is Player ${winner}`;
    }
  }
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      boxes[a].classList.add("text-green");
      boxes[b].classList.add("text-green");
      boxes[c].classList.add("text-green");
      showWinner(gameBoard[a]);
      isGameOver = true;
      return true;
    }
  }

  if (gameBoard.every(cell => cell !== "")) {
    showWinner("draw");
    isGameOver = true;
    return true;
  }
  return false;
};

const aiMove = () => {
  if (isGameOver) return;
  let move = findWinningMove("O");
  if (move === null) move = findWinningMove("X");
  if (move === null) {
    const emptyIndices = gameBoard
      .map((val, idx) => val === "" ? idx : null)
      .filter(idx => idx !== null);
    move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  if (move !== null) {
    setTimeout(() => {
      gameBoard[move] = "O";
      boxes[move].innerText = "O";
      boxes[move].disabled = true;
      boxes[move].classList.add("text-red");
      
      if (!checkWinner()) turnO = true; 
    }, 500);
  }
};

const findWinningMove = (symbol) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      (gameBoard[a] === symbol && gameBoard[b] === symbol && gameBoard[c] === "") ||
      (gameBoard[a] === symbol && gameBoard[c] === symbol && gameBoard[b] === "") ||
      (gameBoard[b] === symbol && gameBoard[c] === symbol && gameBoard[a] === "")
    ) {
      return gameBoard[a] === "" ? a : gameBoard[b] === "" ? b : c;
    }
  }
  return null;
};

// Event Listeners
boxes.forEach((box, idx) => {
  box.addEventListener("click", () => {
    if (isGameOver || gameBoard[idx] !== "") return;
    if (gameMode === "ai" && !turnO) return;

    const currentPlayer = (gameMode === "ai") ? "X" : (turnO ? "O" : "X");
    gameBoard[idx] = currentPlayer;
    box.innerText = currentPlayer;
    box.disabled = true;
    box.classList.add(currentPlayer === "O" ? "text-red" : "text-blue");

    if (checkWinner()) return;

    turnO = !turnO;
    if (gameMode === "ai" && !turnO) {
      aiMove();
    }
  });
});

gameModeRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    gameMode = e.target.value;
    initGame();
  });
});

newGameBtn.addEventListener("click", initGame);
resetBtn.addEventListener("click", initGame);


window.addEventListener("DOMContentLoaded", initGame);