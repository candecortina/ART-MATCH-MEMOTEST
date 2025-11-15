const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const galleryScreen = document.getElementById("gallery-screen");

document.getElementById("start-btn").onclick = () => {
  welcomeScreen.classList.remove("active");
  instructionsScreen.classList.add("active");
};

document.getElementById("play-btn").onclick = startGame;
document.getElementById("gallery-btn").onclick = showGallery;

// Fichas del memotest
const images = [
  "monalisa.jpg","monalisa.jpg",
  "lanochestrellada.jpg","lanochestrellada.jpg",
  "scream.jpg","scream.jpg",
  "laperla.jpg","laperla.jpg",
  "persistencia_memoria.jpg","persistencia_memoria.jpg"
];

let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timeLeft = 40 * 60; // 40 minutos
let timerInterval;

function startGame() {
  instructionsScreen.classList.remove("active");
  gameScreen.classList.add("active");

  matchedPairs = 0;
  firstCard = null;
  timeLeft = 40 * 60;

  startTimer();

  const board = document.getElementById("game-board");
  board.innerHTML = "";

  const shuffled = images.sort(() => Math.random() - 0.5);

  shuffled.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Estructura de la ficha
    card.innerHTML = `
      <div class="card-face card-back">ART MATCH</div>
      <div class="card-face card-front"><img src="img/${src}"></div>
    `;

    card.addEventListener("click", () => flipCard(card, src));
    board.appendChild(card);
  });
}

function startTimer() {
  const timer = document.getElementById("timer");
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const min = Math.floor(timeLeft/60);
    const sec = timeLeft % 60;
    timer.textContent = `Tiempo: ${min}:${sec.toString().padStart(2,"0")}`;
    if(timeLeft<=0){
      clearInterval(timerInterval);
      loseGame();
    }
    timeLeft--;
  },1000);
}

function flipCard(card, src){
  if(lockBoard || card.classList.contains("flip") || card.classList.contains("matched")) return;

  card.classList.add("flip");

  if(!firstCard){
    firstCard = {card, src};
    return;
  }

  if(firstCard.src === src){
    // Coinciden → quedan descubiertas
    firstCard.card.classList.add("matched");
    card.classList.add("matched");
    firstCard = null;
    matchedPairs++;
    if(matchedPairs === images.length/2){
      clearInterval(timerInterval);
      setTimeout(()=>{
        gameScreen.classList.remove("active");
        winScreen.classList.add("active");
      },500);
    }
  } else {
    // No coinciden → vuelven al dorso
    lockBoard = true;
    setTimeout(()=>{
      firstCard.card.classList.remove("flip");
      card.classList.remove("flip");
      firstCard = null;
      lockBoard = false;
    },900);
  }
}

function loseGame(){
  gameScreen.classList.remove("active");
  winScreen.innerHTML = `
    <h2 class="win-msg">¡Se acabó el tiempo! ⏳</h2>
    <p>No lograste completar el memotest.</p>
  `;
  winScreen.classList.add("active");
}

function showGallery(){
  winScreen.classList.remove("active");
  galleryScreen.classList.add("active");

  const gal = document.getElementById("gallery");
  gal.innerHTML = "";

  const obras = [
    {img:"monalisa.jpg", nombre:"La Mona Lisa", artista:"Leonardo da Vinci", año:1503, desc:"Pintura icónica del Renacimiento que representa a Lisa Gherardini."},
    {img:"lanochestrellada.jpg", nombre:"La Noche Estrellada", artista:"Vincent van Gogh", año:1889, desc:"Obra realizada desde la ventana del asilo de Saint-Rémy."},
    {img:"scream.jpg", nombre:"El Grito", artista:"Edvard Munch", año:1893, desc:"Expresa la angustia existencial del ser humano."},
    {img:"laperla.jpg", nombre:"La Joven de la Perla", artista:"Johannes Vermeer", año:1665, desc:"Conocida como la 'Mona Lisa holandesa'."},
    {img:"persistencia_memoria.jpg", nombre:"La Persistencia de la Memoria", artista:"Salvador Dalí", año:1931, desc:"Famosa por sus relojes derretidos, símbolo del tiempo fluido."}
  ];

  obras.forEach(o=>{
    const box = document.createElement("div");
    box.innerHTML = `<img src="img/${o.img}"><p><strong>${o.nombre}</strong><br>${o.artista} (${o.año})<br>${o.desc}</p>`;
    gal.appendChild(box);
  });
}
