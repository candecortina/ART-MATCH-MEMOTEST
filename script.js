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

/* 🎨 IMÁGENES REALES Y CORRECTAS */
const images = [
    "monalisa.jpg", "monalisa.jpg",
    "nochestrellada.jpg", "nochestrellada.jpg",
    "elgrito.jpg", "elgrito.jpg",
    "laperla.jpg", "laperla.jpg",
    "persistencia_memoria.jpg", "persistencia_memoria.jpg"
];

let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timeLeft = 40 * 60; // 40 minutos en segundos
let timerInterval;

function startGame() {
    instructionsScreen.classList.remove("active");
    gameScreen.classList.add("active");

    const board = document.getElementById("game-board");
    board.innerHTML = "";

    matchedPairs = 0;
    firstCard = null;

    /* TIMER */
    startTimer();

    /* Mezclar imágenes */
    const shuffled = images.sort(() => Math.random() - 0.5);

    shuffled.forEach(src => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front"><img src="img/${src}"></div>
        `;

        card.addEventListener("click", () => flip(card, src));
        board.appendChild(card);
    });
}

/* FUNCIONAMIENTO DEL TIMER */
function startTimer() {
    const timer = document.createElement("div");
    timer.id = "timer";
    timer.style.marginTop = "15px";
    timer.style.fontSize = "20px";
    timer.style.fontWeight = "600";
    timer.style.textAlign = "center";
    gameScreen.prepend(timer);

    function updateTimer() {
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;

        timer.textContent = `Tiempo: ${min}:${sec.toString().padStart(2, "0")}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            loseGame();
        }

        timeLeft--;
    }

    clearInterval(timerInterval);
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function flip(card, src) {
    if (lockBoard || card.classList.contains("flip")) return;

    card.classList.add("flip");

    if (!firstCard) {
        firstCard = { card, src };
        return;
    }

    if (firstCard.src === src) {
        matchedPairs++;
        firstCard = null;

        if (matchedPairs === images.length / 2) {
            clearInterval(timerInterval);
            setTimeout(() => {
                gameScreen.classList.remove("active");
                winScreen.classList.add("active");
            }, 600);
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            card.classList.remove("flip");
            firstCard.card.classList.remove("flip");
            firstCard = null;
            lockBoard = false;
        }, 900);
    }
}

function loseGame() {
    gameScreen.classList.remove("active");
    
    winScreen.innerHTML = `
        <h2 class="win-msg">¡Se acabó el tiempo! ⏳</h2>
        <p>No lograste completar el memotest.</p>
    `;
    
    winScreen.classList.add("active");
}

/* GALERÍA */
function showGallery() {
    winScreen.classList.remove("active");
    galleryScreen.classList.add("active");

    const gal = document.getElementById("gallery");
    gal.innerHTML = "";

    const obras = [
        { img: "monalisa.jpg", nombre: "La Mona Lisa", artista: "Leonardo da Vinci", año: 1503, desc: "Pintura icónica del Renacimiento que representa a Lisa Gherardini." },
        { img: "nochestrellada.jpg", nombre: "La Noche Estrellada", artista: "Vincent van Gogh", año: 1889, desc: "Obra realizada desde la ventana del asilo de Saint-Rémy." },
        { img: "elgrito.jpg", nombre: "El Grito", artista: "Edvard Munch", año: 1893, desc: "Expresa la angustia existencial del ser humano." },
        { img: "laperla.jpg", nombre: "La Joven de la Perla", artista: "Johannes Vermeer", año: 1665, desc: "Conocida como la 'Mona Lisa holandesa'." },
        { img: "persistencia_memoria.jpg", nombre: "La Persistencia de la Memoria", artista: "Salvador Dalí", año: 1931, desc: "Famosa por sus relojes derretidos, símbolo del tiempo fluido." }
    ];

    obras.forEach(o => {
        const box = document.createElement("div");
        box.innerHTML = `
            <img src="img/${o.img}">
            <p><strong>${o.nombre}</strong><br>${o.artista} (${o.año})<br>${o.desc}</p>
        `;
        gal.appendChild(box);
    });
}
