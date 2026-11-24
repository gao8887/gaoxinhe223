(function () {
  'use strict';

  const SG = window.SnakeGame;
  let game = null;

  const DIFFICULTY_LABELS = {
    easy: '简单',
    normal: '普通',
    hard: '困难',
  };

  const LS_KEY_HIGHSCORE = 'snake_highscore_v1';

  const el = {
    overlayMenu:    document.getElementById('overlay-menu'),
    overlayPaused:  document.getElementById('overlay-paused'),
    overlayOver:    document.getElementById('overlay-gameover'),
    score:          document.getElementById('score'),
    highscore:      document.getElementById('highscore'),
    difficulty:     document.getElementById('difficulty'),
    finalScore:     document.getElementById('final-score'),
    finalHighscore: document.getElementById('final-highscore'),
    btnStart:       document.getElementById('btn-start'),
    btnResume:      document.getElementById('btn-resume'),
    btnRestart:     document.getElementById('btn-restart'),
    difficultyRadios: document.querySelectorAll('input[name="difficulty"]'),
  };

  const KEY_MAP = {
    ArrowUp:    'UP',
    ArrowDown:  'DOWN',
    ArrowLeft:  'LEFT',
    ArrowRight: 'RIGHT',
    w: 'UP',    W: 'UP',
    s: 'DOWN',  S: 'DOWN',
    a: 'LEFT',  A: 'LEFT',
    d: 'RIGHT', D: 'RIGHT',
  };

  function getSelectedDifficulty() {
    const checked = document.querySelector('input[name="difficulty"]:checked');
    return checked ? checked.value : 'normal';
  }

  function showOverlay(name) {
    el.overlayMenu.classList.add('hidden');
    el.overlayPaused.classList.add('hidden');
    el.overlayOver.classList.add('hidden');
    if (name === 'menu')   el.overlayMenu.classList.remove('hidden');
    if (name === 'paused') el.overlayPaused.classList.remove('hidden');
    if (name === 'over')   el.overlayOver.classList.remove('hidden');
  }

  function hideAllOverlays() {
    el.overlayMenu.classList.add('hidden');
    el.overlayPaused.classList.add('hidden');
    el.overlayOver.classList.add('hidden');
  }

  function updateScore(value) {
    el.score.textContent = value;
    el.score.classList.remove('score-value-pulse');
    void el.score.offsetWidth;
    el.score.classList.add('score-value-pulse');
  }

  function updateHighscore(value) {
    el.highscore.textContent = value;
  }

  function updateDifficulty(label) {
    el.difficulty.textContent = label;
  }

  function loadHighscore() {
    try {
      return parseInt(localStorage.getItem(LS_KEY_HIGHSCORE) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function saveHighscore(value) {
    try {
      localStorage.setItem(LS_KEY_HIGHSCORE, String(value));
    } catch (e) { /* ignore */ }
  }

  function handleKeydown(e) {
    if (!game) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (game.state === SG.STATES.MENU) {
        const diff = getSelectedDifficulty();
        game.setDifficulty(diff);
        updateDifficulty(DIFFICULTY_LABELS[diff]);
        game.start();
      } else if (game.state === SG.STATES.GAMEOVER) {
        const diff = getSelectedDifficulty();
        game.setDifficulty(diff);
        updateDifficulty(DIFFICULTY_LABELS[diff]);
        game.restart();
      } else {
        game.togglePause();
      }
      return;
    }

    if (e.key === 'Escape') {
      if (game.state === SG.STATES.PLAYING) {
        game.pause();
      }
      return;
    }

    const dir = KEY_MAP[e.key];
    if (dir) {
      e.preventDefault();
      game.setDirection(dir);
    }
  }

  function init() {
    if (!SG.Renderer.init('game-board')) {
      console.error('[Main] Renderer 初始化失败');
      return;
    }

    game = new SG.Game(SG.CONSTANTS.GRID_SIZE);

    game.onStateChange = function (newState) {
      console.log('[UI] 状态变更:', newState);
      if (newState === SG.STATES.MENU) {
        showOverlay('menu');
      } else if (newState === SG.STATES.PAUSED) {
        showOverlay('paused');
      } else if (newState === SG.STATES.PLAYING) {
        hideAllOverlays();
      } else if (newState === SG.STATES.GAMEOVER) {
        const finalScore = game.getScore();
        el.finalScore.textContent = finalScore;

        const prev = loadHighscore();
        const newHigh = Math.max(prev, finalScore);
        if (newHigh > prev) saveHighscore(newHigh);
        el.finalHighscore.textContent = newHigh;
        updateHighscore(newHigh);
        showOverlay('over');
      }
    };

    game.onScoreChange = function (score) {
      updateScore(score);
    };

    updateScore(0);
    updateHighscore(loadHighscore());
    updateDifficulty(DIFFICULTY_LABELS.normal);

    el.btnStart.addEventListener('click', function () {
      const diff = getSelectedDifficulty();
      game.setDifficulty(diff);
      updateDifficulty(DIFFICULTY_LABELS[diff]);
      game.start();
    });

    el.btnResume.addEventListener('click', function () {
      game.resume();
    });

    el.btnRestart.addEventListener('click', function () {
      const diff = getSelectedDifficulty();
      game.setDifficulty(diff);
      updateDifficulty(DIFFICULTY_LABELS[diff]);
      game.restart();
    });

    document.addEventListener('keydown', handleKeydown);

    game._render();
    showOverlay('menu');

    window.game = game;
    console.log('[Main] T8 初始化完成, 状态:', game.state);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
