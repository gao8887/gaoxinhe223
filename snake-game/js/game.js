window.SnakeGame = window.SnakeGame || {};

(function (SG) {
  'use strict';

  const STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER',
  };

  const DIFFICULTY_TICKS = {
    easy:   200,
    normal: 130,
    hard:    70,
  };

  class Game {
    constructor(gridSize) {
      this.gridSize = gridSize;
      this.snake = new SG.Snake(gridSize);
      this.food = new SG.Food(gridSize);
      this.state = STATES.MENU;
      this.tickInterval = DIFFICULTY_TICKS.normal;
      this.tickTimer = null;
      this.score = 0;
      this.onStateChange = null;
      this.onScoreChange = null;

      this.food.spawn(this.snake.body);
    }

    setState(newState) {
      const prev = this.state;
      this.state = newState;
      console.log('[Game] 状态:', newState);
      if (prev !== newState && typeof this.onStateChange === 'function') {
        this.onStateChange(newState, prev);
      }
    }

    start() {
      if (this.state === STATES.GAMEOVER || this.state === STATES.MENU) {
        this.reset();
      }
      this.setState(STATES.PLAYING);
      this._startTimer();
    }

    pause() {
      if (this.state !== STATES.PLAYING) return;
      this._stopTimer();
      this.setState(STATES.PAUSED);
    }

    resume() {
      if (this.state !== STATES.PAUSED) return;
      this.setState(STATES.PLAYING);
      this._startTimer();
    }

    togglePause() {
      if (this.state === STATES.PLAYING) {
        this.pause();
      } else if (this.state === STATES.PAUSED) {
        this.resume();
      }
    }

    gameOver(reason) {
      this._stopTimer();
      this.setState(STATES.GAMEOVER);
      console.warn('[Game] GAMEOVER:', reason);
    }

    restart() {
      this.reset();
      this.start();
    }

    reset() {
      this._stopTimer();
      this.snake.reset();
      this.food.spawn(this.snake.body);
      this.score = 0;
      this.setState(STATES.PAUSED);
      this._render();
    }

    setDifficulty(level) {
      if (!DIFFICULTY_TICKS[level]) {
        console.warn('[Game] 未知难度:', level);
        return;
      }
      this.tickInterval = DIFFICULTY_TICKS[level];
      console.log('[Game] 难度:', level, '→', this.tickInterval + 'ms');
      if (this.state === STATES.PLAYING) {
        this._stopTimer();
        this._startTimer();
      }
    }

    setDirection(dir) {
      if (this.state !== STATES.PLAYING) return;
      this.snake.setDirection(dir);
    }

    getScore() {
      return this.score;
    }

    _startTimer() {
      this._stopTimer();
      this.tickTimer = setInterval(() => this._tick(), this.tickInterval);
    }

    _stopTimer() {
      if (this.tickTimer) {
        clearInterval(this.tickTimer);
        this.tickTimer = null;
      }
    }

    _tick() {
      if (this.state !== STATES.PLAYING) return;

      const newHead = this.snake.move();

      if (this.snake.isOutOfBounds(newHead)) {
        this.gameOver('撞墙');
        this._render();
        return;
      }

      if (this.snake.headCollidesWithBody()) {
        this.gameOver('咬到自己');
        this._render();
        return;
      }

      if (newHead.x === this.food.position.x && newHead.y === this.food.position.y) {
        this.score += 10;
        this.snake.grow(1);
        this.food.spawn(this.snake.body);
        SG.Renderer.flashSnake(150);
        console.log('[Game] +10 分, 当前:', this.score);
        if (typeof this.onScoreChange === 'function') {
          this.onScoreChange(this.score);
        }
      }

      this._render();
    }

    _render() {
      const R = SG.Renderer;
      R.drawBoard();
      R.drawFood(this.food.position);
      R.drawSnake(this.snake.body);
    }
  }

  SG.Game = Game;
  SG.STATES = STATES;
  SG.DIFFICULTY_TICKS = DIFFICULTY_TICKS;
})(window.SnakeGame);
