const board = document.getElementById("game-board");
const timerEl = document.getElementById("timer");
const winMsg = document.getElementById("win-message");
const loseMsg = document.getElementById("lose-message");

let timeLeft = 40;
let firstCard = null;
let lock = false;
let matches = 0;

/* FICHAS (incluye las nuevas: venus.jpg) */
let images = [
    "cuadro.png",
    "cuadro.png",
    "venus.jpg",
    "venus.jpg"
];

/* Desordenar */
images = images.sort(() => Math.random() - 0.5);

/* Crear cartas */
images.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.src = src;
    card.style.backgroundImage = "url('reverso.png')";
    card.addEventListener("click", () => reveal(card));
    board.appendChild(card);
});

/* Función de revelar */
function reveal(card) {
    if (lock || card.classList.contains("matched")) return;

    card.style.backgroundImage = `url('${card.dataset.src}')`;

    if (!firstCard) {
        firstCard = card;
    } else {
        lock = true;
        if (firstCard.dataset.src === card.dataset.src) {
            firstCard.classList.add("matched");
            card.classList.add("matched");
            matches++;
            lock = false;
            firstCard = null;

            if (matches === images.length / 2) {
                winMsg.classList.remove("oculto");
            }
        } else {
            setTimeout(() => {
                firstCard.style.backgroundImage = "url('reverso.png')";
                card.style.backgroundImage = "url('reverso.png')";
                lock = false;
                firstCard = null;
            }, 700);
        }
    }
}

/* TIMER */
const countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(countdown);
        loseMsg.classList.remove("oculto");
    }
}, 1000);
