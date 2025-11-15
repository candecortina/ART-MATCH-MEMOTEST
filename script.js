/* ===== Datos de las obras ===== */
const WORKS = [
    {
      id: 'monalisa',
      name: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: '1503–1506',
      img: 'img/monalisa.jpg',
      description: 'La Mona Lisa, obra maestra del Renacimiento, famosa por la enigmática sonrisa y la técnica sfumato de Leonardo.'
    },
    {
      id: 'elgrito',
      name: 'El grito',
      artist: 'Edvard Munch',
      year: '1893',
      img: 'img/scream.jpg',
      description: 'Pintura expresionista que simboliza la ansiedad humana; Munch realizó varias versiones y la obra se volvió icono del tormento moderno.'
    },
    {
      id: 'noche',
      name: 'La noche estrellada',
      artist: 'Vincent van Gogh',
      year: '1889',
      img: 'img/lanochestrellada.jpg',
      description: 'Representa la vista desde la ventana del sanatorio de Saint-Rémy; destaca por el movimiento de las estrellas y la intensidad cromática.'
    },
    {
      id: 'perla',
      name: 'La joven de la perla',
      artist: 'Johannes Vermeer',
      year: 'c.1665',
      img: 'img/laperla.jpg',
      description: 'Retrato íntimo, conocido por su luz y la mirada enigmática; a menudo llamada la "Mona Lisa del Norte".'
    },
    {
      id: 'persistencia',
      name: 'La persistencia de la memoria',
      artist: 'Salvador Dalí',
      year: '1931',
      img: 'img/persistencia_memoria.jpg',
      description: 'Símbolo del surrealismo: relojes blandos que cuestionan la percepción del tiempo; una de las obras más reconocibles de Dalí.'
    }
  ];
  
  /* ===== Estado ===== */
  let deck = []; // cartas duplicadas y mezcladas
  let first = null;
  let second = null;
  let lock = false; // evita clicar más cuando dos cartas están seleccionadas
  let matches = 0;
  const totalPairs = WORKS.length;
  let timerInterval = null;
  let timeLeft = 40 * 60; // 40 minutos
  
  /* ===== DOM ===== */
  const board = document.getElementById('board');
  const timerEl = document.getElementById('timer');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const winModal = document.getElementById('winModal');
  const loseModal = document.getElementById('loseModal');
  const viewGalleryBtn = document.getElementById('viewGalleryBtn');
  const closeWinBtn = document.getElementById('closeWinBtn');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const galleryPanel = document.getElementById('galleryPanel');
  const galleryEl = document.getElementById('gallery');
  const backBtn = document.getElementById('backBtn');
  const viewGalleryModalBtn = document.getElementById('viewGalleryBtn');
  
  /* ===== Helpers ===== */
  function formatTime(sec){
    const m = String(Math.floor(sec/60)).padStart(2,'0');
    const s = String(sec%60).padStart(2,'0');
    return `${m}:${s}`;
  }
  
  /* ===== Construir deck ===== */
  function buildDeck(){
    deck = [];
    WORKS.forEach(w => {
      deck.push({ ...w });
      deck.push({ ...w });
    });
    // Fisher-Yates shuffle
    for(let i=deck.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  
  /* ===== Render tablero (todas las fichas empiezan con dorso visible) ===== */
  function renderBoard(){
    board.innerHTML = '';
    deck.forEach((cardData, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = cardData.id;
      card.dataset.index = idx;
  
      card.innerHTML = `
        <div class="card-inner">
          <div class="face back" data-face="back">
            <div>
              <div class="dorso-title">Art Match</div>
              <div class="dorso-seal">AM</div>
            </div>
          </div>
          <div class="face front" data-face="front">
            <div class="frame">
              <img src="${cardData.img}" alt="${cardData.name}">
            </div>
          </div>
        </div>
      `;
  
      // Inicialmente NO tiene clase is-flipped -> se ve el dorso (Art Match)
      card.addEventListener('click', () => onCardClick(card));
      board.appendChild(card);
    });
  }
  
  /* ===== Click en carta =====
     Reglas especiales solicitadas:
     - No volteos automáticos.
     - Cuando hay match, cartas quedan dadas vuelta (front visible + class matched).
     - Si hay dos cartas seleccionadas y no coinciden, NO se vuelven a ocultar solas: el jugador debe tocarlas para volverlas a ocultar.
     - Se bloquea poder seleccionar otras cartas mientras haya dos seleccionadas hasta que el jugador actúe.
  */
  function onCardClick(card){
    if(lock) {
      // Si hay bloqueo, solo permitimos que el usuario haga clic en una de las dos seleccionadas para ocultarla
      if(card === first || card === second){
        // permitir toggle manual
        toggleFlip(card);
        // si ambas quedan ocultas, desbloquear
        if((first && !isFlipped(first)) && (second && !isFlipped(second))){
          first = null; second = null;
          lock = false;
        } else {
          // actualizar referencias si se ocultó una
          if(first && !isFlipped(first)) first = null;
          if(second && !isFlipped(second)) second = null;
        }
      }
      return;
    }
  
    // Si la carta ya está marcada como matched, no hacer nada
    if(card.classList.contains('matched')) return;
  
    // Si la carta está volteada (user la quiere ocultar manualmente), permitilo
    if(isFlipped(card)){
      // toggle para ocultar
      toggleFlip(card);
      // si la carta era first o second, actualizar referencias
      if(card === first) first = null;
      if(card === second) second = null;
      return;
    }
  
    // Voltear la carta
    flip(card);
  
    // Asignar first / second
    if(!first){
      first = card;
      return;
    }
    if(!second && card !== first){
      second = card;
      // ahora hay dos seleccionadas -> evaluar
      if(first.dataset.id === second.dataset.id){
        // match: dejarlas volteadas y marcadas
        markMatched(first);
        markMatched(second);
        // limpiar referencias
        first = null;
        second = null;
        matches++;
        if(matches === totalPairs){
          onWin();
        }
      } else {
        // no coinciden -> bloquear y esperar que el jugador manualmente las oculte
        lock = true;
      }
    }
  }
  
  /* ===== Utilidades de flip ===== */
  function flip(card){
    card.classList.add('is-flipped');
  }
  function toggleFlip(card){
    card.classList.toggle('is-flipped');
  }
  function isFlipped(card){
    return card.classList.contains('is-flipped');
  }
  function markMatched(card){
    card.classList.add('matched');
    // dejarla volteada permanentemente (front visible)
    card.classList.add('is-flipped');
  }
  
  /* ===== Timer ===== */
  function startTimer(){
    stopTimer();
    timerEl.textContent = formatTime(timeLeft);
    timerInterval = setInterval(()=>{
      timeLeft--;
      timerEl.textContent = formatTime(timeLeft);
      if(timeLeft <= 0){
        stopTimer();
        onLose();
      }
    },1000);
  }
  function stopTimer(){
    if(timerInterval) clearInterval(timerInterval);
  }
  
  /* ===== Eventos UI ===== */
  startBtn.addEventListener('click', ()=>{
    // iniciar estado
    matches = 0;
    timeLeft = 40 * 60;
    buildDeck();
    renderBoard();
    startTimer();
    // esconder galería si estaba visible
    galleryPanel.style.display = 'none';
    // ocultar modales
    hideModal(winModal);
    hideModal(loseModal);
  });
  
  resetBtn.addEventListener('click', ()=>{
    location.reload();
  });
  
  /* Modales */
  function showModal(modal){
    modal.style.display = 'flex';
  }
  function hideModal(modal){
    modal.style.display = 'none';
  }
  
  viewGalleryBtn.addEventListener('click', ()=>{
    hideModal(winModal);
    buildGallery();
    galleryPanel.style.display = 'block';
    galleryPanel.scrollIntoView({behavior:'smooth'});
  });
  closeWinBtn && closeWinBtn.addEventListener('click', ()=> hideModal(winModal));
  tryAgainBtn && tryAgainBtn.addEventListener('click', ()=>{
    hideModal(loseModal);
    // reiniciar
    startBtn.click();
  });
  backBtn && backBtn.addEventListener('click', ()=> {
    galleryPanel.style.display = 'none';
  });
  
  /* Win / Lose */
  function onWin(){
    stopTimer();
    showModal(winModal);
  }
  function onLose(){
    // bloquear tablero para que no se pueda seguir jugando
    lock = true;
    showModal(loseModal);
  }
  
  /* ===== Galería final ===== */
  function buildGallery(){
    galleryEl.innerHTML = '';
    WORKS.forEach(w => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <div class="gallery-thumb"><img src="${w.img}" alt="${w.name}"></div>
        <div><strong>${w.name}</strong> — ${w.artist}</div>
        <div style="margin-top:6px;color:#5b4336;font-size:0.95rem;"><strong>Año:</strong> ${w.year}</div>
        <p style="margin-top:8px;color:#4b392f;font-size:0.95rem;">${w.description}</p>
      `;
      galleryEl.appendChild(item);
    });
  }
  
  /* ===== Inicializar (prepara tablero, sin timer) ===== */
  (function init(){
    buildDeck();
    renderBoard();
    timerEl.textContent = formatTime(timeLeft);
  })();
  