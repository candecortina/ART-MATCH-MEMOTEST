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

const images = [
  "monalisa.jpg","monalisa.jpg",
  "lanochestrellada.jpg","lanochestrellada.jpg",
  "scream.jpg","scream.jpg",
  "laperla.jpg","laperla.jpg",
  "persistencia_memoria.jpg","persistencia_memoria.jpg",
  "venus.jpg","venus.jpg"
];

let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timeLeft = 45; // AHORA 45 SEGUNDOS
let timerInterval;

function startGame(){
  instructionsScreen.classList.remove("active");
  gameScreen.classList.add("active");

  matchedPairs = 0;
  firstCard = null;
  timeLeft = 45;
  startTimer();

  const board = document.getElementById("game-board");
  board.innerHTML = "";

  const shuffled = images.sort(()=>Math.random()-0.5);

  shuffled.forEach(src=>{
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">ART MATCH</div>
        <div class="card-face card-front"><img src="img/${src}"></div>
      </div>
    `;
    card.addEventListener("click", ()=>flipCard(card, src));
    board.appendChild(card);
  });
}

function startTimer(){
  const timer = document.getElementById("timer");
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    timer.textContent = `Tiempo: ${timeLeft}s`;
    if(timeLeft <= 0){
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
    firstCard.card.classList.add("matched");
    card.classList.add("matched");

    firstCard = null;
    matchedPairs++;

    if(matchedPairs === images.length/2){
      clearInterval(timerInterval);
      setTimeout(showWinScreen, 500);
    }

  } else {
    lockBoard = true;
    setTimeout(()=>{
      firstCard.card.classList.remove("flip");
      card.classList.remove("flip");
      firstCard = null;
      lockBoard = false;
    }, 900);
  }
}

function showWinScreen(){
  gameScreen.classList.remove("active");
  winScreen.classList.add("active");

  winScreen.innerHTML = `
    <h2 class="win-msg">¡Felicitaciones! 🎉</h2>
    <p>Completaste el Art Match.</p>
    <button class="btn" id="gallery-btn">Ver Galería</button>
  `;

  document.getElementById("gallery-btn").onclick = showGallery;
}

function loseGame(){
  gameScreen.classList.remove("active");
  winScreen.classList.add("active");

  winScreen.innerHTML = `
    <h2 class="win-msg">¡Se acabó el tiempo! ⏳</h2>
    <p>No lograste completar el memotest.</p>
    <button class="btn" id="retry-btn">Intentar de nuevo</button>
  `;

  document.getElementById("retry-btn").onclick = () => location.reload();
}

function showGallery(){
  winScreen.classList.remove("active");
  galleryScreen.classList.add("active");

  const gal = document.getElementById("gallery");
  gal.innerHTML = "";

  const obras = [
    {img:"lamonalisa.jpg", nombre:"La Mona Lisa", artista:"Leonardo da Vinci", año:1503, desc:"Pintura icónica del Renacimiento."},
    {img:"noche.jpg", nombre:"La Noche Estrellada", artista:"Vincent van Gogh", año:1889, desc:"Pintada desde el asilo de Saint-Rémy."},
    {img:"grito.jpg", nombre:"El Grito", artista:"Edvard Munch", año:1893, desc:"Representa la angustia existencial humana."},
    {img:"renacimiento_venus.jpg", nombre:"El Nacimiento de Venus", artista:"Sandro Botticelli", año:1486, desc:"Representación clásica de Venus."},
    {img:"perla.jpg", nombre:"La Joven de la Perla", artista:"Johannes Vermeer", año:1665, desc:"La ‘Mona Lisa holandesa’."},
    {img:"relojes.jpg", nombre:"La Persistencia de la Memoria", artista:"Salvador Dalí", año:1931, desc:"Los famosos relojes derretidos del surrealismo."}
  ];

  obras.forEach(o=>{
    const box = document.createElement("div");
    box.classList.add("gallery-item");
    box.innerHTML = `
      <img src="img/${o.img}">
      <p><strong>${o.nombre}</strong><br>${o.artista} (${o.año})<br>${o.desc}</p>
    `;
    gal.appendChild(box);
  });
}
