window.SnakeGame = window.SnakeGame || {};

(function (SG) {
  'use strict';

  const GRID_SIZE = 15;
  const CELL_SIZE = 30;
  const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

  const COLORS = {
    boardBg:    getCssVar('--bg-board'),
    gridLine:   getCssVar('--grid-line'),
    snakeHead:  getCssVar('--snake-head'),
    snakeTail:  getCssVar('--snake-tail'),
    food:       getCssVar('--food'),
    foodRgb:    '255, 107, 107',
  };

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  const Renderer = {
    canvas: null,
    ctx: null,
    flashUntil: 0,

    init(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) {
        console.error('[Renderer] 找不到 Canvas 元素:', canvasId);
        return false;
      }
      this.canvas.width = CANVAS_SIZE;
      this.canvas.height = CANVAS_SIZE;
      this.ctx = this.canvas.getContext('2d');
      return true;
    },

    flashSnake(durationMs) {
      this.flashUntil = performance.now() + durationMs;
    },

    drawBoard() {
      const ctx = this.ctx;
      ctx.fillStyle = COLORS.boardBg;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.strokeStyle = COLORS.gridLine;
      ctx.lineWidth = 1;

      for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * CELL_SIZE;

        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, CANVAS_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(CANVAS_SIZE, pos);
        ctx.stroke();
      }
    },

    drawSnake(body) {
      const ctx = this.ctx;
      const now = performance.now();
      const flashing = now < this.flashUntil;
      const flashProgress = flashing ? (this.flashUntil - now) / 150 : 0;
      const len = body.length;

      for (let i = len - 1; i >= 0; i--) {
        const seg = body[i];
        const isHead = i === 0;
        const ratio = len <= 1 ? 0 : i / (len - 1);

        let r = Math.round(
          parseInt(COLORS.snakeHead.slice(1, 3), 16) * (1 - ratio) +
          parseInt(COLORS.snakeTail.slice(1, 3), 16) * ratio
        );
        let g = Math.round(
          parseInt(COLORS.snakeHead.slice(3, 5), 16) * (1 - ratio) +
          parseInt(COLORS.snakeTail.slice(3, 5), 16) * ratio
        );
        let b = Math.round(
          parseInt(COLORS.snakeHead.slice(5, 7), 16) * (1 - ratio) +
          parseInt(COLORS.snakeTail.slice(5, 7), 16) * ratio
        );

        if (flashing) {
          const mix = flashProgress;
          r = Math.round(r + (255 - r) * mix);
          g = Math.round(g + (255 - g) * mix);
          b = Math.round(b + (255 - b) * mix);
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        if (isHead) {
          ctx.shadowColor = 'rgba(0, 255, 136, 0.6)';
          ctx.shadowBlur = 14;
        } else {
          ctx.shadowBlur = 0;
        }

        const pad = isHead ? 2 : 3;
        const size = CELL_SIZE - pad * 2;

        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL_SIZE + pad,
          seg.y * CELL_SIZE + pad,
          size, size,
          isHead ? 6 : 4
        );
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    },

    drawFood(pos) {
      const ctx = this.ctx;
      const now = performance.now();
      const breathe = Math.sin(now / 600) * 0.18 + 1;

      const cx = pos.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = pos.y * CELL_SIZE + CELL_SIZE / 2;
      const baseRadius = CELL_SIZE / 2 - 4;
      const radius = baseRadius * breathe;

      const glowAlpha = Math.sin(now / 500) * 0.2 + 0.5;
      ctx.shadowColor = `rgba(${COLORS.foodRgb}, ${glowAlpha})`;
      ctx.shadowBlur = 12;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, '#ff9a9a');
      grad.addColorStop(1, COLORS.food);
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    },

    get cellSize() {
      return CELL_SIZE;
    },

    get gridSize() {
      return GRID_SIZE;
    },
  };

  SG.Renderer = Renderer;
  SG.CONSTANTS = { GRID_SIZE, CELL_SIZE, CANVAS_SIZE };
})(window.SnakeGame);
