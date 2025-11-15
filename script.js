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

// ---------- MEMOTEST NUEVO ----------
const images = [
  "monalisa.jpg","monalisa.jpg",
  "lanochestrellada.jpg","lanochestrellada.jpg",
  "scream.jpg","scream.jpg",
  "laperla.jpg","laperla.jpg",
  "persistencia_memoria.jpg","persistencia_memoria.jpg",
  "venus.jpg","venus.jpg"
];


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
      setTimeout(()=>{
        gameScreen.classList.remove("active");
        showWinScreen();
      },500);
    }

  } else {
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

// ---------- PANTALLA DE VICTORIA ----------
function showWinScreen(){
  winScreen.innerHTML = `
    <h2 class="win-msg">¡Felicitaciones! 🎉</h2>
    <p>Completaste el Art Match.</p>
    <button id="gallery-btn" class="btn">Ver Galería</button>
  `;
  winScreen.classList.add("active");

  document.getElementById("gallery-btn").onclick = showGallery;
}

// ---------- GALERÍA (igual que antes) ----------
const galleryImages = [
  {img:"lamonalisa.jpg", nombre:"La Mona Lisa", artista:"Leonardo da Vinci", año:1503, desc:"Pintura icónica del Renacimiento."},
  {img:"noche.jpg", nombre:"La Noche Estrellada", artista:"Vincent van Gogh", año:1889, desc:"Vista desde el asilo de Saint-Rémy."},
  {img:"grito.jpg", nombre:"El Grito", artista:"Edvard Munch", año:1893, desc:"Angustia existencial."},
  {img:"renacimiento_venus.jpg", nombre:"El Renacimiento de Venus", artista:"Sandro Botticelli", año:1486, desc:"Nacimiento de Venus."},
  {img:"perla.jpg", nombre:"La Joven de la Perla", artista:"Johannes Vermeer", año:1665, desc:"La 'Mona Lisa holandesa'."},
  {img:"relojes.jpg", nombre:"La Persistencia de la Memoria", artista:"Salvador Dalí", año:1931, desc:"Relojes derretidos."}
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
  const slice = galleryImages.slice(currentIndex, currentIndex+3);

  slice.forEach(o=>{
    const box = document.createElement("div");
    box.classList.add("gallery-item");

    box.innerHTML = `
      <img src="img/${o.img}">
      <p><strong>${o.nombre}</strong><br>${o.artista} (${o.año})<br>${o.desc}</p>
    `;

    box.addEventListener("click", ()=>{
      document.getElementById("modal-img").src = `img/${o.img}`;
      document.getElementById("modal-info").innerHTML =
        `<strong>${o.nombre}</strong><br>${o.artista} (${o.año})<br>${o.desc}`;
      document.getElementById("modal").style.display = "flex";
    });

    gal.appendChild(box);
  });
}

document.getElementById("next").onclick = ()=>{
  if(currentIndex +3 < galleryImages.length){
    currentIndex +=3;
    renderGallery();
  }
};

document.getElementById("prev").onclick = ()=>{
  if(currentIndex -3 >=0){
    currentIndex -=3;
    renderGallery();
  }
};

// Modal
document.getElementById("modal-close").onclick = ()=>document.getElementById("modal").style.display="none";
document.getElementById("modal").onclick = (e)=>{ if(e.target.id==="modal") document.getElementById("modal").style.display="none"; };
