// --- OBRAS ---
const works = [
    {
        name: "Monalisa",
        artist: "Leonardo da Vinci",
        year: "1503",
        desc: "Una de las pinturas más famosas del mundo, conocida por su misteriosa sonrisa.",
        img: "img/monalisa.jpg"
    },
    {
        name: "El Grito",
        artist: "Edvard Munch",
        year: "1893",
        desc: "Representa la ansiedad existencial humana con un estilo expresionista.",
        img: "img/scream.jpg"
    },
    {
        name: "La Noche Estrellada",
        artist: "Vincent van Gogh",
        year: "1889",
        desc: "Una vista onírica del cielo sobre Saint-Rémy, una de las obras más icónicas del artista.",
        img: "img/lanochestrellada.jpg"
    },
    {
        name: "La Joven de la Perla",
        artist: "Johannes Vermeer",
        year: "1665",
        desc: "Retrato enigmático también conocido como 'La Mona Lisa holandesa'.",
        img: "img/laperla.jpg"
    },
    {
        name: "La Persistencia de la Memoria",
        artist: "Salvador Dalí",
        year: "1931",
        desc: "Obra surrealista famosa por sus relojes derretidos.",
        img: "img/persistencia_memoria.jpg"
    }
];

// Pantallas
const welcomeScreen = document.getElementById("welcome-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");
const galleryScreen = document.getElementById("gallery-screen");

// Botones
document.getElementById("continue-btn").onclick = () => switchTo(instructionsScreen);
document.getElementById("start-btn").onclick = startGame;
document.getElementById("gallery-btn").onclick = showGallery;
document.getElementById("restart-btn").onclick = () => location.reload();

function switchTo(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("visible"));
    screen.classList.add("visible");
}

// --- JUEGO ---
let firstCard = null;
let secondCard = null;
let lock = false;
let timerInterval;
let remainingPairs = works.length;

const board = document.getElementById("game-board");

function startGame() {
    switchTo(gameScreen);
    createBoard();
    startTimer(40 * 60);
}

function createBoard() {
    const cards = [...works, ...works]; 
    cards.sort(() => Math.random() - 0.5);

    board.innerHTML = "";

    cards.forEach((work, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.name = work.name;

        card.innerHTML = `
            <div class="card-inner">
                <div class="front">
                    <img src="${work.img}">
                </div>
                <div class="back">Art Match</div>
            </div>
        `;

        card.onclick = () => flip(card);
        board.appendChild(card);
    });
}

function flip(card) {
    if (lock || card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    lock = true;

    setTimeout(() => {
        firstCard.onclick = null;
        secondCard.onclick = null;

        firstCard = null;
        secondCard = null;
        lock = false;

        remainingPairs--;
        if (remainingPairs === 0) winGame();
    }, 500);
}

function unflipCards() {
    lock = true;

    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        firstCard = null;
        secondCard = null;
        lock = false;
    }, 1000);
}

// --- TIMER ---
function startTimer(seconds) {
    const timerDisplay = document.getElementById("timer");

    timerInterval = setInterval(() => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;

        timerDisplay.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

        if (seconds <= 0) {
            clearInterval(timerInterval);
            loseGame();
        }

        seconds--;
    }, 1000);
}

// --- FINES ---
function winGame() {
    clearInterval(timerInterval);
    switchTo(winScreen);
}

function loseGame() {
    switchTo(loseScreen);
}

function showGallery() {
    switchTo(galleryScreen);

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    works.forEach(w => {
        gallery.innerHTML += `
            <div class="gallery-item">
                <img src="${w.img}">
                <h3>${w.name} – ${w.artist}</h3>
                <p><strong>Año:</strong> ${w.year}</p>
                <p>${w.desc}</p>
            </div>
        `;
    });
}
