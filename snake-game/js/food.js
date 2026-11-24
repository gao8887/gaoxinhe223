window.SnakeGame = window.SnakeGame || {};

(function (SG) {
  'use strict';

  class Food {
    constructor(gridSize) {
      this.gridSize = gridSize;
      this.position = { x: 0, y: 0 };
    }

    spawn(snakeBody) {
      const occupied = new Set(
        snakeBody.map(seg => seg.x + ',' + seg.y)
      );

      const emptyCells = [];
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          if (!occupied.has(x + ',' + y)) {
            emptyCells.push({ x, y });
          }
        }
      }

      if (emptyCells.length === 0) {
        console.warn('[Food] 棋盘已满, 无法生成新食物');
        return this.position;
      }

      const pick = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.position = pick;

      console.log('[Food] 食物生成 at', pick.x, pick.y,
        '(剩余空位:', emptyCells.length, ')');
      return this.position;
    }
  }

  SG.Food = Food;
})(window.SnakeGame);
