const obras = [
    {
        nombre: "La Mona Lisa",
        artista: "Leonardo da Vinci",
        archivo: "monalisa.jpg",
        descripcion: "Pintada entre 1503-1506. Famosa por su sonrisa enigmática y su composición innovadora."
    },
    {
        nombre: "El Grito",
        artista: "Edvard Munch",
        archivo: "scream.jpg",
        descripcion: "Creada en 1893. Representa angustia existencial y es un ícono del expresionismo."
    },
    {
        nombre: "La Joven de la Perla",
        artista: "Johannes Vermeer",
        archivo: "laperla.jpg",
        descripcion: "Pintada en 1665. Famosa obra barroca conocida como ‘la Mona Lisa holandesa’."
    },
    {
        nombre: "La Noche Estrellada",
        artista: "Vincent van Gogh",
        archivo: "lanochestrellada.jpg",
        descripcion: "Pintada en 1889 desde el hospital psiquiátrico de Saint-Rémy. Una de sus obras más icónicas."
    },
    {
        nombre: "La Persistencia de la Memoria",
        artista: "Salvador Dalí",
        archivo: "persistencia_memoria.jpg",
        descripcion: "Obra surrealista de 1931 famosa por los relojes derretidos y su atmósfera onírica."
    }
];

let cartas = [];
let primera = null;
let bloqueo = false;
let tiempoRestante = 45;
let temporizador;

const inicio = document.getElementById("inicio");
const juego = document.getElementById("juego");
const tablero = document.getElementById("tablero");
const mensajeGanar = document.getElementById("mensajeGanar");
const mensajePerder = document.getElementById("mensajePerder");
const tiempo = document.getElementById("tiempo");
const galeria = document.getElementById("galeria");

document.getElementById("btnComenzar").onclick = iniciarJuego;
document.getElementById("irGaleria").onclick = mostrarGaleria;
document.getElementById("irGaleria2").onclick = mostrarGaleria;
document.getElementById("cerrarPreview").onclick = () =>
    document.getElementById("preview").classList.add("hidden");

function iniciarJuego() {
    inicio.classList.add("hidden");
    juego.classList.remove("hidden");

    generarCartas();
    iniciarTemporizador();
}

function generarCartas() {
    let duplicadas = [...obras, ...obras];
    cartas = duplicadas.sort(() => Math.random() - 0.5);

    tablero.innerHTML = "";

    cartas.forEach((obra, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;

        card.innerHTML = `
            <div class="dorso">Art Match</div>
            <img src="img/${obra.archivo}">
        `;

        card.onclick = () => voltear(card);
        tablero.appendChild(card);
    });
}

function voltear(card) {
    if (bloqueo || card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!primera) {
        primera = card;
        return;
    }

    const segunda = card;

    const obra1 = cartas[primera.dataset.index];
    const obra2 = cartas[segunda.dataset.index];

    if (obra1.archivo === obra2.archivo) {
        primera = null;

        if (document.querySelectorAll(".flipped").length === cartas.length) {
            clearInterval(temporizador);
            mensajeGanar.classList.remove("hidden");
        }

    } else {
        bloqueo = true;
        setTimeout(() => {
            primera.classList.remove("flipped");
            segunda.classList.remove("flipped");
            primera = null;
            bloqueo = false;
        }, 900);
    }
}

function iniciarTemporizador() {
    tiempo.textContent = `Tiempo: ${tiempoRestante}`;

    temporizador = setInterval(() => {
        tiempoRestante--;
        tiempo.textContent = `Tiempo: ${tiempoRestante}`;

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            juego.classList.add("hidden");
            mensajePerder.classList.remove("hidden");
        }
    }, 1000);
}

function mostrarGaleria() {
    mensajeGanar.classList.add("hidden");
    mensajePerder.classList.add("hidden");

    juego.classList.add("hidden");
    galeria.classList.remove("hidden");

    const cont = document.getElementById("contenedorGaleria");
    cont.innerHTML = "";

    obras.forEach(obra => {
        const img = document.createElement("img");
        img.src = "img/" + obra.archivo;

        img.onclick = () => abrirPreview(obra);

        cont.appendChild(img);
    });
}

function abrirPreview(obra) {
    document.getElementById("previewImg").src = "img/" + obra.archivo;
    document.getElementById("previewTitulo").textContent = `${obra.nombre} – ${obra.artista}`;
    document.getElementById("previewDesc").textContent = obra.descripcion;
    document.getElementById("preview").classList.remove("hidden");
}
