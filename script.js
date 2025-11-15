
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

const images = [
    "img1.jpg", "img1.jpg",
    "img2.jpg", "img2.jpg",
    "img3.jpg", "img3.jpg",
    "img4.jpg", "img4.jpg",
    "img5.jpg", "img5.jpg",
    "img6.jpg", "img6.jpg"
];

let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;

function startGame() {
    instructionsScreen.classList.remove("active");
    gameScreen.classList.add("active");

    const board = document.getElementById("game-board");
    board.innerHTML = "";

    const shuffled = images.sort(() => Math.random() - 0.5);

    shuffled.forEach(src => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front"><img src="images/${src}"></div>
        `;

        card.addEventListener("click", () => flip(card, src));
        board.appendChild(card);
    });
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

function showGallery() {
    winScreen.classList.remove("active");
    galleryScreen.classList.add("active");

    const gal = document.getElementById("gallery");
    gal.innerHTML = "";

    const unique = [...new Set(images)];

    unique.forEach(img => {
        const el = document.createElement("img");
        el.src = "images/" + img;
        gal.appendChild(el);
    });
}
