/*!
 * dsh-carlotta-theme —— 浏览器半边（browser half）  仅自用
 *
 * 结构：
 *   1. 皮肤表：五套皮肤的调色板、背景、装饰、启动画面文案
 *   2. 令牌层：用官方 ctx.theme.overrideTokens 覆盖全部 --dsw-alias-*（所有窗口都吃这一层）
 *   3. 样式表：背景层、装饰、侧栏徽章、Q 版、输入框、峰谷条跟随
 *   4. 背景层 / 装饰动效 / 侧栏 Q 版（DOM 挂载）
 *   5. 启动画面（跟随最后一次选的皮肤）
 *   6. 设置页（注册到 DSH 设置左栏「珂莱塔主题」）
 *   7. apply：读设置 → 挂令牌 / 样式 / 背景 / 启动画面 / 设置页
 */
window.__ModuleLoader__.load({
	id: "dsh-carlotta-theme",
	factory: (require) => {
		const react = require("react");
		const h = react.createElement;

		const VERSION = "1.0.4";
		const BASE = "/dsh-carlotta-theme";
		const asset = (p) => BASE + "/a/" + p + "?v=" + VERSION;
		const CACHE_KEY = "dsh-carlotta-theme:settings";

		//#region 1. 皮肤表
		const SKINS = {
			night: {
				id: "night", name: "晶棱玫瑰 · 夜宴", scheme: "dark", mark: "crest", decor: "shards",
				c: { bg: "#110c13", l1: "#1d1420", l2: "#261a29", l3: "#312235", ink: "#f4ecf1", ink2: "#c8b6c1", ink3: "#8d7a87",
					acc: "#e2436f", acc2: "#ff7c9e", deep: "#9e1f45", gold: "#d6b679", ice: "#bfe3f5",
					ok: "#7fd3a6", warn: "#e9b35c", err: "#ff5a6a", link: "#ff9ab4", code: "rgba(10,6,12,.55)" },
				bg: { file: "bg/night.webp", size: "cover", pos: "70% 30%" },
				veil: "radial-gradient(ellipse at 40% 60%, rgba(17,12,19,.6), rgba(17,12,19,.25) 60%, rgba(17,12,19,.1)), linear-gradient(0deg, rgba(17,12,19,.6), transparent 45%)",
				sub: "DEEPSEEK · HARNESS",
				boot: { file: "boot/night.webp", layout: "night", k1: "MONTELLI · NOTTE DI GALA", title: "CARLOTTA", cn: "珂莱塔", load: "夜宴即将开始 · · ·", credit: "TNan", pos: "center 30%" },
			},
			day: {
				id: "day", name: "晶棱玫瑰 · 白昼", scheme: "light", mark: "crest", decor: "shards",
				c: { bg: "#f8f4f6", l1: "#fffafc", l2: "#ffffff", l3: "#f3e8ee", ink: "#2a1b25", ink2: "#5d4855", ink3: "#9a8592",
					acc: "#c8285a", acc2: "#e2436f", deep: "#8f1a3d", gold: "#b48f4e", ice: "#9fd2ee",
					ok: "#2f9e6a", warn: "#c27a10", err: "#d93a4a", link: "#c8285a", code: "rgba(250,240,245,.85)" },
				bg: { file: "bg/day.webp", size: "auto 104%", pos: "-6% 0", repeat: "no-repeat" },
				veil: "linear-gradient(90deg, rgba(255,250,252,0) 0, rgba(255,250,252,.08) 40%, rgba(255,250,252,.3) 75%, rgba(255,250,252,.42))",
				sub: "DEEPSEEK · HARNESS",
				boot: { file: "boot/day.webp", layout: "day", k1: "Buongiorno, Signore", title: "Carlotta", cn: "珂莱塔", load: "晴空正好，请稍候 · · ·", credit: "KatoRie", pos: "left center" },
			},
			prism: {
				id: "prism", name: "璀璨", scheme: "dark", mark: "crest", decor: "prism",
				c: { bg: "#0d0f17", l1: "#151926", l2: "#1c2132", l3: "#262c40", ink: "#eef2fb", ink2: "#b4bdd4", ink3: "#7b84a0",
					acc: "#ff4f8b", acc2: "#ff8ab3", deep: "#a8205a", gold: "#9fe3ff", ice: "#d6f6ff",
					ok: "#6fe0b0", warn: "#ffd58a", err: "#ff6b7d", link: "#8fd8ff", code: "rgba(6,8,14,.6)" },
				bg: { file: "bg/prism.webp", size: "cover", pos: "left center" },
				veil: "linear-gradient(90deg, rgba(13,15,23,.7) 0, rgba(13,15,23,.4) 45%, rgba(13,15,23,.1) 80%), linear-gradient(0deg, rgba(13,15,23,.6), transparent 40%)",
				sub: "BRILLANTE · HARNESS",
				boot: { file: "boot/prism.webp", layout: "prism", k1: "Interpretare lo splendore", title: "Carlotta", cn: "珂莱塔", load: "棱光折射中 · · ·", credit: "🐟", pos: "35% center" },
			},
			daily: {
				id: "daily", name: "休憩日", scheme: "light", mark: "clover", decor: "clover",
				c: { bg: "#eff7f8", l1: "#f7fbfb", l2: "#ffffff", l3: "#e5f0f2", ink: "#3a424d", ink2: "#67707c", ink3: "#a0a7b0",
					acc: "#4f9fb3", acc2: "#e48aa5", deep: "#3a8496", gold: "#6fb3c4", ice: "#cdeaf1",
					ok: "#3f9f78", warn: "#c58a2a", err: "#d4566f", link: "#3f8fa3", code: "rgba(244,247,248,.95)" },
				bg: { file: "bg/daily.webp", size: "auto 100%", pos: "right 18%", repeat: "no-repeat", mask: "linear-gradient(90deg, transparent 0, transparent 30%, #000 62%)" },
				veil: "none",
				base: "linear-gradient(100deg, #eef8fa 0%, #e2f2f6 45%, #d9eef3 100%)",
				sub: "a slow afternoon",
				boot: { file: "boot/daily.webp", layout: "daily", k1: "a slow afternoon", title: "Carlotta", cn: "今天也辛苦啦", load: "泡茶中，马上就好", credit: "Qurami", pos: "center" },
			},
			summer: {
				id: "summer", name: "盛夏", scheme: "light", mark: "sun", decor: "summer",
				c: { bg: "#eaf5fb", l1: "#f4fbff", l2: "#ffffff", l3: "#e1f0f8", ink: "#12324a", ink2: "#3d6178", ink3: "#7f9db1",
					acc: "#ff5b72", acc2: "#ff8c93", deep: "#e23a55", gold: "#1d93d6", ice: "#a8e4ff",
					ok: "#1fa77a", warn: "#e08a00", err: "#e23a55", link: "#1d7fc4", code: "rgba(240,249,255,.92)" },
				bg: { file: "bg/summer.webp", size: "auto 100%", pos: "right 12%", repeat: "no-repeat", mask: "linear-gradient(90deg, transparent 0, transparent 38%, #000 70%)" },
				veil: "none",
				base: "linear-gradient(180deg, #bfe6fb 0%, #e6f6fd 55%, #fff7ec 100%)",
				sub: "ESTATE · HARNESS",
				boot: { file: "boot/summer.webp", layout: "summer", k1: "Ciao, Estate!", title: "Carlotta", cn: "珂莱塔", load: "潜入工作区", credit: "時雨しずく", pos: "center 30%" },
			},
		};
		const SKIN_ORDER = ["night", "day", "prism", "daily", "summer"];

		const DEFAULTS = {
			enabled: true,
			skin: "night",
			auto: false,          // 跟随系统明暗
			autoLight: "day",     // 亮色时用哪套
			autoDark: "night",    // 暗色时用哪套
			alpha: 0.72,          // 界面不透明度（越小背景透出越多）
			blur: 0,              // 背景模糊 px
			dim: 0,               // 额外压暗 0..0.7
			decor: true,          // 背景装饰动效
			boot: true,           // 启动画面
			chibi: true,          // 侧栏 Q 版
			brand: true,          // 侧栏徽章 + Carlotta 字样
			pvFollow: true,       // 峰谷条跟随皮肤配色
			chibiPos: null,
			splash: true,         // 用珂莱塔启动画面替换 DSH 自带的「正在启动」页       // Q 版拖动后的位置 {x,y}；null = 停在侧栏右下角
			userBg: {},           // { skinId: "image/png" | "video/mp4" ... }
			lastSkin: "night",    // 最后一次实际使用的皮肤（启动画面用）
		};
		//#endregion

		//#region 小工具
		function hexToRgb(hex) {
			const m = /^#?([0-9a-f]{6})$/i.exec(hex);
			if (!m) return [0, 0, 0];
			const n = parseInt(m[1], 16);
			return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
		}
		const rgba = (hex, a) => { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`; };
		const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
		const SVG_NS = "http://www.w3.org/2000/svg";
		//#endregion

		//#region 2. 令牌层
		/** 一套皮肤 → 全部 --dsw-alias-* 令牌值（单值，不区分明暗）。 */
		function tokensFor(skin, s) {
			const c = skin.c;
			const dark = skin.scheme === "dark";
			const a = clamp(Number.isFinite(Number(s.alpha)) ? Number(s.alpha) : DEFAULTS.alpha, 0, 1);
			const line = dark ? c.ink : c.deep;
			const t = {
				"bg-base": rgba(c.bg, a),
				"bg-layer-1": rgba(c.l1, Math.min(1, a + 0.06)),
				// 弹窗（设置、确认框）、浮动面板、菜单用二三级底色：始终几乎不透明，文字不会叠在背景上
				"bg-layer-2": rgba(c.l2, 0.97),
				"bg-layer-3": rgba(c.l3, 0.97),
				"bg-overlay": rgba(c.l2, 0.97),
				"bg-module-platform": rgba(c.l1, Math.min(1, a + 0.08)),
				"bg-multi-select": rgba(c.acc, 0.14),
				"bg-skeleton": dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
				"bg-document-preview": c.l1,
				"label-document-preview": c.ink2,
				"bg-document-selection": rgba(c.acc, 0.3),
				"bg-mask-1": dark ? "rgba(0,0,0,.55)" : rgba(c.deep, 0.22),
				"bg-mask-2": dark ? "rgba(0,0,0,.3)" : rgba(c.deep, 0.12),
				"bg-mask-3": "rgba(0,0,0,.48)",
				"bg-mask-drop": rgba(c.bg, 0.75),
				"bg-mask-photo": "rgba(0,0,0,.88)",
				"border-l1": rgba(line, dark ? 0.07 : 0.06),
				"border-l2": rgba(line, dark ? 0.13 : 0.11),
				"border-l3": rgba(line, dark ? 0.19 : 0.15),
				"border-l4": rgba(line, dark ? 0.26 : 0.2),
				"border-l2-darkmode-thin": rgba(line, dark ? 0.08 : 0.1),
				"border-inverted": dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,0)",
				"border-inverted2": dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,0)",
				"label-primary": c.ink,
				"label-secondary": c.ink2,
				"label-tertiary": c.ink3,
				"label-caption": c.ink3,
				"label-primary-dimmed": c.l3,
				"label-primary-bluish": c.ink,
				"label-dimmed": rgba(c.ink, 0.32),
				"label-primary-inverted": "#ffffff",
				"label-primary-foreground": "#ffffff",
				"label-shimmer": rgba(c.acc2, 0.55),
				"label-deep-diving": c.acc2,
				"label-deep-diving-shimmer": c.gold,
				"brand-primary": c.acc,
				"brand-primary-invert": "#ffffff",
				"brand-primary-new-colorprimary-new-color": c.acc,
				"brand-text": c.ink,
				"button-primary-fill": c.acc,
				"button-primary-hover": dark ? c.acc2 : c.deep,
				"button-primary-dimmed": rgba(c.acc, 0.2),
				"button-contrast-fill": c.l3,
				"button-elevated-fill": rgba(c.l2, 0.96),
				"button-floating-fill": rgba(c.l2, 0.96),
				"button-floating-hover": c.l3,
				"button-ghost-active-fill": rgba(c.acc, 0.12),
				"button-ghost-active-border": rgba(c.acc, 0.5),
				"button-ghost-active-hover": rgba(c.acc, 0.18),
				"button-info-fill": c.gold,
				"button-info-hover": c.gold,
				"button-tool-bar-fill": rgba(c.bg, 0.6),
				"button-tool-bar-fill-invisible": rgba(c.bg, 0.36),
				"button-tool-bar-hover": rgba(c.bg, 0.78),
				"interactive-bg-hover": rgba(c.acc, dark ? 0.08 : 0.06),
				"interactive-bg-hover-accent": rgba(c.acc, 0.15),
				"interactive-bg-hover-danger": rgba(c.err, 0.12),
				"interactive-bg-hover-solid": c.l3,
				"interactive-bg-active": rgba(c.acc, 0.16),
				"state-business-primary": c.acc,
				"state-business-tertiary": rgba(c.acc, 0.12),
				"state-success-primary": c.ok,
				"state-success-secondary": rgba(c.ok, 0.5),
				"state-success-tertiary": rgba(c.ok, 0.13),
				"state-warn-primary": c.warn,
				"state-warn-secondary": rgba(c.warn, 0.5),
				"state-warn-tertiary": rgba(c.warn, 0.13),
				"state-warn-label": c.warn,
				"state-error-primary": c.err,
				"state-error-secondary": rgba(c.err, 0.5),
				"state-idle-primary": c.ink3,
				"link": c.link,
				"scrollbar-bg-l1": rgba(c.ink, 0.14),
				"scrollbar-bg-l2": rgba(c.ink, 0.2),
				"scrollbar-hover-l1": rgba(c.acc, 0.45),
				"scrollbar-hover-l2": rgba(c.acc, 0.6),
				"menu-icon": c.ink2,
				"menu-group-header-fill": rgba(c.l2, 0.97),
				"switch-thumb": "#ffffff",
				"settings-card-fill": rgba(c.l1, 0.96),
				"settings-card-stroke": rgba(line, dark ? 0.12 : 0.1),
				"markdown-code-block": c.code,
				"markdown-code-block-banner": rgba(c.gold, dark ? 0.12 : 0.1),
				"markdown-inline-code": rgba(c.acc, dark ? 0.14 : 0.08),
				"markdown-citation": c.l3,
				"markdown-tag": c.l3,
				"markdown-placeholder": c.l3,
				"markdown-code-segment-selected": c.l2,
				"markdown-code-segment-unselected": c.l1,
				"code-diff-added": rgba(c.ok, dark ? 0.14 : 0.12),
				"code-diff-deleted": rgba(c.err, dark ? 0.14 : 0.1),
				"file-diff-added-bg": dark ? "#1f3124" : "#e6f4e7",
				"file-diff-added-gutter": dark ? "#132016" : "#edf7ed",
				"file-diff-added-marker": dark ? "#41c977" : "#01a241",
				"file-diff-deleted-bg": dark ? "#3c1f1b" : "#fce6e2",
				"file-diff-deleted-gutter": dark ? "#28130e" : "#fdece9",
				"file-diff-deleted-marker": dark ? "#fa423e" : "#ba2723",
				"onboarding-accent": c.acc,
				"onboarding-card-fill": c.l2,
				"onboarding-checkbox-border": rgba(line, 0.3),
				"onboarding-secondary-fill": c.l3,
			};
			const out = {};
			for (const [k, v] of Object.entries(t)) out["--dsw-alias-" + k] = v;
			out["--dsw-specific-input-major"] = rgba(c.l2, Math.min(1, a + 0.2));
			out["--dsw-specific-sidebar-fill"] = rgba(c.bg, Math.min(1, a + 0.02));
			out["--dsw-menu-surface-fill"] = rgba(c.l2, 0.94);
			return out;
		}

		/** 把亮/暗两套皮肤合成 overrideTokens 需要的 { name: {light, dark} }。 */
		function tokenLayer(lightSkin, darkSkin, s) {
			const L = tokensFor(lightSkin, s);
			const D = tokensFor(darkSkin, s);
			const layer = {};
			for (const k of Object.keys(L)) layer[k] = { light: L[k], dark: D[k] ?? L[k] };
			return layer;
		}
		//#endregion

		//#region 3. 样式表
		function fontFaces(url) {
			url = url || ((f) => asset("fonts/" + f));
			return `
@font-face{font-family:"CL Cormorant";font-style:normal;font-weight:500 700;font-display:swap;src:url(${url("CormorantGaramond-600.woff2")}) format("woff2")}
@font-face{font-family:"CL Cormorant";font-style:italic;font-weight:500;font-display:swap;src:url(${url("CormorantGaramond-500i.woff2")}) format("woff2")}
@font-face{font-family:"CL Caveat";font-style:normal;font-weight:600;font-display:swap;src:url(${url("Caveat-600.woff2")}) format("woff2")}`;
		}

		/** 与皮肤相关的变量（装饰层、Q 版、启动画面都吃这些）。 */
		function skinVars(skin) {
			const c = skin.c;
			return `--cl-bg:${c.bg};--cl-ink:${c.ink};--cl-ink2:${c.ink2};--cl-ink3:${c.ink3};--cl-acc:${c.acc};--cl-acc2:${c.acc2};--cl-deep:${c.deep};--cl-gold:${c.gold};--cl-ice:${c.ice};--cl-l2:${c.l2};--cl-acc-rgb:${hexToRgb(c.acc).join(",")};--cl-gold-rgb:${hexToRgb(c.gold).join(",")}`;
		}

		const BOOT_CSS = `
/* ---------- 启动画面 ---------- */
#cl-boot{position:fixed;inset:0;z-index:2147483000;overflow:hidden;color:#fff;font-family:var(--dsw-font-family,inherit);opacity:1;transition:opacity .7s ease;cursor:pointer}
#cl-boot.out{opacity:0;pointer-events:none}
#cl-boot .art{position:absolute;inset:0;background-size:cover;background-position:center}
#cl-boot .v{position:absolute;inset:0}
#cl-boot .skip{position:absolute;right:40px;top:30px;font-size:12px;letter-spacing:.3em;padding:7px 16px;border-radius:999px;border:1px solid currentColor;opacity:.7}
#cl-boot .cap{position:absolute;font-size:10px;letter-spacing:.25em;opacity:.55}
#cl-boot .box{position:absolute;animation:cl-rise-in 1s cubic-bezier(.2,.7,.2,1) both}
#cl-boot .k1{animation:cl-fade-in 1s .2s both}
#cl-boot h1{margin:0;line-height:1;animation:cl-fade-in 1.1s .35s both}
#cl-boot h2{margin:0;animation:cl-fade-in 1.1s .55s both}
#cl-boot .prog{position:relative;height:1px;margin-top:4px}
#cl-boot .prog i{position:absolute;left:0;top:-1px;height:3px;width:0;animation:cl-prog var(--cl-boot-ms) cubic-bezier(.4,.1,.3,1) forwards}
#cl-boot .prog i::after{content:"";position:absolute;right:-5px;top:-3px;width:9px;height:9px;transform:rotate(45deg);background:#fff}
#cl-boot .load{font-size:12px;letter-spacing:.3em;margin-top:12px;animation:cl-fade-in 1s .8s both}
#cl-boot .zoom{animation:cl-zoom calc(var(--cl-boot-ms) + 1500ms) ease-out both}
@keyframes cl-prog{to{width:100%}}
@keyframes cl-rise-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes cl-fade-in{from{opacity:0;filter:blur(6px)}to{opacity:1;filter:none}}
@keyframes cl-zoom{from{transform:scale(1.08)}to{transform:scale(1)}}
#cl-boot .crest{width:64px;height:64px}
/* 夜宴 */
#cl-boot.l-night{background:#0c080d;color:#f4ecf1}
#cl-boot.l-night .v{background:radial-gradient(ellipse at 45% 40%,transparent 30%,rgba(12,6,10,.75) 80%),linear-gradient(0deg,rgba(12,6,10,.96) 0,rgba(12,6,10,.6) 26%,transparent 50%)}
#cl-boot.l-night .box{left:0;right:0;bottom:8vh;display:flex;flex-direction:column;align-items:center}
#cl-boot.l-night .crest{filter:drop-shadow(0 0 16px rgba(226,67,111,.7))}
#cl-boot.l-night .k1{font-family:var(--cl-latin);font-style:italic;letter-spacing:.6em;color:#d6b679;font-size:14px;margin-top:10px}
#cl-boot.l-night h1{margin-top:4px;font-family:var(--cl-latin);font-weight:600;font-size:min(9vw,82px);letter-spacing:.14em;text-shadow:0 4px 30px rgba(0,0,0,.6)}
#cl-boot.l-night h2{margin:4px 0 18px;font-family:var(--cl-serif);font-weight:500;font-size:20px;letter-spacing:1em;padding-left:1em}
#cl-boot.l-night .prog{width:420px;max-width:70vw;background:rgba(214,182,121,.35)}
#cl-boot.l-night .prog i{background:linear-gradient(90deg,transparent,#d6b679,#fff)}
#cl-boot.l-night .prog i::after{box-shadow:0 0 12px #fff,0 0 22px #e2436f}
#cl-boot.l-night .load{color:#c8b6c1}
#cl-boot.l-night .cap{left:40px;bottom:30px}
/* 白昼 */
#cl-boot.l-day{background:#fdf6f7;color:#5a2a3c}
#cl-boot.l-day .v{background:linear-gradient(270deg,rgba(255,250,251,.95) 0,rgba(255,250,251,.78) 24%,rgba(255,250,251,0) 44%),linear-gradient(0deg,rgba(255,250,251,.55),transparent 25%)}
#cl-boot.l-day .box{right:7vw;top:28vh;display:flex;flex-direction:column;align-items:flex-end;text-align:right}
#cl-boot.l-day .k1{font-family:var(--cl-latin);font-style:italic;letter-spacing:.45em;color:#b48f4e;font-size:15px;margin-top:22px}
#cl-boot.l-day h1{margin-top:4px;font-family:var(--cl-latin);font-weight:600;font-size:min(10vw,92px);letter-spacing:.04em;color:#8f1a3d}
#cl-boot.l-day h2{margin:8px 0 34px;font-family:var(--cl-serif);font-weight:500;font-size:22px;letter-spacing:.7em;margin-right:-.7em}
#cl-boot.l-day .prog{width:300px;background:rgba(180,143,78,.35)}
#cl-boot.l-day .prog i{right:0;left:auto;background:linear-gradient(270deg,transparent,#e2436f,#c8285a)}
#cl-boot.l-day .prog i::after{right:auto;left:-5px;background:#c8285a;box-shadow:0 0 10px rgba(200,40,90,.6)}
#cl-boot.l-day .load{color:#9a7582}
#cl-boot.l-day .cap{right:7vw;bottom:30px}
/* 璀璨 */
#cl-boot.l-prism{background:#0d0f17;color:#eef2fb}
#cl-boot.l-prism .v{background:linear-gradient(270deg,rgba(9,10,20,.88) 0,rgba(9,10,20,.5) 22%,transparent 34%),linear-gradient(0deg,rgba(9,10,20,.45),transparent 18%)}
#cl-boot.l-prism .box{right:6vw;top:26vh;display:flex;flex-direction:column;align-items:flex-end;text-align:right}
#cl-boot.l-prism .crest{filter:drop-shadow(0 0 16px rgba(159,227,255,.7))}
#cl-boot.l-prism .k1{font-family:var(--cl-latin);font-style:italic;letter-spacing:.45em;color:#9fe3ff;font-size:14px;margin-top:20px}
#cl-boot.l-prism h1{margin-top:6px;font-family:var(--cl-latin);font-weight:600;font-size:min(9.5vw,88px);letter-spacing:.08em;background:linear-gradient(100deg,#fff 30%,#ffd6e6 45%,#d7fff2 55%,#cfe8ff 65%,#fff 80%);-webkit-background-clip:text;background-clip:text;color:transparent}
#cl-boot.l-prism h2{margin:6px 0 30px;font-family:var(--cl-serif);font-weight:500;font-size:20px;letter-spacing:.9em;margin-right:-.9em}
#cl-boot.l-prism .prog{width:340px;background:rgba(159,227,255,.3)}
#cl-boot.l-prism .prog i{right:0;left:auto;background:linear-gradient(90deg,#ff8ab3,#ffe28a,#8fffd2,#8fd8ff,#c69bff)}
#cl-boot.l-prism .prog i::after{right:auto;left:-5px;box-shadow:0 0 14px #fff,0 0 26px #9fe3ff}
#cl-boot.l-prism .load{color:#b4bdd4}
#cl-boot.l-prism .skip{left:40px;right:auto}
#cl-boot.l-prism .cap{right:6vw;bottom:30px}
/* 休憩日 */
#cl-boot.l-daily{background:#f6f5f1;color:#3a424d}
#cl-boot.l-daily .art.blur{filter:blur(30px) brightness(1.08) saturate(.8);transform:scale(1.15);opacity:.55}
#cl-boot.l-daily .art.sharp{inset:auto 0;top:50%;height:min(100vh,calc(100vw * .5027));transform:translateY(-50%);background-size:100% 100%;-webkit-mask:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);mask:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent)}
#cl-boot.l-daily .v{background:linear-gradient(90deg,rgba(248,247,242,.95) 0,rgba(248,247,242,.78) 28%,rgba(248,247,242,0) 50%)}
#cl-boot.l-daily .box{left:7.5vw;top:30vh}
#cl-boot.l-daily .k1{font-family:var(--cl-hand);font-size:30px;color:#6fb3c4;display:flex;align-items:center;gap:10px}
#cl-boot.l-daily .k1 svg{width:26px;height:26px;color:#6fb3c4}
#cl-boot.l-daily h1{margin-top:2px;font-family:var(--cl-hand);font-weight:600;font-size:min(12vw,110px);line-height:.95}
#cl-boot.l-daily h2{margin:6px 0 34px;font-weight:400;font-size:17px;letter-spacing:.5em;color:#67707c}
#cl-boot.l-daily .prog{display:none}
#cl-boot.l-daily .dots{display:flex;gap:10px}
#cl-boot.l-daily .dots i{width:9px;height:9px;border-radius:50%;background:#6fb3c4;opacity:.25;animation:cl-dot 1.4s ease-in-out infinite}
#cl-boot.l-daily .dots i:nth-child(2){animation-delay:.15s}#cl-boot.l-daily .dots i:nth-child(3){animation-delay:.3s}#cl-boot.l-daily .dots i:nth-child(4){animation-delay:.45s}#cl-boot.l-daily .dots i:nth-child(5){animation-delay:.6s}
@keyframes cl-dot{0%,100%{opacity:.25;transform:none}40%{opacity:1;transform:translateY(-4px)}}
#cl-boot.l-daily .load{color:#8a929c;letter-spacing:.2em;margin-top:14px}
#cl-boot.l-daily .skip{color:#8a929c}
#cl-boot.l-daily .cap{left:7.5vw;bottom:30px;color:#8a929c}
/* 盛夏 */
#cl-boot.l-summer{background:#5cc8ff;color:#fff}
#cl-boot.l-summer .art.blur{filter:blur(26px) saturate(1.2);transform:scale(1.15)}
#cl-boot.l-summer .art.sharp{left:auto;right:7.5vw;width:min(640px,44vw);background-position:center top;-webkit-mask:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
#cl-boot.l-summer .v{background:linear-gradient(90deg,rgba(25,140,195,.62),rgba(40,170,215,.35) 50%,rgba(40,170,215,.1))}
#cl-boot.l-summer .tag{position:absolute;left:70px;top:58px;display:flex;align-items:center;gap:12px;font-family:var(--cl-latin);font-style:italic;font-size:24px;letter-spacing:.2em;text-shadow:0 2px 10px rgba(0,60,120,.5)}
#cl-boot.l-summer .tag svg{width:30px;height:30px}
#cl-boot.l-summer .tag span{font-family:inherit;font-style:normal;font-size:12px;letter-spacing:.3em;padding:4px 10px;border-radius:999px;background:rgba(255,91,114,.9)}
#cl-boot.l-summer .box{left:70px;top:33vh}
#cl-boot.l-summer h1{font-family:var(--cl-latin);font-weight:600;font-size:min(10vw,104px);line-height:.9;text-shadow:0 6px 30px rgba(0,70,130,.45)}
#cl-boot.l-summer h2{font-family:var(--cl-serif);font-size:22px;letter-spacing:.8em;font-weight:500;margin-top:16px}
#cl-boot.l-summer .prog{display:none}
#cl-boot.l-summer .wave{position:absolute;left:74px;bottom:110px;width:380px;max-width:40vw}
#cl-boot.l-summer .wave .load{margin:0 0 10px;letter-spacing:.2em;text-shadow:0 2px 8px rgba(0,60,120,.6)}
#cl-boot.l-summer .wave div{height:14px;border-radius:999px;background:rgba(255,255,255,.3);overflow:hidden;position:relative}
#cl-boot.l-summer .wave div i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:999px;background:linear-gradient(90deg,#5cc8ff,#1d93d6);animation:cl-prog var(--cl-boot-ms) cubic-bezier(.4,.1,.3,1) forwards}
#cl-boot.l-summer .skip{top:30px;right:40px}
#cl-boot.l-summer .cap{left:74px;bottom:40px}
#cl-boot.l-summer .bub{position:absolute;border-radius:50%;border:1.5px solid rgba(255,255,255,.85);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0 12%,rgba(255,255,255,.08) 40%,rgba(160,220,255,.15));animation:cl-rise 6s linear infinite}

@keyframes cl-rise{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:.9}100%{transform:translate3d(var(--dx),-115vh,0);opacity:.2}}
#cl-boot.handoff,#cl-boot.handoff *{animation:none!important}
#cl-boot.handoff .prog i,#cl-boot.handoff .wave div i{width:100%}
`;

		const BASE_CSS = `
:root{--cl-serif:"Noto Serif SC","Source Han Serif SC","Songti SC","STSong","SimSun",serif;--cl-latin:"CL Cormorant","Cormorant Garamond",Georgia,serif;--cl-hand:"CL Caveat","Segoe Print",cursive}
html[data-cl-on]{background:var(--cl-bg)!important}
html[data-cl-on] body{background:transparent!important}
html[data-cl-on] ::selection{background:rgba(var(--cl-acc-rgb),.28)}

/* ---------- 背景层 ---------- */
#cl-bg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--cl-base,var(--cl-bg))}
#cl-bg .cl-art{position:absolute;inset:-30px;background-repeat:no-repeat;transition:opacity .6s}
#cl-bg video.cl-art{width:calc(100% + 60px);height:calc(100% + 60px);object-fit:cover}
#cl-bg .cl-veil{position:absolute;inset:0}
#cl-bg .cl-dim{position:absolute;inset:0;background:#000}
#cl-bg .cl-decor{position:absolute;inset:0}
html:not([data-cl-on]) #cl-bg{display:none}

/* 装饰：晶片 */
.cl-shard{position:absolute;top:-12vh;width:var(--w);opacity:var(--o);filter:drop-shadow(0 0 6px rgba(255,255,255,.35));animation:cl-fall var(--d) linear var(--delay) infinite}
.cl-shard svg{width:100%;height:auto;display:block;animation:cl-spin calc(var(--d) * .6) ease-in-out infinite alternate}
@keyframes cl-fall{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(var(--dx),125vh,0)}}
@keyframes cl-spin{0%{transform:rotate(var(--r0)) rotateY(0deg)}100%{transform:rotate(var(--r1)) rotateY(160deg)}}
/* 装饰：火花（夜宴） */
.cl-spark{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;box-shadow:0 0 6px 2px rgba(var(--cl-acc-rgb),.8),0 0 14px 4px rgba(var(--cl-gold-rgb),.35);opacity:0;animation:cl-twinkle var(--d) ease-in-out var(--delay) infinite}
@keyframes cl-twinkle{0%,100%{opacity:0;transform:scale(.4)}45%{opacity:.95;transform:scale(1)}60%{opacity:.2}}
/* 装饰：棱镜光带（璀璨） */
.cl-band{position:absolute;height:6px;border-radius:6px;opacity:.38;filter:blur(1.5px);mix-blend-mode:screen;background:linear-gradient(90deg,transparent,#ff6b9a 18%,#ffe27a 38%,#7affc8 58%,#7ac8ff 78%,#c08cff 92%,transparent);animation:cl-drift var(--d) ease-in-out var(--delay) infinite alternate}
@keyframes cl-drift{0%{transform:translate3d(-6vw,0,0) rotate(var(--r0));opacity:.15}50%{opacity:.45}100%{transform:translate3d(6vw,2vh,0) rotate(var(--r1));opacity:.2}}
/* 装饰：四叶草（休憩日） */
.cl-clover{position:absolute;top:-8vh;color:var(--cl-gold);opacity:var(--o);animation:cl-fall var(--d) linear var(--delay) infinite}
.cl-clover svg{display:block;width:var(--w);height:var(--w);animation:cl-sway 4.5s ease-in-out infinite alternate}
@keyframes cl-sway{0%{transform:rotate(-25deg) translateX(-8px)}100%{transform:rotate(25deg) translateX(8px)}}
/* 装饰：气泡 + 光斑（盛夏） */
.cl-bubble{position:absolute;bottom:-6vh;border-radius:50%;border:1.5px solid rgba(255,255,255,.85);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0 12%,rgba(255,255,255,.08) 40%,rgba(160,220,255,.15));animation:cl-rise var(--d) linear var(--delay) infinite}
@keyframes cl-rise{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:.9}100%{transform:translate3d(var(--dx),-115vh,0);opacity:.2}}
.cl-dapple{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,255,240,.8),rgba(255,255,240,0) 70%);mix-blend-mode:screen;animation:cl-dapple var(--d) ease-in-out var(--delay) infinite alternate}
@keyframes cl-dapple{0%{opacity:.15;transform:scale(.85) translate3d(0,0,0)}100%{opacity:.7;transform:scale(1.15) translate3d(2vw,1vh,0)}}
@media (prefers-reduced-motion: reduce){#cl-bg .cl-decor *{animation:none!important}}

/* ---------- 侧栏徽章 + 名字（插槽组件） ---------- */
@keyframes cl-rot{to{transform:rotate(360deg)}}
@keyframes cl-sheen{0%{background-position:200% 50%}100%{background-position:-200% 50%}}
@keyframes cl-breath{0%,100%{transform:scale(1);filter:drop-shadow(0 0 4px rgba(var(--cl-acc-rgb),.45))}50%{transform:scale(1.06);filter:drop-shadow(0 0 10px rgba(var(--cl-acc-rgb),.75))}}
@keyframes cl-twk{0%,100%{opacity:.15;transform:scale(.5) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
.cl-mark-wrap{position:relative;display:inline-grid;place-items:center}
.cl-mark-wrap .cl-halo{position:absolute;inset:0;color:var(--cl-gold);animation:cl-rot 16s linear infinite;pointer-events:none}
.cl-mark-wrap .cl-core{position:relative;display:block;animation:cl-breath 3.6s ease-in-out infinite}
.cl-mark-wrap .cl-star{position:absolute;width:7px;height:7px;color:var(--cl-gold);animation:cl-twk 2.8s ease-in-out infinite;pointer-events:none}
.cl-mark-wrap .cl-star svg{width:100%;height:100%;display:block}
.cl-brand{display:inline-flex;align-items:center;gap:7px;height:24px;white-space:nowrap}
.cl-brand-word{font-family:var(--cl-brand-font,var(--cl-latin));font-weight:600;font-size:var(--cl-brand-size,21px);letter-spacing:.05em;line-height:24px;background:var(--cl-title-grad);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:cl-sheen 7s linear infinite;filter:drop-shadow(0 1px 6px rgba(var(--cl-acc-rgb),.25))}
.cl-brand-tag{display:inline-flex;align-items:center;gap:3px;height:17px;padding:0 7px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--cl-gold);border:1px solid rgba(var(--cl-gold-rgb),.65);background:rgba(var(--cl-gold-rgb),.1)}
.cl-brand-tag::before{content:"";width:5px;height:5px;transform:rotate(45deg);background:currentColor}

/* ---------- 首页中间标题 ---------- */
html[data-cl-on] [class*="_titleGroup"]{position:relative;overflow:visible}
html[data-cl-on] [class*="_titleGroup"] > span:first-child{font-family:var(--cl-title-font,var(--cl-serif));font-weight:700;letter-spacing:.14em;background:var(--cl-title-grad);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:cl-sheen 8s linear infinite;filter:drop-shadow(0 2px 10px rgba(var(--cl-acc-rgb),.35))}
html[data-cl-on] [class*="_titleGroup"]::before{content:var(--cl-eyebrow);position:absolute;left:-60px;right:-60px;bottom:calc(100% + 6px);text-align:center;font-family:var(--cl-eyebrow-font,var(--cl-latin));font-style:italic;font-size:var(--cl-eyebrow-size,14px);letter-spacing:.32em;color:var(--cl-gold);white-space:nowrap;pointer-events:none;text-shadow:0 1px 8px rgba(var(--cl-gold-rgb),.35)}
html[data-cl-on] [class*="_titleGroup"]::after{content:"";position:absolute;left:-24px;right:-24px;top:calc(100% + 8px);height:12px;background:var(--cl-orn) center/100% 100% no-repeat;pointer-events:none;opacity:.95}
html[data-cl-on] [class*="_previewBadge"]{position:relative;background:linear-gradient(var(--cl-badge-bg),var(--cl-badge-bg)) padding-box,var(--cl-title-grad) border-box!important;border:1px solid transparent!important;color:var(--cl-gold)!important;font-weight:600!important;letter-spacing:.1em}
html[data-cl-on] [class*="_previewBadge"]::before{content:"✦ ";color:var(--cl-acc2)}
.cl-hero-mark{margin:-8px 4px -8px -6px}

/* ---------- 新会话按钮 / 输入卡片 / 发送按钮 ---------- */
html[data-cl-on] [data-slot="sidebar"] button[class*="_newSession"]{background:var(--cl-newbtn)!important;color:var(--cl-newbtn-ink)!important;border-color:transparent!important;box-shadow:var(--cl-newbtn-shadow)!important}
html[data-cl-on] [data-slot="sidebar"] button[class*="_newSession"] *{color:inherit!important}
html[data-cl-on] [data-composer-card]{box-shadow:0 18px 44px -20px rgba(0,0,0,.45),0 0 0 1px rgba(var(--cl-gold-rgb),.22)!important;backdrop-filter:blur(18px) saturate(1.3)}
html[data-cl-on] [data-composer-card]::before{content:"";position:absolute;left:24px;right:24px;top:-1px;height:1px;background:var(--cl-hairline);pointer-events:none;z-index:2}
html[data-cl-on] [data-composer-card] [class*="_primary"]{box-shadow:0 0 0 3px rgba(var(--cl-acc-rgb),.16),0 6px 14px -4px rgba(var(--cl-acc-rgb),.6)}

/* 峰谷条跟随皮肤（dsh-peak-valley） */
html[data-cl-pv] body{--pv-c-valley:var(--cl-pv-valley);--pv-c-peak:var(--cl-pv-peak)}
html[data-cl-dark] .pv-bar,html[data-cl-dark] .pv-bar *{color:#f6eef3!important}
html[data-cl-dark] .pv-phase{color:var(--cl-acc2)!important}

/* ---------- 侧栏 Q 版 ---------- */
#cl-chibi{position:fixed;left:0;top:0;width:92px;z-index:2147482000;cursor:pointer;touch-action:none;user-select:none;-webkit-user-drag:none;-webkit-app-region:no-drag;transform:rotate(4deg);filter:drop-shadow(0 6px 10px rgba(0,0,0,.3));transition:transform .25s}
#cl-chibi:hover{transform:rotate(-3deg) translateY(-4px)}
#cl-chibi.dragging{cursor:grabbing;transition:none;transform:scale(1.06) rotate(-4deg)}
#cl-chibi.cl-hop{animation:cl-hop .6s cubic-bezier(.3,1.6,.5,1)}
@keyframes cl-hop{0%{transform:rotate(4deg)}40%{transform:translateY(-16px) rotate(-8deg) scale(1.06)}100%{transform:rotate(4deg)}}
#cl-chibi-say{position:fixed;left:0;top:0;width:220px;box-sizing:border-box;z-index:2147482001;-webkit-app-region:no-drag;padding:10px 12px 9px;border-radius:12px 12px 4px 12px;font-size:12px;line-height:1.5;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);box-shadow:0 12px 28px -12px rgba(0,0,0,.45);opacity:0;transform:translateY(8px) scale(.97);transform-origin:right bottom;transition:.25s;pointer-events:none}
#cl-chibi-say::before{content:"";position:absolute;left:14px;right:14px;top:-1px;height:1px;background:var(--cl-hairline)}
#cl-chibi-say.on{opacity:1;transform:none;pointer-events:auto}
#cl-chibi-say .q{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:2px 0}
#cl-chibi-say .q span{color:var(--dsw-alias-label-tertiary);font-size:11.5px}
#cl-chibi-say .q b{font-family:var(--cl-latin);font-size:19px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--cl-acc);letter-spacing:.02em}
#cl-chibi-say .q b small{font-family:inherit;font-size:12px;margin-right:2px;opacity:.8}
#cl-chibi-say .q.used b{color:var(--cl-gold);font-size:16px}
#cl-chibi-say .note{font-size:10.5px;color:var(--dsw-alias-label-tertiary);margin-top:2px}
#cl-chibi-say .line{margin-top:6px;padding-top:6px;border-top:.5px dashed var(--dsw-alias-border-l3);color:var(--dsw-alias-label-secondary)}
#cl-chibi-say .err{color:var(--dsw-alias-label-secondary)}
#cl-chibi-say .ld{display:inline-block;width:10px;height:10px;border-radius:50%;border:2px solid rgba(var(--cl-acc-rgb),.25);border-top-color:var(--cl-acc);animation:cl-spin2 .8s linear infinite;vertical-align:-1px;margin-right:6px}
@keyframes cl-spin2{to{transform:rotate(360deg)}}

`+BOOT_CSS+`
/* ---------- 设置页 ---------- */
.cl-set{display:flex;flex-direction:column;gap:18px;padding:4px 0 24px;font-size:13px;color:var(--dsw-alias-label-primary);position:relative}
.cl-set .cl-hd{display:flex;align-items:flex-end;gap:12px}
.cl-set .cl-hd b{font-family:var(--cl-serif);font-size:20px;letter-spacing:.12em}
.cl-set .cl-hd i{font-family:var(--cl-latin);font-style:italic;color:var(--cl-gold);font-size:15px;letter-spacing:.2em}
.cl-set .cl-blk{display:flex;flex-direction:column;gap:10px}
.cl-set .cl-h{font-size:13px;font-weight:600;line-height:20px;display:flex;align-items:center;gap:8px}
.cl-set .cl-h::before{content:"";width:6px;height:6px;transform:rotate(45deg);border:1px solid var(--cl-gold)}
.cl-set .cl-hint{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.cl-set .cl-skins{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px}
.cl-set .cl-sk{border-radius:12px;overflow:hidden;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);cursor:pointer;padding:0;text-align:left;color:inherit;font:inherit;transition:transform .15s}
.cl-set .cl-sk:hover{transform:translateY(-2px)}
.cl-set .cl-sk[data-on="true"]{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.cl-set .cl-sk .im{height:70px;background-size:cover;background-position:center 20%}
.cl-set .cl-sk .nm{padding:7px 9px 2px;font-weight:600;font-size:12px}
.cl-set .cl-sk .dots{display:flex;gap:4px;padding:0 9px 9px}
.cl-set .cl-sk .dots i{width:12px;height:12px;border-radius:4px;border:1px solid rgba(0,0,0,.12)}
.cl-set .cl-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}
.cl-set .cl-row:last-child{border-bottom:0}
.cl-set .cl-row .l{flex:1;min-width:0}
.cl-set .cl-row .l b{display:block;font-weight:500}
.cl-set .cl-row .l small{display:block;color:var(--dsw-alias-label-tertiary);font-size:12px;margin-top:2px}
.cl-set .cl-tg{width:38px;height:22px;border-radius:999px;border:0;background:var(--dsw-alias-border-l4);position:relative;cursor:pointer;flex:none;padding:0}
.cl-set .cl-tg::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .18s}
.cl-set .cl-tg[data-on="true"]{background:var(--dsw-alias-state-business-primary)}
.cl-set .cl-tg[data-on="true"]::after{left:19px}
.cl-set input[type=range]{width:180px;accent-color:var(--dsw-alias-state-business-primary)}
.cl-set .cl-val{width:42px;text-align:right;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.cl-set select{height:30px;padding:0 8px;border-radius:8px;border:.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit}
.cl-set .cl-btn{height:30px;padding:0 12px;border-radius:8px;border:.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}
.cl-set .cl-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.cl-set .cl-btn.p{background:var(--dsw-alias-state-business-primary);color:#fff;border-color:transparent}
.cl-set .cl-thumb{width:72px;height:44px;border-radius:7px;background-size:cover;background-position:center;border:1px solid var(--dsw-alias-border-l2);flex:none}
.cl-set .cl-err{color:var(--dsw-alias-state-error-primary);font-size:12px}
.cl-set .cl-full{position:absolute;right:-24px;bottom:-24px;width:260px;opacity:.9;pointer-events:none;-webkit-mask:linear-gradient(90deg,transparent,#000 30%);mask:linear-gradient(90deg,transparent,#000 30%)}
.cl-set .cl-card{border-radius:14px;border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-settings-card-fill,var(--dsw-alias-bg-layer-1));padding:4px 16px;position:relative;z-index:1}
`;

		const CREST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 120 120"><defs><linearGradient id="pa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fae"/><stop offset="1" stop-color="#c8204f"/></linearGradient><linearGradient id="pb" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2416e"/><stop offset="1" stop-color="#7d1233"/></linearGradient><linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3dcaa"/><stop offset=".5" stop-color="#c9a464"/><stop offset="1" stop-color="#8f6a35"/></linearGradient><linearGradient id="ic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9fd2ee"/></linearGradient><g id="p"><path d="M0 0 L-9 -20 L0 -34 Z" fill="url(#pa)"/><path d="M0 0 L9 -20 L0 -34 Z" fill="url(#pb)"/></g><g id="q"><path d="M0 0 L-7 -13 L0 -22 Z" fill="url(#pb)"/><path d="M0 0 L7 -13 L0 -22 Z" fill="url(#pa)"/></g></defs><path d="M0 -56 L56 0 L0 56 L-56 0 Z" fill="none" stroke="url(#gd)" stroke-width="1.6"/><path d="M0 -49 L49 0 L0 49 L-49 0 Z" fill="none" stroke="url(#gd)" stroke-width=".7" opacity=".7"/><path d="M0 -60 L3 -52 L0 -46 L-3 -52 Z M0 60 L3 52 L0 46 L-3 52 Z M60 0 L52 3 L46 0 L52 -3 Z M-60 0 L-52 3 L-46 0 L-52 -3 Z" fill="url(#ic)"/><use href="#p"/><use href="#p" transform="rotate(45)"/><use href="#p" transform="rotate(90)"/><use href="#p" transform="rotate(135)"/><use href="#p" transform="rotate(180)"/><use href="#p" transform="rotate(225)"/><use href="#p" transform="rotate(270)"/><use href="#p" transform="rotate(315)"/><g transform="rotate(22.5)"><use href="#q"/><use href="#q" transform="rotate(72)"/><use href="#q" transform="rotate(144)"/><use href="#q" transform="rotate(216)"/><use href="#q" transform="rotate(288)"/></g><path d="M0 -7 L6 0 L0 7 L-6 0 Z" fill="url(#ic)" stroke="#fff" stroke-width=".5"/></svg>`;
		const cloverSvg = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 40 40"><g fill="${color}">${[0, 90, 180, 270].map((r) => `<path transform="rotate(${r})" d="M0 -1 C-2 -6 -10 -8 -10 -13 C-10 -17 -5 -19 0 -14 C5 -19 10 -17 10 -13 C10 -8 2 -6 0 -1Z"/>`).join("")}</g><circle r="2.2" fill="#fff"/></svg>`;
		const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 40 40"><g stroke="#ff8c5a" stroke-width="2.2" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((r) => `<line transform="rotate(${r})" x1="0" y1="-12" x2="0" y2="-17"/>`).join("")}</g><circle r="8.5" fill="#ffb347"/><path d="M-6 3 q3 -3 6 0 t6 0" stroke="#1d93d6" stroke-width="2" fill="none"/></svg>`;
		const SHARD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 90"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#cfeaf8"/><stop offset="1" stop-color="#ffb3c8"/></linearGradient></defs><path d="M20 0 L40 34 L22 90 L0 40 Z" fill="url(#sg)" fill-opacity=".55" stroke="#fff" stroke-opacity=".8" stroke-width=".8"/><path d="M20 0 L22 90 L0 40 Z" fill="#fff" fill-opacity=".25"/></svg>`;
		const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
		const markSvg = (skin) => skin.mark === "clover" ? cloverSvg(skin.c.gold) : skin.mark === "sun" ? SUN_SVG : CREST_SVG;

		/** 随皮肤变化的那部分样式。 */
		function skinCss(skin) {
			const c = skin.c;
			const dark = skin.scheme === "dark";
			const newbtn = skin.id === "daily"
				? { bg: "#ffffff", ink: c.ink, sh: "0 2px 8px -4px rgba(60,80,100,.3), inset 0 0 0 1px rgba(60,80,100,.15)" }
				: skin.id === "summer"
					? { bg: "linear-gradient(120deg,#ffb36b,#ff5b72 55%,#ff4f8b)", ink: "#fff", sh: "0 6px 18px -6px rgba(255,91,114,.6), inset 0 1px 0 rgba(255,255,255,.35)" }
					: skin.id === "prism"
						? { bg: "linear-gradient(120deg,#ff8ab3,#ff4f8b 40%,#7a5cff 100%)", ink: "#fff", sh: "0 6px 18px -6px rgba(255,79,139,.6), inset 0 1px 0 rgba(255,255,255,.35)" }
						: { bg: `linear-gradient(135deg,${c.acc2},${c.acc} 45%,${c.deep})`, ink: "#fff", sh: `0 6px 18px -6px ${rgba(c.acc, 0.6)}, inset 0 1px 0 rgba(255,255,255,.35)` };
			const hair = skin.id === "prism"
				? "linear-gradient(90deg,transparent,#ff8ab3,#ffe28a,#8fffd2,#8fd8ff,#c69bff,transparent)"
				: skin.id === "summer" ? "linear-gradient(90deg,transparent,#5cc8ff,#fff,#5cc8ff,transparent)"
					: skin.id === "daily" ? "transparent"
						: `linear-gradient(90deg,transparent,${c.gold},transparent)`;
			const pv = skin.id === "daily" ? ["#cfe9ef", "#f6d3dd"] : skin.id === "summer" ? ["#bfe5fb", "#ffc9cf"] : dark
				? [rgba(c.acc, 0.38), rgba(c.err, 0.5)] : [rgba(c.acc, 0.22), rgba(c.err, 0.28)];
			const T = {
				night: ["linear-gradient(100deg,#fff 0%,#ffd0dc 22%,#e9c98c 40%,#ffffff 50%,#e9c98c 60%,#ffd0dc 78%,#fff 100%)", "Benvenuto, Signore", "夜宴"],
				day: ["linear-gradient(100deg,#8f1a3d 0%,#c8285a 22%,#b48f4e 40%,#e2436f 50%,#b48f4e 60%,#c8285a 78%,#8f1a3d 100%)", "Buongiorno, Signore", "白昼"],
				prism: ["linear-gradient(100deg,#ffffff 0%,#ffb3cf 18%,#ffe8a3 34%,#b9ffe4 50%,#b3e0ff 66%,#dcc2ff 82%,#ffffff 100%)", "Interpretare lo splendore", "璀璨"],
				daily: ["linear-gradient(100deg,#3a8496 0%,#4f9fb3 25%,#e48aa5 45%,#6fb3c4 60%,#3a8496 100%)", "a slow afternoon ~", "休憩日"],
				summer: ["linear-gradient(100deg,#1d7fc4 0%,#28a8ea 25%,#ff7a8a 45%,#ffb36b 55%,#28a8ea 75%,#1d7fc4 100%)", "Ciao, Estate!", "盛夏"],
			}[skin.id];
			const orn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 12" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${c.gold}" stop-opacity="0"/><stop offset=".35" stop-color="${c.gold}"/><stop offset=".5" stop-color="${c.acc2}"/><stop offset=".65" stop-color="${c.gold}"/><stop offset="1" stop-color="${c.gold}" stop-opacity="0"/></linearGradient></defs><path d="M0 6 H132 M168 6 H300" stroke="url(#g)" stroke-width="1"/><path d="M150 1 L156 6 L150 11 L144 6 Z" fill="${c.acc2}"/><path d="M137 6 L140 3.5 L143 6 L140 8.5 Z M157 6 L160 3.5 L163 6 L160 8.5 Z" fill="${c.gold}"/></svg>`;
			return `:root{${skinVars(skin)};--cl-title-grad:${T[0]};--cl-eyebrow:"— ${T[1]} —";--cl-orn:${svgUrl(orn)};--cl-badge-bg:${rgba(c.l2, 0.9)};${skin.id === "daily" ? "--cl-eyebrow-font:var(--cl-hand);--cl-eyebrow-size:20px;" : ""}--cl-mark:${svgUrl(markSvg(skin))};--cl-sub:"${skin.sub}";--cl-newbtn:${newbtn.bg};--cl-newbtn-ink:${newbtn.ink};--cl-newbtn-shadow:${newbtn.sh};--cl-hairline:${hair};--cl-pv-valley:${pv[0]};--cl-pv-peak:${pv[1]};${skin.base ? `--cl-base:${skin.base};` : ""}${skin.id === "daily" ? "--cl-brand-font:var(--cl-hand);--cl-brand-size:25px;--cl-title-font:inherit;" : ""}}`;
		}

		function makeStyle(id) {
			let tag = document.querySelector(`style[data-cl="${id}"]`);
			if (!tag) {
				tag = document.createElement("style");
				tag.dataset.cl = id;
				document.head.appendChild(tag);
			}
			return tag;
		}
		//#endregion

		//#region 4. 背景层 / 装饰 / Q 版
		const rand = (a, b) => a + Math.random() * (b - a);

		function buildDecor(kind, host) {
			host.textContent = "";
			const add = (cls, style, html) => {
				const el = document.createElement("span");
				el.className = cls;
				el.setAttribute("style", style);
				if (html) el.innerHTML = html;
				host.appendChild(el);
			};
			if (kind === "shards" || kind === "prism") {
				for (let i = 0; i < 14; i++) {
					const d = rand(26, 48);
					add("cl-shard", `left:${rand(0, 100)}vw;--w:${rand(10, 26)}px;--o:${rand(0.35, 0.75)};--d:${d}s;--delay:${-rand(0, d)}s;--dx:${rand(-12, 12)}vw;--r0:${rand(-40, 40)}deg;--r1:${rand(80, 260)}deg`, SHARD_SVG);
				}
			}
			if (kind === "shards") {
				for (let i = 0; i < 18; i++) add("cl-spark", `left:${rand(5, 95)}vw;top:${rand(5, 70)}vh;--d:${rand(3, 7)}s;--delay:${-rand(0, 7)}s`);
			}
			if (kind === "prism") {
				for (let i = 0; i < 5; i++) add("cl-band", `left:${rand(5, 70)}vw;top:${rand(5, 90)}vh;width:${rand(14, 30)}vw;--d:${rand(12, 22)}s;--delay:${-rand(0, 20)}s;--r0:${rand(-25, -5)}deg;--r1:${rand(5, 25)}deg`);
			}
			if (kind === "clover") {
				for (let i = 0; i < 10; i++) {
					const d = rand(30, 55);
					add("cl-clover", `left:${rand(0, 100)}vw;--w:${rand(12, 24)}px;--o:${rand(0.2, 0.45)};--d:${d}s;--delay:${-rand(0, d)}s;--dx:${rand(-8, 8)}vw`, cloverSvg("currentColor"));
				}
			}
			if (kind === "summer") {
				for (let i = 0; i < 7; i++) add("cl-dapple", `left:${rand(0, 70)}vw;top:${rand(0, 80)}vh;width:${rand(90, 200)}px;height:${rand(70, 160)}px;--d:${rand(5, 9)}s;--delay:${-rand(0, 9)}s`);
				for (let i = 0; i < 14; i++) {
					const d = rand(14, 30), w = rand(8, 26);
					add("cl-bubble", `left:${rand(0, 100)}vw;width:${w}px;height:${w}px;--d:${d}s;--delay:${-rand(0, d)}s;--dx:${rand(-6, 6)}vw`);
				}
			}
		}

		function ensureBgLayer() {
			let el = document.getElementById("cl-bg");
			if (!el) {
				el = document.createElement("div");
				el.id = "cl-bg";
				el.setAttribute("aria-hidden", "true");
				el.innerHTML = `<div class="cl-art"></div><div class="cl-veil"></div><div class="cl-decor"></div><div class="cl-dim"></div>`;
				document.body.prepend(el);
			}
			return el;
		}

		let bgKey = "";
		function renderBg(skin, s) {
			const el = ensureBgLayer();
			const custom = s.userBg && s.userBg[skin.id];
			const key = [skin.id, custom || "", s.decor, s.blur, s.dim, s.userBgRev || 0].join("|");
			const veil = el.querySelector(".cl-veil");
			const dim = el.querySelector(".cl-dim");
			veil.style.background = skin.veil;
			dim.style.opacity = String(clamp(Number(s.dim) || 0, 0, 0.7));
			if (key === bgKey) return;
			bgKey = key;
			// 画面
			const old = el.querySelector(".cl-art");
			let art;
			if (custom && /^video\//.test(custom)) {
				art = document.createElement("video");
				art.className = "cl-art";
				art.src = BASE + "/userbg?skin=" + skin.id + "&r=" + (s.userBgRev || 0);
				art.muted = true; art.loop = true; art.autoplay = true; art.playsInline = true;
			} else {
				art = document.createElement("div");
				art.className = "cl-art";
				if (custom) {
					art.style.backgroundImage = `url("${BASE}/userbg?skin=${skin.id}&r=${s.userBgRev || 0}")`;
					art.style.backgroundSize = "cover";
					art.style.backgroundPosition = "center";
				} else {
					art.style.backgroundImage = `url("${asset(skin.bg.file)}")`;
					art.style.backgroundSize = skin.bg.size;
					art.style.backgroundPosition = skin.bg.pos;
					if (skin.bg.mask) { art.style.webkitMaskImage = skin.bg.mask; art.style.maskImage = skin.bg.mask; }
				}
			}
			const blur = clamp(Number(s.blur) || 0, 0, 30);
			if (blur > 0) art.style.filter = `blur(${blur}px)`;
			old.replaceWith(art);
			if (art.tagName === "VIDEO") art.play().catch(() => {});
			// 装饰
			const decor = el.querySelector(".cl-decor");
			if (s.decor) buildDecor(skin.decor, decor);
			else decor.textContent = "";
		}

		function removeBg() {
			document.getElementById("cl-bg")?.remove();
			bgKey = "";
		}

		const CHIBI_LINES = ["今天也要优雅地写代码哦。", "红茶已经备好了~", "需要我帮忙吗？", "这个 bug，交给我。", "休息一下也没关系。", "Montelli 家从不失手。"];
		let chibiTimer = 0;
		let quotaReq = 0;

		const money = (v, cur) => {
			const sym = cur === "USD" ? "$" : "¥";
			return `<small>${sym}</small>${Number(v).toFixed(2)}`;
		};
		const QUOTA_ERR = {
			NO_KEY: "没找到 DeepSeek 的 API Key，也没登录 DeepSeek 账号，查不到余额。",
			HTTP_401: "API Key 好像失效了，查不到余额。",
			NETWORK: "网络不太顺，等会儿再点我一下？",
		};

		/** 点 Q 版：先弹出卡片（读取中），拿到余额和今日已用后填进去，8 秒后自动收起。 */
		async function showQuota(say) {
			const id = ++quotaReq;
			const line = CHIBI_LINES[Math.floor(Math.random() * CHIBI_LINES.length)];
			say.innerHTML = `<div class="err"><span class="ld"></span>正在帮你查账本…</div>`;
			say.classList.add("on");
			placeSay();
			window.clearTimeout(chibiTimer);
			let q = null;
			try {
				const r = await fetch(BASE + "/quota", { cache: "no-store" });
				q = r.ok ? await r.json() : null;
			} catch { q = null; }
			if (id !== quotaReq) return;
			if (q && q.ok) {
				let note = "";
				if (q.since) {
					const d = new Date(q.since);
					note = `<div class="note">今日已用从 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} 开始记账</div>`;
				}
				if (q.available === false) note += `<div class="note">余额不足，DeepSeek 暂时停用了 API</div>`;
				say.innerHTML = `<div class="q"><span>剩余额度</span><b>${money(q.balance, q.currency)}</b></div>`
					+ `<div class="q used"><span>今日已用</span><b>${money(q.todayUsed, q.currency)}</b></div>${note}`
					+ `<div class="line">${line}</div>`;
			} else {
				const code = q && q.code;
				say.innerHTML = `<div class="err">${QUOTA_ERR[code] || "这次没查到余额，等会儿再试试。"}</div><div class="line">${line}</div>`;
			}
			placeSay();
			chibiTimer = window.setTimeout(() => say.classList.remove("on"), 8000);
		}
		/**
		 * Q 版：固定悬浮在页面最上层（不会被别的按钮挡住）。
		 * 默认停在侧栏右下角、「设置」那一行上面；拖动后记住位置。
		 * 侧栏收起且没拖动过时隐藏。
		 */
		const CHIBI_W = 92;
		function sidebarRect() {
			const side = document.querySelector("[data-dsh-sidebar-root]");
			if (!side || side.getAttribute("data-dsh-sidebar-wide") === "false") return null;
			const r = side.getBoundingClientRect();
			return r.width > 120 ? r : null;
		}
		function placeChibi() {
			const img = document.getElementById("cl-chibi");
			if (!img) return;
			const pos = store.get().chibiPos;
			const h = img.offsetHeight || CHIBI_W;
			let x, y;
			if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
				x = pos.x; y = pos.y;
				img.style.display = "";
			} else {
				const r = sidebarRect();
				if (!r) { img.style.display = "none"; hideSay(); return; }
				img.style.display = "";
				x = r.right - CHIBI_W - 10;
				y = r.bottom - h - 50;
			}
			x = clamp(x, 0, window.innerWidth - CHIBI_W);
			y = clamp(y, 0, window.innerHeight - h);
			img.style.left = x + "px";
			img.style.top = y + "px";
			placeSay();
		}
		function placeSay() {
			const img = document.getElementById("cl-chibi");
			const say = document.getElementById("cl-chibi-say");
			if (!img || !say) return;
			const r = img.getBoundingClientRect();
			const w = say.offsetWidth || 220;
			const sh = say.offsetHeight || 120;
			let left = clamp(r.right - w, 8, window.innerWidth - w - 8);
			let top = r.top - sh - 8;
			if (top < 8) top = Math.min(window.innerHeight - sh - 8, r.bottom + 8);
			say.style.left = left + "px";
			say.style.top = top + "px";
		}
		function hideSay() {
			document.getElementById("cl-chibi-say")?.classList.remove("on");
			window.clearTimeout(chibiTimer);
		}
		function ensureChibi(on) {
			let img = document.getElementById("cl-chibi");
			let say = document.getElementById("cl-chibi-say");
			if (!on || !document.body) { img?.remove(); say?.remove(); return; }
			if (img) { placeChibi(); return; }
			img = document.createElement("img");
			img.id = "cl-chibi";
			img.alt = "";
			img.draggable = false;
			img.title = "点我看余额；按住可以拖动";
			// 仓库不带 Q 版图（版权原因）；没放图时退回皮肤徽章，照样能点出余额卡片
			img.onerror = () => { img.onerror = null; img.src = "data:image/svg+xml," + encodeURIComponent(CREST_SVG); img.style.width = "56px"; placeChibi(); };
			img.onload = placeChibi;
			img.src = asset("img/chibi.png");
			say = document.createElement("div");
			say.id = "cl-chibi-say";
			// 按住拖动，移动不到 5 像素算点击
			let drag = null;
			img.addEventListener("pointerdown", (e) => {
				if (e.button !== 0) return;
				const r = img.getBoundingClientRect();
				drag = { sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, moved: false };
				img.setPointerCapture(e.pointerId);
			});
			img.addEventListener("pointermove", (e) => {
				if (!drag) return;
				const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
				if (!drag.moved && Math.hypot(dx, dy) < 5) return;
				drag.moved = true;
				img.classList.add("dragging");
				img.style.left = clamp(drag.ox + dx, 0, window.innerWidth - img.offsetWidth) + "px";
				img.style.top = clamp(drag.oy + dy, 0, window.innerHeight - img.offsetHeight) + "px";
				placeSay();
			});
			const end = () => {
				if (!drag) return;
				const d = drag;
				drag = null;
				img.classList.remove("dragging");
				if (d.moved) {
					store.set({ chibiPos: { x: parseFloat(img.style.left), y: parseFloat(img.style.top) } });
					return;
				}
				img.classList.remove("cl-hop");
				void img.offsetWidth;
				img.classList.add("cl-hop");
				// 再点一次就收起
				if (say.classList.contains("on")) { hideSay(); return; }
				showQuota(say);
			};
			img.addEventListener("pointerup", end);
			img.addEventListener("pointercancel", () => { drag = null; img.classList.remove("dragging"); });
			img.addEventListener("dblclick", () => { store.set({ chibiPos: null }); });
			say.addEventListener("click", hideSay);
			document.body.appendChild(say);
			document.body.appendChild(img);
			placeChibi();
		}
		//#endregion

		//#region 5. 启动画面
		const BOOT_MS = 2600;
		/** 启动画面的内部结构。img = 图片地址；splash = 用在 DSH 自带启动页里（不显示跳过）。 */
		function bootInner(skin, img, splash) {
			const b = skin.boot;
			const skip = splash ? "" : `<div class="skip">${b.layout === "daily" ? "跳过" : "ESC 跳过"}</div>`;
			const crest = `<span class="crest">${CREST_SVG}</span>`;
			let inner;
			if (b.layout === "daily") {
				inner = `<div class="art blur" style="background-image:url('${img}')"></div><div class="art sharp" style="background-image:url('${img}')"></div><div class="v"></div>${skip}
					<div class="box"><div class="k1">${cloverSvg("currentColor")} ${b.k1}</div><h1>${b.title}</h1><h2>${b.cn}</h2><div class="dots"><i></i><i></i><i></i><i></i><i></i></div><div class="load">${b.load}</div></div>`;
			} else if (b.layout === "summer") {
				let bubbles = "";
				for (let i = 0; i < 9; i++) { const w = rand(10, 26); bubbles += `<span class="bub" style="left:${rand(2, 60).toFixed(1)}vw;bottom:-5vh;width:${w.toFixed(0)}px;height:${w.toFixed(0)}px;animation-delay:${(-rand(0, 6)).toFixed(1)}s;--dx:${rand(-4, 4).toFixed(1)}vw"></span>`; }
				inner = `<div class="art blur" style="background-image:url('${img}');background-position:${b.pos}"></div><div class="v"></div><div class="art sharp" style="background-image:url('${img}')"></div>${bubbles}
					<div class="tag">${SUN_SVG} ${b.k1} <span>夏日限定</span></div>${skip}
					<div class="box"><h1>${b.title}</h1><h2>${b.cn}</h2></div>
					<div class="wave"><div class="load">${b.load}</div><div><i></i></div></div>`;
			} else {
				inner = `<div class="art zoom" style="background-image:url('${img}');background-position:${b.pos}"></div><div class="v"></div>${skip}
					<div class="box">${crest}<div class="k1">${b.k1}</div><h1>${b.title}</h1><h2>${b.cn}</h2><div class="prog"><i></i></div><div class="load">${b.load}</div></div>`;
			}
			return inner + `<div class="cap">ILLUST · ${b.credit}</div>`;
		}

		/** 给 DSH 自带启动页用的整页内容（宿主会把 __DIR__ 换成本机文件路径）。 */
		function splashPayload(skin) {
			const css = fontFaces((f) => "__DIR__/fonts/" + f) + "\n" + BASE_CSS.slice(0, BASE_CSS.indexOf("html[data-cl-on]{")) + BOOT_CSS + `
html,body{margin:0;height:100%;overflow:hidden;background:${skin.boot.layout === "daily" ? "#f6f5f1" : skin.boot.layout === "day" ? "#fdf6f7" : skin.boot.layout === "summer" ? "#5cc8ff" : "#0c080d"}}
body>main{display:none!important}
#cl-boot.splash{cursor:default;transition:none}
#cl-boot.splash .prog i,#cl-boot.splash .wave div i{animation:cl-splash-prog 30s cubic-bezier(.08,.7,.2,1) forwards}
@keyframes cl-splash-prog{0%{width:0}100%{width:94%}}`;
			const html = `<div id="cl-boot" class="l-${skin.boot.layout} splash" style="--cl-boot-ms:${BOOT_MS}ms">${bootInner(skin, "__DIR__/boot.webp", true)}</div>`;
			return { skin: skin.id, css, html };
		}

		/**
		 * 在界面里放启动画面。
		 * handoff = DSH 启动页已经播过同一张图：直接显示最终画面再淡出，和启动页无缝衔接。
		 */
		function mountBoot(skin, opts) {
			const handoff = !!(opts && opts.handoff);
			document.getElementById("cl-boot")?.remove();
			const el = document.createElement("div");
			el.id = "cl-boot";
			el.className = "l-" + skin.boot.layout + (handoff ? " handoff" : "");
			el.style.setProperty("--cl-boot-ms", BOOT_MS + "ms");
			const img = asset(skin.boot.file);
			el.innerHTML = bootInner(skin, img, false);
			let closed = false;
			const close = () => {
				if (closed) return;
				closed = true;
				window.removeEventListener("keydown", onKey, true);
				el.classList.add("out");
				window.setTimeout(() => { el.remove(); opts?.onDone?.(); }, 720);
			};
			const onKey = (e) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); close(); } };
			el.addEventListener("click", close);
			window.addEventListener("keydown", onKey, true);
			// 图片加载好再开始计时，避免空白闪一下；最多等 1.2 秒
			let started = false;
			const start = () => { if (started) return; started = true; window.setTimeout(close, handoff ? 700 : BOOT_MS + 600); };
			const pre = new Image();
			pre.onload = start; pre.onerror = start; pre.src = img;
			window.setTimeout(start, 1200);
			(document.body || document.documentElement).appendChild(el);
			return close;
		}
		//#endregion

		//#region 设置存储
		function loadCache() {
			try { const raw = window.localStorage.getItem(CACHE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
		}
		function saveCache(s) {
			try { window.localStorage.setItem(CACHE_KEY, JSON.stringify(s)); } catch {}
		}
		function normalize(raw) {
			const s = { ...DEFAULTS, ...(raw && typeof raw === "object" ? raw : {}) };
			for (const k of ["skin", "autoLight", "autoDark", "lastSkin"]) if (!SKINS[s[k]]) s[k] = DEFAULTS[k];
			if (!s.userBg || typeof s.userBg !== "object") s.userBg = {};
			return s;
		}

		const store = (() => {
			let value = normalize(loadCache());
			const listeners = new Set();
			let saveTimer = 0;
			const persist = () => {
				window.clearTimeout(saveTimer);
				saveTimer = window.setTimeout(() => {
					fetch(BASE + "/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(value) }).catch(() => {});
				}, 300);
			};
			return {
				get: () => value,
				subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
				set(patch, opts) {
					value = normalize({ ...value, ...patch });
					saveCache(value);
					if (!opts || opts.persist !== false) persist();
					for (const fn of listeners) fn();
				},
				async load() {
					try {
						const r = await fetch(BASE + "/settings", { cache: "no-store" });
						if (r.ok) {
							const j = await r.json();
							if (j && j.settings && Object.keys(j.settings).length) this.set(j.settings, { persist: false });
						}
					} catch {}
					return value;
				},
			};
		})();
		const useStore = () => react.useSyncExternalStore(store.subscribe, store.get, store.get);

		// ---- DSH 自带启动页替换（宿主改写 resources/splash.html，改前备份） ----
		const splashState = { supported: false, patched: false, error: "", loaded: false };
		const splashListeners = new Set();
		const emitSplash = () => { for (const fn of splashListeners) fn(); };
		async function refreshSplash() {
			try {
				const r = await fetch(BASE + "/splash", { cache: "no-store" });
				const j = await r.json();
				Object.assign(splashState, { supported: !!j.supported, patched: !!j.patched, error: j.error || "", loaded: true });
			} catch { Object.assign(splashState, { loaded: true }); }
			emitSplash();
		}
		let lastSplashKey = "";
		/** 皮肤或开关变了就把新的启动页内容交给宿主；同一状态只发一次。 */
		function pushSplash(skin, s) {
			const on = !!(skin && s.enabled && s.boot && s.splash);
			const key = on ? skin.id + "|" + VERSION : "off";
			if (key === lastSplashKey || !splashState.loaded) return;
			lastSplashKey = key;
			const body = on ? { enabled: true, ...splashPayload(skin) } : { enabled: false };
			fetch(BASE + "/splash", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
				.then((r) => r.json()).then((j) => { Object.assign(splashState, { patched: !!j.patched, error: j.error || "" }); emitSplash(); })
				.catch(() => {});
		}
		const useSplash = () => {
			const [, bump] = react.useReducer((n) => n + 1, 0);
			react.useEffect(() => { splashListeners.add(bump); return () => splashListeners.delete(bump); }, []);
			return splashState;
		};
		//#endregion

		//#region 6. 设置页
		function Toggle({ on, onChange }) {
			return h("button", { type: "button", className: "cl-tg", "data-on": String(!!on), onClick: () => onChange(!on), "aria-pressed": !!on });
		}
		function Row({ title, hint, children }) {
			return h("div", { className: "cl-row" }, h("div", { className: "l" }, h("b", null, title), hint ? h("small", null, hint) : null), children);
		}
		function Slider({ value, min, max, step, fmt, onChange }) {
			return h(react.Fragment, null,
				h("input", { type: "range", min, max, step, value, onChange: (e) => onChange(Number(e.target.value)) }),
				h("span", { className: "cl-val" }, fmt(value)));
		}

		function SplashRow({ s, set }) {
			const st = useSplash();
			const hint = !st.loaded ? "检查中…"
				: !st.supported ? "没找到 DSH 安装目录里的启动页，无法替换" + (st.error ? "（" + st.error + "）" : "")
					: st.error ? "替换失败：" + st.error
						: s.splash && st.patched ? "已替换：打开 DSH 的「正在启动」页面直接显示珂莱塔，进入界面后不再重复播放；关闭开关会还原原版"
							: "DSH 自带的「正在启动」页面换成珂莱塔启动画面（会先备份原文件，DSH 更新后自动重新替换）";
			return h(Row, { title: "替换 DSH 自带启动页", hint }, h(Toggle, { on: s.splash, onChange: (v) => set({ splash: v }) }));
		}

		function SettingsSection(props) {
			const s = useStore();
			const [msg, setMsg] = react.useState("");
			const fileRef = react.useRef(null);
			const current = SKINS[activeSkinId(s, props.getScheme())];
			const set = (patch) => store.set(patch);

			const upload = async (file) => {
				if (!file) return;
				setMsg("上传中…");
				try {
					const r = await fetch(BASE + "/userbg?skin=" + current.id, { method: "POST", headers: { "content-type": file.type || "application/octet-stream" }, body: file });
					const j = await r.json().catch(() => ({}));
					if (!r.ok || !j.ok) { setMsg(j.code === "TYPE" ? "只支持 png / jpg / webp / gif / mp4 / webm" : j.code === "SIZE" ? "文件太大（上限 150MB）" : "上传失败"); return; }
					set({ userBg: { ...s.userBg, [current.id]: j.type }, userBgRev: Date.now() });
					setMsg("");
				} catch { setMsg("上传失败"); }
			};
			const resetBg = async () => {
				try { await fetch(BASE + "/userbg?skin=" + current.id, { method: "DELETE" }); } catch {}
				const next = { ...s.userBg };
				delete next[current.id];
				set({ userBg: next, userBgRev: Date.now() });
			};
			const custom = s.userBg[current.id];
			const thumb = custom ? (/^video\//.test(custom) ? null : `${BASE}/userbg?skin=${current.id}&r=${s.userBgRev || 0}`) : asset(current.bg.file);

			const skinCards = SKIN_ORDER.map((id) => {
				const k = SKINS[id];
				return h("button", {
					key: id, type: "button", className: "cl-sk",
					"data-on": String(!s.auto && s.skin === id || s.auto && current.id === id),
					onClick: () => set({ skin: id, auto: false }),
				},
					h("div", { className: "im", style: { backgroundImage: `url("${asset(k.bg.file)}")` } }),
					h("div", { className: "nm" }, k.name),
					h("div", { className: "dots" }, h("i", { style: { background: k.c.bg } }), h("i", { style: { background: k.c.acc } }), h("i", { style: { background: k.c.gold } })));
			});
			const lightOpts = SKIN_ORDER.filter((id) => SKINS[id].scheme === "light");
			const darkOpts = SKIN_ORDER.filter((id) => SKINS[id].scheme === "dark");

			return h("div", { className: "cl-set" },
				h("div", { className: "cl-hd" }, h("b", null, "珂莱塔主题"), h("i", null, "Carlotta · Crystal Rose")),
				h("div", { className: "cl-card" },
					h(Row, { title: "主题总开关", hint: "关闭后完全回到 DSH 原生样式，不用重启" }, h(Toggle, { on: s.enabled, onChange: (v) => set({ enabled: v }) }))),
				h("div", { className: "cl-blk" },
					h("div", { className: "cl-h" }, "皮肤"),
					h("div", { className: "cl-hint" }, "点一下立即生效；启动画面跟随你最后一次使用的皮肤。"),
					h("div", { className: "cl-skins" }, skinCards)),
				h("div", { className: "cl-card" },
					h(Row, { title: "跟随系统明暗自动切换", hint: "开启后，按 DSH「外观」或系统明暗在下面两套之间切换" }, h(Toggle, { on: s.auto, onChange: (v) => set({ auto: v }) })),
					s.auto ? h(Row, { title: "亮色时", hint: null },
						h("select", { value: s.autoLight, onChange: (e) => set({ autoLight: e.target.value }) }, lightOpts.map((id) => h("option", { key: id, value: id }, SKINS[id].name)))) : null,
					s.auto ? h(Row, { title: "暗色时", hint: null },
						h("select", { value: s.autoDark, onChange: (e) => set({ autoDark: e.target.value }) }, darkOpts.map((id) => h("option", { key: id, value: id }, SKINS[id].name)))) : null),
				h("div", { className: "cl-blk" }, h("div", { className: "cl-h" }, "背景 · " + current.name)),
				h("div", { className: "cl-card" },
					h(Row, { title: "背景图", hint: custom ? "正在使用你自己的背景" : "默认插画；可换成自己的图片 / GIF / 视频（只影响当前皮肤）" },
						thumb ? h("div", { className: "cl-thumb", style: { backgroundImage: `url("${thumb}")` } }) : h("div", { className: "cl-thumb" }),
						h("button", { type: "button", className: "cl-btn", onClick: () => fileRef.current?.click() }, "换一张"),
						custom ? h("button", { type: "button", className: "cl-btn", onClick: resetBg }, "恢复默认") : null,
						h("input", { ref: fileRef, type: "file", accept: "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm", style: { display: "none" }, onChange: (e) => { upload(e.target.files && e.target.files[0]); e.target.value = ""; } })),
					msg ? h("div", { className: "cl-err" }, msg) : null,
					h(Row, { title: "界面不透明度", hint: "越低，背景透出越多" }, h(Slider, { value: s.alpha, min: 0, max: 1, step: 0.01, fmt: (v) => Math.round(v * 100) + "%", onChange: (v) => set({ alpha: v }) })),
					h(Row, { title: "背景模糊" }, h(Slider, { value: s.blur, min: 0, max: 30, step: 1, fmt: (v) => v + "px", onChange: (v) => set({ blur: v }) })),
					h(Row, { title: "背景压暗" }, h(Slider, { value: s.dim, min: 0, max: 0.7, step: 0.01, fmt: (v) => Math.round(v * 100) + "%", onChange: (v) => set({ dim: v }) }))),
				h("div", { className: "cl-blk" }, h("div", { className: "cl-h" }, "动效与装饰")),
				h("div", { className: "cl-card" },
					h(Row, { title: "背景装饰动效", hint: "晶片飘落 / 棱镜光带 / 四叶草 / 光斑与气泡，随皮肤变化" }, h(Toggle, { on: s.decor, onChange: (v) => set({ decor: v }) })),
					h(SplashRow, { s, set }),
					h(Row, { title: "启动画面", hint: "打开 DSH 时播放一次，点击或 ESC 跳过" },
						h("button", { type: "button", className: "cl-btn", onClick: () => props.previewBoot() }, "预览"),
						h(Toggle, { on: s.boot, onChange: (v) => set({ boot: v }) })),
					h(Row, { title: "侧栏 Q 版珂莱塔", hint: "点她会告诉你 DeepSeek 剩余额度和今日已用" }, h(Toggle, { on: s.chibi, onChange: (v) => set({ chibi: v }) })),
					h(Row, { title: "侧栏徽章与名字", hint: "左上角换成皮肤徽章和 Carlotta 字样" }, h(Toggle, { on: s.brand, onChange: (v) => set({ brand: v }) })),
					h(Row, { title: "峰谷条跟随皮肤配色", hint: "需要已安装「峰谷状态显示器」" }, h(Toggle, { on: s.pvFollow, onChange: (v) => set({ pvFollow: v }) }))),
				h("img", { className: "cl-full", src: asset("img/fullbody.webp"), alt: "", onError: (e) => { e.currentTarget.style.display = "none"; } }));
		}
		//#endregion

		//#region 7. 主流程
		/** 当前应使用的皮肤 id。scheme = DSH 当前解析出的明暗。 */
		function activeSkinId(s, scheme) {
			if (s.auto) return scheme === "dark" ? s.autoDark : s.autoLight;
			return s.skin;
		}

		function apply(ctx) {
			const theme = ctx.theme;
			const html = document.documentElement;
			const baseStyle = makeStyle("base");
			baseStyle.textContent = fontFaces() + BASE_CSS;
			const skinStyle = makeStyle("skin");

			const getScheme = () => {
				try { return theme.getTheme().active.colorScheme === "dark" ? "dark" : "light"; } catch { return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
			};

			// ---- 官方插槽：侧栏徽章 / 侧栏名字 / 中间标题的鲸鱼图标 ----
			// 开着主题才注册；关掉就注销，DSH 自动回到原来的鲸鱼和名字。
			const useSkin = () => { const s = useStore(); return SKINS[activeSkinId(s, getScheme())]; };
			const markSrc = (skin) => "data:image/svg+xml," + encodeURIComponent(markSvg(skin));
			const SKIN_TAG = { night: "夜宴", day: "白昼", prism: "璀璨", daily: "休憩日", summer: "盛夏" };
			const STAR = '<svg viewBox="-10 -10 20 20"><path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill="currentColor"/></svg>';
			/** 徽章 + 旋转光环 + 闪烁小星。z = 徽章本身大小 */
			function MarkWithHalo(skin, z, extraClass, stars, ringSize) {
				const ring = ringSize || Math.round(z * 1.55);
				const halo = h("svg", { className: "cl-halo", viewBox: "-50 -50 100 100", width: ring, height: ring, "aria-hidden": "true" },
					h("circle", { r: 46, fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeDasharray: "2 5", opacity: 0.85 }),
					h("circle", { r: 40, fill: "none", stroke: "currentColor", strokeWidth: 0.6, opacity: 0.5 }),
					[0, 90, 180, 270].map((r) => h("path", { key: r, d: "M0 -50 L3 -46 L0 -42 L-3 -46 Z", fill: "currentColor", transform: `rotate(${r})` })));
				const starEls = stars ? [[-0.15, 0.05, 0], [1.02, 0.1, 0.9], [0.9, 0.95, 1.7], [-0.1, 0.85, 2.3]].map(([x, y, d], i) =>
					h("span", { key: i, className: "cl-star", style: { left: x * ring + "px", top: y * ring + "px", animationDelay: d + "s" }, dangerouslySetInnerHTML: { __html: STAR } })) : null;
				return h("span", { className: "cl-mark-wrap" + (extraClass ? " " + extraClass : ""), style: { width: ring + "px", height: ring + "px" } },
					halo,
					h("img", { className: "cl-core", src: markSrc(skin), width: z, height: z, alt: "" }),
					starEls);
			}
			function BrandMark(p) {
				const skin = useSkin();
				const z = (p && p.size) || 24;
				return h("span", { style: { display: "inline-grid", placeItems: "center", width: z + 4, height: z + 4, overflow: "visible" } }, MarkWithHalo(skin, z - 6, "", false, z + 2));
			}
			function BrandName() {
				const skin = useSkin();
				return h("span", { className: "cl-brand" }, h("span", { className: "cl-brand-word" }, "Carlotta"), h("span", { className: "cl-brand-tag" }, SKIN_TAG[skin.id]));
			}
			function HeroMark(p) {
				const skin = useSkin();
				const z = ((p && p.size) || 34) + 6;
				return MarkWithHalo(skin, z, "cl-hero-mark", true);
			}
			function dynSlot(name, order, Comp) {
				const st = { ready: false, want: false, dispose: null };
				const refresh = () => {
					const on = st.ready && st.want;
					if (on && !st.dispose) {
						try {
							// 单插槽里官方品牌组件占着优先级 0；数字越小越优先显示，用 -100 盖过它
							const d = ctx.slots.register({ name, id: "carlotta-" + name, order, priority: -100 }, Comp);
							st.dispose = typeof d === "function" ? d : () => {};
						} catch { st.dispose = null; }
					} else if (!on && st.dispose) {
						try { st.dispose(); } catch {}
						st.dispose = null;
					}
				};
				try {
					ctx.slots.inject(name, () => {
						st.ready = true; refresh();
						return () => { try { st.dispose?.(); } catch {} st.dispose = null; st.ready = false; };
					}, "carlotta-theme: " + name);
				} catch {}
				return (want) => { st.want = want; refresh(); };
			}
			const setMark = dynSlot("sidebar.brand.mark", 10, BrandMark);
			const setName = dynSlot("sidebar.brand.name", 10, BrandName);
			const setHeroSlot = dynSlot("conversation.hero.brand.mark", 10, HeroMark);
			const setBrandSlots = (on) => { setMark(on); setName(on); };

			let tokenDispose = null;
			let lastTokenKey = "";
			let appliedSkin = "";
			let observer = null;
			let chibiRaf = 0;

			const sync = () => {
				const s = store.get();
				if (!s.enabled) {
					tokenDispose?.(); tokenDispose = null; lastTokenKey = "";
					html.removeAttribute("data-cl-on"); html.removeAttribute("data-cl-dark"); setBrandSlots(false); setHeroSlot(false); html.removeAttribute("data-cl-pv");
					skinStyle.textContent = "";
					removeBg(); ensureChibi(false);
					pushSplash(null, s);
					return;
				}
				const scheme = getScheme();
				const skin = SKINS[activeSkinId(s, scheme)];
				// 单选皮肤、且刚换了皮肤时，让 DSH 的明暗跟皮肤一致（代码高亮等非令牌部分才会对）。
				// 只在切换皮肤那一刻做一次，之后用户自己改「外观」不会被抢回来。
				if (!s.auto && appliedSkin !== skin.id && typeof theme.setTheme === "function") {
					try { if (scheme !== skin.scheme) theme.setTheme(skin.scheme); } catch {}
				}
				const lightSkin = s.auto ? SKINS[s.autoLight] : skin;
				const darkSkin = s.auto ? SKINS[s.autoDark] : skin;
				const tokenKey = [lightSkin.id, darkSkin.id, s.alpha].join("|");
				if (tokenKey !== lastTokenKey && typeof theme.overrideTokens === "function") {
					lastTokenKey = tokenKey;
					tokenDispose = theme.overrideTokens("dsh-carlotta-theme", tokenLayer(lightSkin, darkSkin, s));
				}
				html.setAttribute("data-cl-on", skin.id);
				html.toggleAttribute("data-cl-dark", skin.scheme === "dark");
				setBrandSlots(!!s.brand);
				setHeroSlot(true);
				html.toggleAttribute("data-cl-pv", !!s.pvFollow);
				if (appliedSkin !== skin.id) skinStyle.textContent = skinCss(skin);
				appliedSkin = skin.id;
				if (document.body) renderBg(skin, s);
				ensureChibi(!!s.chibi);
				if (s.lastSkin !== skin.id) store.set({ lastSkin: skin.id });
				pushSplash(skin, s);
			};

			ctx.effect(() => {
				const off = store.subscribe(sync);
				// DSH 明暗变化（外观设置 / 系统）
				let offTheme = null;
				try { offTheme = ctx.on("theme/change", () => { if (store.get().auto) sync(); }); } catch {}
				// 侧栏可能晚于插件渲染、也可能被重建：盯着结构变化补挂 Q 版
				observer = new MutationObserver(() => {
					if (chibiRaf) return;
					chibiRaf = window.requestAnimationFrame(() => {
						chibiRaf = 0;
						const s = store.get();
						if (s.enabled) {
							ensureChibi(!!s.chibi);
							if (!document.getElementById("cl-bg") && document.body) { bgKey = ""; sync(); }
						}
					});
				});
				const onResize = () => placeChibi();
				window.addEventListener("resize", onResize);
				const startObserve = () => { observer.observe(document.body, { childList: true, subtree: true }); bgKey = ""; sync(); };
				if (document.body) startObserve();
				else document.addEventListener("DOMContentLoaded", startObserve, { once: true });
				return () => {
					document.removeEventListener("DOMContentLoaded", startObserve);
					window.removeEventListener("resize", onResize);
					off();
					try { typeof offTheme === "function" && offTheme(); } catch {}
					observer?.disconnect();
					window.cancelAnimationFrame(chibiRaf);
					tokenDispose?.(); tokenDispose = null;
					html.removeAttribute("data-cl-on"); html.removeAttribute("data-cl-dark"); setBrandSlots(false); setHeroSlot(false); html.removeAttribute("data-cl-pv");
					baseStyle.remove(); skinStyle.remove();
					removeBg(); ensureChibi(false);
					document.getElementById("cl-boot")?.remove();
				};
			}, "carlotta-theme: skin");

			// 先用缓存立刻上色，再读宿主保存的设置
			sync();
			const previewBoot = () => {
				const s = store.get();
				mountBoot(SKINS[activeSkinId(s, getScheme())]);
			};
			store.load().then(async (s) => {
				await refreshSplash();
				sync();
				let shown = false;
				try { shown = window.sessionStorage.getItem("dsh-carlotta-theme:booted") === "1"; } catch {}
				if (s.enabled && s.boot && !shown) {
					try { window.sessionStorage.setItem("dsh-carlotta-theme:booted", "1"); } catch {}
					const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
					const bootSkin = SKINS[s.auto ? activeSkinId(s, getScheme()) : (SKINS[s.lastSkin] ? s.lastSkin : s.skin)];
					// DSH 自带启动页已经换成珂莱塔：启动画面已经在那里播过了，界面里不再叠一层
					// （插件要等读完设置才能放画面，那时主界面已经出来了，再盖上去会闪一下）
					const splashShown = !!(s.splash && splashState.patched);
					if (!reduce && !splashShown) mountBoot(bootSkin);
				}
			});

			// 设置页：DSH 设置左栏多一项「珂莱塔主题」
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "carlotta-theme",
				order: 47,
				label: () => "珂莱塔主题",
			}, () => h(SettingsSection, { getScheme, previewBoot })), "carlotta-theme: settings section");
		}
		//#endregion

		return { apply, inject: ["slots", "theme"] };
	},
});
