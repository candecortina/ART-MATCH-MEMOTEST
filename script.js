const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");
const galleryScreen = document.getElementById("gallery-screen");

document.getElementById("start-btn").onclick = ()=>{ welcomeScreen.classList.remove("active"); instructionsScreen.classList.add("active"); };
document.getElementById("play-btn").onclick = startGame;
document.getElementById("gallery-btn").onclick = showGallery;
document.getElementById("replay-btn").onclick = startGame;
document.getElementById("retry-btn").onclick = startGame;
document.getElementById("replay-gallery-btn").onclick = startGame;

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
let pairsFound = 0;
let timerInterval;
let timeLeft = 40;

function startGame(){
  instructionsScreen.classList.remove("active");
  gameScreen.classList.add("active");

  matchedPairs = 0;
  pairsFound = 0;
  firstCard = null;
  document.getElementById("pairs-counter").textContent = `Pares encontrados: 0 / 6`;

  const board = document.getElementById("game-board");
  board.innerHTML = "";

  const shuffled = [...images].sort(()=>Math.random()-0.5);

  shuffled.forEach(src=>{
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.src = src;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">ART MATCH</div>
        <div class="card-face card-front"><img src="img/${src}"></div>
      </div>
    `;
    card.addEventListener("click", ()=>flipCard(card));
    board.appendChild(card);
  });

  timeLeft = 40;
  document.getElementById("timer").textContent = `Tiempo: ${timeLeft}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").textContent = `Tiempo: ${timeLeft}s`;
    if(timeLeft<=0){
      clearInterval(timerInterval);
      loseGame();
    }
  },1000);
}

function flipCard(card){
  if(lockBoard || card.classList.contains("flip") || card.classList.contains("matched")) return;

  card.classList.add("flip");

  if(!firstCard){
    firstCard = card;
    return;
  }

  if(firstCard.dataset.src === card.dataset.src){
    firstCard.classList.add("matched");
    card.classList.add("matched");
    firstCard = null;
    matchedPairs++;
    pairsFound++;
    document.getElementById("pairs-counter").textContent = `Pares encontrados: ${pairsFound} / 6`;
    if(matchedPairs === images.length/2){
      clearInterval(timerInterval);
      setTimeout(()=>{
        gameScreen.classList.remove("active");
        winScreen.classList.add("active");
      },500);
    }
  } else {
    lockBoard = true;
    setTimeout(()=>{
      firstCard.classList.remove("flip");
      card.classList.remove("flip");
      firstCard = null;
      lockBoard = false;
    },900);
  }
}

function loseGame(){
  gameScreen.classList.remove("active");
  loseScreen.classList.add("active");
}

function showGallery(){
  winScreen.classList.remove("active");
  galleryScreen.classList.add("active");

  const gal = document.getElementById("gallery");
  gal.innerHTML = "";

  const obras = [
    {img:"lamonalisa.jpg", nombre:"La Mona Lisa", artista:"Leonardo da Vinci", año:1503, desc:"Pintura icónica del Renacimiento que representa a Lisa Gherardini."},
    {img:"noche.jpg", nombre:"La Noche Estrellada", artista:"Vincent van Gogh", año:1889, desc:"Obra realizada desde la ventana del asilo de Saint-Rémy."},
    {img:"grito.jpg", nombre:"El Grito", artista:"Edvard Munch", año:1893, desc:"Expresa la angustia existencial del ser humano."},
    {img:"renacimiento_venus.jpg", nombre:"El nacimiento de Venus", artista:"Sandro Botticelli", año:1485, desc:"Pintura renacentista que representa a Venus emergiendo del mar."},
    {img:"perla.jpg", nombre:"La joven de la perla", artista:"Johannes Vermeer", año:1665, desc:"Conocida como la 'Mona Lisa holandesa'."},
    {img:"relojes.jpg", nombre:"Persistencia de la memoria", artista:"Salvador Dalí", año:1931, desc:"Representa la relatividad del tiempo con relojes blandos."}
  ];

  obras.forEach(o=>{
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `
      <img src="img/${o.img}">
      <h3>${o.nombre}</h3>
      <h4>${o.artista} (${o.año})</h4>
      <p>${o.desc}</p>
    `;
    gal.appendChild(div);
  });
}
