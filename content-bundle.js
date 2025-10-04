// content-bundle.js
// Bundled content script with all modules inline (no ES modules)

// ============ STORAGE MODULE ============
const Storage = {
  get(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => resolve(result[key]));
    });
  },

  set(obj) {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, resolve);
    });
  },

  addToWhitelist(domain) {
    return this.get('whitelist').then((whitelist = []) => {
      if (!whitelist.includes(domain)) {
        whitelist.push(domain);
        return this.set({ whitelist });
      }
    });
  },

  isWhitelisted(domain) {
    return this.get('whitelist').then((whitelist = []) => whitelist.includes(domain));
  }
};

// ============ OVERLAY MODULE ============
const OVERLAY_ID = 'xo-blocker-overlay';
const TIMER_KEY = 'xo_blocker_timer_';

function createOverlay(domain, duration) {
  if (document.getElementById(OVERLAY_ID)) return;
  
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.tabIndex = 0;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'xo-title');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    z-index: 2147483647; display: flex; flex-direction: column;
    align-items: center; justify-content: center; color: #fff; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  // Title
  const title = document.createElement('h1');
  title.id = 'xo-title';
  title.textContent = '🎮 XO Blocker';
  title.style.cssText = 'font-size: 2.5rem; margin-bottom: 0.5em; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);';
  overlay.appendChild(title);
  
  // Subtitle
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Play Tic-Tac-Toe until the timer ends';
  subtitle.style.cssText = 'font-size: 1.1rem; margin-bottom: 1em; opacity: 0.8;';
  overlay.appendChild(subtitle);
  
  // Timer
  const timer = document.createElement('div');
  timer.id = 'xo-timer';
  timer.setAttribute('aria-live', 'polite');
  timer.style.cssText = 'font-size: 1.8rem; margin-bottom: 1.5em; font-weight: 600; color: #4ecdc4;';
  overlay.appendChild(timer);
  
  // XO Game
  const game = document.createElement('div');
  game.id = 'xo-game';
  overlay.appendChild(game);
  
  // No control buttons - user must wait for timer
  
  document.body.appendChild(overlay);
  setTimeout(() => overlay.focus(), 100);
}

function removeOverlay() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();
}

// XO Game logic (Smart AI: Minimax - Unbeatable)
function renderGame(container, onGameEnd) {
  container.innerHTML = '';
  const board = Array(9).fill(null);
  let gameOver = false;

  const grid = document.createElement('div');
  grid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 80px); grid-gap: 12px; margin: 1em auto;';
  grid.setAttribute('role', 'grid');
  grid.setAttribute('aria-label', 'Tic Tac Toe board');

  function checkWin(b, sym) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(line => line.every(i => b[i] === sym));
  }

  function checkDraw(b) {
    return b.every(x => x);
  }

  function aiMove() {
    const empty = board.map((v,i) => v ? null : i).filter(i => i!==null);
    if (!empty.length) return;
    
    // Smart AI using minimax algorithm
    const bestMove = findBestMove(board);
    board[bestMove] = 'O';
    update();
  }

  function minimax(b, depth, isMaximizing) {
    // Check terminal states
    if (checkWin(b, 'O')) return 10 - depth;
    if (checkWin(b, 'X')) return depth - 10;
    if (b.every(x => x)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = 'O';
          let score = minimax(b, depth + 1, false);
          b[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = 'X';
          let score = minimax(b, depth + 1, true);
          b[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function findBestMove(b) {
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'O';
        let score = minimax(b, 0, false);
        b[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  function update() {
    grid.innerHTML = '';
    for (let i = 0; i < 9; ++i) {
      const cell = document.createElement('button');
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', board[i] ? board[i] : `cell ${i+1}`);
      cell.style.cssText = `
        width:80px; height:80px; font-size:2.5rem; background:#0f3460; color:#fff;
        border-radius:12px; border:3px solid #16213e; outline:none; cursor:pointer;
        transition: all 0.2s; font-weight: 700;
      `;
      cell.tabIndex = 0;
      cell.textContent = board[i] || '';
      
      if (!board[i] && !gameOver) {
        cell.onmouseover = () => cell.style.background = '#1a4d7a';
        cell.onmouseout = () => cell.style.background = '#0f3460';
        cell.onfocus = () => cell.style.border = '3px solid #4ecdc4';
        cell.onblur = () => cell.style.border = '3px solid #16213e';
        
        cell.onclick = () => {
          if (gameOver) return; // Prevent clicks after game ends
          
          board[i] = 'X';
          update();
          
          if (checkWin(board, 'X')) {
            gameOver = true;
            update(); // Update to disable all cells
            setTimeout(() => container.appendChild(msg('🎉 You Win!', '#2ecc71')), 200);
            onGameEnd && onGameEnd('win');
            return;
          }
          if (checkDraw(board)) {
            gameOver = true;
            update(); // Update to disable all cells
            setTimeout(() => container.appendChild(msg('🤝 Draw!', '#f39c12')), 200);
            onGameEnd && onGameEnd('draw');
            return;
          }
          
          setTimeout(() => {
            if (gameOver) return; // Safety check
            aiMove();
            if (checkWin(board, 'O')) {
              gameOver = true;
              update(); // Update to disable all cells
              setTimeout(() => container.appendChild(msg('🤖 Computer Wins!', '#e74c3c')), 200);
              onGameEnd && onGameEnd('lose');
              return;
            }
            if (checkDraw(board)) {
              gameOver = true;
              update(); // Update to disable all cells
              setTimeout(() => container.appendChild(msg('🤝 Draw!', '#f39c12')), 200);
              onGameEnd && onGameEnd('draw');
              return;
            }
          }, 300);
        };
        
        cell.onkeydown = (e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !board[i] && !gameOver) {
            e.preventDefault();
            cell.click();
          }
        };
      } else {
        cell.disabled = true;
        cell.style.cursor = 'default';
        if (board[i] === 'X') cell.style.color = '#4ecdc4';
        if (board[i] === 'O') cell.style.color = '#ff6b6b';
      }
      grid.appendChild(cell);
    }
  }

  function msg(text, color) {
    const d = document.createElement('div');
    d.textContent = text;
    d.style.cssText = `margin:1.5em; font-size:1.5rem; font-weight:700; color:${color}; animation: fadeIn 0.5s;`;
    return d;
  }

  container.appendChild(grid);
  update();
}

// ============ MAIN CONTENT SCRIPT LOGIC ============
const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

async function showBlockOverlay(domain) {
  let blockDuration = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'get_block_duration' }, (resp) => {
      resolve(resp?.blockDuration || 5);
    });
  });
  
  // Always start a fresh timer for each visit (reset on every visit)
  let start = Date.now();
  let duration = blockDuration * 60 * 1000;
  let end = start + duration;
  
  // Store the new timer (overwrites any existing timer for this domain)
  Storage.set({ [TIMER_KEY + domain]: { start, duration: blockDuration, sessionId: Date.now() } });
  createOverlay(domain, blockDuration);
  renderGame(document.getElementById('xo-game'), onGameEnd);
  updateTimer();

  function updateTimer() {
    const timerEl = document.getElementById('xo-timer');
    if (!timerEl) return;
    
    let now = Date.now();
    let rem = Math.max(0, Math.floor((end - now) / 1000));
    let min = Math.floor(rem / 60);
    let sec = rem % 60;
    
    timerEl.textContent = rem > 0
      ? `⏱️ Time left: ${min}:${sec.toString().padStart(2, '0')}`
      : '⏰ Time\'s up! Redirecting...';
      
    if (rem > 0) {
      setTimeout(updateTimer, 1000);
    } else {
      setTimeout(() => {
        Storage.set({ [TIMER_KEY + domain]: null });
        window.location.href = 'https://www.google.com';
      }, 1500);
    }
  }

  function onGameEnd(result) {
    // When game ends, clear the old game and start a fresh new one
    setTimeout(() => {
      const gameContainer = document.getElementById('xo-game');
      if (gameContainer) {
        // Clear the entire game container (removes old board and message)
        gameContainer.innerHTML = '';
        // Start a completely new game
        renderGame(gameContainer, onGameEnd);
      }
    }, 2500); // 2.5 second delay to show the result, then start fresh game
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'block_with_overlay' && msg.domain) {
    Storage.isWhitelisted(msg.domain).then((whitelisted) => {
      if (!whitelisted) showBlockOverlay(msg.domain);
    });
  }
});

// No need to check for existing timer - background.js will trigger overlay on each visit
