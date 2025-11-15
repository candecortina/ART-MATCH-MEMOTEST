const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");
const galleryScreen = document.getElementById("gallery-screen");

document.getElementById("start-btn").onclick = () => {
    welcomeScreen.classList.remove("active");
    instructionsScreen.classList.add("active");
};

document.getElementById("play-btn").onclick = startGame;
document.getElementById("gallery-btn").onclick = showGallery;
document.getElementById("retry-btn").onclick = startGame;
document.getElementById("restart-btn").onclick = startGame;

// ------- MEMOTEST -------

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
let timeLeft = 40;
let timerInterval;

function startGame(){
    instructionsScreen.classList.remove("active");
    galleryScreen.classList.remove("active");
    winScreen.classList.remove("active");
    loseScreen.classList.remove("active");

    gameScreen.classList.add("active");

    matchedPairs = 0;
    firstCard = null;
    timeLeft = 40;
    document.getElementById("pairs-count").textContent = "Pares encontrados: 0/6";

    startTimer();
    loadBoard();
}

function startTimer(){
    clearInterval(timerInterval);
    const timer = document.getElementById("timer");

    timerInterval = setInterval(()=>{
        timer.textContent = `Tiempo: 0:${timeLeft.toString().padStart(2,"0")}`;
        if(timeLeft <= 0){
            clearInterval(timerInterval);
            loseGame();
        }
        timeLeft--;
    },1000);
}

function loadBoard(){
    const board = document.getElementById("game-board");
    board.innerHTML = "";

    const shuffled = [...images].sort(()=>Math.random()-0.5);

    shuffled.forEach(src=>{
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">ART MATCH</div>
                <div class="card-face card-front">
                    <img src="img/${src}">
                </div>
            </div>
        `;
        card.addEventListener("click", ()=>flipCard(card,src));
        board.appendChild(card);
    });
}

function flipCard(card,src){
    if(lockBoard || card.classList.contains("flip") || card.classList.contains("matched")) return;

    card.classList.add("flip");

    if(!firstCard){
        firstCard = { card, src };
        return;
    }

    if(firstCard.src === src){
        firstCard.card.classList.add("matched");
        card.classList.add("matched");
        matchedPairs++;
        document.getElementById("pairs-count").textContent = `Pares encontrados: ${matchedPairs}/6`;

        firstCard = null;

        if(matchedPairs === 6){
            clearInterval(timerInterval);
            setTimeout(()=>{
                gameScreen.classList.remove("active");
                winScreen.classList.add("active");
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
    loseScreen.classList.add("active");
}

// ------- GALERÍA -------

function showGallery(){
    winScreen.classList.remove("active");
    galleryScreen.classList.add("active");

    loadGallery();
}

let galleryIndex = 0;

const obras = [
    {img:"lamonalisa.jpg",titulo:"La Mona Lisa"},
    {img:"noche.jpg",titulo:"Noche Estrellada"},
    {img:"grito.jpg",titulo:"El Grito"},
    {img:"renacimiento_venus.jpg",titulo:"Renacimiento de Venus"},
    {img:"perla.jpg",titulo:"La Joven de la Perla"},
    {img:"relojes.jpg",titulo:"La Persistencia de la Memoria"},
];

function loadGallery(){
    const gal = document.getElementById("gallery");
    gal.innerHTML = "";

    const slice = obras.slice(galleryIndex, galleryIndex+3);

    slice.forEach(o=>{
        gal.innerHTML += `
            <div>
                <img src="img/${o.img}">
                <p>${o.titulo}</p>
            </div>`;
    });

    document.getElementById("prev-btn").onclick = ()=>{
        if(galleryIndex > 0){
            galleryIndex -= 3;
            loadGallery();
        }
    };
    document.getElementById("next-btn").onclick = ()=>{
        if(galleryIndex < obras.length - 3){
            galleryIndex += 3;
            loadGallery();
        }
    };
}
