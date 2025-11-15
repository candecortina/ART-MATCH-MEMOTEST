/* ===== Datos de las obras (rutas EXACTAS dentro de img/) ===== */
const WORKS = [
    { id:'monalisa', name:'Mona Lisa', artist:'Leonardo da Vinci', year:'1503–1506', img:'img/monalisa.jpg', description:'La Mona Lisa, obra maestra del Renacimiento, famosa por la enigmática sonrisa y la técnica sfumato de Leonardo.' },
    { id:'elgrito', name:'El grito', artist:'Edvard Munch', year:'1893', img:'img/scream.jpg', description:'Pintura expresionista que simboliza la ansiedad humana; Munch realizó varias versiones y la obra se volvió icono del tormento moderno.' },
    { id:'noche', name:'La noche estrellada', artist:'Vincent van Gogh', year:'1889', img:'img/lanochestrellada.jpg', description:'Representa la vista desde la ventana del sanatorio de Saint-Rémy; destaca por el movimiento de las estrellas y la intensidad cromática.' },
    { id:'perla', name:'La joven de la perla', artist:'Johannes Vermeer', year:'c.1665', img:'img/laperla.jpg', description:'Retrato íntimo, conocido por su luz y la mirada enigmática; a menudo llamada la "Mona Lisa del Norte".' },
    { id:'persistencia', name:'La persistencia de la memoria', artist:'Salvador Dalí', year:'1931', img:'img/persistencia_memoria.jpg', description:'Símbolo del surrealismo: relojes blandos que cuestionan la percepción del tiempo; una de las obras más reconocibles de Dalí.' }
  ];
  
  /* ===== Estado ===== */
  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matches = 0;
  const totalPairs = WORKS.length;
  let timerInterval = null;
  let timeLeft = 40 * 60; // 40 minutos en segundos
  
  /* ===== DOM ===== */
  const welcomeScreen = document.getElementById('welcome');
  const instructionsScreen = document.getElementById('instructions');
  const gameScreen = document.getElementById('game');
  const galleryScreen = document.getElementById('gallery');
  const boardEl = document.getElementById('board');
  const timerEl = document.getElementById('timer');
  
  const toInstructionsBtn = document.getElementById('toInstructions');
  const startGameBtn = document.getElementById('startGame');
  const restartBtn = document.getElementById('restart');
  const winModal = document.getElementById('winModal');
  const loseModal = document.getElementById('loseModal');
  const showGalleryBtn = document.getElementById('showGallery');
  const closeWinBtn = document.getElementById('closeWin');
  const tryAgainBtn = document.getElementById('tryAgain');
  const galleryGrid = document.getElementById('galleryGrid');
  const backToGameBtn = document.getElementById('backToGame');
  
  /* ===== Utilidades ===== */
  function showScreen(el){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('visible'));
    // hide modals as well
    hideModal(winModal); hideModal(loseModal);
    el.classList.add('visible');
  }
  function showModal(modal){ if(modal) modal.style.display = 'flex'; }
  function hideModal(modal){ if(modal) modal.style.display = 'none'; }
  function formatTime(sec){ const m = String(Math.floor(sec/60)).padStart(2,'0'); const s = String(sec%60).padStart(2,'0'); return `${m}:${s}`; }
  
  /* ===== Deck & render ===== */
  function buildDeck(){
    deck = [];
    WORKS.forEach(w => { deck.push({...w}); deck.push({...w}); });
    // shuffle Fisher-Yates
    for(let i = deck.length -1; i>0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  
  function renderBoard(){
    boardEl.innerHTML = '';
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
            <img class="front-img" src="${cardData.img}" alt="${cardData.name}">
          </div>
        </div>
      `;
      // start with back visible (no .is-flipped)
      card.addEventListener('click', () => handleCardClick(card));
      boardEl.appendChild(card);
    });
  }
  
  /* ===== Game logic: memotest clásico ===== */
  function handleCardClick(card){
    if(lockBoard) return;
    if(card.classList.contains('matched')) return;
    if(card === firstCard) return;
  
    flipCard(card);
  
    if(!firstCard){
      firstCard = card;
      return;
    }
  
    secondCard = card;
    // check match
    if(firstCard.dataset.id === secondCard.dataset.id){
      // match: mark and keep flipped
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matches++;
      firstCard = null;
      secondCard = null;
      if(matches === totalPairs) {
        setTimeout(() => onWin(), 500);
      }
    } else {
      // not match: flip back automatically after short delay
      lockBoard = true;
      setTimeout(() => {
        unflipCard(firstCard);
        unflipCard(secondCard);
        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 800);
    }
  }
  
  function flipCard(card){ card.classList.add('is-flipped'); }
  function unflipCard(card){ card.classList.remove('is-flipped'); }
  
  /* ===== Timer ===== */
  function startTimer(){
    stopTimer();
    timeLeft = 40 * 60;
    timerEl.textContent = formatTime(timeLeft);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = formatTime(timeLeft);
      if(timeLeft <= 0){
        stopTimer();
        onLose();
      }
    }, 1000);
  }
  function stopTimer(){ if(timerInterval) clearInterval(timerInterval); }
  
  /* ===== Flow handlers ===== */
  toInstructionsBtn.addEventListener('click', () => showScreen(instructionsScreen));
  startGameBtn.addEventListener('click', () => {
    // start game screen
    showScreen(gameScreen);
    initGame();
  });
  restartBtn.addEventListener('click', () => location.reload());
  
  function initGame(){
    matches = 0;
    buildDeck();
    renderBoard();
    startTimer();
  }
  
  /* ===== Win / Lose ===== */
  function onWin(){
    stopTimer();
    showModal(winModal);
  }
  function onLose(){
    // block board
    lockBoard = true;
    showModal(loseModal);
  }
  
  /* modal buttons */
  showGalleryBtn && showGalleryBtn.addEventListener('click', () => {
    hideModal(winModal);
    buildGallery();
    showScreen(galleryScreen);
  });
  closeWinBtn && closeWinBtn.addEventListener('click', () => hideModal(winModal));
  tryAgainBtn && tryAgainBtn.addEventListener('click', () => {
    hideModal(loseModal);
    initGame();
  });
  backToGameBtn && backToGameBtn.addEventListener('click', () => {
    // volver al tablero y reiniciar si querés
    showScreen(gameScreen);
  });
  
  /* ===== Gallery ===== */
  function buildGallery(){
    galleryGrid.innerHTML = '';
    WORKS.forEach(w => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <div class="gallery-thumb"><img src="${w.img}" alt="${w.name}"></div>
        <div style="font-weight:700;margin-top:6px;">${w.name} — ${w.artist}</div>
        <div style="color:#5b4336;margin-top:6px;"><strong>Año:</strong> ${w.year}</div>
        <p style="margin-top:8px;color:#4b392f;">${w.description}</p>
      `;
      galleryGrid.appendChild(item);
    });
  }
  
  /* ===== Init on load (prepares board but does not start timer) ===== */
  (function init(){
    buildDeck();
    renderBoard();
    timerEl.textContent = formatTime(timeLeft);
    // show welcome initially (already visible by markup)
  })();
  