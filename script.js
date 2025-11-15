const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const galleryScreen = document.getElementById("gallery-screen");
const playAgainBtn = document.getElementById("play-again-btn");

document.getElementById("start-btn").onclick = ()=>{
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

// Galería
const galleryImages = [
  {src:"lamonalisa.jpg", info:"Mona Lisa - Leonardo da Vinci, 1503-1506, Retrato icónico del Renacimiento."},
  {src:"noche.jpg", info:"La Noche Estrellada - Vincent van Gogh, 1889, Pintura postimpresionista."},
  {src:"grito.jpg", info:"El Grito - Edvard Munch, 1893, Representa ansiedad y angustia."},
  {src:"renacimiento_venus.jpg", info:"El Nacimiento de Venus - Sandro Botticelli, 1486, Mitología y belleza renacentista."},
  {src:"perla.jpg", info:"La Joven de la Perla - Johannes Vermeer, 1665, Retrato famoso de juventud y misterio."},
  {src:"relojes.jpg", info:"Persistencia de la Memoria - Salvador Dalí, 1931, Obra surrealista sobre el tiempo."}
];
let galleryIndex = 0;

function startGame(){
  instructionsScreen.classList.remove("active");
  gameScreen.classList.add("active");
  galleryScreen.classList.remove("active");
  endScreen.classList.remove("active");

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
    card.addEventListener("click", ()=>flipCard(card));
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
  endScreen.innerHTML = `
    <div class="end-msg">
      <h2>¡Se acabó el tiempo! ⏳</h2>
      <p>No lograste completar el memotest.</p>
      <button id="try-again-btn" class="btn">Intentar de nuevo</button>
    </div>
  `;
  endScreen.classList.add("active");
  document.getElementById("try-again-btn").onclick = startGame;
}

function showWinScreen(){
  gameScreen.classList.remove("active");
  endScreen.innerHTML = `
    <div class="end-msg">
      <h2>¡Felicitaciones! 🎉</h2>
      <p>Completaste el Art Match.</p>
      <button id="gallery-btn" class="btn">Ver Galería</button>
    </div>
  `;
  endScreen.classList.add("active");
  document.getElementById("gallery-btn").onclick = ()=> {
    endScreen.classList.remove("active");
    showGallery(0);
    galleryScreen.classList.add("active");
  };
}

// Galería
function showGallery(index){
  galleryIndex = index;
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  for(let i=index;i<index+3 && i<galleryImages.length;i++){
    const g = galleryImages[i];
    const img = document.createElement("img");
    img.src = `img/${g.src}`;
    img.alt = g.info;
    img.title = g.info;
    gallery.appendChild(img);
  }
}

document.getElementById("prev").onclick = ()=>{
  if(galleryIndex>0) { galleryIndex-=3; showGallery(galleryIndex); }
};
document.getElementById("next").onclick = ()=>{
  if(galleryIndex+3<galleryImages.length) { galleryIndex+=3; showGallery(galleryIndex); }
};

// Modal galería
const modal = document.getElementById("gallery-modal");
const modalImg = document.getElementById("modal-img");
const modalInfo = document.getElementById("modal-info");
const closeModalBtn = modal.querySelector(".close-btn");

document.getElementById("gallery").addEventListener("click", (e)=>{
  if(e.target.tagName === "IMG"){
    modalImg.src = e.target.src;
    modalInfo.textContent = e.target.title;
    modal.style.display = "flex";
  }
});

closeModalBtn.onclick = ()=>{ modal.style.display = "none"; };
modal.onclick = (e)=>{ if(e.target===modal) modal.style.display="none"; };
