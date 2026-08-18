/* ==========================================================================
   LOGIQUE GLOBALE & NAVIGATION
   ========================================================================== */
document.getElementById('fullscreen-btn').addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen();
});

// Animation d'erreur sur les boutons
function animateBtnError(id) {
  const btn = document.getElementById(id);
  // On sauvegarde le style complet original du bouton pour ne rien perdre
  const originalStyle = btn.getAttribute('style') || '';
  
  btn.style.backgroundColor = 'var(--danger)';
  gsap.to(btn, { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => {
     // On restaure exactement le style précédent (le vert)
     btn.setAttribute('style', originalStyle);
  }});
}

// Variables Globales du Bilan
let turnBalance = 0; 
let keepTotalBalance = true; 

// ==========================================================================
//   GESTION DES MUSIQUES DYNAMIQUES
// ==========================================================================

// 1. Déclaration des pistes (Remplace les URL par tes liens Dropbox ?raw=1)
const audioMalus = new Audio('https://www.dropbox.com/scl/fi/67rgjc1h3vahk800ui02i/Lorenzo-Carton-Rouge-Clip-Officiel.mp3?rlkey=p78rf4m7ajfv0nwik8solrysf&st=5j4r3q8d&raw=1');
audioMalus.loop = true; // Joue en boucle

const audioBonus = new Audio('https://www.dropbox.com/scl/fi/s9ja657kwttjid26yo22b/Kaaris-Illimit-HyperPop-Remix.mp3?rlkey=xffwe9gyk3gjoje32v0nriu7b&st=qvd18ny8&raw=1');
audioBonus.loop = true;

const audioTension = new Audio('https://www.dropbox.com/scl/fi/rceu8q3tzjzvpjvqi5nlr/Ziak-I-WILL-SURVIVE-Disco-Remix.mp3?rlkey=gfqeumtm1k2ygi2fwe7qxghas&st=e9p1cyik&raw=1');
audioTension.loop = true;

// 2. Le "Cerveau" audio qui vérifie les conditions en temps réel
function gererMusiques(currentMult = 1.0) {
  // Règle 1 : Bilan <= -30
  if (turnBalance <= -30) {
    if (audioMalus.paused) audioMalus.play();
  } else {
    audioMalus.pause();
    audioMalus.currentTime = 0; // Remet à zéro si la condition n'est plus remplie
  }

  // Règle 2 : Bilan >= 30
  if (turnBalance >= 30) {
    if (audioBonus.paused) audioBonus.play();
  } else {
    audioBonus.pause();
    audioBonus.currentTime = 0;
  }

  // Règle 3 : Multiplicateur > 3
  if (currentMult > 3) {
    if (audioTension.paused) audioTension.play();
  } else {
    audioTension.pause();
    audioTension.currentTime = 0;
  }
}

const screens = {
  select: document.getElementById('game-select-screen'),
  crash: document.getElementById('crash-screen'),
  plinko: document.getElementById('plinko-screen'),
  mines: document.getElementById('mines-screen'),
  hilo: document.getElementById('hilo-screen'),
  roulette: document.getElementById('roulette-screen')
};

// ==========================================================================
//   ANIMATIONS SPÉCIALES (SINGES & GOBE)
// ==========================================================================

function triggerMonkeyRain() {
    for(let i = 0; i < 40; i++) {
        let monkey = document.createElement('div');
        monkey.textContent = '🐒';
        monkey.style.position = 'fixed';
        monkey.style.top = '-50px';
        monkey.style.left = (Math.random() * 100) + 'vw';
        monkey.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
        monkey.style.zIndex = '9999';
        monkey.style.pointerEvents = 'none';
        document.body.appendChild(monkey);
        
        gsap.to(monkey, {
            y: window.innerHeight + 100,
            rotation: (Math.random() - 0.5) * 360,
            duration: Math.random() * 2 + 1.5,
            ease: "none",
            onComplete: () => monkey.remove()
        });
    }
}

// On précharge l'image en cache pour qu'elle s'affiche instantanément
const preloadedCowardImg = new Image();
preloadedCowardImg.src = 'https://www.dropbox.com/scl/fi/1mlet19xtbnhy9w6erx4j/gobe.png?rlkey=yhaveynetbwzh9u05po5priqx&st=97div8vd&raw=1';

function triggerCowardImage() {
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.6)'; // Fond un peu plus transparent
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    let img = document.createElement('img');
    img.src = preloadedCowardImg.src; // Utilise l'image déjà chargée en mémoire
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.transform = 'scale(0.1)'; // Départ tout petit
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    
    // Pop instantané et agressif
    gsap.to(img, {scale: 1, rotation: (Math.random() - 0.5) * 20, duration: 0.4, ease: "back.out(2)"});
    
    // Disparaît après 2 secondes
    setTimeout(() => {
        gsap.to(overlay, {opacity: 0, duration: 0.3, onComplete: () => overlay.remove()});
    }, 2000);
}

// Gestion de l'affichage des écrans
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenName].classList.add('active');
  setTimeout(() => { resizeCrash(); resizePlinko(); }, 50);
}

// Gestion du Bilan
document.querySelectorAll('.toggle-total-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    keepTotalBalance = !keepTotalBalance;
    const text = keepTotalBalance ? "Mode Total : ON" : "Mode Total : OFF";
    document.querySelectorAll('.toggle-total-btn').forEach(b => {
      b.textContent = text;
      if(keepTotalBalance) b.classList.add('active'); else b.classList.remove('active');
    });
  });
});

document.querySelectorAll('.reset-total-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    turnBalance = 0;
    updateLiveSummary();
    gsap.to(btn, { rotation: "+=360", duration: 0.5 });
  });
});

function updateLiveSummary() {
  const absVal = Math.abs(turnBalance);
  let label = "Équilibre";
  let boxClass = "neutral-box";

  if (turnBalance > 0) {
    label = "À Distribuer";
    boxClass = "success-box";
  } else if (turnBalance < 0) {
    label = "À Boire";
    boxClass = "danger-box";
  }

  ['crash', 'plinko', 'mines', 'hilo', 'roulette'].forEach(game => {
    const box = document.getElementById(`${game}-balance-box`);
    if(box) {
      box.className = `stat-box ${boxClass}`;
      document.getElementById(`${game}-balance-label`).textContent = label;
      document.getElementById(`${game}-live-balance`).textContent = absVal;
    }
  });

  // NOUVEAU : Appel du gestionnaire de musique à chaque mise à jour du bilan
  gererMusiques(); 
}

// Boutons de navigation
// Boutons de navigation du menu principal
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const game = card.dataset.game;
    if (game === 'crash') { resetCrashUI(); showScreen('crash'); }
    else if (game === 'plinko') { resetPlinkoUI(); showScreen('plinko'); }
    else if (game === 'mines') { resetMinesUI(); showScreen('mines'); }
    else if (game === 'hilo') { resetHiloUI(); showScreen('hilo'); }
    else if (game === 'roulette') { resetRouletteUI(); showScreen('roulette'); } // <-- La ligne manquante
  });
});

// Boutons "Autre manche / Recharger" à la fin d'une partie
document.querySelectorAll('.btn-play-again').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.target.dataset.target;
    if(target === 'crash') resetCrashUI();
    else if(target === 'plinko') resetPlinkoUI();
    else if(target === 'mines') resetMinesUI();
    else if(target === 'hilo') resetHiloUI();
    else if(target === 'roulette') resetRouletteUI(); // <-- La ligne manquante
  });
});


/* ==========================================================================
   JEU 1 : LE CRASH
   ========================================================================== */
let crashBet = 0;
let crashObj = { isPlaying: false, hasCashedOut: false, multiplier: 1.0, crashPoint: 1.0, timeElapsed: 0, history: [], animFrameId: null };
const crashCanvas = document.getElementById('crash-canvas');
const crashCtx = crashCanvas.getContext('2d');
const rocket = document.getElementById('rocket');
const disp_mult = document.getElementById('multiplier-display');
const btn_stop = document.getElementById('stop-btn');
const crashPlaceBtn = document.getElementById('crash-place-bet-btn');

function resizeCrash() {
  const container = document.getElementById('crash-game-view');
  if(container && screens.crash.classList.contains('active')) {
    crashCanvas.width = container.clientWidth; crashCanvas.height = container.clientHeight; drawCrashGraph();
  }
}
window.addEventListener('resize', resizeCrash);

document.querySelectorAll('.crash-bet').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.crash-bet').forEach(b => b.classList.remove('selected-crash'));
    btn.classList.add('selected-crash'); crashBet = parseInt(btn.dataset.bet); document.getElementById('crash-custom-bet').value = ''; 
  });
});
document.getElementById('crash-custom-bet').addEventListener('input', (e) => {
  document.querySelectorAll('.crash-bet').forEach(b => b.classList.remove('selected-crash')); 
  crashBet = parseInt(e.target.value) || 0;
  if(crashBet > 12) { crashBet = 12; e.target.value = 12; }
});

crashPlaceBtn.addEventListener('click', () => {
  if (!crashBet || crashBet < 1) return animateBtnError('crash-place-bet-btn');
  if (crashBet > 12) { crashBet = 12; document.getElementById('crash-custom-bet').value = 12; return animateBtnError('crash-place-bet-btn'); }
  startCrashRound();
});

function resetCrashUI() {
  document.getElementById('crash-betting-area').classList.remove('hidden');
  document.getElementById('crash-result-actions').classList.add('hidden');
  btn_stop.classList.add('hidden');
  disp_mult.textContent = "1.00x"; disp_mult.className = ""; 
  crashCtx.clearRect(0, 0, crashCanvas.width, crashCanvas.height);
  gsap.set(rocket, { left: 0, top: crashCanvas.height, rotation: 45, opacity: 1 });
}

function startCrashRound() {
  if(!keepTotalBalance) turnBalance = 0;
  turnBalance -= crashBet;
  updateLiveSummary();

  let r = Math.random();
  let calculatedCrash = 1.00;
  
  if (r < 0.10) calculatedCrash = 1.00; 
  else if (r < 0.50) calculatedCrash = 1.01 + (Math.random() * 0.98); 
  else if (r < 0.85) calculatedCrash = 2.00 + (Math.random() * 1.99); 
  else if (r < 0.97) calculatedCrash = 4.00 + (Math.random() * 3.99); 
  else calculatedCrash = 8.00 + (Math.random() * 12.00); 

  crashObj = { 
    isPlaying: true, hasCashedOut: false, multiplier: 1.0, 
    crashPoint: calculatedCrash, timeElapsed: 0, history: [], animFrameId: null 
  };

  document.getElementById('crash-betting-area').classList.add('hidden');
  btn_stop.classList.remove('hidden'); btn_stop.classList.add('locked'); btn_stop.disabled = true; btn_stop.textContent = "🔒 1.30x mini";
  gsap.set(rocket, { left: 0, top: crashCanvas.height, rotation: 45, opacity: 1 });
  crashLastTime = performance.now(); crashObj.animFrameId = requestAnimationFrame(crashLoop);
}

let crashLastTime = 0;

function crashLoop(currentTime) {
  if (!crashObj.isPlaying) return;
  const dt = currentTime - crashLastTime; crashLastTime = currentTime;
  crashObj.timeElapsed += dt; crashObj.multiplier = Math.pow(1.00015, crashObj.timeElapsed);

  if (crashObj.multiplier >= crashObj.crashPoint) {
    crashObj.multiplier = crashObj.crashPoint; drawCrashGraph(); triggerCrash(); return;
  }
  if (!crashObj.hasCashedOut) {
    if (crashObj.multiplier < 1.3) { btn_stop.disabled = true; btn_stop.classList.add('locked'); btn_stop.textContent = `🔒 1.30x mini`; } 
    else { btn_stop.disabled = false; btn_stop.classList.remove('locked'); btn_stop.textContent = "S'ARRÊTER 🛑"; }
  }
  disp_mult.textContent = crashObj.multiplier.toFixed(2) + "x";
  
  // NOUVEAU : Envoie le multiplicateur en direct à la musique
  gererMusiques(crashObj.multiplier); 

  crashObj.history.push({ time: crashObj.timeElapsed, mult: crashObj.multiplier });
  drawCrashGraph(); crashObj.animFrameId = requestAnimationFrame(crashLoop);
}

function drawCrashGraph() {
  const w = crashCanvas.width, h = crashCanvas.height; crashCtx.clearRect(0, 0, w, h);
  if (crashObj.history.length === 0) return;
  const scaleX = w / Math.max(3000, crashObj.timeElapsed * 1.15); 
  const scaleY = h / Math.max(1.5, (crashObj.multiplier - 1) * 1.15); 
  crashCtx.beginPath(); crashCtx.setLineDash([8, 8]); crashCtx.lineWidth = 3;
  crashCtx.strokeStyle = crashObj.hasCashedOut ? "rgba(107, 114, 128, 0.5)" : "rgba(245, 158, 11, 1)"; 
  let lastPx = 0, lastPy = h;
  crashObj.history.forEach((pt, i) => {
    const px = pt.time * scaleX, py = h - ((pt.mult - 1) * scaleY);
    if (i === 0) crashCtx.moveTo(px, py); else crashCtx.lineTo(px, py);
    lastPx = px; lastPy = py;
  });
  crashCtx.stroke();
  gsap.set(rocket, { left: lastPx, top: lastPy });
  if (crashObj.history.length > 5) {
    const p1 = crashObj.history[crashObj.history.length - 5], p2 = crashObj.history[crashObj.history.length - 1];
    gsap.set(rocket, { rotation: Math.atan2(-((p2.mult - p1.mult) * scaleY), (p2.time - p1.time) * scaleX) * (180 / Math.PI) + 45 });
  }
}

btn_stop.addEventListener('click', () => {
  if (!crashObj.isPlaying || crashObj.hasCashedOut || crashObj.multiplier < 1.3) return;
  
  // IMAGE DU LÂCHE : S'il s'arrête avant 1.70x
  if (crashObj.multiplier < 1.70) triggerCowardImage();
  
  crashObj.hasCashedOut = true; btn_stop.classList.add('hidden');
  
  turnBalance += Math.round(crashBet * crashObj.multiplier); 
  updateLiveSummary();

  disp_mult.classList.add('ghost'); gsap.to(rocket, { opacity: 0.4, duration: 0.3 });
  if (typeof gererMusiques === "function") gererMusiques(1.0);
});

function triggerCrash() {
  crashObj.isPlaying = false; cancelAnimationFrame(crashObj.animFrameId);
  
  // PLUIE DE SINGES : Si ça crash immédiatement à 1.00
  if (crashObj.crashPoint === 1.00) triggerMonkeyRain();
  
  gsap.to(rocket, { duration: 0.1, x: "+=15", rotation: "+=20", repeat: 3, yoyo: true });
  gsap.to(rocket, { delay: 0.4, duration: 0.5, scale: 2, opacity: 0, ease: "back.in" });
  btn_stop.classList.add('hidden'); document.getElementById('crash-result-actions').classList.remove('hidden'); disp_mult.classList.remove('ghost'); 
  disp_mult.textContent = crashObj.crashPoint.toFixed(2) + "x"; disp_mult.classList.add('crashed');
  if (typeof gererMusiques === "function") gererMusiques(1.0);
}


/* ==========================================================================
   JEU 2 : LE PLINKO
   ========================================================================== */
const PLINKO_MODES = {
  ange: {
      rows: 10,
      bins: [
          { label: '-10x', mult: -10, color: '#7f1d1d' }, 
          { label: '-5x', mult: -5, color: '#991b1b' },
          { label: '-3x', mult: -3, color: '#b91c1c' }, 
          { label: '-2x', mult: -2, color: '#dc2626' }, 
          { label: '-1x', mult: -1, color: '#ef4444' },
          { label: '0x', mult: 0, color: '#6b7280' }, 
          { label: '1x', mult: 1, color: '#10b981' }, 
          { label: '2x', mult: 2, color: '#059669' },
          { label: '3x', mult: 3, color: '#047857' }, 
          { label: '5x', mult: 5, color: '#064e3b' }, 
          { label: '10x', mult: 10, color: '#022c22' }
      ]
  },
  bazar: {
      rows: 7, 
      bins: [
          { label: '3x', mult: 3, color: '#10b981' }, 
          { label: '-3x', mult: -3, color: '#ef4444' }, 
          { label: '5x', mult: 5, color: '#059669' },
          { label: '-5x', mult: -5, color: '#dc2626' }, 
          { label: '4x', mult: 4, color: '#10b981' }, 
          { label: '-4x', mult: -4, color: '#ef4444' },
          { label: '2x', mult: 2, color: '#34d399' }, 
          { label: '-2x', mult: -2, color: '#f87171' }
      ]
  }
};

let currentPlinkoMode = 'ange';
let plinkoVal = 0;
const pBgCanvas = document.getElementById('plinko-bg-canvas');
const pBgCtx = pBgCanvas.getContext('2d');
const pCanvas = document.getElementById('plinko-canvas');
const pCtx = pCanvas.getContext('2d');
const plinkoDropBtn = document.getElementById('plinko-drop-btn');

let pEngine = { isPlaying: false, balls: [], animId: null };

document.querySelectorAll('.plinko-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.plinko-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPlinkoMode = btn.dataset.mode;
        resetPlinkoUI();
    });
});

function resizePlinko() {
  const container = document.getElementById('plinko-game-view');
  if(container && screens.plinko.classList.contains('active')) {
    pBgCanvas.width = container.clientWidth; pBgCanvas.height = container.clientHeight;
    pCanvas.width = container.clientWidth; pCanvas.height = container.clientHeight;
    drawPlinkoStaticBg(); 
  }
}
window.addEventListener('resize', resizePlinko);

document.querySelectorAll('.plinko-val').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.plinko-val').forEach(x => x.classList.remove('selected-plinko'));
  b.classList.add('selected-plinko'); plinkoVal = parseInt(b.dataset.val); document.getElementById('plinko-custom-val').value = '';
}));
document.getElementById('plinko-custom-val').addEventListener('input', (e) => {
  document.querySelectorAll('.plinko-val').forEach(x => x.classList.remove('selected-plinko')); plinkoVal = parseInt(e.target.value) || 0;
});

plinkoDropBtn.addEventListener('click', () => {
  if (!plinkoVal || plinkoVal < 1) return animateBtnError('plinko-drop-btn');
  if(!keepTotalBalance && pEngine.balls.length === 0) turnBalance = 0;

  const rows = PLINKO_MODES[currentPlinkoMode].rows;
  let path = [], currentBin = 0;
  for(let step=0; step<rows; step++) {
    let dir = Math.random() > 0.5 ? 1 : 0;
    path.push(dir); currentBin += dir;
  }
  
  pEngine.balls.push({ yProgress: -0.5, path: path, finalBin: currentBin, active: true });
  
  if (!pEngine.isPlaying) {
    pEngine.isPlaying = true;
    pEngine.animId = requestAnimationFrame(plinkoLoop);
  }
});

function resetPlinkoUI() {
  if(pEngine.animId) cancelAnimationFrame(pEngine.animId);
  pEngine = { isPlaying: false, balls: [], animId: null };
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  drawPlinkoStaticBg();
}

function getPlinkoLayout() {
  const rows = PLINKO_MODES[currentPlinkoMode].rows;
  const w = pCanvas.width, h = pCanvas.height;
  const paddingY = 20, binHeight = 35;
  const availableH = h - paddingY * 2 - binHeight;
  const spacingY = availableH / rows;
  const spacingX = Math.min(spacingY * 1.3, w / (rows + 3));
  const startX = w / 2;
  return { w, h, spacingX, spacingY, startX, startY: paddingY, binHeight, binY: h - paddingY - binHeight, rows };
}

function drawPlinkoStaticBg() {
  const L = getPlinkoLayout();
  const bins = PLINKO_MODES[currentPlinkoMode].bins;
  pBgCtx.clearRect(0, 0, L.w, L.h);
  
  pBgCtx.fillStyle = "rgba(255,255,255,0.7)";
  for (let r = 0; r <= L.rows; r++) {
    let numPegs = r + 1;
    let rowStartX = L.startX - (r * L.spacingX) / 2;
    for (let c = 0; c < numPegs; c++) {
      pBgCtx.beginPath();
      pBgCtx.arc(rowStartX + c * L.spacingX, L.startY + r * L.spacingY, 4, 0, Math.PI * 2);
      pBgCtx.fill();
    }
  }

  let binRowStartX = L.startX - (L.rows * L.spacingX) / 2;
  pBgCtx.font = "bold 11px Inter"; pBgCtx.textAlign = "center"; pBgCtx.textBaseline = "middle";
  for(let i=0; i<bins.length; i++) {
    let bx = binRowStartX + i * L.spacingX;
    let bw = L.spacingX * 0.9;
    pBgCtx.fillStyle = bins[i].color;
    pBgCtx.beginPath();
    pBgCtx.roundRect(bx - bw/2, L.binY, bw, L.binHeight, 4);
    pBgCtx.fill();
    pBgCtx.fillStyle = "#fff";
    pBgCtx.fillText(bins[i].label, bx, L.binY + L.binHeight/2);
  }
}

function plinkoLoop() {
  if(!pEngine.isPlaying) return;
  
  const L = getPlinkoLayout();
  pCtx.clearRect(0, 0, L.w, L.h);
  const speed = 0.035; 
  
  pEngine.balls.forEach(ball => {
    if(!ball.active) return;
    ball.yProgress += speed;

    if(ball.yProgress >= L.rows) {
      ball.active = false;
      handlePlinkoWin(ball.finalBin);
    } else if (ball.yProgress >= 0) {
      let row = Math.floor(ball.yProgress);
      let fraction = ball.yProgress - row;
      
      let currentX = L.startX;
      for(let r=0; r<row; r++) currentX += (ball.path[r] === 1 ? L.spacingX/2 : -L.spacingX/2);
      
      let nextDir = ball.path[row] === 1 ? 1 : -1;
      let x = currentX + (nextDir * (L.spacingX/2) * fraction);
      
      let bounce = Math.sin(fraction * Math.PI) * (L.spacingY * 0.4);
      let y = L.startY + (row * L.spacingY) + (fraction * L.spacingY) - bounce;

      pCtx.beginPath(); pCtx.arc(x, y, 7, 0, Math.PI*2);
      pCtx.fillStyle = "#ffffff"; pCtx.fill();
      pCtx.lineWidth = 1.5; pCtx.strokeStyle = "rgba(0,0,0,0.5)"; pCtx.stroke();
    }
  });

  pEngine.balls = pEngine.balls.filter(b => b.active);

  if(pEngine.balls.length === 0) {
    pEngine.isPlaying = false; 
  } else {
    pEngine.animId = requestAnimationFrame(plinkoLoop);
  }
}

function handlePlinkoWin(binIndex) {
  let mult = PLINKO_MODES[currentPlinkoMode].bins[binIndex].mult;
  turnBalance += Math.round(plinkoVal * mult);
  updateLiveSummary();
}


/* ==========================================================================
   JEU 3 : LES MINES
   ========================================================================== */
let minesBet = 0;
let minesCount = 3;
let minesObj = { isPlaying: false, grid: [], revealedCount: 0, mult: 1 };

const minesGrid = document.getElementById('mines-grid');
const minesCashoutBtn = document.getElementById('mines-cashout-btn');
const minesMultDisplay = document.getElementById('mines-multiplier-display');
const minesStartBtn = document.getElementById('mines-start-btn');

document.querySelectorAll('.mines-bet').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mines-bet').forEach(b => b.classList.remove('selected-mines'));
    btn.classList.add('selected-mines'); minesBet = parseInt(btn.dataset.bet); document.getElementById('mines-custom-bet').value = ''; 
  });
});

document.getElementById('mines-custom-bet').addEventListener('input', (e) => {
  document.querySelectorAll('.mines-bet').forEach(b => b.classList.remove('selected-mines')); 
  minesBet = parseInt(e.target.value) || 0;
  if(minesBet > 10) { minesBet = 10; e.target.value = 10; }
});

function resetMinesUI() {
  minesObj = { isPlaying: false, grid: [], revealedCount: 0, mult: 1 };
  minesGrid.innerHTML = '';
  
  for(let i=0; i<25; i++) {
      const cell = document.createElement('div');
      cell.className = 'mine-cell';
      cell.dataset.index = i;
      minesGrid.appendChild(cell);
  }
  
  document.getElementById('mines-betting-area').classList.remove('hidden');
  document.getElementById('mines-result-actions').classList.add('hidden');
  minesCashoutBtn.classList.add('hidden');
  minesStartBtn.classList.remove('hidden');
  
  minesMultDisplay.textContent = "1.00x";
  minesMultDisplay.className = "";
}

minesStartBtn.addEventListener('click', () => {
  if (!minesBet || minesBet < 1) return animateBtnError('mines-start-btn');
  if (minesBet > 10) {
      minesBet = 10; document.getElementById('mines-custom-bet').value = 10; return animateBtnError('mines-start-btn');
  }
  minesCount = parseInt(document.getElementById('mines-count-input').value) || 3;
  if (!minesCount || minesCount < 1 || minesCount > 24) {
      document.getElementById('mines-count-input').value = 3; minesCount = 3; return animateBtnError('mines-start-btn');
  }
  startMinesRound();
});

function calculateMinesMultiplier(mines, diamonds) {
  if (diamonds === 0) return 1.0;
  let mult = 1;
  for (let i = 0; i < diamonds; i++) {
    mult *= (25 - i) / (25 - mines - i);
  }
  
  // AVANTAGE MAISON ALLÉGÉ : On retient 15% au lieu des 35% de tout à l'heure
  mult = mult * 0.85; 
  
  // Tassement de la courbe beaucoup plus doux et qui arrive plus tard (à 2.50x)
  if (mult > 2.50) mult = 2.50 + ((mult - 2.50) * 0.40); 
  
  if (mult > 8.00) mult = 8.00; // Plafond strict
  
  return Math.max(1.0, mult); 
}

function startMinesRound() {
  if(!keepTotalBalance) turnBalance = 0;
  turnBalance -= minesBet;
  updateLiveSummary();
  
  let bombs = Array(minesCount).fill(true);
  let diamonds = Array(25 - minesCount).fill(false);
  minesObj.grid = bombs.concat(diamonds).sort(() => Math.random() - 0.5);
  
  minesObj.isPlaying = true;
  minesObj.revealedCount = 0;
  minesObj.mult = 1.00;

  minesMultDisplay.textContent = "1.00x";
  minesMultDisplay.className = "";
  
  minesStartBtn.classList.add('hidden');
  minesCashoutBtn.classList.remove('hidden');
  minesCashoutBtn.textContent = `Encaisser`;

  Array.from(minesGrid.children).forEach(cell => {
      const newCell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newCell, cell);
      newCell.addEventListener('click', () => handleMineClick(newCell, parseInt(newCell.dataset.index)));
  });
}

function handleMineClick(cell, index) {
  if(!minesObj.isPlaying || cell.classList.contains('revealed')) return;
  
  cell.classList.add('revealed');
  
  if(minesObj.grid[index]) {
      cell.classList.add('bomb-explode');
      cell.textContent = '💣';
      endMinesGame(false);
      gererMusiques(1.0); // NOUVEAU : Coupe la tension si on perd
  } else {
      cell.classList.add('diamond');
      cell.textContent = '💎';
      minesObj.revealedCount++;
      
      minesObj.mult = calculateMinesMultiplier(minesCount, minesObj.revealedCount);
      minesMultDisplay.textContent = minesObj.mult.toFixed(2) + "x";
      
      // NOUVEAU : Envoie le multiplicateur à la musique
      gererMusiques(minesObj.mult);
      
      let gain = Math.round(minesBet * minesObj.mult);
      minesCashoutBtn.textContent = `Encaisser (${gain})`;
      
      if(minesObj.revealedCount === 25 - minesCount) {
          endMinesGame(true); 
          gererMusiques(1.0); // Coupe la tension si on gagne tout
      }
  }
}

function endMinesGame(wonByClearing) {
  minesObj.isPlaying = false;
  minesCashoutBtn.classList.add('hidden');
  document.getElementById('mines-result-actions').classList.remove('hidden');
  
  Array.from(minesGrid.children).forEach((cell, i) => {
      if(!cell.classList.contains('revealed')) {
          cell.classList.add('revealed');
          if(minesObj.grid[i]) {
              cell.classList.add('bomb'); cell.textContent = '💣'; cell.style.opacity = '0.4';
          } else {
              cell.classList.add('diamond'); cell.textContent = '💎'; cell.style.opacity = '0.4';
          }
      }
  });

  if(wonByClearing) {
      turnBalance += Math.round(minesBet * minesObj.mult);
      updateLiveSummary();
      minesMultDisplay.classList.add('cashed-out');
  } else {
      minesMultDisplay.classList.add('crashed');
  }
}

minesCashoutBtn.addEventListener('click', () => {
  if(!minesObj.isPlaying) return;
  
  // BUG FIX : Impossible d'encaisser à 0 case révélée
  if(minesObj.revealedCount === 0) {
      return animateBtnError('mines-cashout-btn'); 
  }
  
  // IMAGE DU LÂCHE : S'il encaisse avant 3 diamants
  if(minesObj.revealedCount < 3) triggerCowardImage();
  
  let gain = Math.round(minesBet * minesObj.mult);
  turnBalance += gain;
  updateLiveSummary();
  endMinesGame(true);
});


/* ==========================================================================
   JEU 4 : HI-LO
   ========================================================================== */
let hiloBet = 0;
let hiloDevinTarget = 0;
let hiloObj = { isPlaying: false, deck: [], currentCard: null, mult: 1.00, history: [], successCount: 0 };

const hiloStartBtn = document.getElementById('hilo-start-btn');
const hiloCashoutBtn = document.getElementById('hilo-cashout-btn');
const hiloBtnHigher = document.getElementById('hilo-btn-higher');
const hiloBtnLower = document.getElementById('hilo-btn-lower');
const hiloMultDisplay = document.getElementById('hilo-multiplier-display');
const hiloActiveCard = document.getElementById('hilo-active-card');
const hiloHistoryCont = document.getElementById('hilo-history');

document.querySelectorAll('.hilo-bet').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.hilo-bet').forEach(b => b.classList.remove('selected-hilo'));
    btn.classList.add('selected-hilo'); hiloBet = parseInt(btn.dataset.bet); document.getElementById('hilo-custom-bet').value = ''; 
  });
});

document.getElementById('hilo-custom-bet').addEventListener('input', (e) => {
  document.querySelectorAll('.hilo-bet').forEach(b => b.classList.remove('selected-hilo')); 
  hiloBet = parseInt(e.target.value) || 0;
  if(hiloBet > 10) { hiloBet = 10; e.target.value = 10; }
});

function buildDeck() {
  let deck = [];
  const suits = ['♥', '♦', '♣', '♠'];
  const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  
  for(let s of suits) {
      for(let i=0; i<ranks.length; i++) {
          deck.push({ rank: ranks[i], value: i+2, suit: s, color: (s==='♥'||s==='♦') ? 'red' : 'black', isDeath: false });
      }
  }
  for(let i=0; i<4; i++) {
      deck.push({ rank: '☠️', value: -1, suit: '☠️', color: 'black', isDeath: true });
  }
  
  for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function resetHiloUI() {
  hiloObj = { isPlaying: false, deck: [], currentCard: null, mult: 1.00, history: [], successCount: 0 };
  hiloDevinTarget = 0;
  
  document.getElementById('hilo-betting-area').classList.remove('hidden');
  document.getElementById('hilo-result-actions').classList.add('hidden');
  hiloCashoutBtn.classList.add('hidden');
  hiloStartBtn.classList.remove('hidden');
  
  hiloMultDisplay.textContent = "1.00x";
  hiloMultDisplay.className = "hilo-mult-header";
  
  hiloActiveCard.className = "playing-card facedown";
  hiloHistoryCont.innerHTML = "";
  
  hiloBtnHigher.disabled = true;
  hiloBtnLower.disabled = true;
  document.getElementById('hilo-mult-higher').textContent = "-";
  document.getElementById('hilo-mult-lower').textContent = "-";
}

hiloStartBtn.addEventListener('click', () => {
  if (!hiloBet || hiloBet < 1) return animateBtnError('hilo-start-btn');
  if (hiloBet > 10) { hiloBet = 10; document.getElementById('hilo-custom-bet').value = 10; return animateBtnError('hilo-start-btn'); }
  
  hiloDevinTarget = parseInt(document.getElementById('hilo-devin-input').value) || 0;
  
  if(!keepTotalBalance) turnBalance = 0;
  turnBalance -= hiloBet;
  updateLiveSummary();
  
  hiloObj.deck = buildDeck();
  hiloObj.history = [];
  hiloObj.mult = 1.00;
  hiloObj.successCount = 0;
  hiloObj.isPlaying = true;
  
  hiloStartBtn.classList.add('hidden');
  hiloCashoutBtn.classList.remove('hidden');
  
  if (hiloDevinTarget > 0) {
      hiloCashoutBtn.disabled = true;
      hiloCashoutBtn.textContent = `Objectif Devin : 0/${hiloDevinTarget}`;
  } else {
      hiloCashoutBtn.disabled = false;
      hiloCashoutBtn.textContent = `Encaisser`;
  }
  
  drawHiloCard();
});

function setCardVisuals(card, domElement) {
  domElement.classList.remove('facedown', 'card-red', 'card-black');
  domElement.classList.add(card.color === 'red' ? 'card-red' : 'card-black');
  domElement.querySelectorAll('.rank').forEach(el => el.textContent = card.rank);
  domElement.querySelectorAll('.suit').forEach(el => el.textContent = card.suit);
}

function calculateHiloOdds() {
  let higherCount = 0;
  let lowerCount = 0;
  let val = hiloObj.currentCard.value;
  
  hiloObj.deck.forEach(c => {
      if(!c.isDeath && c.value > val) higherCount++;
      if(!c.isDeath && c.value < val) lowerCount++;
  });
  
  let total = hiloObj.deck.length; 
  
  // HAUSSE DES GAINS : Le multiplicateur de base repasse à 0.85
  let multH = higherCount > 0 ? (total / higherCount) * 0.85 : 0;
  let multL = lowerCount > 0 ? (total / lowerCount) * 0.85 : 0;
  
  // Le freinage des cotes commence beaucoup plus tard (1.50x au lieu de 1.15x)
  if (multH > 1.50) multH = 1.50 + ((multH - 1.50) * 0.50);
  if (multL > 1.50) multL = 1.50 + ((multL - 1.50) * 0.50);
  
  return { 
      h: multH > 0 ? Math.max(1.05, multH) : 0, 
      l: multL > 0 ? Math.max(1.05, multL) : 0 
  };
}

function updateHiloButtons() {
  let odds = calculateHiloOdds();
  
  if(odds.h === 0) {
      hiloBtnHigher.disabled = true;
      document.getElementById('hilo-mult-higher').textContent = "Impossible";
  } else {
      hiloBtnHigher.disabled = false;
      document.getElementById('hilo-mult-higher').textContent = odds.h.toFixed(2) + "x";
  }
  
  if(odds.l === 0) {
      hiloBtnLower.disabled = true;
      document.getElementById('hilo-mult-lower').textContent = "Impossible";
  } else {
      hiloBtnLower.disabled = false;
      document.getElementById('hilo-mult-lower').textContent = odds.l.toFixed(2) + "x";
  }
}

function addMiniCardToHistory(card) {
    const mini = document.createElement('div');
    mini.className = 'mini-card';
    mini.style.color = card.color === 'red' ? '#dc2626' : '#111827';
    mini.innerHTML = `${card.rank}<br><span style="font-size:0.7rem">${card.suit}</span>`;
    hiloHistoryCont.appendChild(mini);
    if(hiloHistoryCont.children.length > 7) hiloHistoryCont.firstChild.remove();
}

function drawHiloCard() {
  let nextCard = hiloObj.deck.pop();
  
  if (hiloObj.currentCard === null) {
      while(nextCard.isDeath) {
          hiloObj.deck.unshift(nextCard); 
          nextCard = hiloObj.deck.pop();
      }
  }

  gsap.to(hiloActiveCard, { rotationY: 90, duration: 0.2, onComplete: () => {
      setCardVisuals(nextCard, hiloActiveCard);
      hiloObj.currentCard = nextCard;
      gsap.to(hiloActiveCard, { rotationY: 0, duration: 0.2, onComplete: () => { updateHiloButtons(); }});
  }});
}

function playHiloTurn(guessDir) {
    if(!hiloObj.isPlaying) return;
    
    let odds = calculateHiloOdds();
    let targetedMult = guessDir === 'higher' ? odds.h : odds.l;
    
    let oldCard = hiloObj.currentCard;
    let newCard = hiloObj.deck.pop();
    
    addMiniCardToHistory(oldCard);
    hiloBtnHigher.disabled = true; hiloBtnLower.disabled = true;
    
    gsap.to(hiloActiveCard, { rotationY: 90, duration: 0.2, onComplete: () => {
        setCardVisuals(newCard, hiloActiveCard);
        hiloObj.currentCard = newCard;
        
        gsap.to(hiloActiveCard, { rotationY: 0, duration: 0.2, onComplete: () => {
            
            let isWin = false;
            if (newCard.isDeath) {
                isWin = false; 
            } else if (guessDir === 'higher' && newCard.value > oldCard.value) {
                isWin = true;
            } else if (guessDir === 'lower' && newCard.value < oldCard.value) {
                isWin = true;
            }
            
            if(isWin) {
                hiloObj.mult *= targetedMult;
                hiloObj.successCount++;
                
                if (hiloDevinTarget > 0 && hiloObj.successCount === hiloDevinTarget) {
                    hiloObj.mult *= 1.5; 
                    hiloCashoutBtn.disabled = false; 
                }
                
                if(hiloObj.mult > 10.00) hiloObj.mult = 10.00;
                
                hiloMultDisplay.textContent = hiloObj.mult.toFixed(2) + "x";
                
                // NOUVEAU : On met à jour la musique de tension
                gererMusiques(hiloObj.mult);
                
                let gain = Math.round(hiloBet * hiloObj.mult);
                
                if (hiloDevinTarget > 0 && hiloObj.successCount < hiloDevinTarget) {
                    hiloCashoutBtn.textContent = `Objectif Devin : ${hiloObj.successCount}/${hiloDevinTarget}`;
                } else {
                    hiloCashoutBtn.textContent = `Encaisser (${gain})`;
                }

                updateHiloButtons();
            } else {
                endHiloGame(false, newCard.isDeath);
                gererMusiques(1.0); // NOUVEAU : Coupe la tension si on perd
            }
        }});
    }});
}

hiloBtnHigher.addEventListener('click', () => playHiloTurn('higher'));
hiloBtnLower.addEventListener('click', () => playHiloTurn('lower'));

function endHiloGame(won, byDeath = false) {
  hiloObj.isPlaying = false;
  hiloCashoutBtn.classList.add('hidden');
  document.getElementById('hilo-result-actions').classList.remove('hidden');
  hiloBtnHigher.disabled = true;
  hiloBtnLower.disabled = true;

  if(won) {
      turnBalance += Math.round(hiloBet * hiloObj.mult);
      updateLiveSummary();
      hiloMultDisplay.classList.add('cashed-out');
  } else {
      if (byDeath) {
          hiloMultDisplay.textContent = "☠️ MORT !";
          // PLUIE DE SINGES : S'il tire la tête de mort
          triggerMonkeyRain();
      } else {
          hiloMultDisplay.classList.add('crashed');
      }

      if (hiloDevinTarget > 0 && hiloObj.successCount < hiloDevinTarget) {
          turnBalance -= Math.round(hiloBet * 0.5); 
          updateLiveSummary();
          setTimeout(() => alert("Pénalité Devin appliquée : Tu bois encore plus !"), 200);
      }

      gsap.to(hiloActiveCard, { x: 10, duration: 0.1, yoyo: true, repeat: 3 });
  }
}

hiloCashoutBtn.addEventListener('click', () => {
  if(!hiloObj.isPlaying) return;
  
  // IMAGE DU LÂCHE : S'il encaisse avant 1.70x
  if (hiloObj.mult < 1.70) triggerCowardImage();
  
  endHiloGame(true);
});
/* ==========================================================================
   JEU 5 : LA ROULETTE RUSSE (Moteur 3D & Tir)
   ========================================================================== */
let rouletteBet = 0;
let rouletteChambers = [false, false, false, false, false, false];
let rouletteObj = { isPlaying: false, mult: 1.00 };

let currentRotationX = 0;
let dragStartY = 0;
let dragStartRot = 0;
let isDragging = false;
let isSpinning = false;
let awaitingSwipe = false;

// Chargement des effets sonores
const audioSpin = new Audio('spin.mp3');
const audioBang = new Audio('bang.mp3');
const audioClick = new Audio('click.mp3');

const ROULETTE_MULTS = { 0: 1.0, 1: 1.25, 2: 1.60, 3: 2.20, 4: 3.50, 5: 7.00, 6: 0.00 };

const rouletteStartBtn = document.getElementById('roulette-start-btn');
const rouletteOddsInfo = document.getElementById('roulette-odds-info');
const rouletteMultDisplay = document.getElementById('roulette-multiplier-display');
const cylinder3d = document.getElementById('cylinder3d');
const swipeIndicator = document.getElementById('swipe-indicator');
const flatLoader = document.getElementById('flat-cylinder-loader');

document.querySelectorAll('.roulette-bet').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.roulette-bet').forEach(b => b.classList.remove('selected-hilo'));
    btn.classList.add('selected-hilo'); rouletteBet = parseInt(btn.dataset.bet); document.getElementById('roulette-custom-bet').value = ''; 
  });
});
document.getElementById('roulette-custom-bet').addEventListener('input', (e) => {
  document.querySelectorAll('.roulette-bet').forEach(b => b.classList.remove('selected-hilo')); 
  rouletteBet = parseInt(e.target.value) || 0;
  if(rouletteBet > 10) { rouletteBet = 10; e.target.value = 10; }
});

function updateRouletteOdds() {
    let loadedCount = rouletteChambers.filter(c => c).length;
    rouletteObj.mult = ROULETTE_MULTS[loadedCount];
    if (loadedCount === 0) { rouletteOddsInfo.textContent = "Barillet vide..."; rouletteOddsInfo.style.color = "#9ca3af"; } 
    else if (loadedCount === 6) { rouletteOddsInfo.textContent = "Mort certaine (x0) ☠️"; rouletteOddsInfo.style.color = "var(--danger)"; } 
    else { rouletteOddsInfo.textContent = `Gain : ${rouletteObj.mult.toFixed(2)}x (${loadedCount}/6)`; rouletteOddsInfo.style.color = "white"; }
}

function resetRouletteUI() {
    rouletteObj.isPlaying = false;
    awaitingSwipe = false;
    isSpinning = false;
    document.getElementById('roulette-betting-area').classList.remove('hidden');
    document.getElementById('roulette-result-actions').classList.add('hidden');
    
    // Réinitialisation de l'interface
    swipeIndicator.classList.add('hidden');
    flatLoader.classList.remove('hidden'); // On réaffiche le chargeur plat
    rouletteStartBtn.disabled = false;
    rouletteMultDisplay.textContent = "1.00x";
    rouletteMultDisplay.className = "hilo-mult-header";
    
    currentRotationX = 0;
    gsap.set(cylinder3d, { rotationX: 0 });
    gsap.set('#muzzle-flash', { opacity: 0 }); // On cache le flash du précédent tir
    gsap.set('.gun-container', { x: 0, rotation: 0 }); // On remet l'arme droite
    if (typeof gererMusiques === "function") gererMusiques(1.0);
}

// LOGIQUE DE CHARGEMENT : Uniquement sur le barillet plat en bas à droite
document.querySelectorAll('.flat-chamber').forEach(chamber => {
    chamber.addEventListener('click', () => {
        if(rouletteObj.isPlaying) return;
        const index = parseInt(chamber.dataset.index);
        rouletteChambers[index] = !rouletteChambers[index];
        
        if (rouletteChambers[index]) chamber.classList.add('loaded');
        else chamber.classList.remove('loaded');
        
        updateRouletteOdds();
    });
});

rouletteStartBtn.addEventListener('click', () => {
    let loadedCount = rouletteChambers.filter(c => c).length;
    if (!rouletteBet || rouletteBet < 1 || loadedCount === 0) return animateBtnError('roulette-start-btn');
    
    if(!keepTotalBalance) turnBalance = 0;
    turnBalance -= rouletteBet; 
    updateLiveSummary();
    
    rouletteObj.isPlaying = true;
    awaitingSwipe = true; 
    
    document.getElementById('roulette-betting-area').classList.add('hidden');
    flatLoader.classList.add('hidden'); // Le chargeur plat disparaît !
    rouletteMultDisplay.textContent = "TIRE !";
    swipeIndicator.classList.remove('hidden'); 
    
    // Le barillet 3D sur l'arme tourne d'un coup de façon dramatique
    currentRotationX = Math.round(currentRotationX / 60) * 60 + 360; 
    gsap.to(cylinder3d, {rotationX: currentRotationX, duration: 0.8, ease: "power2.out"});
});

function getY(e) { return e.touches ? e.touches[0].clientY : e.clientY; }

function startDrag(e) {
    if(isSpinning || !awaitingSwipe) return;
    isDragging = true;
    dragStartY = getY(e);
    dragStartRot = currentRotationX;
}

function moveDrag(e) {
    if(!isDragging || isSpinning || !awaitingSwipe) return;
    let delta = getY(e) - dragStartY;
    currentRotationX = dragStartRot - (delta * 0.5); 
    gsap.set(cylinder3d, { rotationX: currentRotationX });
}

function endDrag(e) {
    if(!isDragging || isSpinning || !awaitingSwipe) return;
    isDragging = false;
    let delta = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - dragStartY;
    
    if(Math.abs(delta) > 40) executeSpin(delta);
    else {
        currentRotationX = Math.round(currentRotationX / 60) * 60;
        gsap.to(cylinder3d, { rotationX: currentRotationX, duration: 0.3, ease: "power2.out" });
    }
}

cylinder3d.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', moveDrag);
window.addEventListener('mouseup', endDrag);
cylinder3d.addEventListener('touchstart', startDrag, {passive: true});
window.addEventListener('touchmove', moveDrag, {passive: true});
window.addEventListener('touchend', endDrag);

function executeSpin(delta) {
    awaitingSwipe = false;
    isSpinning = true;
    swipeIndicator.classList.add('hidden');
    rouletteMultDisplay.textContent = "SPINNING...";
    
    // On lance le son du barillet (le catch évite les erreurs si le navigateur bloque l'audio)
    audioSpin.currentTime = 0;
    audioSpin.play().catch(e => console.log("Audio bloqué"));
    
    const landedIndex = Math.floor(Math.random() * 6);
    let loadedCount = rouletteChambers.filter(c => c).length;
    
    let baseTargetAngle = -landedIndex * 60; 
    let spinAmount = (delta > 0) ? -2160 : 2160; 
    
    let targetRotation = currentRotationX + spinAmount;
    let remainder = targetRotation % 360;
    let correction = baseTargetAngle - remainder;
    
    if (correction > 180) correction -= 360;
    if (correction < -180) correction += 360;
    
    targetRotation += correction;
    currentRotationX = targetRotation;
    
    gsap.to(cylinder3d, {
        rotationX: targetRotation, 
        duration: 3.0, 
        ease: "power4.out",
        onComplete: () => { 
            isSpinning = false;
            audioSpin.pause(); // On coupe le son de rotation quand ça s'arrête
            finishRoulette(landedIndex, loadedCount); 
        }
    });
}

function finishRoulette(landedIndex, loadedCount) {
    document.getElementById('roulette-result-actions').classList.remove('hidden');
    
    if (rouletteChambers[landedIndex]) {
        // PERDU : On lance le coup de feu
        audioBang.currentTime = 0;
        audioBang.play().catch(e => console.log("Audio bloqué"));

        rouletteMultDisplay.textContent = "BOUM ! 💥";
        rouletteMultDisplay.classList.add('crashed');
        
        gsap.to('#muzzle-flash', { opacity: 1, duration: 0.05, yoyo: true, repeat: 1 });
        gsap.to('.gun-container', { x: 50, rotation: -15, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out", 
            onComplete: () => {
                gsap.to('.gun-container', { x: 0, rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
            }
        });
        
        if (loadedCount === 6) triggerMonkeyRain();
        if (typeof gererMusiques === "function") gererMusiques(1.0);
    } else {
        // GAGNÉ : On lance le bruit de clic métallique
        audioClick.currentTime = 0;
        audioClick.play().catch(e => console.log("Audio bloqué"));

        turnBalance += Math.round(rouletteBet * rouletteObj.mult);
        updateLiveSummary();
        rouletteMultDisplay.textContent = rouletteObj.mult.toFixed(2) + "x";
        rouletteMultDisplay.classList.add('cashed-out');
        if (typeof gererMusiques === "function") gererMusiques(rouletteObj.mult);
    }
}
