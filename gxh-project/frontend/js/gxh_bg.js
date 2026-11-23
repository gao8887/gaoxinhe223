/**
 * 姓名：gaoxinhe | 学号：24001010223 |
 * 时间：2026-11-19 | 大模型：Trae AI
 */
(function () {
  var gxh_canvas = document.getElementById('gxh_canvas_bg');
  if (!gxh_canvas) return;
  var gxh_ctx = gxh_canvas.getContext('2d');
  var gxh_particles = [];
  var gxh_particle_count = 80;
  var gxh_max_line_dist = 140;
  var gxh_mouse = { x: null, y: null, radius: 160 };

  function gxh_resize() {
    gxh_canvas.width = window.innerWidth;
    gxh_canvas.height = window.innerHeight;
  }
  gxh_resize();
  window.addEventListener('resize', gxh_resize);

  function gxh_particle() {
    this.x = Math.random() * gxh_canvas.width;
    this.y = Math.random() * gxh_canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.size = Math.random() * 2 + 1;
  }

  gxh_particle.prototype.gxh_update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > gxh_canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > gxh_canvas.height) this.vy = -this.vy;

    if (gxh_mouse.x !== null) {
      var gxh_dx = this.x - gxh_mouse.x;
      var gxh_dy = this.y - gxh_mouse.y;
      var gxh_dist = Math.sqrt(gxh_dx * gxh_dx + gxh_dy * gxh_dy);
      if (gxh_dist < gxh_mouse.radius) {
        var gxh_force = (gxh_mouse.radius - gxh_dist) / gxh_mouse.radius;
        this.x += gxh_dx * gxh_force * 0.02;
        this.y += gxh_dy * gxh_force * 0.02;
      }
    }
  };

  gxh_particle.prototype.gxh_draw = function () {
    gxh_ctx.beginPath();
    gxh_ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    gxh_ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
    gxh_ctx.fill();
  };

  for (var gxh_i = 0; gxh_i < gxh_particle_count; gxh_i++) {
    gxh_particles.push(new gxh_particle());
  }

  function gxh_connect() {
    for (var gxh_a = 0; gxh_a < gxh_particles.length; gxh_a++) {
      for (var gxh_b = gxh_a + 1; gxh_b < gxh_particles.length; gxh_b++) {
        var gxh_dx = gxh_particles[gxh_a].x - gxh_particles[gxh_b].x;
        var gxh_dy = gxh_particles[gxh_a].y - gxh_particles[gxh_b].y;
        var gxh_dist = Math.sqrt(gxh_dx * gxh_dx + gxh_dy * gxh_dy);
        if (gxh_dist < gxh_max_line_dist) {
          var gxh_opacity = 1 - gxh_dist / gxh_max_line_dist;
          gxh_ctx.strokeStyle = 'rgba(118, 75, 162, ' + (gxh_opacity * 0.5) + ')';
          gxh_ctx.lineWidth = 1;
          gxh_ctx.beginPath();
          gxh_ctx.moveTo(gxh_particles[gxh_a].x, gxh_particles[gxh_a].y);
          gxh_ctx.lineTo(gxh_particles[gxh_b].x, gxh_particles[gxh_b].y);
          gxh_ctx.stroke();
        }
      }
    }
  }

  function gxh_animate() {
    gxh_ctx.clearRect(0, 0, gxh_canvas.width, gxh_canvas.height);
    for (var gxh_i = 0; gxh_i < gxh_particles.length; gxh_i++) {
      gxh_particles[gxh_i].gxh_update();
      gxh_particles[gxh_i].gxh_draw();
    }
    gxh_connect();
    requestAnimationFrame(gxh_animate);
  }
  gxh_animate();

  document.addEventListener('mousemove', function (gxh_e) {
    gxh_mouse.x = gxh_e.clientX;
    gxh_mouse.y = gxh_e.clientY;
  });
  document.addEventListener('mouseout', function () {
    gxh_mouse.x = null;
    gxh_mouse.y = null;
  });

  fetch('/api/health')
    .then(function (gxh_res) { return gxh_res.json(); })
    .then(function (gxh_data) { console.log('[gxh] 后端状态:', gxh_data); })
    .catch(function (gxh_err) { console.error('[gxh] 后端连接失败:', gxh_err); });
})();
