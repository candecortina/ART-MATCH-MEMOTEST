const welcome = document.getElementById("welcome-screen");
const instructions = document.getElementById("instructions-screen");
const game = document.getElementById("game-screen");
const win = document.getElementById("win-screen");
const lose = document.getElementById("lose-screen");
const gallery = document.getElementById("gallery-screen");

document.getElementById("continue-btn").onclick = () => show(instructions);
document.getElementById("start-btn").onclick = startGame;
document.getElementById("gallery-btn").onclick = () => show(gallery);
document.getElementById("restart-btn").onclick = () => location.reload();

const works = [
    {
        name: "Monalisa",
        artist: "Leonardo da Vinci",
        year: "1503",
        img: "img/monalisa.jpg",
        description: "Una obra icónica del Renacimiento italiano..."
    },
    {
        name: "El Grito",
        artist: "Edvard Munch",
        year: "1893",
        img: "img/scream.jpg",
        description: "Representa la angustia humana en un paisaje expresionista."
    },
    {
        name: "La Noche Estrellada",
        artist: "Vincent van Gogh",
        year: "1889",
        img: "img/lanochestrellada.jpg",
        description: "Una vista nocturna desde la habitación del artista en Saint-Rémy."
    },
    {
        name: "La Joven de la Perla",
        artist: "Johannes Vermeer",
        year: "1665",
        img: "img/laperla.jpg",
        description: "Conocida como la Mona Lisa del norte, famosa por su luz y misterio."
    },
    {
        name: "La Persistencia de la Memoria",
        artist: "Salvador Dalí",
        year: "1931",
        img: "img/persistencia_memoria.jpg",
        description: "Famoso por sus relojes derretidos, representación del tiempo surrealista."
    }
];

let cardArray = [...works, ...works]; // duplicar para memotest
let lock = false;
let firstCard, secondCard;
let matches = 0;
let timer;
let timeLeft = 40 * 60; // 40 minutos

function show(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("visible"));
    screen.classList.add("visible");
}

function startGame() {
    show(game);
    loadBoard();
    startTimer();
}

function loadBoard() {
    cardArray.sort(() => Math.random() - 0.5);
    const board = document.getElementById("game-board");
    board.innerHTML = "";

    cardArray.forEach(work => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.name = work.name;

        card.innerHTML = `
            <div class="front"><img src="${work.img}"></div>
            <div class="back"></div>
        `;

        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (lock) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

function checkMatch() {
    lock = true;

    if (firstCard.dataset.name === secondCard.dataset.name) {
        matches++;
        disableCards();
        if (matches === works.length) winGame();
    } else {
        unflipCards();
    }
}

function disableCards() {
    setTimeout(() => {
        firstCard.style.opacity = "0";
        secondCard.style.opacity = "0";
        resetTurn();
    }, 600);
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetTurn();
    }, 800);
}

function resetTurn() {
    [firstCard, secondCard, lock] = [null, null, false];
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        let m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
        let s = String(timeLeft % 60).padStart(2, "0");
        document.getElementById("timer").textContent = `${m}:${s}`;

        if (timeLeft <= 0) loseGame();
    }, 1000);
}

function winGame() {
    clearInterval(timer);
    show(win);
    loadGallery();
}

function loseGame() {
    clearInterval(timer);
    show(lose);
}

function loadGallery() {
    const container = document.querySelector(".gallery");
    container.innerHTML = "";

    works.forEach(w => {
        container.innerHTML += `
            <div class="gallery-item">
                <img src="${w.img}">
                <h3>${w.name} – ${w.artist}</h3>
                <p><b>Año:</b> ${w.year}</p>
                <p>${w.description}</p>
            </div>
        `;
    });
}
