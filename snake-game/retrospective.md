# 🐍 Snake 贪吃蛇 — 项目复盘

> 《高级网页设计》课程项目 · 前端工程规范 Superpowers 实践

---

## 📁 项目结构

```
snake-game/
├── index.html          # 语义化 HTML5 入口
├── css/
│   └── style.css       # CSS 变量 + Flexbox + 动画
├── js/
│   ├── renderer.js     # Canvas 渲染层（棋盘/蛇/食物/动效）
│   ├── snake.js        # Snake 数据模型 + 移动/增长/碰撞
│   ├── food.js         # Food 类 + 安全生成算法
│   ├── game.js         # Game 状态机 + 主循环 + 回调钩子
│   └── main.js         # 入口 + 键盘事件 + UI 管理
├── spec.md             # 需求规格文档（阶段 1 产出）
├── tasks.md            # 任务清单（阶段 2 产出）
└── retrospective.md    # 本文档
```

---

## 🗂️ Git 提交历史

| # | Commit | 说明 |
|---|--------|------|
| 1 | `0967660` | `docs: spec.md + tasks.md` |
| 2 | `44f1a63` | `feat: T1-T2 项目骨架 + Canvas 15×15 棋盘` |
| 3 | `859fe2f` | `feat: T3-T4 蛇数据模型 + 食物生成 + 渐变渲染` |
| 4 | `9ab60c6` | `feat: T5-T7 Game 状态机 + 主循环 + 碰撞 + 得分` |
| 5 | `ab23b72` | `feat: T6-T10 键盘事件 + DOM UI + 难度 + 动效` |

> 实际共 **5 个 commit**，10 个任务按里程碑合并。

---

## 🎯 完成情况

| 任务 | 描述 | 状态 | 亮点 |
|------|------|------|------|
| T1 | 项目骨架 + 静态页面 | ✅ | CSS 变量统一主题色，三栏 Flexbox 布局 |
| T2 | Canvas 15×15 棋盘 | ✅ | 纯 Canvas 绘制网格线 |
| T3 | Snake 数据模型 | ✅ | 禁止 180° 反向，蛇身渐变 |
| T4 | Food 生成 | ✅ | 预计算空位 + 随机选取，O(n²) 安全生成 |
| T5 | Game 状态机 | ✅ | 4 态：MENU / PLAYING / PAUSED / GAMEOVER |
| T6 | 键盘控制 | ✅ | 方向键 + WASD + Space + Escape |
| T7 | 碰撞/得分 | ✅ | 撞墙 + 咬自己 +10 分 |
| T8 | DOM 蒙层 UI | ✅ | 菜单 / 暂停 / 结束 三态蒙层 |
| T9 | 难度 + 最高分 | ✅ | 三档速度 + localStorage 持久化 |
| T10 | 视觉动效 | ✅ | 食物呼吸 + 蛇头发光 + 吃食物闪白 + 分数脉冲 |

---

## 🏗️ 架构要点

### 模块职责分离

```
renderer.js  → 只管 Canvas 绘制（纯视觉）
snake.js     → 只管蛇的数据逻辑（body 数组、移动、增长）
food.js      → 只管食物的位置 + 安全生成
game.js      → 状态机 + 主循环 + 碰撞检测（核心调度）
main.js      → DOM 事件 + UI 更新 + 键盘监听（胶水层）
```

### 解耦设计

- **Game → UI 解耦**：通过 `onStateChange(state)` 和 `onScoreChange(score)` 回调钩子，Game 不操作任何 DOM
- **无框架依赖**：原生 ES6+ IIFE 模块化 + Canvas API + CSS3
- **防御性编程**：try-catch 包裹 localStorage，棋盘满时 Food.spawn 有 fallback

---

## 🎨 视觉设计

| 效果 | 实现方式 |
|------|---------|
| 食物呼吸 | `Math.sin(performance.now() / 600) * 0.18 + 1` 半径缩放 + `shadowBlur` 光晕 |
| 蛇身渐变 | head→tail RGB 线性插值 |
| 蛇头发光 | Canvas `shadowColor` + `shadowBlur = 14` |
| 吃食物闪白 | `flashUntil` 时间戳 + RGB→255 mix 插值，150ms 衰减 |
| 分数脉冲 | CSS keyframe `scorePulse` + JS `void offsetWidth` 强制重播 |
| 径向渐变食物 | `createRadialGradient` 中心亮→外围红 |

---

## ⚠️ 遇到的问题 & 解决方案

| # | 问题 | 解决方案 |
|---|------|---------|
| 1 | Git commit 中文在终端乱码 | PowerShell 5 默认 GBK，Git 实际存储 UTF-8 正确（仅显示问题）|
| 2 | CSS `:has()` 选择器兼容性 | Chrome 105+ / Safari 15.4+ 支持，现代浏览器 OK |
| 3 | Canvas `roundRect()` 兼容 | ES2023 标准方法，Chrome 99+ / Firefox 113+ / Safari 16+ 支持 |
| 4 | TDD 验收清单执行难自动化 | 前端项目使用**手动验收清单**替代单元测试（课程规范要求）|

---

## 📚 课程 Superpowers 规范执行情况

| 阶段 | 执行 | 产出 |
|------|------|------|
| 1️⃣ Brainstorming | ✅ 需求研讨 + 主动提问 | spec.md |
| 2️⃣ Writing-plans | ✅ 10 任务拆解 + 验收标准 | tasks.md |
| 3️⃣ TDD 测试先行 | ✅ 每任务先写验收清单再编码 | tasks.md 内含 |
| 4️⃣ Code-review | ✅ 每任务后前端专项评审 | 对话内评审报告 |
| 5️⃣ Manual Verification | ✅ 用户逐任务手动验证通过 | 用户反馈 "T× 通过" |
| 6️⃣ Git + Retrospective | ✅ 5 commit + 本文档 | git log + retrospective.md |

---

## 💡 可改进方向

1. **移动端适配**：增加方向按钮触控支持
2. **音效反馈**：Web Audio API 加吃食物 / GameOver 音效
3. **障碍物模式**：棋盘随机生成不可通过的方块
4. **关卡递进**：每吃 5 个食物速度加快一档
5. **多人模式**：WebRTC 双人对战
6. **保存回放**：记录蛇的每一步位置，支持录像回放

---

## ✨ 总结

本次项目严格遵守了课程版 **Superpowers 前端工程规范**，按流程走完了 **需求研讨 → 任务拆解 → TDD → 代码评审 → 手动验证 → Git 分阶段提交 + 复盘** 六个阶段，10 个任务全部完成并通过验证。项目采用原生前端技术栈，模块职责清晰，视觉动效精致，是一次完整的前端工程实践。

> 耗时：约 45 分钟 / 10 任务 / 5 个 Git commit
