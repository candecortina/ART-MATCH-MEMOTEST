const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");
const galleryScreen = document.getElementById("gallery-screen");

const timerDisplay = document.getElementById("timer");

document.getElementById("start-btn").onclick = () => {
    welcomeScreen.classList.remove("active");
    instructionsScreen.classList.add("active");
};

document.getElementById("play-btn").onclick = startGame;
document.getElementById("gallery-btn").onclick = showGallery;
document.getElementById("retry-btn").onclick = () => {
    loseScreen.classList.remove("active");
    instructionsScreen.classList.add("active");
};

// tus imágenes reales
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

let timer;
let timeLeft = 2400; // 40 minutos

function startTimer() {
    timeLeft = 2400;
    timerDisplay.textContent = formatTime(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameScreen.classList.remove("active");
            loseScreen.classList.add("active");
        }
    }, 1000);
}

function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

function startGame() {
    instructionsScreen.classList.remove("active");
    gameScreen.classList.add("active");

    matchedPairs = 0;
    firstCard = null;

    const board = document.getElementById("game-board");
    board.innerHTML = "";

    const shuffled = images.sort(() => Math.random() - 0.5);

    shuffled.forEach(src => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-face card-back">Art Match</div>
            <div class="card-face card-front">
                <img src="img/${src}">
            </div>
        `;

        card.addEventListener("click", () => flip(card, src));
        board.appendChild(card);
    });

    startTimer(); // ⏳ ahora sí arranca el tiempo
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
            clearInterval(timer);
            setTimeout(() => {
                gameScreen.classList.remove("active");
                winScreen.classList.add("active");
            }, 500);
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

function showGallery() {
    winScreen.classList.remove("active");
    galleryScreen.classList.add("active");

    const gal = document.getElementById("gallery");
    gal.innerHTML = "";

    const obras = [
        {
            img: "monalisa.jpg",
            nombre: "La Mona Lisa",
            artista: "Leonardo da Vinci",
            año: "1503",
            descripcion: "Una de las obras más famosas del mundo. Se cree que retrata a Lisa Gherardini y es célebre por su enigmática sonrisa."
        },
        {
            img: "nochestrellada.jpg",
            nombre: "La noche estrellada",
            artista: "Vincent van Gogh",
            año: "1889",
            descripcion: "Obra maestra pintada desde la ventana de su habitación en Saint-Rémy-de-Provence. Representa un cielo turbulento lleno de emoción."
        },
        {
            img: "elgrito.jpg",
            nombre: "El Grito",
            artista: "Edvard Munch",
            año: "1893",
            descripcion: "Expresa ansiedad y angustia. Inspirado en un atardecer rojo que vio mientras caminaba por un fiordo noruego."
        },
        {
            img: "laperla.jpg",
            nombre: "La joven de la perla",
            artista: "Johannes Vermeer",
            año: "1665",
            descripcion: "Conocida como la 'Mona Lisa del norte'. Un retrato íntimo y luminoso famoso por su pendiente de perla."
        },
        {
            img: "persistencia_memoria.jpg",
            nombre: "La persistencia de la memoria",
            artista: "Salvador Dalí",
            año: "1931",
            descripcion: "Los famosos relojes derretidos simbolizan la relatividad del tiempo y los sueños en el surrealismo."
        }
    ];

    obras.forEach(o => {
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        item.innerHTML = `
            <img src="img/${o.img}">
            <h3>${o.nombre}</h3>
            <h4>${o.artista} — ${o.año}</h4>
            <p>${o.descripcion}</p>
        `;

        gal.appendChild(item);
    });
}
