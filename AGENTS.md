# AGENTS.md

Static coursework site for 高薪和's《高级网页设计》 class. Plain HTML/CSS/JS: no package manifest, build, lint, or automated tests. `index.html` is the catalog/entrypoint. Verify changes by opening the page in a browser (file:// is sufficient) and checking the console.

## Repo rules (recorded in `gxh_prompt.md`)

- Before acting on a user prompt, append a record to `gxh_prompt.md` (date, model, prompt text). Append only; never rewrite earlier entries.
- Prefix new CSS classes, IDs, and JS variables with `gxh_` (see `pdd.html` / `pdd.css`, `iconfont-3.html` / `iconfont-4.html`). Do not mass-rename existing identifiers, and do not rename anything inside the provided `starter-level*.html` templates; their markup/IDs are meant to match an external target.
- When adding a page, add a catalog card in `index.html` and a link back to `index.html` (existing icon pages use `.gxh_back_home`).
- New pages should be UTF-8 with `lang="zh-CN"`; user-facing copy is Chinese.

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
