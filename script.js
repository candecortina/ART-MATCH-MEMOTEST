document.getElementById("startBtn").addEventListener("click", startGame);

let images = [
  "monalisa.jpg",
  "lanochestrellada.jpg",
  "scream.jpg",
  "laperla.jpg",
  "persistencia_memoria.jpg"
];

// duplicamos para las parejas
let cardsArray = [...images, ...images];

let grid = document.querySelector(".grid");
let flippedCard = null;
let lockBoard = false;
let time = 0;
let timerInterval;

function startGame() {
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".game").style.display = "block";

  startTimer();
  generateCards();
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").textContent = `Tiempo: ${time}s`;
  }, 1000);
}

function generateCards() {
  grid.innerHTML = "";
  cardsArray.sort(() => Math.random() - 0.5);

  cardsArray.forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="front">
        <img src="img/${img}" style="width:100%; height:100%; border-radius:12px;">
      </div>
      <div class="back">
        Art Match
      </div>
    `;

    card.addEventListener("click", () => flipCard(card, img));
    grid.appendChild(card);
  });
}

function flipCard(card, img) {
  if (lockBoard || card === flippedCard || card.classList.contains("matched")) return;

  card.classList.add("flip");

  if (!flippedCard) {
    flippedCard = card;
    flippedCard.dataset.image = img;
  } else {
    checkMatch(card, img);
  }
}

function checkMatch(card2, img2) {
  lockBoard = true;

  if (flippedCard.dataset.image === img2) {
    flippedCard.classList.add("matched");
    card2.classList.add("matched");
    resetTurn();

  } else {
    setTimeout(() => {
      flippedCard.classList.remove("flip");
      card2.classList.remove("flip");
      resetTurn();
    }, 900);
  }
}

function resetTurn() {
  flippedCard = null;
  lockBoard = false;
}
