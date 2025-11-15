const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const galleryScreen = document.getElementById("gallery-screen");
const playAgainBtn = document.getElementById("play-again-btn");

document.getElementById("start-btn").onclick = () => {
  welcomeScreen.classList.remove("active");
  instructionsScreen.classList.add("active");
};

document.getElementById("play-btn").onclick = startGame;
if(playAgainBtn) playAgainBtn.onclick = startGame;

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
let timeLeft = 40;
let timerInterval;

function startGame(){
  instructionsScreen.classList.remove("active");
  gameScreen.classList.add("active");
  galleryScreen.classList.remove("active");
  winScreen.classList.remove("active");

  matchedPairs = 0;
  pairsFound = 0;
  firstCard = null;
  timeLeft = 40;
  startTimer();
  document.getElementById("pairs-counter").textContent = `Pares encontrados: ${pairsFound} / 6`;

  const board = document.getElementById("game-board");
  board.innerHTML = "";

  const shuffled = images.sort(()=>Math.random()-0.5);

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

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

function startTimer(){
  const timer = document.getElementById("timer");
  clearInterval(timerInterval);
  timer.textContent = `Tiempo: ${timeLeft}s`;
  timerInterval = setInterval(()=>{
    timeLeft--;
    timer.textContent = `Tiempo: ${timeLeft}s`;
    if(timeLeft<=0){ clearInterval(timerInterval); loseGame(); }
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
      setTimeout(showWinScreen,500);
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
  winScreen.innerHTML = `
    <h2 class="win-msg">¡Se acabó el tiempo! ⏳</h2>
    <p>No lograste completar el memotest.</p>
    <button id="try-again-btn" class="btn">Intentar de nuevo</button>
  `;
  winScreen.classList.add("active");
  document.getElementById("try-again-btn").onclick = startGame;
}

function showWinScreen(){
  gameScreen.classList.remove("active");
  winScreen.innerHTML = `
    <h2 class="win-msg">¡Felicitaciones! 🎉</h2>
    <p>Completaste el Art Match.</p>
    <button id="gallery-btn" class="btn">Ver Galería</button>
  `;
  winScreen.classList.add("active");
  document.getElementById("gallery-btn").addEventListener("click", showGallery);
}

// --- Galería Carrusel ---
const galleryImages = [
  {img:"lamonalisa.jpg", nombre:"La Mona Lisa", artista:"Leonardo da Vinci", año:1503, desc:"Pintura icónica del Renacimiento que representa a Lisa Gherardini."},
  {img:"noche.jpg", nombre:"La Noche Estrellada", artista:"Vincent van Gogh", año:1889, desc:"Obra realizada desde la ventana del asilo de Saint-Rémy."},
  {img:"grito.jpg", nombre:"El Grito", artista:"Edvard Munch", año:1893, desc:"Expresa la angustia existencial del ser humano."},
  {img:"renacimiento_venus.jpg", nombre:"El Renacimiento de Venus", artista:"Sandro Botticelli", año:1486, desc:"Representa el nacimiento de Venus de la espuma del mar."},
  {img:"perla.jpg", nombre:"La Joven de la Perla", artista:"Johannes Vermeer", año:1665, desc:"Conocida como la 'Mona Lisa holandesa'."},
  {img:"relojes.jpg", nombre:"La Persistencia de la Memoria", artista:"Salvador Dalí", año:1931, desc:"Famosa por sus relojes derretidos, símbolo del tiempo fluido."}
];

let currentIndex = 0;

function showGallery(){
  winScreen.classList.remove("active");
  galleryScreen.classList.add("active");
  renderGallery();
}

function renderGallery(){
  const gal = document.getElementById("gallery");
  gal.innerHTML = "";
  const slice = galleryImages.slice(currentIndex,currentIndex+3);
  slice.forEach(o=>{
    const box = document.createElement("div");
    box.classList.add("gallery-item");
    box.innerHTML = `<img src="img/${o.img}"><p><strong>${o.nombre}</strong><br>${o.artista} (${o.año})<br>${o.desc}</p>`;
    gal.appendChild(box);

    box.addEventListener("click", ()=>{
      document.getElementById("modal-img").src = `img/${o.img}`;
      document.getElementById("modal-info").innerHTML = `<strong>${o.nombre}</strong><br>${o.artista} (${o.año})<br>${o.desc}`;
      document.getElementById("modal").style.display = "flex";
    });
  });
}

document.getElementById("next").onclick = ()=>{
  if(currentIndex+3<galleryImages.length){ currentIndex+=3; renderGallery(); }
};
document.getElementById("prev").onclick = ()=>{
  if(currentIndex-3>=0){ currentIndex-=3; renderGallery(); }
};

// --- Modal ---
document.getElementById("modal-close").onclick = ()=>document.getElementById("modal").style.display="none";
document.getElementById("modal").onclick = (e)=>{if(e.target.id==="modal") document.getElementById("modal").style.display="none";};
