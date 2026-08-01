// =====================
// MEMORY MATCH GAME JS
// =====================

let cards = [];
let flippedCards = [];
let moves = 0;
let timer = 0;
let interval;

const startBtn = document.getElementById("startBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");

startBtn.addEventListener("click", startGame);
leaderboardBtn.addEventListener("click", showLeaderboard);

// ---------------------
// START GAME FUNCTION
// ---------------------
function startGame() {
  startBtn.disabled = true; // prevent multiple clicks

  const symbols = ['🍎','🍌','🍇','🍒','🥝','🍉','🍍','🍑'];
  cards = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  flippedCards = [];
  moves = 0;
  timer = 0;

  document.getElementById("moves").textContent = moves;
  document.getElementById("time").textContent = timer;

  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById("time").textContent = timer;
  }, 1000);

  // create card elements
  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.value = symbol;
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

// ---------------------
// FLIP CARD FUNCTION
// ---------------------
function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

  card.textContent = card.dataset.value;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById("moves").textContent = moves;
    checkMatch();
  }
}

// ---------------------
// CHECK MATCH FUNCTION
// ---------------------
function checkMatch() {
  const [c1, c2] = flippedCards;

  if (c1.dataset.value === c2.dataset.value) {
    flippedCards = [];
    checkWin();
  } else {
    setTimeout(() => {
      c1.textContent = "";
      c2.textContent = "";
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");
      flippedCards = [];
    }, 800);
  }
}

// ---------------------
// CHECK WIN FUNCTION
// ---------------------
function checkWin() {
  const matched = document.querySelectorAll(".card.flipped").length;
  if (matched === cards.length) {
    clearInterval(interval);

    // save the score after winning
    saveScore(moves, timer);

    alert(`🎉 You won in ${moves} moves and ${timer} seconds!`);

    startBtn.disabled = false; // allow restart
  }
}

// ---------------------
// SAVE SCORE FUNCTION
// ---------------------
function saveScore(moves, time) {
  const scoreValue = moves * 10 + time;

  const newScore = {
    moves,
    time,
    score: scoreValue
  };

  let scores = JSON.parse(localStorage.getItem("memoryScores")) || [];

  scores.push(newScore);

  // sort ascending (lower score is better)
  scores.sort((a, b) => a.score - b.score);

  // keep top 10 only
  scores = scores.slice(0, 10);

  localStorage.setItem("memoryScores", JSON.stringify(scores));

  console.log("Score saved:", newScore); // debug
}

// ---------------------
// SHOW LEADERBOARD FUNCTION
// ---------------------
function showLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  const scores = JSON.parse(localStorage.getItem("memoryScores")) || [];

  if (scores.length === 0) {
    leaderboard.innerHTML = "<li>No scores yet</li>";
    return;
  }

  scores.forEach((s, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. Moves: ${s.moves}, Time: ${s.time}s`;
    leaderboard.appendChild(li);
  });
}
