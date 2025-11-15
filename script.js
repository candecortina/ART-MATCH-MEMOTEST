const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");
const galleryScreen = document.getElementById("gallery-screen");

document.getElementById("start-btn").onclick = ()=>{
  welcomeScreen.classList.remove("active");
  instructionsScreen.classList.add("active");
};
document.getElementById("play-btn").onclick = startGame;
document.getElementById("gallery-btn").onclick = showGallery;
document.getElementById("replay-btn").onclick = startGame;
document.getElementById("retry-btn").onclick = startGame;
document.getElementById("replay-gallery-btn").onclick = startGame;

const images = [
  "monalisa.jpg", "monalisa.jpg",
  "lanochestrellada.jpg", "lanochestrellada.jpg",
  "scream.jpg", "scream.jpg",
  "laperla.jpg", "laperla.jpg",
  "persistencia_memoria.jpg", "persistencia_memoria.jpg",
  "venus.jpg", "venus.jpg"
];

let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;
let pairsFound = 0;
let timerInterval;

function startGame(){
  instructionsScreen.classList.remove("active");
  gameScreen.classList.add("active");
  matchedPairs = 0;
  pairsFound = 0;
  document.getElementById("pairs-counter").textContent = `Pares encontrados: 0 / 6`;

  const board = document.getElementById("game-board");
  board.innerHTML = "";
  let shuffled = [...images].sort(()=>Math.random()-0.5);

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

  // Timer 40 segundos
  let timeLeft = 40;
  document.getElementById("timer").textContent = `Tiempo: ${timeLeft}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").textContent = `Tiempo: ${timeLeft}s`;
    if(timeLeft <= 0){
      clearInterval(timerInterval);
      gameScreen.classList.remove("active");
      loseScreen.classList.add("active");
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

// Galería con título, artista y descripción
function showGallery(){
  winScreen.classList.remove("active");
  galleryScreen.classList.add("active");
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const galleryData = [
    {src:"lamonalisa.jpg", title:"Mona Lisa", artist:"Leonardo da Vinci", desc:"1503-1506. Una de las pinturas más famosas del Renacimiento italiano."},
    {src:"noche.jpg", title:"La Noche Estrellada", artist:"Vincent van Gogh", desc:"1889. Pintura que refleja el paisaje nocturno desde el asilo de Saint-Rémy."},
    {src:"grito.jpg", title:"El Grito", artist:"Edvard Munch", desc:"1893. Representa la angustia existencial del ser humano."},
    {src:"renacimiento_venus.jpg", title:"El nacimiento de Venus", artist:"Sandro Botticelli", desc:"1485. Pintura renacentista que representa a Venus emergiendo del mar."},
    {src:"perla.jpg", title:"La joven de la perla", artist:"Johannes Vermeer", desc:"1665. Retrato de una joven con un pendiente de perla."},
    {src:"relojes.jpg", title:"Persistencia de la memoria", artist:"Salvador Dalí", desc:"1931. Representa la relatividad del tiempo con relojes blandos."}
  ];

  galleryData.forEach(item=>{
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `
      <img src="img/${item.src}">
      <h3>${item.title}</h3>
      <h4>${item.artist}</h4>
      <p>${item.desc}</p>
    `;
    gallery.appendChild(div);
  });
}
