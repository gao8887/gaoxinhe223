# AGENTS.md

Static coursework site for 高薪和's《高级网页设计》 class. Plain HTML/CSS/JS: no package manifest, build, lint, or automated tests. `index.html` is the catalog/entrypoint. Verify changes by opening the page in a browser (file:// is sufficient) and checking the console.

## Repo rules (recorded in `gxh_prompt.md`)

- Before acting on a user prompt, append a record to `gxh_prompt.md` (date, model, prompt text). Append only; never rewrite earlier entries.
- Prefix new CSS classes, IDs, and JS variables with `gxh_` (see `pdd.html` / `pdd.css`, `iconfont-3.html` / `iconfont-4.html`). Do not mass-rename existing identifiers, and do not rename anything inside the provided `starter-level*.html` templates; their markup/IDs are meant to match an external target.
- When adding a page, add a catalog card in `index.html` and a link back to `index.html` (existing icon pages use `.gxh_back_home`).
- New pages should be UTF-8 with `lang="zh-CN"`; user-facing copy is Chinese.
- **新建 HTML 文件必须在 `<body>` 顶部和 `<script>` 顶部添加注释**，格式如下：

```html
<!--
=============================================================================
  页面名称：xxx
  功能简介：一句话描述页面核心作用
  作者：高薪和
  建立时间：YYYY-MM-DD
  使用模型：Trae AI（具体模型可填用户指定版本，未指定则写"Trae AI"）
  依赖：data.js / cdn/font-awesome / （列出引用的外部资源，没有则写"无"）
=============================================================================
-->
```

- **JS 部分每个独立函数必须加注释**，说明其功能、参数含义、返回值。推荐格式：

```js
/**
 * 函数功能简述（一句话）
 * 详细说明：可选，描述核心逻辑或注意事项
 * @param {类型} 参数名 - 参数含义
 * @returns {类型} 返回值含义
 * @example 可选的调用示例
 */
function example(params) { ... }
```

- 已有文件如果没有注释，补全时一并加上。注释语言为中文。

## Assets and structure

- Icon libraries are vendored locally. Use local paths, not remote icon CDNs: `cdn/font-awesome/css/all.min.css` (font icons), `cdn/lucide/lucide.min.js` (SVG replacement), `font/font_f7pxn1abi9u/iconfont.css` (custom iconfont).
- Pages are standalone HTML; page-specific CSS is either inline or a sibling file (`stack223.html` + `stack223.css`, `pdd.html` + `pdd.css`).
- Root `node.exe` is a bundled runtime, not a sign of a Node project; there is no npm workflow.

## Student grades exercise

- `data.js` defines `STUDENTS` and `SUBJECTS` and exposes them on `window`. `starter-level1.html` and `starter-level2.html` load it via `<script src="data.js">` and expect those globals.
- No `target.html` is checked in. The reference target is the Netlify URL noted in `gxh_prompt.md`; compare rendered output manually.

## Git

- Remote `origin` is Gitee. The local submit workflow lives in `.trae/skills/submit-project/SKILL.md` (`.trae/` is gitignored). Commits use conventional types plus a Chinese description, e.g. `feat: ...`.
- Do not commit, push, or initialize repositories unless explicitly asked.
