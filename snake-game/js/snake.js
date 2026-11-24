window.SnakeGame = window.SnakeGame || {};

(function (SG) {
  'use strict';

  const DIRS = {
    UP:    { x: 0,  y: -1 },
    DOWN:  { x: 0,  y: 1 },
    LEFT:  { x: -1, y: 0 },
    RIGHT: { x: 1,  y: 0 },
  };

  const OPPOSITES = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };

  class Snake {
    constructor(gridSize) {
      this.gridSize = gridSize;
      this.reset();
    }

    reset() {
      const mid = Math.floor(this.gridSize / 2);
      this.body = [
        { x: mid,     y: mid },
        { x: mid - 1, y: mid },
        { x: mid - 2, y: mid },
      ];
      this.direction = 'RIGHT';
      this.pendingDirection = null;
      this.growPending = 0;
    }

    get head() {
      return this.body[0];
    }

    get length() {
      return this.body.length;
    }

    setDirection(newDir) {
      if (!DIRS[newDir]) return false;
      if (OPPOSITES[this.direction] === newDir) {
        console.warn('[Snake] 禁止 180° 反向:', this.direction, '→', newDir);
        return false;
      }
      this.pendingDirection = newDir;
      return true;
    }

    move() {
      if (this.pendingDirection) {
        this.direction = this.pendingDirection;
        this.pendingDirection = null;
      }

      const delta = DIRS[this.direction];
      const newHead = {
        x: this.head.x + delta.x,
        y: this.head.y + delta.y,
      };

      this.body.unshift(newHead);

      if (this.growPending > 0) {
        this.growPending--;
      } else {
        this.body.pop();
      }

      return newHead;
    }

    grow(amount) {
      this.growPending += amount;
    }

    isOutOfBounds(head) {
      return head.x < 0 || head.x >= this.gridSize
          || head.y < 0 || head.y >= this.gridSize;
    }

    headCollidesWithBody() {
      const h = this.head;
      for (let i = 1; i < this.body.length; i++) {
        if (this.body[i].x === h.x && this.body[i].y === h.y) {
          return true;
        }
      }
      return false;
    }

    occupies(x, y) {
      return this.body.some(seg => seg.x === x && seg.y === y);
    }
  }

  SG.Snake = Snake;
  SG.DIRS = DIRS;
})(window.SnakeGame);
