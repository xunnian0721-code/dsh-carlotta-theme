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

		const VERSION = "2.3.0";
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

			// ---------- 卡提希娅 ----------
			// bg.zoom / bg.origin：先铺满，再朝某个角放大，把画面中间的人物挪开，免得挡住首页标题
			csky: {
				id: "csky", char: "carte", name: "苍风 · 圣女", tag: "苍风", scheme: "light", mark: "crown", decor: "wind",
				c: { bg: "#eef5fb", l1: "#f7fbfe", l2: "#ffffff", l3: "#e3eef8", ink: "#1b2a3c", ink2: "#4a5d73", ink3: "#8d9db0",
					acc: "#2f7fd6", acc2: "#5fb0f2", deep: "#1d5aa6", gold: "#c39a3e", ice: "#bfe0fa",
					ok: "#2f9e6a", warn: "#c27a10", err: "#d93a4a", link: "#2f7fd6", code: "rgba(240,247,253,.9)" },
				bg: { file: "bg/csky.webp", size: "cover", pos: "center 40%", zoom: 1.25, origin: "100% 40%" },
				veil: "linear-gradient(90deg, rgba(238,245,251,.55) 0, rgba(238,245,251,.15) 40%, rgba(238,245,251,0) 70%)",
				sub: "BENEDIZIONE · HARNESS",
				title: "linear-gradient(100deg,#c39a3e 0%,#f0d58a 18%,#2f7fd6 40%,#7cc4ff 50%,#2f7fd6 60%,#f0d58a 82%,#c39a3e 100%)",
				eyebrow: "Benedizione del Vento",
				boot: { file: "boot/csky.webp", layout: "carte", mode: "portrait", w: 40, k1: "Benedizione del Vento", title: "Cartethyia", cn: "卡提希娅", load: "顺着风，马上就到", credit: "晕欧欧", fx: "sweep", decor: "wind", grad: "linear-gradient(90deg,#f0d58a 0%,#fff6dc 35%,#cfe8ff 65%,#8fcbff 100%)",
					base: "#163a66", veil: "linear-gradient(90deg,rgba(18,52,96,.8) 0,rgba(18,52,96,.45) 45%,rgba(18,52,96,0) 70%)" },
			},
			cnight: {
				id: "cnight", char: "carte", name: "月誓 · 静夜", tag: "月誓", scheme: "dark", mark: "moon", decor: "firefly",
				c: { bg: "#0b0f1c", l1: "#131a2c", l2: "#1a2238", l3: "#232d47", ink: "#eef2ff", ink2: "#b7c0dc", ink3: "#7a85a6",
					acc: "#86a8ff", acc2: "#b3c8ff", deep: "#3f5fc4", gold: "#e6c98a", ice: "#cfdcff",
					ok: "#7fd3a6", warn: "#e9b35c", err: "#ff6b7d", link: "#a9c1ff", code: "rgba(6,9,18,.6)" },
				bg: { file: "bg/cnight.webp", size: "cover", pos: "center 40%", zoom: 1.2, origin: "100% 40%" },
				veil: "linear-gradient(90deg, rgba(11,15,28,.6) 0, rgba(11,15,28,.25) 45%, rgba(11,15,28,.05) 80%)",
				sub: "GIURAMENTO · HARNESS",
				title: "linear-gradient(100deg,#e6c98a 0%,#fff3cf 20%,#b3c8ff 40%,#ffffff 50%,#b3c8ff 60%,#fff3cf 80%,#e6c98a 100%)",
				eyebrow: "Giuramento al chiaro di luna",
				boot: { file: "boot/cnight.webp", layout: "carte", mode: "portrait", w: 44, k1: "Giuramento al chiaro di luna", title: "Cartethyia", cn: "卡提希娅", load: "月色正好，请稍候", credit: "茶壶", fx: "moon", decor: "firefly",
					base: "#0a0e1c", veil: "linear-gradient(90deg,rgba(8,12,26,.88) 0,rgba(8,12,26,.5) 45%,rgba(8,12,26,0) 72%)" },
			},
			ctide: {
				id: "ctide", char: "carte", name: "潮汐 · 拉古那", tag: "潮汐", scheme: "dark", mark: "wave", decor: "tide",
				c: { bg: "#071722", l1: "#0e2231", l2: "#132b3d", l3: "#1b3850", ink: "#e9f7ff", ink2: "#a9c8da", ink3: "#6c8ea3",
					acc: "#36c2e6", acc2: "#7fdcf2", deep: "#1679a8", gold: "#e2c47e", ice: "#c5f1ff",
					ok: "#6fe0b0", warn: "#ffd58a", err: "#ff6b7d", link: "#7fdcf2", code: "rgba(4,14,22,.6)" },
				bg: { file: "bg/ctide.webp", size: "cover", pos: "center 30%" },
				veil: "linear-gradient(90deg, rgba(7,23,34,.72) 0, rgba(7,23,34,.35) 45%, rgba(7,23,34,.1) 80%), linear-gradient(0deg, rgba(7,23,34,.55), transparent 45%)",
				sub: "MAREA · HARNESS",
				title: "linear-gradient(100deg,#e2c47e 0%,#fff1c8 18%,#7fdcf2 40%,#ffffff 50%,#7fdcf2 60%,#fff1c8 82%,#e2c47e 100%)",
				eyebrow: "Il canto della marea",
				boot: { file: "boot/ctide.webp", layout: "carte", mode: "full", shift: 26, scale: 1.18, k1: "Il canto della marea", title: "Cartethyia", cn: "卡提希娅", load: "潮声渐近", credit: "dvdarts", fx: "ripple", decor: "tide",
					base: "#04101e", veil: "linear-gradient(90deg,rgba(4,16,30,.82) 0,rgba(4,16,30,.45) 40%,rgba(4,16,30,0) 66%)" },
			},
			cdaily: {
				id: "cdaily", char: "carte", name: "花野 · 休憩日", tag: "花野", scheme: "light", mark: "blossom", decor: "petal",
				c: { bg: "#fbf8ee", l1: "#fffdf6", l2: "#ffffff", l3: "#f4efdc", ink: "#3a3a2e", ink2: "#6b6a58", ink3: "#a5a38e",
					acc: "#d29e00", acc2: "#4f97d6", deep: "#a87e00", gold: "#4f97d6", ice: "#d9ecfa",
					ok: "#3f9f78", warn: "#c58a2a", err: "#d4566f", link: "#3f86c6", code: "rgba(250,248,240,.95)" },
				bg: { file: "bg/cdaily.webp", size: "cover", pos: "center 30%", zoom: 1.3, origin: "100% 30%" },
				veil: "linear-gradient(90deg, rgba(251,248,238,.7) 0, rgba(251,248,238,.3) 40%, rgba(251,248,238,0) 65%)",
				sub: "un giorno fra i fiori",
				title: "linear-gradient(100deg,#c99700 0%,#f0be1c 22%,#4f97d6 45%,#8cc2ec 55%,#4f97d6 65%,#f0be1c 80%,#c99700 100%)",
				eyebrow: "Un giorno fra i fiori",
				boot: { file: "boot/cdaily.webp", layout: "carte", mode: "portrait", w: 40, light: true, k1: "Un giorno fra i fiori", title: "Cartethyia", cn: "今天也辛苦啦", load: "在花野里歇一会儿", credit: "LaNoyee", decor: "petal",
					base: "#fbf6e4", veil: "linear-gradient(90deg,rgba(255,252,238,.94) 0,rgba(255,252,238,.6) 45%,rgba(255,252,238,0) 70%)" },
			},
			csummer: {
				id: "csummer", char: "carte", name: "盛夏 · 海风", tag: "海风", scheme: "light", mark: "shell", decor: "gull",
				c: { bg: "#eaf8fb", l1: "#f4fcfe", l2: "#ffffff", l3: "#dff2f7", ink: "#0f3346", ink2: "#3b6275", ink3: "#7fa2b3",
					acc: "#1aa3c9", acc2: "#ffb347", deep: "#0f7ea0", gold: "#e89a1c", ice: "#b5ecff",
					ok: "#1fa77a", warn: "#e08a00", err: "#e23a55", link: "#1287b0", code: "rgba(240,250,253,.92)" },
				bg: { file: "bg/csummer.webp", size: "cover", pos: "center 45%", zoom: 1.1, origin: "100% 45%" },
				veil: "linear-gradient(90deg, rgba(234,248,251,.6) 0, rgba(234,248,251,.2) 40%, rgba(234,248,251,0) 65%)",
				sub: "BREZZA · HARNESS",
				title: "linear-gradient(100deg,#1287b0 0%,#1aa3c9 20%,#ffb347 42%,#ff8c42 50%,#ffb347 58%,#1aa3c9 80%,#1287b0 100%)",
				eyebrow: "Brezza d'estate",
				boot: { file: "boot/csummer.webp", layout: "carte", mode: "portrait", w: 40, k1: "Brezza d'estate", title: "Cartethyia", cn: "卡提希娅", load: "海风正好，请稍候", credit: "リョンsan", decor: "gull", grad: "linear-gradient(90deg,#ffffff 0%,#c9f3ff 40%,#ffe0a0 70%,#ffb347 100%)",
					base: "#1b6f9c", veil: "linear-gradient(90deg,rgba(10,70,110,.78) 0,rgba(10,70,110,.4) 45%,rgba(10,70,110,0) 70%)" },
			},
		};
		// ---------- 爱弥斯 ----------
		// 主题里不放中文字样（加载文字除外）：流光字 Aemeath 下面是英文副标题，和流光字做冷暖对比
		// hero = 首页标题换成 Aemeath；subUi = 首页副标题颜色；glitch = 电子幽灵的故障闪烁
		const A_SKINS = {
			astage: {
				id: "astage", char: "aemeath", name: "星辉 · 歌姬", tag: "Diva", scheme: "dark", mark: "heart", decor: "astage",
				c: { bg: "#140c1a", l1: "#1f1428", l2: "#281a33", l3: "#33223f", ink: "#fbeef6", ink2: "#d3bccb", ink3: "#94809a",
					acc: "#ff6fae", acc2: "#ffa3cb", deep: "#c2427f", gold: "#7fe9ff", ice: "#ffe1f0",
					ok: "#7fd3a6", warn: "#e9b35c", err: "#ff5a6a", link: "#ff9ec8", code: "rgba(12,6,16,.6)" },
				bg: { file: "bg/astage.webp", size: "cover", pos: "center 45%", zoom: 1.25, origin: "100% 45%" },
				veil: "linear-gradient(90deg, rgba(20,12,26,.55) 0, rgba(20,12,26,.2) 45%, rgba(20,12,26,.05) 80%), linear-gradient(0deg, rgba(20,12,26,.5), transparent 40%)",
				sub: "LIVE · HARNESS",
				title: "linear-gradient(100deg,#ff5fa2 0%,#ffb3d4 20%,#fff1f7 40%,#ffc48a 55%,#fff1f7 70%,#ffb3d4 85%,#ff5fa2 100%)",
				eyebrow: "Sing for the Stars", subtitle: "One Voice, One Signal", subUi: "#8ff0ff",
				boot: { file: "boot/astage.webp", layout: "carte", mode: "portrait", w: 44, k1: "Sing for the Stars", title: "Aemeath", sub: "One Voice, One Signal", subColor: "#8ff0ff",
					load: "调频 9072，信号接通中", loadFont: "'CL ZXiaoWei'", loadGrad: "linear-gradient(90deg,#ff8fc4,#ffd1e6,#8ff0ff,#ff8fc4)", credit: "KuroiDa", decor: "astage", scan: true,
					base: "#1a0a22", veil: "linear-gradient(90deg,rgba(26,10,34,.86) 0,rgba(26,10,34,.5) 45%,rgba(26,10,34,0) 72%)" },
			},
			acosmos: {
				id: "acosmos", char: "aemeath", name: "远航星 · 靛青宇宙", tag: "Polestar", scheme: "dark", mark: "polestar", decor: "acosmos",
				c: { bg: "#0a0c22", l1: "#12163a", l2: "#191e48", l3: "#222857", ink: "#eef0ff", ink2: "#b6bbe6", ink3: "#7c82b3",
					acc: "#9d8bff", acc2: "#ff8fc4", deep: "#5a48d6", gold: "#ffd98a", ice: "#cfe4ff",
					ok: "#7fd3a6", warn: "#ffd58a", err: "#ff6b7d", link: "#b9a9ff", code: "rgba(6,8,20,.6)" },
				bg: { file: "bg/acosmos.webp", size: "cover", pos: "center 40%" },
				veil: "linear-gradient(90deg, rgba(10,12,34,.6) 0, rgba(10,12,34,.25) 45%, rgba(10,12,34,.05) 80%)",
				sub: "VOYAGE · HARNESS",
				title: "linear-gradient(100deg,#ffd98a 0%,#fff4d6 20%,#ff9fcb 40%,#ffb38a 55%,#ff9fcb 70%,#fff4d6 85%,#ffd98a 100%)",
				eyebrow: "Indigo Universe", subtitle: "Bon voyage", subUi: "#a9c4ff",
				boot: { file: "boot/acosmos.webp", layout: "carte", mode: "portrait", w: 36, k1: "Indigo Universe", title: "Aemeath", sub: "Bon voyage", subColor: "#b9d0ff",
					load: "长航的星辉，正在点亮", loadFont: "'CL ZXiaoWei'", loadGrad: "linear-gradient(90deg,#ffd98a,#ff9fcb,#b9d0ff,#ffd98a)", credit: "千千結", decor: "acosmos", scan: true,
					base: "#080a1e", veil: "linear-gradient(90deg,rgba(8,10,30,.88) 0,rgba(8,10,30,.5) 45%,rgba(8,10,30,0) 72%)" },
			},
			amecha: {
				id: "amecha", char: "aemeath", name: "隧者兵装 · 机兵", tag: "Exostrider", scheme: "light", mark: "core", decor: "amecha",
				c: { bg: "#f2f5fa", l1: "#f8fafd", l2: "#ffffff", l3: "#e8edf6", ink: "#1e2a3c", ink2: "#4b5a70", ink3: "#8d9ab0",
					acc: "#2f7fd8", acc2: "#ff7fb0", deep: "#1f5fb0", gold: "#d39a2c", ice: "#cfe2fa",
					ok: "#2f9e6a", warn: "#c27a10", err: "#d93a4a", link: "#2f7fd8", code: "rgba(240,244,250,.92)" },
				bg: { file: "bg/amecha.webp", size: "cover", pos: "center 40%", zoom: 1.3, origin: "100% 35%" },
				veil: "linear-gradient(90deg, rgba(242,245,250,.5) 0, rgba(242,245,250,.15) 45%, rgba(242,245,250,0) 75%)",
				sub: "EXOSTRIDER · HARNESS",
				title: "linear-gradient(100deg,#2563c9 0%,#4fa8ee 25%,#ff8fbd 50%,#e0507f 65%,#4fa8ee 85%,#2563c9 100%)",
				eyebrow: "Exostrider Sync", subtitle: "Wings of Steel, Heart of Light", subUi: "#cf8a18",
				boot: { file: "boot/amecha.webp", layout: "carte", mode: "portrait", w: 36, light: true, k1: "Exostrider Sync", k1c: "#2f7fd8", title: "Aemeath", sub: "Wings of Steel, Heart of Light", subColor: "#cf8a18",
					grad: "linear-gradient(90deg,#2563c9,#4fa8ee,#ff8fbd,#e0507f)",
					load: "隧者兵装同步中", loadFont: "'CL ZQingKe'", loadGrad: "linear-gradient(90deg,#2f7fd8,#5fb3f0,#ff7fb0,#2f7fd8)", credit: "Ayamekiki", decor: "amecha",
					base: "#eef2f9", veil: "linear-gradient(90deg,rgba(244,247,252,.95) 0,rgba(244,247,252,.65) 45%,rgba(244,247,252,0) 70%)" },
			},
			afamily: {
				id: "afamily", char: "aemeath", name: "归家 · 小爱弥斯", tag: "Home", scheme: "light", mark: "home", decor: "afamily",
				c: { bg: "#fbf3ee", l1: "#fffaf6", l2: "#ffffff", l3: "#f5e9e1", ink: "#3e3030", ink2: "#6e5d5b", ink3: "#a8978f",
					acc: "#e8789f", acc2: "#f2b25c", deep: "#c4587f", gold: "#6fa4d6", ice: "#fde4ec",
					ok: "#3f9f78", warn: "#c58a2a", err: "#d4566f", link: "#c4587f", code: "rgba(252,246,242,.95)" },
				bg: { file: "bg/afamily.webp", size: "cover", pos: "center 30%", zoom: 1.25, origin: "100% 30%" },
				veil: "linear-gradient(90deg, rgba(251,243,238,.7) 0, rgba(251,243,238,.3) 40%, rgba(251,243,238,0) 65%)",
				sub: "home, sweet home",
				title: "linear-gradient(100deg,#3a78c2 0%,#6fb0e8 25%,#f08fb4 50%,#d9568a 65%,#6fb0e8 85%,#3a78c2 100%)",
				eyebrow: "Welcome Home", subtitle: "Someone Waiting at the Door", subUi: "#d48a1e",
				boot: { file: "boot/afamily.webp", layout: "carte", mode: "full", shift: 22, scale: 1, pos: "center 12%", light: true, k1: "Welcome Home", k1c: "#e8789f", title: "Aemeath", sub: "Someone Waiting at the Door", subColor: "#d48a1e",
					grad: "linear-gradient(90deg,#3a78c2,#6fb0e8,#f08fb4,#d9568a)",
					load: "点心马上就好", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#e06892,#f2b25c,#6fa4d6,#e06892)", credit: "日向あおい", decor: "afamily",
					base: "#fbf3ee", veil: "linear-gradient(90deg,rgba(255,248,244,.96) 0,rgba(255,248,244,.75) 30%,rgba(255,248,244,0) 52%)" },
			},
			asummer: {
				id: "asummer", char: "aemeath", name: "盛夏 · 星海", tag: "Summer", scheme: "light", mark: "starfish", decor: "asummer",
				c: { bg: "#eef8fc", l1: "#f6fcff", l2: "#ffffff", l3: "#e2f2f9", ink: "#173246", ink2: "#456277", ink3: "#86a2b4",
					acc: "#ff7aa8", acc2: "#43c6e8", deep: "#e0507f", gold: "#2fb2d8", ice: "#c4f0ff",
					ok: "#1fa77a", warn: "#e08a00", err: "#e23a55", link: "#1489bd", code: "rgba(240,250,253,.92)" },
				bg: { file: "bg/asummer.webp", size: "cover", pos: "center 35%" },
				veil: "linear-gradient(90deg, rgba(238,248,252,.55) 0, rgba(238,248,252,.15) 40%, rgba(238,248,252,0) 65%)",
				sub: "SUMMER · HARNESS",
				title: "linear-gradient(100deg,#1489bd 0%,#3fc3ea 25%,#ffd06a 50%,#f0a020 65%,#3fc3ea 85%,#1489bd 100%)",
				eyebrow: "Summer Starlight", subtitle: "Salt Wind & Sunlit Waves", subUi: "#e8608f",
				boot: { file: "boot/asummer.webp", layout: "carte", mode: "portrait", w: 36, k1: "Summer Starlight", k1c: "#ffe7a8", title: "Aemeath", sub: "Salt Wind & Sunlit Waves", subColor: "#ffb3cf",
					grad: "linear-gradient(90deg,#ffd06a,#fff2c4,#7fe6ff,#ffd06a)", badge: "Summer Starlight",
					load: "跳进海里之前，请稍候", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#ffe07a,#7fe6ff,#ff9ec0,#ffe07a)", credit: "絆", decor: "asummer",
					base: "#1b6f9c", veil: "linear-gradient(90deg,rgba(14,80,120,.78) 0,rgba(14,80,120,.4) 45%,rgba(14,80,120,0) 70%)" },
			},
		};
		Object.assign(SKINS, A_SKINS);

		// ---------- 达妮娅（十套） ----------
		// 底部副标题多为俄语（她的名字来自 До свидания）；加载文字是中文
		const dSkin = (id, o) => {
			const b = o.boot;
			return { id: "d" + id, char: "denia", name: o.name, tag: o.tag, scheme: o.dark ? "dark" : "light", mark: o.mark, decor: "d" + o.decor,
				c: o.c, bg: { file: "bg/d" + id + ".webp", ...o.bg }, veil: o.veil, base: o.base, sub: o.tag.toUpperCase() + " · HARNESS",
				title: o.title, eyebrow: o.it, subtitle: o.sub, subUi: o.subUi,
				boot: { file: "boot/d" + id + ".webp", layout: "carte", title: "Denia", sub: o.sub, k1: o.it, decor: "d" + o.decor, light: !o.dark, ...b } };
		};
		const pal = (bg, l1, l2, l3, ink, ink2, ink3, acc, acc2, gold, dark) => ({ bg, l1, l2, l3, ink, ink2, ink3, acc, acc2, deep: acc, gold, ice: acc2,
			ok: dark ? "#7fd3a6" : "#2f9e6a", warn: dark ? "#e9b35c" : "#c27a10", err: dark ? "#ff6b7d" : "#d93a4a", link: acc, code: dark ? "rgba(6,6,16,.6)" : "rgba(250,248,252,.92)" });
		const D_SKINS = [
			dSkin("veil", { name: "伪装 · 泡影", tag: "Dreamer", mark: "bubble", decor: "veil",
				c: pal("#f6f3fa", "#fbf9fd", "#ffffff", "#eee8f5", "#2f2a40", "#615a78", "#a09ab4", "#e27aa8", "#7fa7e8", "#b48fe0"),
				title: "linear-gradient(100deg,#3a5fc0 0%,#6f62cf 25%,#cc4f8c 50%,#a33a72 65%,#6f62cf 85%,#3a5fc0 100%)", it: "Sweet Dreams in Bubbles", sub: "Безобидная мечтательница", subUi: "#d08a2a",
				bg: { size: "cover", pos: "center 40%", zoom: 1.15, origin: "0% 40%" }, veil: "linear-gradient(270deg,rgba(246,243,250,.45) 0,rgba(246,243,250,.12) 45%,rgba(246,243,250,0) 75%)",
				boot: { mode: "portrait", w: 38, k1c: "#b48fe0", subColor: "#d08a2a", grad: "linear-gradient(90deg,#3a5fc0,#6f62cf,#cc4f8c,#a33a72)", load: "再睡五分钟就好", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#e27aa8,#b9a0e0,#7fa7e8,#e27aa8)", credit: "絆", base: "#f6f1fa", veil: "linear-gradient(90deg,rgba(250,247,253,.95) 0,rgba(250,247,253,.62) 45%,rgba(250,247,253,0) 70%)" } }),
			dSkin("void", { name: "幻灭 · 真形", tag: "Void", dark: true, mark: "eye", decor: "void",
				c: pal("#07061a", "#100e2a", "#171437", "#201c47", "#efeaff", "#bdb4e0", "#7e76a8", "#8a6bff", "#ff6fb0", "#6fd8ff", true),
				title: "linear-gradient(100deg,#ffd1e8 0%,#ff8fc4 25%,#ffffff 45%,#ffb0d6 62%,#ff8fc4 80%,#ffd1e8 100%)", it: "До свидания", sub: "Into the Silent Void", subUi: "#7fd8ff",
				bg: { size: "cover", pos: "center 45%" }, veil: "linear-gradient(90deg,rgba(7,6,26,.55) 0,rgba(7,6,26,.2) 45%,rgba(7,6,26,.05) 80%),linear-gradient(rgba(7,6,26,.42),rgba(7,6,26,.42))",
				boot: { mode: "portrait", w: 30, subColor: "#8fe0ff", load: "正在坠入虚质空间", loadFont: "'CL ZXiaoWei'", loadGrad: "linear-gradient(90deg,#c9b8ff,#ff8fc4,#6fd8ff,#c9b8ff)", credit: "モ誰", scan: true, base: "#06051a", veil: "linear-gradient(90deg,rgba(6,5,22,.9) 0,rgba(6,5,22,.5) 45%,rgba(6,5,22,0) 72%)" } }),
			dSkin("alone", { name: "天之弱", tag: "Alone", dark: true, mark: "doll", decor: "alone",
				c: pal("#12141f", "#1a1d2b", "#222637", "#2b3045", "#e8e9f2", "#b0b3c8", "#737893", "#b8a6e6", "#f0a6c0", "#ffb877", true),
				title: "linear-gradient(100deg,#dfe6ff 0%,#b8a6e6 25%,#f0c6d8 50%,#c9d4f5 70%,#b8a6e6 85%,#dfe6ff 100%)", it: "A Lie for Tomorrow", sub: "Я в порядке", subUi: "#ffb877",
				bg: { size: "cover", pos: "center 40%" }, veil: "linear-gradient(90deg,rgba(18,20,31,.5) 0,rgba(18,20,31,.25) 45%,rgba(18,20,31,.15) 80%),linear-gradient(rgba(18,20,31,.35),rgba(18,20,31,.35))",
				boot: { mode: "portrait", w: 34, subColor: "#ffbf85", load: "没事的，我很好", loadFont: "'CL ZXiaoWei'", loadGrad: "linear-gradient(90deg,#c9c3e8,#f0c6d8,#ffb877,#c9c3e8)", credit: "_toriumu", base: "#0e0f19", veil: "linear-gradient(90deg,rgba(12,13,22,.92) 0,rgba(12,13,22,.55) 45%,rgba(12,13,22,0) 72%)" } }),
			dSkin("birthday", { name: "生日漫游 · 橙子蛋糕", tag: "Birthday", mark: "orange", decor: "birthday",
				c: pal("#fff6ee", "#fffaf5", "#ffffff", "#fbeee2", "#43322a", "#75604f", "#ad9886", "#f08a3c", "#ef7aa6", "#6fa4d6"),
				title: "linear-gradient(100deg,#3f7fd0 0%,#8fb8ec 25%,#ef7aa6 50%,#f08a3c 65%,#8fb8ec 85%,#3f7fd0 100%)", it: "Happy Birthday", sub: "Апельсиновый торт для тебя", subUi: "#e0607f",
				bg: { size: "cover", pos: "center 40%", zoom: 1.45, origin: "100% 40%" }, veil: "linear-gradient(90deg,rgba(255,246,238,.6) 0,rgba(255,246,238,.2) 40%,rgba(255,246,238,0) 65%)",
				boot: { mode: "portrait", w: 36, k1c: "#f08a3c", subColor: "#e0607f", grad: "linear-gradient(90deg,#3f7fd0,#8fb8ec,#ef7aa6,#f08a3c)", load: "橙子蛋糕马上就好", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#f08a3c,#ef7aa6,#7fb0e8,#f08a3c)", credit: "Luma", base: "#fff6ee", veil: "linear-gradient(90deg,rgba(255,249,243,.95) 0,rgba(255,249,243,.62) 45%,rgba(255,249,243,0) 70%)" } }),
			dSkin("summer", { name: "盛夏 · 汽水泡泡", tag: "Summer", mark: "soda", decor: "summer",
				c: pal("#eef8fc", "#f6fcff", "#ffffff", "#e2f2f9", "#173246", "#456277", "#86a2b4", "#ff7aa8", "#3fc3ea", "#f0a020"),
				title: "linear-gradient(100deg,#1489bd 0%,#3fc3ea 25%,#ff9ec0 50%,#e8608f 65%,#3fc3ea 85%,#1489bd 100%)", it: "Summer Bubbles", sub: "Sunlight, Sea & Sigrika", subUi: "#e8961c",
				bg: { size: "cover", pos: "center 40%", zoom: 1.35, origin: "0% 40%" }, veil: "linear-gradient(90deg,rgba(238,248,252,.5) 0,rgba(238,248,252,.15) 40%,rgba(238,248,252,0) 65%)",
				boot: { mode: "portrait", w: 36, k1c: "#ff7aa8", subColor: "#e8961c", grad: "linear-gradient(90deg,#1489bd,#3fc3ea,#ff9ec0,#e8608f)", badge: "Summer Bubbles", badgeColor: "#e8608f", load: "泡泡浮上海面", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#ffe07a,#7fe6ff,#ff9ec0,#ffe07a)", credit: "ふわおむ", base: "#eef8fc", veil: "linear-gradient(90deg,rgba(246,251,254,.95) 0,rgba(246,251,254,.62) 45%,rgba(246,251,254,0) 70%)" } }),
			dSkin("idol", { name: "Solar5 · 偶像", tag: "Idol", mark: "mic", decor: "idol",
				c: pal("#fbf2f7", "#fff8fb", "#ffffff", "#f6e6ef", "#3b2a3a", "#6e5770", "#a891a8", "#ff5fa2", "#7fc8ff", "#f2b33c"),
				title: "linear-gradient(100deg,#3d6fd6 0%,#7fa8f0 25%,#ff6fae 50%,#e0457f 65%,#7fa8f0 85%,#3d6fd6 100%)", it: "Shine Together", sub: "Сияем вместе", subUi: "#e8961c",
				bg: { size: "cover", pos: "center 35%", zoom: 1.15, origin: "100% 35%" }, veil: "linear-gradient(90deg,rgba(251,242,247,.6) 0,rgba(251,242,247,.2) 40%,rgba(251,242,247,0) 65%)",
				boot: { mode: "portrait", w: 40, k1c: "#ff5fa2", subColor: "#e8961c", grad: "linear-gradient(90deg,#3d6fd6,#7fa8f0,#ff6fae,#e0457f)", load: "麦克风测试，一、二", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#ff7ab6,#ffd36e,#7fc8ff,#ff7ab6)", credit: "maru.selinn", base: "#fbf2f7", veil: "linear-gradient(90deg,rgba(255,248,252,.95) 0,rgba(255,248,252,.6) 45%,rgba(255,248,252,0) 70%)" } }),
			dSkin("lab", { name: "残星会 · 实验体", tag: "Specimen", dark: true, mark: "chain", decor: "lab",
				c: pal("#070f14", "#0d1a21", "#13232c", "#1a2e39", "#e6f7f5", "#a6c4c2", "#6b8a89", "#4fe0c0", "#ff7fb4", "#9fb4ff", true),
				title: "linear-gradient(100deg,#d8fff4 0%,#7dffd8 25%,#ffffff 45%,#ffb0d6 62%,#7dffd8 82%,#d8fff4 100%)", it: "Property of Fractsidus", sub: "Образец № Д", subUi: "#ff9ec8",
				bg: { size: "cover", pos: "center 40%" }, veil: "linear-gradient(90deg,rgba(7,15,20,.6) 0,rgba(7,15,20,.25) 45%,rgba(7,15,20,.05) 80%),linear-gradient(rgba(7,15,20,.3),rgba(7,15,20,.3))",
				boot: { mode: "full", shift: 0, scale: 1, pos: "center 40%", subColor: "#ffa8cc", load: "频率持续流失中", loadFont: "'CL ZQingKe'", loadGrad: "linear-gradient(90deg,#7dffd8,#9fb4ff,#ff8fc4,#7dffd8)", credit: "Joezunzun", scan: true, base: "#050c10", veil: "linear-gradient(90deg,rgba(5,12,16,.92) 0,rgba(5,12,16,.55) 34%,rgba(5,12,16,0) 58%)" } }),
			dSkin("duo", { name: "娅娅与西格莉卡", tag: "Besties", mark: "peach", decor: "duo",
				c: pal("#fff5f0", "#fffaf7", "#ffffff", "#fbebe3", "#43302c", "#755a52", "#ad958b", "#ff8a6a", "#ff8fb4", "#6fa4d6"),
				title: "linear-gradient(100deg,#3f7fd0 0%,#8fb8ec 25%,#ff8fb4 50%,#ff7a4a 65%,#8fb8ec 85%,#3f7fd0 100%)", it: "Good Orange & Evil Peach", sub: "Лучшие подруги", subUi: "#e0607f",
				bg: { size: "cover", pos: "center 30%", zoom: 1.2, origin: "0% 30%" }, veil: "linear-gradient(90deg,rgba(255,245,240,.6) 0,rgba(255,245,240,.2) 40%,rgba(255,245,240,0) 65%)",
				boot: { mode: "portrait", w: 46, k1c: "#ff8a6a", subColor: "#e0607f", grad: "linear-gradient(90deg,#3f7fd0,#8fb8ec,#ff8fb4,#ff7a4a)", load: "娅娅，等等我", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#ff9a5a,#ff8fb4,#7fb0e8,#ff9a5a)", credit: "ASAK", base: "#fff5f0", veil: "linear-gradient(90deg,rgba(255,248,244,.95) 0,rgba(255,248,244,.62) 45%,rgba(255,248,244,0) 70%)" } }),
			dSkin("tea", { name: "甜点社 · 下午茶", tag: "Teatime", mark: "macaron", decor: "tea",
				c: pal("#fbf6ef", "#fffbf6", "#ffffff", "#f5ece0", "#45362c", "#776250", "#ae9c8a", "#d98a5a", "#f2a5c0", "#6f9fd0"),
				title: "linear-gradient(100deg,#3f74c8 0%,#88b0e6 25%,#e88aaa 50%,#c9704a 65%,#88b0e6 85%,#3f74c8 100%)", it: "Sweets for Answers", sub: "Сладкое — в обмен на ответ", subUi: "#c76a8a",
				bg: { size: "cover", pos: "center 40%", zoom: 1.12, origin: "0% 40%" }, veil: "linear-gradient(90deg,rgba(251,246,239,.6) 0,rgba(251,246,239,.2) 40%,rgba(251,246,239,0) 65%)",
				boot: { mode: "portrait", w: 40, k1c: "#d98a5a", subColor: "#c76a8a", grad: "linear-gradient(90deg,#3f74c8,#88b0e6,#e88aaa,#c9704a)", load: "再来一块蛋糕就好", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#e8a06a,#f2a5c0,#9cc9a0,#e8a06a)", credit: "大熊まい", base: "#fbf6ef", veil: "linear-gradient(90deg,rgba(255,250,244,.95) 0,rgba(255,250,244,.62) 45%,rgba(255,250,244,0) 70%)" } }),
			dSkin("nap", { name: "午睡 · 嘘", tag: "Shh", mark: "zmoon", decor: "nap",
				c: pal("#f6f1f7", "#fbf8fc", "#ffffff", "#efe6f2", "#38303f", "#68607a", "#a39bb3", "#b07ad0", "#f2a0c0", "#7aa0d8"),
				title: "linear-gradient(100deg,#4a6cc8 0%,#8c8ce0 25%,#d07ab0 50%,#b05a8f 65%,#8c8ce0 85%,#4a6cc8 100%)", it: "Five More Minutes", sub: "Тсс… я сплю", subUi: "#d0892a",
				bg: { size: "auto 100%", pos: "right 20%", repeat: "no-repeat", mask: "linear-gradient(90deg, transparent 0, transparent 30%, #000 62%)" }, base: "linear-gradient(120deg,#f3ecf6 0%,#ecdff0 50%,#f6e6ee 100%)", veil: "none",
				boot: { mode: "portrait", w: 38, k1c: "#b07ad0", subColor: "#d0892a", grad: "linear-gradient(90deg,#4a6cc8,#8c8ce0,#d07ab0,#b05a8f)", load: "嘘，别吵醒我", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#b8a6e6,#f2b8d0,#a9c8f0,#b8a6e6)", credit: "karen", base: "#f6f1f7", veil: "linear-gradient(90deg,rgba(250,246,251,.95) 0,rgba(250,246,251,.62) 45%,rgba(250,246,251,0) 70%)" } }),
		];
		for (const s of D_SKINS) SKINS[s.id] = s;

		// ---------- 西格莉卡（五套） ----------
		// 底部副标题用英文；加载文字是中文
		const sSkin = (id, o) => {
			const b = o.boot;
			return { id: "s" + id, char: "sigrika", name: o.name, tag: o.tag, scheme: o.dark ? "dark" : "light", mark: o.mark, decor: o.decor || "s" + id,
				c: o.c, bg: { file: "bg/s" + id + ".webp", ...o.bg }, veil: o.veil, base: o.base, sub: o.tag.toUpperCase() + " · HARNESS",
				title: o.title, eyebrow: o.it, subtitle: o.sub, subUi: o.subUi,
				boot: { file: "boot/s" + id + ".webp", layout: "carte", title: "Sigrika", sub: o.sub, k1: o.it, decor: o.decor || "s" + id, light: !o.dark, ...b } };
		};
		const S_SKINS = [
			sSkin("rune", { name: "符文 · 语义解现", tag: "Runes", dark: true, mark: "rune",
				c: pal("#0d0f22", "#151933", "#1c2142", "#252b52", "#f3efff", "#bdb8dc", "#7d79a3", "#f2a33a", "#7fd8c8", "#ffd36e", true),
				title: "linear-gradient(100deg,#ffd36e 0%,#fff1c8 22%,#f2a33a 45%,#ffe0a0 60%,#fff1c8 80%,#ffd36e 100%)", it: "Semantic Manifestation", sub: "Every Rune Has a Voice", subUi: "#8fe8d8",
				bg: { size: "cover", pos: "100% 40%", zoom: 1.15, origin: "100% 40%" }, veil: "linear-gradient(90deg,rgba(13,15,34,.55) 0,rgba(13,15,34,.2) 45%,rgba(13,15,34,.05) 80%)",
				boot: { mode: "portrait", w: 36, subColor: "#8fe8d8", load: "符文解读中", loadFont: "'CL ZXiaoWei'", loadGrad: "linear-gradient(90deg,#ffd36e,#7fe8d8,#f2a33a,#ffd36e)", credit: "ちぐさ", base: "#0b0d1e", veil: "linear-gradient(90deg,rgba(10,12,30,.9) 0,rgba(10,12,30,.5) 45%,rgba(10,12,30,0) 72%)" } }),
			sSkin("sun", { name: "昭日 · 日光祝福", tag: "Daylight", mark: "sunrune",
				c: pal("#fff7ea", "#fffbf3", "#ffffff", "#fbefdc", "#3f3022", "#735a40", "#ad977d", "#e8902a", "#f2c14a", "#6fa4d6"),
				title: "linear-gradient(100deg,#2a5cb0 0%,#4f86d0 26%,#c8508a 48%,#d8801a 70%,#b85a10 100%)", it: "Blessed by Daylight", sub: "Toward the Sun", subUi: "#d0608a",
				bg: { size: "cover", pos: "center 40%", zoom: 1.2, origin: "0% 40%" }, veil: "linear-gradient(90deg,rgba(255,247,234,.6) 0,rgba(255,247,234,.2) 40%,rgba(255,247,234,0) 65%)",
				boot: { mode: "portrait", w: 36, k1c: "#e8902a", subColor: "#d0608a", grad: "linear-gradient(90deg,#2a5cb0,#4f86d0,#c8508a,#d8801a)", load: "日光正好，马上就来", loadFont: "'CL ZXiaoWei'", loadGrad: "linear-gradient(90deg,#f2a33a,#ffd36e,#e8784a,#f2a33a)", credit: "Datsha", base: "#fff7ea", veil: "linear-gradient(90deg,rgba(255,250,240,.95) 0,rgba(255,250,240,.62) 45%,rgba(255,250,240,0) 70%)" } }),
			sSkin("roya", { name: "罗伊 · 日灵伙伴", tag: "Roya", mark: "spirit",
				c: pal("#eef7fb", "#f6fbfd", "#ffffff", "#e2f0f6", "#1f3442", "#4b6474", "#8aa2b0", "#2f9fd0", "#7fd08a", "#f2a33a"),
				title: "linear-gradient(100deg,#1d55b0 0%,#3f86e0 35%,#7a5cd0 68%,#e8701e 100%)", it: "Home of the Roya", sub: "Sun Spirit, Lend Me a Hand", subUi: "#8a5cc8",
				bg: { size: "cover", pos: "center 30%", zoom: 1.05, origin: "0% 0%" }, veil: "linear-gradient(90deg,rgba(238,247,251,.6) 0,rgba(238,247,251,.2) 40%,rgba(238,247,251,0) 65%)",
				boot: { mode: "portrait", w: 34, k1c: "#2f9fd0", subColor: "#8a5cc8", grad: "linear-gradient(90deg,#1d55b0,#3f86e0,#7a5cd0,#e8701e)", load: "日灵，帮帮忙", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#2f9fd0,#7fd08a,#ffb04a,#2f9fd0)", credit: "lami", base: "#eef7fb", veil: "linear-gradient(90deg,rgba(246,251,253,.95) 0,rgba(246,251,253,.62) 45%,rgba(246,251,253,0) 70%)" } }),
			sSkin("orange", { name: "小橘子 · 星炬日常", tag: "Tangerine", mark: "tangerine",
				c: pal("#fff5ec", "#fffaf5", "#ffffff", "#fbeadc", "#43302a", "#755a4c", "#ad9584", "#f08a2a", "#a07ad0", "#6fa4d6"),
				title: "linear-gradient(100deg,#3f7fd0 0%,#7fa8e8 26%,#d07ac0 48%,#ff9a3a 70%,#e0701a 100%)", it: "Little Tangerine", sub: "Not a Failure, Just Not Yet", subUi: "#9a60c8",
				bg: { size: "cover", pos: "center 40%", zoom: 1.15, origin: "0% 40%" }, veil: "linear-gradient(90deg,rgba(255,245,236,.6) 0,rgba(255,245,236,.2) 40%,rgba(255,245,236,0) 65%)",
				boot: { mode: "portrait", w: 44, k1c: "#f08a2a", subColor: "#9a60c8", grad: "linear-gradient(90deg,#3f7fd0,#7fa8e8,#d07ac0,#ff9a3a)", load: "嘭嘭！马上就好", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#f08a2a,#ffc46a,#a07ad0,#f08a2a)", credit: "熊吉Z_Z", base: "#fff5ec", veil: "linear-gradient(90deg,rgba(255,249,243,.95) 0,rgba(255,249,243,.62) 45%,rgba(255,249,243,0) 70%)" } }),
			sSkin("summer", { name: "盛夏 · 橘子海", tag: "Summer", mark: "shellr", decor: "dsummer",
				c: pal("#eef9fc", "#f6fcfe", "#ffffff", "#e2f2f9", "#173246", "#456277", "#86a2b4", "#ff8a3a", "#3fc3ea", "#f0a020"),
				title: "linear-gradient(100deg,#0d5f9e 0%,#1f8fd0 28%,#b85ac0 52%,#f0702a 76%,#e8487a 100%)", it: "Summer Light", sub: "L!!!!ght Up the Sea", subUi: "#e0608f",
				bg: { size: "cover", pos: "center 0%", zoom: 1.12, origin: "100% 0%" }, veil: "linear-gradient(90deg,rgba(238,249,252,.55) 0,rgba(238,249,252,.15) 40%,rgba(238,249,252,0) 65%)",
				boot: { mode: "portrait", w: 38, k1c: "#ff8a3a", subColor: "#e0608f", grad: "linear-gradient(90deg,#0d5f9e,#1f8fd0,#b85ac0,#f0702a)", badge: "Summer L!!!!ght", badgeColor: "#e8608f", load: "冲进海里之前，请稍候", loadFont: "'CL ZKuaiLe'", loadGrad: "linear-gradient(90deg,#ff7a2a,#1f9fd8,#e8487a,#ff7a2a)", credit: "十绫 LS", base: "#eef9fc", veil: "linear-gradient(90deg,rgba(246,251,254,.95) 0,rgba(246,251,254,.62) 45%,rgba(246,251,254,0) 70%)" } }),
		];
		for (const s of S_SKINS) SKINS[s.id] = s;
		const SKIN_ORDER = ["night", "day", "prism", "daily", "summer", "csky", "cnight", "ctide", "cdaily", "csummer", "astage", "acosmos", "amecha", "afamily", "asummer", ...D_SKINS.map((s) => s.id), ...S_SKINS.map((s) => s.id)];

		/** 角色：侧栏字样、Q 版、设置页立绘、Q 版台词。皮肤里不写 char 的都是珂莱塔。 */
		const CHARS = {
			carlotta: { name: "珂莱塔", latin: "Carlotta", chibi: "img/chibi.png", full: "img/fullbody.webp",
				lines: ["今天也要优雅地写代码哦。", "红茶已经备好了~", "需要我帮忙吗？", "这个 bug，交给我。", "休息一下也没关系。", "Montelli 家从不失手。"] },
			carte: { name: "卡提希娅", latin: "Cartethyia", chibi: "img/chibi-carte.png", full: "img/fullbody-carte.webp",
				lines: ["风会把好消息带来的。", "今天也辛苦啦，要不要歇一会儿？", "这个问题，我们一起想想。", "别着急，慢慢来就好。", "拉古那的风，今天也很温柔。", "需要我帮忙吗？"] },
			aemeath: { name: "爱弥斯", latin: "Aemeath", chibi: "img/chibi-aemeath.png", full: "img/fullbody-aemeath.webp", glitch: true,
				lines: ["Let's make today sparkle!", "Signal's clear. I'm right here.", "Need a hand? I've got two!", "Don't forget to take a break, okay?", "Tuning in to you~", "I'll keep the light on."] },
			denia: { name: "达妮娅", latin: "Denia", chibi: "img/chibi-denia.png", full: "img/fullbody-denia.webp", hero: true,
				lines: ["带甜点来的话，就帮你「蒙」一个答案~", "嘘……我在睡觉。", "这个嘛，你最好别问哦。", "今天也是很讨厌你的一天~", "要不要分我一块蛋糕？", "До свидания~"] },
			sigrika: { name: "西格莉卡", latin: "Sigrika", chibi: "img/chibi-sigrika.png", full: "img/fullbody-sigrika.webp", hero: true,
				lines: ["想知道符文的意思？找我就好啦！", "日灵，帮帮忙~", "没关系，下次一定能做到！", "要不要吃橘子？刚剥好的。", "娅娅又跑去哪儿了……", "今天也要元气满满！"] },
		};
		const charOf = (skin) => CHARS[(skin && skin.char) || "carlotta"];

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
@font-face{font-family:"CL Caveat";font-style:normal;font-weight:600;font-display:swap;src:url(${url("Caveat-600.woff2")}) format("woff2")}
@font-face{font-family:"CL ZXiaoWei";font-display:swap;src:url(${url("ZCOOLXiaoWei-sub.woff2")}) format("woff2")}
@font-face{font-family:"CL ZQingKe";font-display:swap;src:url(${url("ZCOOLQingKeHuangYou-sub.woff2")}) format("woff2")}
@font-face{font-family:"CL ZKuaiLe";font-display:swap;src:url(${url("ZCOOLKuaiLe-sub.woff2")}) format("woff2")}
@font-face{font-family:"CL Cormorant";font-style:normal;font-weight:500 700;font-display:swap;src:url(${url("CormorantCyr-600-sub.woff2")}) format("woff2");unicode-range:U+0400-04FF,U+2014,U+2026,U+2116}
@font-face{font-family:"CL Cormorant";font-style:italic;font-weight:500;font-display:swap;src:url(${url("CormorantCyr-500i-sub.woff2")}) format("woff2");unicode-range:U+0400-04FF,U+2014,U+2026,U+2116}`;
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
#cl-boot .skip{position:absolute;right:40px;top:56px;font-size:12px;letter-spacing:.3em;padding:7px 16px;border-radius:999px;border:1px solid currentColor;opacity:.7}
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
#cl-boot.l-summer{background:linear-gradient(160deg,#8fd6ff 0%,#c4ebff 45%,#e8f7ff 100%);color:#fff}
#cl-boot.l-summer .art.blur{filter:blur(12px) saturate(1.1);transform:scale(1.08);opacity:.3}
#cl-boot.l-summer .art.sharp{left:auto;right:5vw;width:calc(100vh * 1274 / 1800);max-width:58vw;background-size:contain;background-position:center;box-shadow:0 0 60px rgba(0,90,150,.25);-webkit-mask:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
#cl-boot.l-summer .v{background:linear-gradient(90deg,rgba(30,140,205,.55),rgba(70,180,230,.22) 45%,rgba(255,255,255,0) 70%)}
#cl-boot.l-summer .tag{position:absolute;left:70px;top:58px;display:flex;align-items:center;gap:12px;font-family:var(--cl-latin);font-style:italic;font-size:24px;letter-spacing:.2em;text-shadow:0 2px 10px rgba(0,60,120,.5)}
#cl-boot.l-summer .tag svg{width:30px;height:30px}
#cl-boot.l-summer .tag span{font-family:inherit;font-style:normal;font-size:12px;letter-spacing:.3em;padding:4px 10px;border-radius:999px;background:rgba(255,91,114,.9)}
#cl-boot.l-summer .box{left:70px;top:33vh}
#cl-boot.l-summer h1{font-family:var(--cl-latin);font-weight:600;font-size:min(10vw,104px);line-height:.9;text-shadow:0 6px 30px rgba(0,70,130,.45)}
#cl-boot.l-summer h2{font-family:var(--cl-serif);font-size:22px;letter-spacing:.8em;font-weight:500;margin-top:16px}
#cl-boot.l-summer .prog{display:none}
#cl-boot.l-summer .wave{position:absolute;left:74px;bottom:110px;width:380px;max-width:40vw}
#cl-boot.l-summer .wave .load{margin:0 0 10px;letter-spacing:.2em;text-shadow:0 2px 8px rgba(0,60,120,.6)}
#cl-boot.l-summer .wave .bar{height:14px;border-radius:999px;background:rgba(255,255,255,.3);overflow:hidden;position:relative}
#cl-boot.l-summer .wave .bar i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:999px;background:linear-gradient(90deg,#5cc8ff,#1d93d6);animation:cl-prog var(--cl-boot-ms) cubic-bezier(.4,.1,.3,1) forwards}
#cl-boot.l-summer .skip{top:56px;right:40px}
#cl-boot.l-summer .cap{left:74px;bottom:40px}
#cl-boot.l-summer .bub{position:absolute;border-radius:50%;border:1.5px solid rgba(255,255,255,.85);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0 12%,rgba(255,255,255,.08) 40%,rgba(160,220,255,.15));animation:cl-rise 6s linear infinite}

@keyframes cl-rise{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:.9}100%{transform:translate3d(var(--dx),-115vh,0);opacity:.2}}
#cl-boot.handoff,#cl-boot.handoff *{animation:none!important}
#cl-boot.handoff .prog i,#cl-boot.handoff .wave .bar i{width:100%}
`;

		/** 卡提希娅：背景动效 + 启动画面布局（DSH 自带启动页也要用，所以单独一段）。 */
		const CARTE_CSS = `
/* 苍风：风带 + 羽毛 */
.cl-wind{position:absolute;left:0;width:100%;height:120px;overflow:visible}
.cl-wind path{fill:none;stroke:rgba(255,255,255,.75);stroke-width:2;stroke-linecap:round;stroke-dasharray:180 1400;animation:cl-windrun var(--d) cubic-bezier(.45,.05,.55,.95) var(--delay) infinite;filter:drop-shadow(0 0 3px rgba(160,210,255,.9))}
@keyframes cl-windrun{0%{stroke-dashoffset:1580;opacity:0}12%{opacity:1}80%{opacity:.9}100%{stroke-dashoffset:0;opacity:0}}
.cl-feather{position:absolute;left:-6%;color:#fff;animation:cl-glide var(--d) linear var(--delay) infinite}
.cl-feather svg{display:block;width:var(--w);animation:cl-flutter calc(var(--d) / 5) ease-in-out infinite alternate;filter:drop-shadow(0 1px 2px rgba(40,90,150,.35))}
@keyframes cl-glide{0%{transform:translate3d(0,0,0)}25%{transform:translate3d(30vw,-4vh,0)}50%{transform:translate3d(60vw,5vh,0)}75%{transform:translate3d(90vw,-2vh,0)}100%{transform:translate3d(118vw,6vh,0)}}
@keyframes cl-flutter{0%{transform:rotate(var(--r0)) scaleX(1)}100%{transform:rotate(var(--r1)) scaleX(.55)}}
/* 月誓：萤火 + 星点 + 流星 */
.cl-fly{position:absolute;width:5px;height:5px;border-radius:50%;background:#fff6cf;box-shadow:0 0 8px 3px rgba(255,214,120,.75),0 0 22px 8px rgba(255,200,90,.25);animation:cl-wander var(--d) ease-in-out var(--delay) infinite alternate,cl-glow 3.2s ease-in-out var(--delay) infinite}
@keyframes cl-wander{0%{transform:translate(0,0)}33%{transform:translate(var(--x1),var(--y1))}66%{transform:translate(var(--x2),var(--y2))}100%{transform:translate(var(--x3),var(--y3))}}
@keyframes cl-glow{0%,100%{opacity:.15}50%{opacity:1}}
.cl-star2{position:absolute;width:2px;height:2px;border-radius:50%;background:#dfe7ff;box-shadow:0 0 4px 1px rgba(170,195,255,.8);animation:cl-tw var(--d) ease-in-out var(--delay) infinite}
@keyframes cl-tw{0%,100%{opacity:.1}50%{opacity:.9}}
.cl-shoot{position:absolute;width:140px;height:1.5px;background:linear-gradient(90deg,transparent,#dbe6ff);border-radius:2px;transform:rotate(-24deg);opacity:0;animation:cl-shoot 9s ease-in var(--delay) infinite}
@keyframes cl-shoot{0%,86%{opacity:0;transform:translate(0,0) rotate(-24deg)}88%{opacity:1}100%{opacity:0;transform:translate(-260px,116px) rotate(-24deg)}}
/* 潮汐：光束 + 波光 + 气泡 + 巨鲸 */
.cl-ray{position:absolute;top:-10%;width:var(--w);height:130%;background:linear-gradient(180deg,rgba(150,230,255,.32),rgba(150,230,255,0) 75%);transform-origin:50% 0;mix-blend-mode:screen;filter:blur(6px);animation:cl-raysway var(--d) ease-in-out var(--delay) infinite alternate}
@keyframes cl-raysway{0%{transform:rotate(var(--r0));opacity:.25}100%{transform:rotate(var(--r1));opacity:.7}}
.cl-caus{position:absolute;inset:-20%;background:radial-gradient(ellipse 60px 26px at 20% 30%,rgba(170,240,255,.22),transparent 70%),radial-gradient(ellipse 80px 30px at 60% 55%,rgba(170,240,255,.18),transparent 70%),radial-gradient(ellipse 50px 22px at 80% 20%,rgba(170,240,255,.2),transparent 70%),radial-gradient(ellipse 70px 28px at 35% 80%,rgba(170,240,255,.16),transparent 70%);background-size:340px 260px;mix-blend-mode:screen;animation:cl-causmove 14s linear infinite}
.cl-caus.b{background-size:420px 300px;animation-duration:22s;animation-direction:reverse;opacity:.8}
@keyframes cl-causmove{to{transform:translate(340px,130px)}}
.cl-bub2{position:absolute;bottom:-4%;border-radius:50%;border:1.2px solid rgba(200,245,255,.8);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.85) 0 12%,rgba(255,255,255,.05) 45%,rgba(120,220,255,.12));animation:cl-rise2 var(--d) linear var(--delay) infinite}
@keyframes cl-rise2{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:.9}50%{transform:translate3d(var(--dx),-55vh,0)}100%{transform:translate3d(0,-112vh,0);opacity:.15}}
.cl-whale{position:absolute;bottom:6%;left:-40%;width:46%;color:rgba(120,200,240,.2);animation:cl-swim 46s linear infinite}
.cl-whale svg{width:100%;display:block;animation:cl-undulate 6s ease-in-out infinite}
@keyframes cl-swim{0%{transform:translateX(0)}100%{transform:translateX(330%)}}
@keyframes cl-undulate{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-14px) rotate(1.5deg)}}
.cl-ring{position:absolute;width:20px;height:20px;margin:-10px;border-radius:50%;border:2px solid rgba(190,245,255,.8);animation:cl-ripple 3.6s ease-out var(--delay) infinite}
@keyframes cl-ripple{0%{transform:scale(.2);opacity:.9}100%{transform:scale(16);opacity:0;border-width:.5px}}
/* 花野：小黄花瓣 + 蝴蝶 */
.cl-pet{position:absolute;left:-4%;animation:cl-blow var(--d) linear var(--delay) infinite}
.cl-pet svg{display:block;width:var(--w);animation:cl-tumble calc(var(--d) / 4) linear infinite}
@keyframes cl-blow{0%{transform:translate3d(0,0,0)}30%{transform:translate3d(34vw,12vh,0)}60%{transform:translate3d(68vw,4vh,0)}100%{transform:translate3d(112vw,22vh,0)}}
@keyframes cl-tumble{to{transform:rotate(360deg)}}
.cl-bfly{position:absolute;color:#7fb6e6;animation:cl-flit var(--d) ease-in-out var(--delay) infinite alternate}
.cl-bfly svg{width:22px;display:block}
.cl-bfly .wl,.cl-bfly .wr{transform-box:fill-box;animation:cl-flap .32s ease-in-out infinite alternate}
.cl-bfly .wl{transform-origin:100% 50%}.cl-bfly .wr{transform-origin:0% 50%}
@keyframes cl-flap{0%{transform:scaleX(1)}100%{transform:scaleX(.25)}}
@keyframes cl-flit{0%{transform:translate(0,0)}25%{transform:translate(120px,-50px)}50%{transform:translate(220px,20px)}75%{transform:translate(320px,-70px)}100%{transform:translate(420px,-10px)}}
/* 海风：海鸥 + 波光 + 泡泡 */
.cl-gull{position:absolute;left:-8%;color:#fff;animation:cl-soar var(--d) linear var(--delay) infinite}
.cl-gull svg{width:var(--w);display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(20,80,120,.25))}
.cl-gull .w{transform-origin:50% 60%;transform-box:fill-box;animation:cl-gflap 1.1s ease-in-out infinite alternate}
@keyframes cl-gflap{0%{transform:scaleY(1)}100%{transform:scaleY(-.35)}}
@keyframes cl-soar{0%{transform:translate3d(0,0,0)}50%{transform:translate3d(58vw,-5vh,0)}100%{transform:translate3d(118vw,3vh,0)}}
.cl-glint{position:absolute;width:var(--w);height:var(--w);color:#fff;animation:cl-glint var(--d) ease-in-out var(--delay) infinite}
.cl-glint svg{width:100%;height:100%;display:block;filter:drop-shadow(0 0 4px rgba(255,255,255,.9))}
@keyframes cl-glint{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}

/* ---------- 卡提希娅启动画面 ---------- */
#cl-boot.l-carte{background:var(--cb-base,#0a0e1c);color:#fff}
#cl-boot.l-carte.lt{color:#3a3a2e}
#cl-boot.l-carte .art.blur{inset:-40px;filter:blur(28px) saturate(1.1);transform:scale(1.08)}
#cl-boot.l-carte .art.sharp{left:auto;right:4vw;width:var(--cb-w,40vw);background-size:contain;background-repeat:no-repeat;-webkit-mask:linear-gradient(90deg,transparent,#000 7%);mask:linear-gradient(90deg,transparent,#000 7%);animation:cl-cb-art 1.6s cubic-bezier(.2,.7,.2,1) both}
#cl-boot.l-carte .art.full{animation:cl-zoom calc(var(--cl-boot-ms) + 3000ms) ease-out both}
@keyframes cl-cb-art{0%{opacity:0;transform:translateX(40px) scale(1.04)}100%{opacity:1;transform:none}}
#cl-boot.l-carte .dec{position:absolute;inset:0;overflow:hidden;pointer-events:none}
#cl-boot.l-carte .box{left:7vw;top:50%;width:46vw;transform:translateY(-50%);animation:none}
#cl-boot.l-carte .k1{font-family:var(--cl-hand);font-size:min(3vw,32px);color:var(--cb-k1);animation:cl-cb-up .9s .2s ease-out both}
#cl-boot.l-carte h1{display:flex;font-family:var(--cl-latin);font-weight:600;font-size:min(9vw,112px);line-height:1;letter-spacing:.01em;margin:6px 0 4px;animation:none}
#cl-boot.l-carte h1 span{display:inline-block;background:var(--cb-grad);background-size:1000% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:cl-cb-letter .8s cubic-bezier(.2,.8,.2,1) both;filter:drop-shadow(0 4px 18px rgba(0,0,0,.25))}
@keyframes cl-cb-letter{0%{opacity:0;transform:translateY(36px) rotate(6deg)}100%{opacity:1;transform:none}}
#cl-boot.l-carte h2{font-family:var(--cl-serif);font-weight:500;font-size:min(2.4vw,26px);letter-spacing:.6em;animation:cl-cb-up .9s 1s ease-out both}
#cl-boot.l-carte .rule{display:flex;align-items:center;gap:12px;width:76%;margin:20px 0 14px;color:var(--cb-rule);animation:cl-cb-up .9s 1.2s ease-out both}
#cl-boot.l-carte .rule i{height:1px;flex:1;background:linear-gradient(90deg,transparent,currentColor,transparent);opacity:.8}
#cl-boot.l-carte .rule img{width:30px;height:30px}
#cl-boot.l-carte .load{font-size:14px;letter-spacing:.2em;margin:0;animation:cl-cb-up .9s 1.4s ease-out both}
#cl-boot.l-carte .prog{width:76%;height:3px;margin-top:14px;border-radius:3px;background:rgba(255,255,255,.2);overflow:hidden;animation:cl-cb-up .6s 1.4s both}
#cl-boot.l-carte.lt .prog{background:rgba(60,60,40,.12)}
#cl-boot.l-carte .prog i{top:0;height:100%;border-radius:3px;background:var(--cb-grad);background-size:200% 100%}
#cl-boot.l-carte .prog i::after{display:none}
@keyframes cl-cb-up{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
#cl-boot.l-carte .skip{right:34px;top:30px}
#cl-boot.l-carte .cap{right:24px;bottom:18px}
#cl-boot.l-carte .sweep{position:absolute;left:-60%;top:0;bottom:0;width:60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.5) 45%,rgba(200,230,255,.2) 55%,transparent);mix-blend-mode:screen;animation:cl-cb-sweep 3.6s .4s ease-in-out infinite}
@keyframes cl-cb-sweep{0%{transform:translateX(0) skewX(-12deg)}60%,100%{transform:translateX(280%) skewX(-12deg)}}
#cl-boot.l-carte .moonglow{position:absolute;right:15vw;top:50%;width:60vh;height:60vh;margin-top:-30vh;border-radius:50%;background:radial-gradient(circle,rgba(220,232,255,.38),rgba(160,190,255,.1) 45%,transparent 70%);animation:cl-cb-breathe 4s ease-in-out infinite}
@keyframes cl-cb-breathe{0%,100%{transform:scale(.92);opacity:.6}50%{transform:scale(1.06);opacity:1}}

/* ---------- 爱弥斯：启动画面补充 ---------- */
#cl-boot.l-carte h2.en{font-family:var(--cl-latin);font-style:italic;font-weight:500;font-size:min(3.2vw,36px);letter-spacing:.04em;margin-top:6px}
#cl-boot.l-carte .load.fancy{font-size:min(1.9vw,22px);letter-spacing:.14em;background:var(--cb-load);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 1px 2px rgba(0,0,0,.18));animation:cl-cb-up .9s 1.4s ease-out both,cl-loadflow 4s linear infinite}
@keyframes cl-loadflow{0%{background-position:0% 50%}100%{background-position:300% 50%}}
#cl-boot.l-carte .scanl{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 3px);mix-blend-mode:overlay;pointer-events:none}
#cl-boot.l-carte .sbadge{position:absolute;left:7vw;top:9vh;z-index:2;display:flex;align-items:center;gap:10px;font-family:var(--cl-latin);font-style:italic;font-weight:600;font-size:22px;letter-spacing:.12em;color:#fff;text-shadow:0 2px 10px rgba(0,60,120,.5);animation:cl-cb-up .8s .2s ease-out both}
#cl-boot.l-carte .sbadge svg{width:30px;height:30px}
#cl-boot.l-carte .sbadge span{font-family:var(--dsw-font-family,inherit);font-style:normal;font-size:12px;letter-spacing:.3em;padding:5px 11px;border-radius:999px;background:linear-gradient(90deg,#ff8a5b,#ff5f8f)}

/* ---------- 爱弥斯：背景动效 ---------- */
.cl-spot{position:absolute;top:-12%;width:var(--w);height:125%;transform-origin:50% 0;background:linear-gradient(180deg,rgba(255,160,210,.42),rgba(255,160,210,.12) 55%,transparent 85%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);mix-blend-mode:screen;filter:blur(3px);animation:cl-spot var(--d) ease-in-out var(--delay) infinite alternate}
.cl-spot.c{background:linear-gradient(180deg,rgba(120,235,255,.4),rgba(120,235,255,.1) 55%,transparent 85%)}
@keyframes cl-spot{0%{transform:rotate(var(--r0));opacity:.45}100%{transform:rotate(var(--r1));opacity:.9}}
.cl-note{position:absolute;bottom:-6%;color:var(--c);animation:cl-noteup var(--d) linear var(--delay) infinite}
.cl-note svg{display:block;width:var(--w);filter:drop-shadow(0 0 6px currentColor);animation:cl-sway2 2.6s ease-in-out infinite alternate}
@keyframes cl-noteup{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:.95}100%{transform:translate3d(var(--dx),-112vh,0);opacity:0}}
@keyframes cl-sway2{0%{transform:rotate(-14deg)}100%{transform:rotate(14deg)}}
.cl-stick{position:absolute;width:var(--w);height:var(--w);border-radius:50%;background:radial-gradient(circle,var(--c),transparent 68%);mix-blend-mode:screen;animation:cl-pulse var(--d) ease-in-out var(--delay) infinite}
@keyframes cl-pulse{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:.9;transform:scale(1.15)}}
.cl-gbar{position:absolute;left:0;right:0;height:var(--h);background:linear-gradient(90deg,transparent,rgba(127,233,255,.55) 20%,rgba(255,111,174,.55) 60%,transparent);mix-blend-mode:screen;opacity:0;animation:cl-gbar 6s steps(1) var(--delay) infinite}
@keyframes cl-gbar{0%,90%,100%{opacity:0;transform:none}91%{opacity:.9;transform:translateX(-14px)}93%{opacity:.6;transform:translateX(18px)}95%{opacity:0}}
.cl-star3{position:absolute;width:2px;height:2px;border-radius:50%;background:#eef0ff;box-shadow:0 0 4px 1px rgba(190,180,255,.8);animation:cl-tw var(--d) ease-in-out var(--delay) infinite}
.cl-trail{position:absolute;width:var(--w);height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,rgba(255,143,196,.55) 55%,#fff);box-shadow:0 0 10px rgba(255,180,220,.8);transform:rotate(var(--r));opacity:0;animation:cl-trail var(--d) cubic-bezier(.3,.1,.4,1) var(--delay) infinite}
.cl-trail::after{content:"";position:absolute;right:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,215,140,.6) 45%,transparent 70%)}
@keyframes cl-trail{0%{opacity:0;transform:rotate(var(--r)) translateX(-30vw)}12%{opacity:1}70%{opacity:1}100%{opacity:0;transform:rotate(var(--r)) translateX(110vw)}}
.cl-pix{position:absolute;bottom:-3%;width:var(--w);height:var(--w);background:var(--c);opacity:0;animation:cl-pixup var(--d) linear var(--delay) infinite}
@keyframes cl-pixup{0%{opacity:0;transform:translateY(0)}10%{opacity:.8}45%{opacity:.2}55%{opacity:.8}100%{opacity:0;transform:translateY(-70vh)}}
.cl-pole{position:absolute;width:var(--w);color:#ffe3a0;animation:cl-polepulse 4s ease-in-out infinite;filter:drop-shadow(0 0 10px rgba(255,220,150,.9))}
.cl-pole svg{display:block;width:100%}
@keyframes cl-polepulse{0%,100%{transform:scale(.85) rotate(0);opacity:.7}50%{transform:scale(1.1) rotate(20deg);opacity:1}}
.cl-ring2{position:absolute;width:var(--w);height:var(--w);color:var(--c);animation:cl-rot var(--d) linear infinite;opacity:.55}
.cl-ring2 svg{width:100%;height:100%;display:block}
.cl-ring2.r{animation-direction:reverse}
.cl-scan2{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(47,127,216,.75) 30%,rgba(255,127,176,.75) 70%,transparent);box-shadow:0 0 12px rgba(80,160,240,.7);animation:cl-scan2 var(--d) linear var(--delay) infinite}
@keyframes cl-scan2{0%{top:-2%;opacity:0}8%{opacity:.9}92%{opacity:.9}100%{top:102%;opacity:0}}
.cl-hexg{position:absolute;width:var(--w);color:var(--c);animation:cl-hexblink var(--d) ease-in-out var(--delay) infinite}
.cl-hexg svg{width:100%;display:block}
@keyframes cl-hexblink{0%,100%{opacity:0;transform:scale(.8)}40%,60%{opacity:.75;transform:scale(1)}}
.cl-readout{position:absolute;font:600 11px/1.5 Consolas,"Cascadia Mono",monospace;letter-spacing:.18em;color:#2f7fd8;opacity:.7;white-space:nowrap}
.cl-readout b{color:#e0507f;font-weight:700}
.cl-readout i{display:inline-block;width:7px;height:12px;background:#2f7fd8;vertical-align:-2px;margin-left:4px;animation:cl-blink 1s steps(1) infinite}
@keyframes cl-blink{50%{opacity:0}}
.cl-plane{position:absolute;left:-8%;color:#fff;animation:cl-fly var(--d) ease-in-out var(--delay) infinite}
.cl-plane svg{display:block;width:var(--w);filter:drop-shadow(0 3px 4px rgba(90,110,160,.35))}
@keyframes cl-fly{0%{transform:translate3d(0,0,0) rotate(-6deg);opacity:0}6%{opacity:1}35%{transform:translate3d(38vw,-8vh,0) rotate(4deg)}65%{transform:translate3d(74vw,4vh,0) rotate(-8deg)}94%{opacity:1}100%{transform:translate3d(118vw,-6vh,0) rotate(2deg);opacity:0}}
.cl-doodle{position:absolute;color:var(--c);animation:cl-doodle var(--d) ease-in-out var(--delay) infinite}
.cl-doodle svg{display:block;width:var(--w)}
@keyframes cl-doodle{0%,100%{opacity:0;transform:scale(.4) rotate(-20deg)}20%,70%{opacity:.85;transform:scale(1) rotate(8deg)}45%{transform:scale(1.08) rotate(-6deg) translateY(-8px)}}
.cl-crys{position:absolute;bottom:-5%;color:#7fe9ff;animation:cl-rise2 var(--d) linear var(--delay) infinite}
.cl-crys svg{display:block;width:var(--w);filter:drop-shadow(0 0 6px rgba(127,233,255,.9))}
.cl-sun{position:absolute;left:var(--sx,10%);top:-22%;width:var(--sw,30vw);aspect-ratio:1;pointer-events:none;opacity:.85}
.cl-sun i{position:absolute;display:block}
.cl-sun .core{inset:32%;border-radius:50%;background:radial-gradient(circle,rgba(255,252,235,.95) 0,rgba(255,241,176,.7) 35%,rgba(255,214,110,.3) 58%,transparent 72%);animation:cl-sunpulse 4s ease-in-out infinite}
.cl-sun .rays{inset:0;background:repeating-conic-gradient(from 0deg,rgba(255,236,160,.38) 0 5deg,transparent 5deg 18deg);-webkit-mask:radial-gradient(circle,transparent 18%,#000 30%,transparent 70%);mask:radial-gradient(circle,transparent 18%,#000 30%,transparent 70%);animation:cl-rot 40s linear infinite}
@keyframes cl-sunpulse{0%,100%{transform:scale(.95);opacity:.85}50%{transform:scale(1.06);opacity:1}}
.cl-flare{position:absolute;border-radius:50%;mix-blend-mode:screen;background:radial-gradient(circle,rgba(255,240,190,.5),rgba(255,180,120,.12) 60%,transparent 70%);animation:cl-sunpulse 5s ease-in-out infinite}
.cl-palm{position:absolute;color:rgba(20,90,80,.28);transform-origin:0 0;animation:cl-palmsway 5s ease-in-out infinite alternate;pointer-events:none}
.cl-palm.r{transform-origin:100% 0;animation-name:cl-palmsway-r;animation-duration:6.5s}
.cl-palm svg{display:block;width:100%}
@keyframes cl-palmsway{0%{transform:rotate(-3deg)}100%{transform:rotate(4deg)}}
@keyframes cl-palmsway-r{0%{transform:scaleX(-1) rotate(-3deg)}100%{transform:scaleX(-1) rotate(4deg)}}
.cl-waves{position:absolute;left:0;right:0;bottom:0;height:16%;pointer-events:none;overflow:hidden}
.cl-waves svg{position:absolute;left:0;bottom:0;width:200%;height:100%;animation:cl-wavemove var(--d) linear infinite}
@keyframes cl-wavemove{to{transform:translateX(-50%)}}
.cl-ball{position:absolute;width:var(--w);animation:cl-bounce 2.6s cubic-bezier(.5,0,.5,1) infinite alternate;filter:drop-shadow(0 6px 6px rgba(0,60,100,.25))}
.cl-ball svg{display:block;width:100%;animation:cl-rot 6s linear infinite}
@keyframes cl-bounce{0%{transform:translateY(0)}100%{transform:translateY(-26px)}}
@keyframes cl-rot{to{transform:rotate(360deg)}}

/* ---------- 达妮娅：背景动效 ---------- */
.cl-ibub{position:absolute;bottom:-6%;border-radius:50%;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.95) 0 9%,rgba(255,255,255,0) 22%),conic-gradient(from 30deg,rgba(255,150,200,.35),rgba(170,150,255,.3),rgba(120,200,255,.32),rgba(150,255,220,.25),rgba(255,230,150,.3),rgba(255,150,200,.35));-webkit-mask:radial-gradient(circle,transparent 55%,#000 64%);mask:radial-gradient(circle,transparent 55%,#000 64%);animation:cl-ibub var(--d) linear var(--delay) infinite}
@keyframes cl-ibub{0%{transform:translate3d(0,0,0) scale(1);opacity:0}8%{opacity:.95}50%{transform:translate3d(var(--dx),-55vh,0) scale(1)}88%{transform:translate3d(0,-96vh,0) scale(1);opacity:.95}92%{transform:translate3d(0,-98vh,0) scale(1.5);opacity:0}100%{transform:translate3d(0,-98vh,0) scale(1.5);opacity:0}}
.cl-dolls{position:absolute;width:var(--w);color:rgba(40,30,60,.55);transform-origin:50% 0;animation:cl-dollsway var(--d) ease-in-out var(--delay) infinite alternate}
.cl-dolls svg{display:block;width:100%}
@keyframes cl-dollsway{0%{transform:rotate(-4deg)}100%{transform:rotate(4deg)}}
.cl-zz{position:absolute;font-family:var(--cl-latin);font-style:italic;font-weight:600;line-height:1;color:#9a8be0;opacity:0;animation:cl-zz var(--d) ease-out var(--delay) infinite}
@keyframes cl-zz{0%{opacity:0;transform:translate(0,0) scale(.6)}20%{opacity:.85}100%{opacity:0;transform:translate(40px,-70px) scale(1.3)}}
.cl-hole{position:absolute;width:var(--w);height:var(--w);pointer-events:none}
.cl-hole i{position:absolute;display:block;border-radius:50%}
.cl-hole .disk{inset:24% -6%;background:radial-gradient(ellipse closest-side,transparent 52%,rgba(255,200,235,.95) 58%,rgba(255,120,190,.75) 66%,rgba(160,120,255,.55) 78%,transparent 100%);transform:rotate(-16deg);animation:cl-diskglow 3.2s ease-in-out infinite alternate;filter:blur(.6px)}
.cl-hole::after{content:"";position:absolute;inset:-20%;border-radius:50%;background:conic-gradient(from 0deg,transparent,rgba(201,184,255,.25),transparent 30%,rgba(111,216,255,.2),transparent 60%,rgba(255,143,196,.22),transparent);-webkit-mask:radial-gradient(circle,transparent 30%,#000 45%,transparent 70%);mask:radial-gradient(circle,transparent 30%,#000 45%,transparent 70%);animation:cl-rot 18s linear infinite}
@keyframes cl-diskglow{0%{opacity:.75;transform:rotate(-16deg) scale(.97)}100%{opacity:1;transform:rotate(-16deg) scale(1.03)}}
.cl-hole .core{inset:36%;background:radial-gradient(circle,#000 56%,rgba(255,210,240,.95) 60%,rgba(170,130,255,.7) 66%,transparent 76%);box-shadow:0 0 50px 14px rgba(140,100,255,.45),0 0 120px 30px rgba(255,110,180,.18)}
.cl-pull{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--c);box-shadow:0 0 6px var(--c);animation:cl-pull var(--d) cubic-bezier(.5,0,.9,.6) var(--delay) infinite}
@keyframes cl-pull{0%{transform:rotate(var(--r0)) translateX(var(--rad)) scale(1);opacity:0}15%{opacity:1}100%{transform:rotate(calc(var(--r0) + 300deg)) translateX(0) scale(.2);opacity:0}}
.cl-aeye{position:absolute;width:var(--w);opacity:.55;animation:cl-eyeopen 7s ease-in-out infinite;filter:drop-shadow(0 0 12px rgba(140,100,255,.8))}
.cl-aeye svg{display:block;width:100%}
@keyframes cl-eyeopen{0%,60%,100%{transform:scaleY(.05);opacity:0}68%,88%{transform:scaleY(1);opacity:.6}}
.cl-tblock{position:absolute;top:-8%;color:rgba(160,140,255,.35);animation:cl-tfall var(--d) linear var(--delay) infinite}
.cl-tblock svg{display:block;width:44px;filter:drop-shadow(0 0 6px rgba(140,100,255,.6))}
@keyframes cl-tfall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(118vh) rotate(90deg)}}
.cl-dchain{position:absolute;display:flex;align-items:flex-start;color:rgba(230,226,245,.55);transform-origin:50% 0;animation:cl-dollsway 6s ease-in-out infinite alternate}
.cl-dchain i{display:block}
.cl-dchain .row svg{display:block;width:170px}
.cl-dchain .last{width:34px;margin-left:-2px;animation:cl-letgo 12s ease-in infinite}
.cl-dchain .last svg{display:block;width:100%}
@keyframes cl-letgo{0%,30%{transform:none;opacity:1}45%{transform:translate(6px,4px) rotate(10deg);opacity:1}100%{transform:translate(220px,260px) rotate(70deg);opacity:0}}
.cl-ash{position:absolute;top:-3%;width:var(--w);height:var(--w);background:rgba(220,222,235,.7);border-radius:1px;animation:cl-ashfall var(--d) linear var(--delay) infinite}
@keyframes cl-ashfall{0%{transform:translate3d(0,0,0) rotate(0);opacity:0}10%{opacity:.7}100%{transform:translate3d(var(--dx),108vh,0) rotate(200deg);opacity:0}}
.cl-lie{position:absolute;font-family:var(--cl-latin);font-style:italic;font-weight:500;font-size:17px;letter-spacing:.08em;color:rgba(225,222,240,.7);white-space:nowrap;opacity:0;animation:cl-lie var(--d) ease-in-out var(--delay) infinite}
@keyframes cl-lie{0%,100%{opacity:0;filter:blur(3px);transform:translateY(6px)}30%,55%{opacity:.75;filter:blur(0);transform:none}80%{opacity:0;filter:blur(4px);transform:translateY(-10px)}}
.cl-ember{position:absolute;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle,#fff1d6,#ffb877 50%,transparent 72%);box-shadow:0 0 22px 10px rgba(255,170,100,.35);animation:cl-ember 7s ease-in-out infinite}
@keyframes cl-ember{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:.18;transform:scale(.6)}}
.cl-ofloat{position:absolute;bottom:-8%;animation:cl-rise2 var(--d) linear var(--delay) infinite}
.cl-ofloat svg{display:block;width:var(--w);animation:cl-rot 9s linear infinite;filter:drop-shadow(0 3px 4px rgba(200,100,30,.25))}
.cl-candle{position:absolute;width:10px;height:46px}
.cl-candle i{display:block}
.cl-candle .stick{position:absolute;left:0;right:0;bottom:0;height:34px;border-radius:3px}
.cl-candle .flame{position:absolute;left:50%;top:0;width:10px;height:14px;margin-left:-5px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 50% 70%,#fff8d0,#ffc23a 55%,#ff7a2a);box-shadow:0 0 14px 4px rgba(255,190,80,.6);animation:cl-flick .18s ease-in-out infinite alternate}
@keyframes cl-flick{0%{transform:scale(1,1)}100%{transform:scale(.88,1.12) translateY(-1px)}}
.cl-confetti{position:absolute;top:-4%;width:7px;height:12px;background:var(--c);border-radius:2px;animation:cl-confall var(--d) linear var(--delay) infinite}
@keyframes cl-confall{0%{transform:translate3d(0,0,0) rotate(0);opacity:0}8%{opacity:.95}100%{transform:translate3d(var(--dx),110vh,0) rotate(var(--r));opacity:.5}}
.cl-soda{position:absolute;bottom:-3%;border-radius:50%;border:1.5px solid rgba(255,255,255,.9);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0 18%,rgba(255,255,255,.08) 50%);animation:cl-soda var(--d) cubic-bezier(.4,0,.8,.6) var(--delay) infinite}
@keyframes cl-soda{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:.95}100%{transform:translate3d(var(--dx),-100vh,0);opacity:0}}
.cl-bobf{position:absolute;animation:cl-bob2 var(--d) ease-in-out var(--delay) infinite alternate}
.cl-bobf svg{display:block;width:var(--w)}
@keyframes cl-bob2{0%{transform:translateY(0) rotate(-8deg)}100%{transform:translateY(-10px) rotate(8deg)}}
.cl-chainv{position:absolute;top:-10px;width:14px;height:var(--len);overflow:hidden;color:rgba(160,220,210,.55);transform-origin:50% 0;animation:cl-hswing var(--d) ease-in-out var(--delay) infinite alternate;filter:drop-shadow(0 0 4px rgba(125,255,216,.4))}
.cl-chainv svg{display:block;width:100%}
@keyframes cl-hswing{0%{transform:rotate(-8deg)}100%{transform:rotate(8deg)}}
.cl-steam{position:absolute;width:22px;color:rgba(255,255,255,.75);animation:cl-steam var(--d) ease-out var(--delay) infinite}
.cl-steam svg{display:block;width:100%}
@keyframes cl-steam{0%{opacity:0;transform:translateY(10px) scaleY(.7)}30%{opacity:.8}100%{opacity:0;transform:translateY(-60px) scaleY(1.2)}}
.cl-rglyph{position:absolute;width:var(--w);height:var(--w);margin:calc(var(--w) / -2);color:var(--c);filter:drop-shadow(0 0 6px currentColor);animation:cl-rglyph var(--d) ease-in-out var(--delay) infinite}
.cl-rglyph svg{display:block;width:100%;height:100%}
@keyframes cl-rglyph{0%,100%{opacity:.15;transform:scale(.8) rotate(-10deg)}50%{opacity:1;transform:scale(1.08) rotate(10deg)}}
.cl-rlines{position:absolute;inset:0;width:100%;height:100%}
.cl-rlines line{stroke:rgba(255,220,140,.55);stroke-width:.25;stroke-dasharray:60;stroke-dashoffset:60;animation:cl-rline 6s ease-in-out var(--delay) infinite;filter:drop-shadow(0 0 1px #ffd36e)}
@keyframes cl-rline{0%{stroke-dashoffset:60;opacity:0}40%,60%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:-60;opacity:0}}
.cl-mote{position:absolute;bottom:-3%;width:var(--w);height:var(--w);border-radius:50%;background:#ffe39a;box-shadow:0 0 8px 2px rgba(255,200,90,.7);animation:cl-moteup var(--d) linear var(--delay) infinite}
@keyframes cl-moteup{0%{transform:translate3d(0,0,0);opacity:0}15%{opacity:.9}100%{transform:translate3d(var(--dx),-100vh,0);opacity:0}}
.cl-gust{position:absolute;left:-30%;width:30%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);animation:cl-gust var(--d) ease-in-out var(--delay) infinite}
@keyframes cl-gust{0%{transform:translateX(0);opacity:0}20%{opacity:1}100%{transform:translateX(450%);opacity:0}}
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
/* 电子幽灵的故障闪烁（爱弥斯） */
.cl-glitch{position:relative}
.cl-glitch::before{content:attr(data-t);position:absolute;inset:0;background:inherit;background-size:inherit;-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0;pointer-events:none;animation:cl-glitch 5.5s steps(1) infinite}
@keyframes cl-glitch{0%,88%,100%{opacity:0;transform:none;clip-path:none;filter:none}89%{opacity:.85;transform:translate(-3px,0);clip-path:inset(10% 0 55% 0);filter:hue-rotate(60deg)}91%{opacity:.85;transform:translate(3px,0);clip-path:inset(60% 0 8% 0);filter:hue-rotate(-60deg)}93%{opacity:0}}
.cl-brand-tag{display:inline-flex;align-items:center;gap:3px;height:17px;padding:0 7px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--cl-gold);border:1px solid rgba(var(--cl-gold-rgb),.65);background:rgba(var(--cl-gold-rgb),.1)}
.cl-brand-tag::before{content:"";width:5px;height:5px;transform:rotate(45deg);background:currentColor}

/* ---------- 首页中间标题 ---------- */
html[data-cl-on] [class*="_titleGroup"]{position:relative;overflow:visible}
html[data-cl-on] [class*="_titleGroup"] > span:first-child{font-family:var(--cl-title-font,var(--cl-serif));font-weight:700;letter-spacing:.14em;background:var(--cl-title-grad);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:cl-sheen 8s linear infinite;filter:drop-shadow(0 2px 10px rgba(var(--cl-acc-rgb),.35))}
html[data-cl-on] [class*="_titleGroup"]::before{content:var(--cl-eyebrow);position:absolute;left:-60px;right:-60px;bottom:calc(100% + 6px);text-align:center;font-family:var(--cl-eyebrow-font,var(--cl-latin));font-style:italic;font-size:var(--cl-eyebrow-size,14px);letter-spacing:.32em;color:var(--cl-gold);white-space:nowrap;pointer-events:none;text-shadow:0 1px 8px rgba(var(--cl-gold-rgb),.35);transform:translateX(var(--cl-hero-shift,0px))}
html[data-cl-on] [class*="_titleGroup"]::after{content:"";position:absolute;left:-24px;right:-24px;top:calc(100% + 8px);height:12px;background:var(--cl-orn) center/100% 100% no-repeat;pointer-events:none;opacity:.95;transform:translateX(var(--cl-hero-shift,0px))}
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

`+BOOT_CSS+CARTE_CSS+`
/* ---------- 设置页 ---------- */
.cl-set{display:flex;flex-direction:column;gap:18px;padding:4px 0 24px;font-size:13px;color:var(--dsw-alias-label-primary);position:relative}
.cl-set .cl-hd{display:flex;align-items:flex-end;gap:12px}
.cl-set .cl-hd b{font-family:var(--cl-serif);font-size:20px;letter-spacing:.12em}
.cl-set .cl-hd i{font-family:var(--cl-latin);font-style:italic;color:var(--cl-gold);font-size:15px;letter-spacing:.2em}
.cl-set .cl-blk{display:flex;flex-direction:column;gap:10px}
.cl-set .cl-h{font-size:13px;font-weight:600;line-height:20px;display:flex;align-items:center;gap:8px}
.cl-set .cl-h::before{content:"";width:6px;height:6px;transform:rotate(45deg);border:1px solid var(--cl-gold)}
.cl-set .cl-hint{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.cl-set .cl-grp{display:flex;flex-direction:column;gap:8px}
.cl-set .cl-grp+.cl-grp{margin-top:6px}
.cl-set .cl-grp-h{display:flex;align-items:baseline;gap:8px}
.cl-set .cl-grp-h b{font-family:var(--cl-serif);font-size:14px;letter-spacing:.2em}
.cl-set .cl-grp-h i{font-family:var(--cl-latin);font-style:italic;font-size:13px;letter-spacing:.12em;color:var(--cl-gold)}
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
		// 卡提希娅的五个徽章：枝角冠 / 月牙 + 枝 / 浪花 / 四瓣小黄花 / 扇贝。c = 线条色，g = 点缀色
		const CARTE_MARKS = {
			crown: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 44c7-5 15-7 23-7s16 2 23 7"/><path d="M22 38c-2-8-6-13-13-17M15 29c-4-1-8 0-11 3M13 24c0-5-2-9-5-12M26 37c0-7 1-12 4-17"/><path d="M42 38c2-8 6-13 13-17M49 29c4-1 8 0 11 3M51 24c0-5 2-9 5-12M38 37c0-7-1-12-4-17"/><path d="M32 24l5 8-5 8-5-8z" fill="${g}" stroke="${g}" stroke-width="1.5"/></svg>`,
			moon: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"><path d="M40 10a22 22 0 1 0 14 36A18 18 0 0 1 40 10z" fill="${c}" fill-opacity=".2"/><path d="M30 50c-1-8 2-15 8-21M34 40c-4-2-7-2-10 0M36 34c0-4 2-7 5-9" stroke="${g}"/><circle cx="48" cy="18" r="1.8" fill="${g}" stroke="none"/><circle cx="56" cy="30" r="1.3" fill="${g}" stroke="none"/></svg>`,
			wave: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 40c6-6 12-6 18 0s12 6 18 0 12-6 16-2"/><path d="M6 50c6-6 12-6 18 0s12 6 18 0 12-6 16-2" opacity=".55"/><path d="M14 30c2-10 10-17 20-17 8 0 13 5 13 11 0 5-4 8-8 8-3 0-5-2-5-5"/><path d="M32 6l3 5-3 5-3-5z" fill="${g}" stroke="${g}" stroke-width="1.2"/></svg>`,
			blossom: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="${c}"><ellipse cx="32" cy="17" rx="9" ry="12"/><ellipse cx="32" cy="47" rx="9" ry="12"/><ellipse cx="17" cy="32" rx="12" ry="9"/><ellipse cx="47" cy="32" rx="12" ry="9"/></g><circle cx="32" cy="32" r="7" fill="#fff8dc"/><circle cx="32" cy="32" r="3.2" fill="${g}"/></svg>`,
			shell: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 54L8 30c4-12 13-19 24-19s20 7 24 19z" fill="${g}" fill-opacity=".28"/><path d="M32 54V12M32 54L19 15M32 54L45 15M32 54L11 24M32 54L53 24"/><path d="M26 54h12"/></svg>`,
		};
		// 爱弥斯的五个徽章：心形水晶 / 启明星 / 兵装核心 / 亮灯小房子 / 海星
		Object.assign(CARTE_MARKS, {
			heart: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="3.2" stroke-linejoin="round"><ellipse cx="32" cy="12" rx="15" ry="4.5" stroke="${g}"/><path d="M32 54L14 36c-6-6-4-16 4-17 6-1 10 3 14 8 4-5 8-9 14-8 8 1 10 11 4 17z" fill="${c}" fill-opacity=".22"/><path d="M32 30l4 6-4 6-4-6z" fill="${g}" stroke="none"/></svg>`,
			polestar: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="2.6"><ellipse cx="32" cy="34" rx="27" ry="10" transform="rotate(-18 32 34)" opacity=".75"/><path d="M32 6C34 24 38 28 56 32 38 36 34 40 32 58 30 40 26 36 8 32 26 28 30 24 32 6z" fill="${g}" stroke="none"/><circle cx="54" cy="22" r="2.4" fill="${c}" stroke="none"/></svg>`,
			core: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"><path d="M32 8l18 10v22L32 50 14 40V18z" fill="${c}" fill-opacity=".14"/><path d="M32 38l-7-7c-2.5-2.5-1.5-6.5 1.5-7 2-.3 3.8.9 5.5 3 1.7-2.1 3.5-3.3 5.5-3 3 .5 4 4.5 1.5 7z" fill="${g}" stroke="none"/><path d="M14 26L4 22l4 12 6 2M50 26l10-4-4 12-6 2"/><path d="M32 50v8"/></svg>`,
			home: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 30L32 10l24 20"/><path d="M14 26v28h36V26" fill="${c}" fill-opacity=".16"/><path d="M27 54V40h10v14"/><path d="M32 20c1 3 2 4 5 5-3 1-4 2-5 5-1-3-2-4-5-5 3-1 4-2 5-5z" fill="${g}" stroke="none"/><path d="M44 14v-4h5v8"/></svg>`,
			starfish: (c, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 6c3 9 6 15 9 18 4 1 11 1 18 3-6 5-12 8-14 12 0 5 3 12 4 19-6-4-12-8-17-8s-11 4-17 8c1-7 4-14 4-19-2-4-8-7-14-12 7-2 14-2 18-3 3-3 6-9 9-18z" fill="${c}"/><g fill="#fff" opacity=".85"><circle cx="32" cy="26" r="2"/><circle cx="32" cy="34" r="2.4"/><circle cx="25" cy="32" r="1.6"/><circle cx="39" cy="32" r="1.6"/></g></svg>`,
		});
		// 达妮娅的十个徽章
		const X = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"';
		Object.assign(CARTE_MARKS, {
			bubble: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3"><circle cx="30" cy="34" r="22" fill="${c}" fill-opacity=".12"/><path d="M18 26c2-6 7-10 13-11" stroke-linecap="round"/><circle cx="50" cy="14" r="7" stroke="${g}"/><path d="M50 9l1.4 3.6 3.6 1.4-3.6 1.4L50 19l-1.4-3.6-3.6-1.4 3.6-1.4z" fill="${g}" stroke="none"/></svg>`,
			eye: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3"><path d="M4 32C14 18 23 13 32 13s18 5 28 19C50 46 41 51 32 51S14 46 4 32z" fill="${c}" fill-opacity=".14"/><circle cx="32" cy="32" r="10" stroke="${g}"/><circle cx="32" cy="32" r="4.5" fill="${g}" stroke="none"/><path d="M32 4v6M32 54v6M10 10l4 4M54 10l-4 4" stroke-linecap="round" opacity=".7"/></svg>`,
			doll: (c, g) => `<svg ${X} fill="${c}"><g opacity=".45"><circle cx="10" cy="20" r="4.5"/><path d="M2 26h16l-3 3 2 12h-4l-3-7-3 7H3l2-12z"/></g><circle cx="44" cy="22" r="6"/><path d="M33 30h22l-4 4 3 17h-6l-4-10-4 10h-6l3-17z"/><path d="M27 32l4-1" stroke="${g}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2 3"/></svg>`,
			orange: (c, g) => `<svg ${X}><circle cx="32" cy="32" r="26" fill="#ffb347"/><circle cx="32" cy="32" r="21" fill="#ffd27a"/><g stroke="#fff3d6" stroke-width="2.4">${[0, 45, 90, 135].map((r) => `<line x1="32" y1="12" x2="32" y2="52" transform="rotate(${r} 32 32)"/>`).join("")}</g><circle cx="32" cy="32" r="4" fill="#fff3d6"/><circle cx="32" cy="32" r="26" fill="none" stroke="${c}" stroke-width="2.4"/></svg>`,
			soda: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"><path d="M18 18h28l-4 40H22z" fill="${c}" fill-opacity=".14"/><path d="M36 18l8-12h8" stroke-linecap="round"/><circle cx="28" cy="40" r="3" stroke="${g}"/><circle cx="35" cy="30" r="2.4" stroke="${g}"/><circle cx="33" cy="48" r="2"/></svg>`,
			mic: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><rect x="24" y="6" width="16" height="28" rx="8" fill="${c}" fill-opacity=".18"/><path d="M16 28c0 9 7 16 16 16s16-7 16-16M32 44v12M24 56h16"/><path d="M50 8l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="${g}" stroke="none"/></svg>`,
			chain: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3.2"><rect x="6" y="22" width="24" height="14" rx="7" transform="rotate(-30 18 29)"/><rect x="24" y="28" width="24" height="14" rx="7" transform="rotate(-30 36 35)"/><circle cx="16" cy="48" r="7" fill="${g}" fill-opacity=".25" stroke="${g}"/><path d="M16 44v8M12 48h8" stroke="${g}" stroke-width="2"/></svg>`,
			peach: (c, g) => `<svg ${X}><circle cx="24" cy="38" r="16" fill="#ffb07a"/><path d="M42 30c9 0 16 7 16 16s-7 14-16 14-16-5-16-14 7-16 16-16z" fill="#ff9ab8"/><path d="M42 30c-1 8-1 18 0 30" stroke="#e87a9a" stroke-width="2" fill="none"/><path d="M42 30c2-6 7-9 12-8-2 5-7 8-12 8z" fill="#8cc88a"/><circle cx="24" cy="38" r="16" fill="none" stroke="${c}" stroke-width="2.4"/></svg>`,
			macaron: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"><path d="M10 28c0-10 10-16 22-16s22 6 22 16z" fill="${c}" fill-opacity=".2"/><path d="M8 32h48" stroke-width="5" stroke-linecap="round" opacity=".55"/><path d="M10 36h44c0 10-10 16-22 16S10 46 10 36z" fill="${c}" fill-opacity=".2"/><path d="M46 6l1.4 3.6 3.6 1.4-3.6 1.4L46 16l-1.4-3.6-3.6-1.4 3.6-1.4z" fill="${g}" stroke="none"/></svg>`,
			zmoon: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3"><path d="M40 8a24 24 0 1 0 16 38A20 20 0 0 1 40 8z" fill="${c}" fill-opacity=".18"/><path d="M46 20h8l-8 9h8" stroke="${g}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6"/><circle cx="18" cy="16" r="1.8" fill="${g}" stroke="none"/></svg>`,
		});
		// 西格莉卡的五个徽章：符文四角星 / 日光符文 / 日灵 / 小橘子 / 扇贝 + 橘子
		Object.assign(CARTE_MARKS, {
			rune: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="2.6"><circle cx="32" cy="32" r="26" stroke-dasharray="4 4" opacity=".6"/><path d="M32 8C34 26 38 30 56 32 38 34 34 38 32 56 30 38 26 34 8 32 26 30 30 26 32 8z" fill="${g}" fill-opacity=".3"/><path d="M24 24l16 16M40 24L24 40" stroke="${g}" opacity=".7"/></svg>`,
			sunrune: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><circle cx="32" cy="32" r="12" fill="${c}" fill-opacity=".2"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((r) => `<path d="M32 6v8" transform="rotate(${r} 32 32)"/>`).join("")}<path d="M28 32h8M32 28v8" stroke="${g}" stroke-width="2.4"/></svg>`,
			spirit: (c, g) => `<svg ${X}><path d="M10 40c0-14 10-26 22-26s22 12 22 26c0 8-10 14-22 14S10 48 10 40z" fill="#8ad8a0"/><path d="M8 30l8 6M56 30l-8 6" stroke="#6bbf86" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="36" r="10" fill="#e8fff2" stroke="${c}" stroke-width="2.6"/><circle cx="32" cy="36" r="4" fill="${c}"/></svg>`,
			tangerine: (c, g) => `<svg ${X}><circle cx="32" cy="36" r="22" fill="#ffa040"/><circle cx="26" cy="30" r="4" fill="#ffd08a" opacity=".8"/><path d="M32 14c-1-5 1-8 4-9" stroke="#6a8f3a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 13c6-6 14-5 16-2-5 4-11 5-16 2z" fill="#7fc070"/><circle cx="32" cy="36" r="22" fill="none" stroke="${c}" stroke-width="2.4"/></svg>`,
			shellr: (c, g) => `<svg ${X} fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"><path d="M32 54L8 30c4-12 13-19 24-19s20 7 24 19z" fill="${c}" fill-opacity=".16"/><path d="M32 54V12M32 54L19 15M32 54L45 15"/><circle cx="52" cy="12" r="5" fill="#ffa040" stroke="none"/></svg>`,
		});
		const markSvg = (skin) => CARTE_MARKS[skin.mark] ? CARTE_MARKS[skin.mark](skin.c.acc, skin.c.gold)
			: skin.mark === "clover" ? cloverSvg(skin.c.gold) : skin.mark === "sun" ? SUN_SVG : CREST_SVG;

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
			}[skin.id] || [skin.title, skin.eyebrow, skin.tag];
			const orn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 12" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${c.gold}" stop-opacity="0"/><stop offset=".35" stop-color="${c.gold}"/><stop offset=".5" stop-color="${c.acc2}"/><stop offset=".65" stop-color="${c.gold}"/><stop offset="1" stop-color="${c.gold}" stop-opacity="0"/></linearGradient></defs><path d="M0 6 H132 M168 6 H300" stroke="url(#g)" stroke-width="1"/><path d="M150 1 L156 6 L150 11 L144 6 Z" fill="${c.acc2}"/><path d="M137 6 L140 3.5 L143 6 L140 8.5 Z M157 6 L160 3.5 L163 6 L160 8.5 Z" fill="${c.gold}"/></svg>`;
			return `:root{${skinVars(skin)};--cl-title-grad:${T[0]};--cl-eyebrow:"— ${T[1]} —";--cl-orn:${svgUrl(orn)};--cl-badge-bg:${rgba(c.l2, 0.9)};${skin.id === "daily" ? "--cl-eyebrow-font:var(--cl-hand);--cl-eyebrow-size:20px;" : ""}--cl-mark:${svgUrl(markSvg(skin))};--cl-sub:"${skin.sub}";--cl-newbtn:${newbtn.bg};--cl-newbtn-ink:${newbtn.ink};--cl-newbtn-shadow:${newbtn.sh};--cl-hairline:${hair};--cl-pv-valley:${pv[0]};--cl-pv-peak:${pv[1]};${skin.base ? `--cl-base:${skin.base};` : ""}${skin.id === "daily" ? "--cl-brand-font:var(--cl-hand);--cl-brand-size:25px;--cl-title-font:inherit;" : ""}${skin.char === "carte" ? "--cl-brand-size:19px;" : ""}${skin.id === "cdaily" ? "--cl-eyebrow-font:var(--cl-hand);--cl-eyebrow-size:20px;" : ""}}` + (skin.char === "aemeath" || skin.char === "denia" || skin.char === "sigrika" ? aemeathHeroCss(skin) : "");
		}

		/**
		 * 爱弥斯：首页标题不显示 DSH 的中文标题，换成 Aemeath 流光字（每隔几秒闪一下故障），
		 * 下面一行英文副标题，颜色和流光字冷暖相反；字边加一圈很细的描边，花哨的背景上也看得清。
		 */
		function aemeathHeroCss(skin) {
			const T = 'html[data-cl-on] [class*="_titleGroup"]';
			const S = T + " > span:first-child";
			const edge = `drop-shadow(0 0 .8px ${skin.c.l2}) drop-shadow(0 0 .8px ${skin.c.l2}) drop-shadow(0 0 .6px ${skin.c.l2}) drop-shadow(0 3px 6px rgba(0,0,0,.28))`;
			const word = `font-family:var(--cl-latin);font-weight:600;font-size:52px;line-height:1.1;letter-spacing:.02em;background:var(--cl-title-grad);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent`;
			return `
${T}{margin-bottom:38px}
${S}{font-size:0!important;letter-spacing:0!important;background:none!important;animation:none!important;filter:none!important;position:relative;display:inline-block}
${S}::after{content:"${charOf(skin).latin}";${word};animation:cl-sheen 8s linear infinite;filter:${edge}}
${charOf(skin).glitch ? `${S}::before{content:"${charOf(skin).latin}";position:absolute;left:0;top:0;${word};animation:cl-glitch 5.5s steps(1) infinite;opacity:0;pointer-events:none}` : ""}
${T}::after{content:${JSON.stringify(skin.subtitle)};height:auto;top:calc(100% + 4px);padding-top:18px;background:var(--cl-orn) top center/100% 12px no-repeat;text-align:center;white-space:nowrap;font-family:var(--cl-latin);font-style:italic;font-weight:500;font-size:22px;letter-spacing:.05em;color:${skin.subUi};text-shadow:0 0 1px ${skin.c.l2},0 0 2px ${skin.c.l2},0 0 3px ${skin.c.l2},0 2px 4px rgba(0,0,0,.25)}
${T}::before{text-shadow:0 0 1px ${skin.c.l2},0 0 2px ${skin.c.l2},0 0 3px ${skin.c.l2}}`;
		}

		/**
		 * 首页标题上方的小字、下方的副标题 / 金线是挂在整个标题区上的，标题区右边还有「预览版」小标签，
		 * 中心会偏右。这里量一下标题文字本身的中心，把偏差交给 CSS（--cl-hero-shift）挪回来。
		 */
		function alignHero() {
			const g = document.querySelector('[class*="_titleGroup"]');
			if (!g) return;
			const s = g.querySelector(":scope > span:first-child");
			if (!s) return;
			const gr = g.getBoundingClientRect(), sr = s.getBoundingClientRect();
			if (!gr.width || !sr.width) return;
			const dx = Math.round(sr.left + sr.width / 2 - (gr.left + gr.width / 2));
			if (g.dataset.clShift !== String(dx)) { g.dataset.clShift = String(dx); g.style.setProperty("--cl-hero-shift", dx + "px"); }
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
			if (CARTE_DECOR.has(kind)) host.innerHTML = carteDecorHtml(kind);
		}

		// ---- 卡提希娅的动效：拼成 HTML 字符串，背景层和 DSH 自带启动页（没有脚本）都能直接用 ----
		const CARTE_DECOR = new Set(["wind", "firefly", "tide", "petal", "gull", "astage", "acosmos", "amecha", "afamily", "asummer",
			"dveil", "dvoid", "dalone", "dbirthday", "dsummer", "didol", "dlab", "dduo", "dtea", "dnap",
			"srune", "ssun", "sroya", "sorange"]);
		// 西格莉卡动效用到的小图
		const SD = {
			glyphs: ["M10 2v16M4 6l12 8M4 14l12-8", "M4 2l12 16M16 2L4 18M10 2v16", "M4 18V2l12 8-12 8", "M10 2L3 10l7 8 7-8z", "M4 2v16M4 10h12M16 2v16", "M3 4h14M10 4v14M5 18h10", "M10 2a8 8 0 1 0 0 16M10 2v16", "M4 2l6 8-6 8M16 2l-6 8 6 8"],
			leaf: `<svg viewBox="0 0 30 16"><path d="M1 8C8 0 22 0 29 8 22 16 8 16 1 8z" fill="currentColor"/><path d="M1 8h28" stroke="rgba(255,255,255,.5)" stroke-width="1"/></svg>`,
			mini: `<svg viewBox="0 0 40 34"><path d="M4 22c0-10 7-18 16-18s16 8 16 18c0 6-7 10-16 10S4 28 4 22z" fill="#8ad8a0"/><circle cx="20" cy="20" r="6" fill="#e8fff2" stroke="#2f9fd0" stroke-width="2"/><circle cx="20" cy="20" r="2.4" fill="#2f9fd0"/></svg>`,
			tang: `<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="15" fill="#ffa040"/><circle cx="15" cy="17" r="3" fill="#ffd08a" opacity=".8"/><path d="M21 8c4-4 9-3 10-1-3 3-7 3-10 1z" fill="#7fc070"/></svg>`,
			flower: `<svg viewBox="0 0 20 20"><g fill="#fff">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="10" cy="5" rx="3" ry="4.6" transform="rotate(${r} 10 10)"/>`).join("")}</g><circle cx="10" cy="10" r="2.4" fill="#ffd36e"/></svg>`,
		};
		// 达妮娅动效用到的小图
		const DOLL1 = (x) => `<g transform="translate(${x} 0)"><circle cx="14" cy="6" r="5"/><path d="M4 12h20l-4 4 2 13h-5l-3-8-3 8H6l2-13z"/><path d="M0 14h6M22 14h6" stroke="currentColor" stroke-width="3"/></g>`;
		const DD = {
			dolls: `<svg viewBox="0 0 140 30" fill="currentColor">${[0, 28, 56, 84, 112].map(DOLL1).join("")}</svg>`,
			doll1: `<svg viewBox="0 0 28 30" fill="currentColor">${DOLL1(0)}</svg>`,
			eye: `<svg viewBox="0 0 200 100"><path d="M5 50C40 10 70 5 100 5s60 5 95 45c-35 40-65 45-95 45S40 90 5 50z" fill="rgba(20,10,50,.6)" stroke="#a98bff" stroke-width="3"/><circle cx="100" cy="50" r="30" fill="#1a0f3a" stroke="#c9b8ff" stroke-width="3"/><circle cx="100" cy="50" r="13" fill="#000"/><circle cx="92" cy="42" r="5" fill="#fff" opacity=".8"/></svg>`,
			tetro: [[[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[1, 0], [2, 0], [0, 1], [1, 1]]]
				.map((cells) => `<svg viewBox="0 0 88 44" fill="currentColor" stroke="rgba(220,210,255,.7)" stroke-width="1.5">${cells.map(([x, y]) => `<rect x="${x * 22 + 1}" y="${y * 22 + 1}" width="20" height="20" rx="3"/>`).join("")}</svg>`),
			oslice: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#ff9f3a"/><circle cx="20" cy="20" r="14.5" fill="#ffd27a"/><g stroke="#fff6dc" stroke-width="1.8">${[0, 45, 90, 135].map((r) => `<line x1="20" y1="6" x2="20" y2="34" transform="rotate(${r} 20 20)"/>`).join("")}</g><circle cx="20" cy="20" r="2.6" fill="#fff6dc"/></svg>`,
			peach: `<svg viewBox="0 0 40 40"><path d="M20 8c9 0 16 7 16 16s-7 14-16 14S4 33 4 24 11 8 20 8z" fill="#ff9ab8"/><path d="M20 8c-1 9-1 20 0 30" stroke="#e87a9a" stroke-width="1.6" fill="none"/><path d="M20 8c2-5 6-7 10-6-2 4-6 6-10 6z" fill="#8cc88a"/></svg>`,
			heart: `<svg viewBox="0 0 24 24"><path d="M12 21C4 15 2 11 3 7.5 4 4.5 8 3.5 10.5 6L12 7.5 13.5 6C16 3.5 20 4.5 21 7.5c1 3.5-1 7.5-9 13.5z" fill="currentColor"/></svg>`,
			steam: `<svg viewBox="0 0 30 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M15 58c-8-8 8-14 0-22s8-14 0-22"/></svg>`,
			mac: `<svg viewBox="0 0 40 30"><path d="M4 13c0-6 7-10 16-10s16 4 16 10z" fill="currentColor"/><rect x="3" y="13" width="34" height="4" rx="2" fill="#fff8ee"/><path d="M4 17h32c0 6-7 10-16 10S4 23 4 17z" fill="currentColor"/></svg>`,
			chainV: `<svg viewBox="0 0 16 200" fill="none" stroke="currentColor" stroke-width="2.4">${Array.from({ length: 10 }, (_, i) => `<rect x="3" y="${i * 20}" width="10" height="16" rx="5"/>`).join("")}</svg>`,
		};
		const CD = {
			feather: `<svg viewBox="0 0 40 16"><path d="M1 8C8 1 22 0 39 4 30 6 26 9 20 10 13 12 6 12 1 8z" fill="currentColor" opacity=".92"/><path d="M1 8C12 6 26 5 39 4" stroke="rgba(120,170,220,.7)" stroke-width=".8" fill="none"/></svg>`,
			petal: (c) => `<svg viewBox="0 0 20 20"><g fill="${c}"><ellipse cx="10" cy="5" rx="3.2" ry="4.4"/><ellipse cx="10" cy="15" rx="3.2" ry="4.4"/><ellipse cx="5" cy="10" rx="4.4" ry="3.2"/><ellipse cx="15" cy="10" rx="4.4" ry="3.2"/></g><circle cx="10" cy="10" r="2" fill="#fff6c2"/></svg>`,
			butterfly: `<svg viewBox="0 0 24 18"><path class="wl" d="M12 9C9 2 3 0 1 3s2 8 11 6zM12 9C7 10 3 14 5 16s6 0 7-7z" fill="currentColor"/><path class="wr" d="M12 9c3-7 9-9 11-6s-2 8-11 6zM12 9c5 1 9 5 7 7s-6 0-7-7z" fill="currentColor"/></svg>`,
			gull: `<svg viewBox="0 0 40 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path class="w" d="M2 9C8 2 14 3 20 9 26 3 32 2 38 9"/></svg>`,
			sparkle: `<svg viewBox="0 0 20 20"><path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0z" fill="currentColor"/></svg>`,
			whale: `<svg viewBox="0 0 300 110"><path fill="currentColor" d="M8 62C30 38 80 26 140 30c40 3 74 14 98 30 10-10 24-22 44-26-6 12-10 22-12 30 8 4 16 10 20 16-18-2-34-2-48 2-20 16-56 24-100 24C70 106 30 92 8 62z"/><path d="M120 86c10 10 26 14 40 12" stroke="currentColor" stroke-width="3" fill="none"/></svg>`,
		};
		/** 一种动效 → HTML。boot = 用在启动画面里（少放一点，不放巨鲸）。 */
		function carteDecorHtml(kind, boot) {
			const f = (n) => n.toFixed(2);
			let out = "";
			const span = (cls, style, html) => { out += `<span class="${cls}" style="${style}">${html || ""}</span>`; };
			if (kind === "wind") {
				for (let i = 0; i < 7; i++) {
					const a = rand(20, 60), b = rand(-40, 40), d = rand(5, 9);
					const p = Math.random() < 0.4
						? `M-50 60 C200 ${f(60 - a)} 420 ${f(60 + a)} 640 60 C760 30 800 -10 760 -6 C720 0 730 50 820 62 C1000 ${f(60 - a)} 1200 ${f(60 + b)} 1450 50`
						: `M-50 60 C250 ${f(60 - a)} 500 ${f(60 + a)} 750 60 S1200 ${f(60 + b)} 1450 ${f(60 - b / 2)}`;
					out += `<svg class="cl-wind" viewBox="0 0 1400 120" preserveAspectRatio="none" style="top:${f(rand(4, 82))}%"><path d="${p}" style="--d:${f(d)}s;--delay:${f(-rand(0, d))}s"/></svg>`;
				}
				for (let i = 0; i < 11; i++) { const d = rand(16, 28); span("cl-feather", `top:${f(rand(0, 85))}%;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--w:${f(rand(18, 34))}px;--r0:${f(rand(-30, 0))}deg;--r1:${f(rand(10, 50))}deg`, CD.feather); }
			}
			if (kind === "firefly") {
				for (let i = 0; i < 30; i++) span("cl-star2", `left:${f(rand(0, 100))}%;top:${f(rand(0, 55))}%;--d:${f(rand(2.5, 6))}s;--delay:${f(-rand(0, 6))}s`);
				for (let i = 0; i < 22; i++) { const r = () => f(rand(-70, 70)) + "px"; span("cl-fly", `left:${f(rand(5, 95))}%;top:${f(rand(35, 95))}%;--d:${f(rand(7, 14))}s;--delay:${f(-rand(0, 10))}s;--x1:${r()};--y1:${r()};--x2:${r()};--y2:${r()};--x3:${r()};--y3:${r()}`); }
				for (let i = 0; i < 2; i++) span("cl-shoot", `left:${f(rand(50, 95))}%;top:${f(rand(3, 25))}%;--delay:${f(-rand(0, 9))}s`);
			}
			if (kind === "tide") {
				span("cl-caus", ""); span("cl-caus b", "");
				for (let i = 0; i < 6; i++) span("cl-ray", `left:${f(rand(10, 90))}%;--w:${f(rand(40, 110))}px;--d:${f(rand(6, 11))}s;--delay:${f(-rand(0, 10))}s;--r0:${f(rand(-14, -4))}deg;--r1:${f(rand(4, 14))}deg`);
				for (let i = 0; i < 16; i++) { const d = rand(12, 24), w = rand(5, 16); span("cl-bub2", `left:${f(rand(0, 100))}%;width:${f(w)}px;height:${f(w)}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-30, 30))}px`); }
				if (!boot) span("cl-whale", "", CD.whale);
				else for (let i = 0; i < 6; i++) span("cl-ring", `left:${f(rand(45, 95))}%;top:${f(rand(30, 90))}%;--delay:${f(i * 0.6)}s`);
			}
			if (kind === "petal") {
				for (let i = 0; i < 18; i++) { const d = rand(14, 24); span("cl-pet", `top:${f(rand(-10, 70))}%;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--w:${f(rand(9, 17))}px;opacity:${f(rand(0.55, 0.95))}`, CD.petal(Math.random() < 0.22 ? "#8cc2ec" : "#f5c400")); }
				for (let i = 0; i < 2; i++) span("cl-bfly", `left:${f(rand(20, 50))}%;top:${f(rand(20, 60))}%;--d:${f(rand(9, 13))}s;--delay:${f(-rand(0, 8))}s`, CD.butterfly);
			}
			if (kind === "gull") {
				for (let i = 0; i < 4; i++) { const d = rand(18, 30); span("cl-gull", `top:${f(rand(4, 30))}%;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--w:${f(rand(26, 46))}px`, CD.gull); }
				for (let i = 0; i < 14; i++) span("cl-glint", `left:${f(rand(0, 100))}%;top:${f(rand(55, 96))}%;--w:${f(rand(10, 22))}px;--d:${f(rand(2, 4.5))}s;--delay:${f(-rand(0, 4))}s`, CD.sparkle);
				for (let i = 0; i < 12; i++) { const d = rand(14, 26), w = rand(8, 26); span("cl-bub2", `left:${f(rand(0, 100))}%;width:${f(w)}px;height:${f(w)}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-30, 30))}px`); }
			}
			// ---- 爱弥斯 ----
			const pick = (a, b, p) => (Math.random() < (p ?? 0.5) ? a : b);
			if (kind === "didol") kind = "astage"; // 达妮娅 · 偶像：沿用舞台追光
			// ---- 达妮娅 ----
			const bub = (n, lo, hi) => { for (let i = 0; i < n; i++) { const d = rand(10, 20), w = rand(lo, hi); span("cl-ibub", `left:${f(rand(0, 100))}%;width:${f(w)}px;height:${f(w)}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-40, 40))}px`); } };
			const glints = (n, top, col) => { for (let i = 0; i < n; i++) span("cl-glint", `left:${f(rand(0, 100))}%;top:${f(rand(top, 96))}%;--w:${f(rand(7, 16))}px;--d:${f(rand(2.5, 5))}s;--delay:${f(-rand(0, 5))}s${col ? ";color:" + col : ""}`, CD.sparkle); };
			const zz = (n, x0, x1) => { for (let i = 0; i < n; i++) span("cl-zz", `left:${f(rand(x0, x1))}%;top:${f(rand(22, 52))}%;--d:${f(rand(4, 6))}s;--delay:${f(-i * 1.2)}s;font-size:${f(rand(15, 28))}px`, "z"); };
			const floatUp = (n, svg, lo, hi, extra) => { for (let i = 0; i < n; i++) { const d = rand(14, 24); span("cl-ofloat", `left:${f(rand(0, 100))}%;--w:${f(rand(lo, hi))}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-40, 40))}px${extra ? extra(i) : ""}`, typeof svg === "function" ? svg(i) : svg); } };
			if (kind === "dveil") {
				bub(16, 14, 46);
				span("cl-dolls", `left:${boot ? 4 : 10}%;top:-2px;--w:${boot ? 200 : 180}px;--d:5s;--delay:-1s`, DD.dolls);
				if (!boot) span("cl-dolls", "left:62%;top:-2px;--w:180px;--d:6s;--delay:-3s", DD.dolls);
				zz(4, boot ? 40 : 15, boot ? 60 : 45);
				glints(14, 5, "#fff");
			}
			if (kind === "dvoid") {
				const hx = boot ? "left:42%;top:8%" : "right:6%;top:6%", w = boot ? 300 : 260;
				span("cl-hole", `${hx};--w:${w}px`, `<i class="disk"></i><i class="core"></i>`);
				const cx = boot ? `left:calc(42% + ${w / 2}px)` : `right:calc(6% + ${w / 2}px)`, cy = boot ? `top:calc(8% + ${w / 2}px)` : `top:calc(6% + ${w / 2}px)`;
				for (let i = 0; i < 40; i++) span("cl-pull", `${cx};${cy};--r0:${f(rand(0, 360))}deg;--rad:${f(rand(140, 420))}px;--d:${f(rand(4, 9))}s;--delay:${f(-rand(0, 9))}s;--c:${pick("#c9b8ff", pick("#ff8fc4", "#6fd8ff"))}`);
				for (let i = 0; i < 40; i++) span("cl-star3", `left:${f(rand(0, 100))}%;top:${f(rand(0, 100))}%;--d:${f(rand(2, 6))}s;--delay:${f(-rand(0, 6))}s`);
				if (!boot) span("cl-aeye", `left:${f(rand(20, 45))}%;top:${f(rand(55, 75))}%;--w:120px`, DD.eye);
				for (let i = 0; i < 5; i++) { const d = rand(14, 22); span("cl-tblock", `left:${f(rand(5, 95))}%;--d:${f(d)}s;--delay:${f(-rand(0, d))}s`, DD.tetro[i % DD.tetro.length]); }
			}
			if (kind === "dalone") {
				span("cl-dchain", `left:${boot ? 6 : 12}%;top:${boot ? 4 : 3}%`, `<i class="row">${DD.dolls}</i><i class="last">${DD.doll1}</i>`);
				for (let i = 0; i < 26; i++) { const d = rand(14, 26); span("cl-ash", `left:${f(rand(0, 100))}%;--w:${f(rand(2, 5))}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-40, 40))}px`); }
				["I'm fine.", "Don't look for me.", "До свидания", "I'm fine.", "Я в порядке"].forEach((w, i) => span("cl-lie", `left:${f(rand(boot ? 42 : 20, 88))}%;top:${f(rand(15, 85))}%;--d:9s;--delay:${f(-i * 1.8)}s`, w));
				span("cl-ember", boot ? "left:46%;bottom:10%" : "left:22%;bottom:12%");
			}
			if (kind === "dbirthday") {
				floatUp(10, DD.oslice, 20, 34);
				for (let i = 0; i < 4; i++) span("cl-candle", `left:${boot ? 40 + i * 6 : 8 + i * 4}%;bottom:${boot ? 8 : 10}%`, `<i class="flame"></i><i class="stick" style="background:${["#ef7aa6", "#7fb0e8", "#f2c94c", "#9fd7a8"][i]}"></i>`);
				const cols = ["#f08a3c", "#ef7aa6", "#7fb0e8", "#f2c94c", "#9fd7a8"];
				for (let i = 0; i < 30; i++) { const d = rand(6, 12); span("cl-confetti", `left:${f(rand(0, 100))}%;--c:${cols[i % 5]};--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-60, 60))}px;--r:${f(rand(180, 720))}deg`); }
				bub(8, 12, 30);
			}
			if (kind === "dsummer") {
				span("cl-sun", boot ? "--sx:58%;--sw:34vw" : "--sx:70%;--sw:30vw", `<i class="rays"></i><i class="core"></i>`);
				for (let i = 0; i < 22; i++) { const d = rand(6, 13), w = rand(5, 16); span("cl-soda", `left:${f(rand(0, 100))}%;width:${f(w)}px;height:${f(w)}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-20, 20))}px`); }
				glints(12, 50);
				for (let i = 0; i < 4; i++) span("cl-bobf", `left:${f(rand(10, 90))}%;bottom:${f(rand(4, 12))}%;--w:${f(rand(22, 34))}px;--d:${f(rand(3, 5))}s;--delay:${f(-rand(0, 4))}s`, DD.oslice);
				out += `<div class="cl-waves"><svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="--d:9s"><path d="M0 50 Q75 25 150 50 T300 50 T450 50 T600 50 T750 50 T900 50 T1050 50 T1200 50 V120 H0Z" fill="rgba(255,255,255,.4)"/></svg><svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="--d:6s;bottom:-10%"><path d="M0 70 Q75 45 150 70 T300 70 T450 70 T600 70 T750 70 T900 70 T1050 70 T1200 70 V120 H0Z" fill="rgba(80,200,240,.3)"/></svg></div>`;
			}
			if (kind === "dlab") {
				for (let i = 0; i < (boot ? 4 : 6); i++) span("cl-chainv", `left:${f(rand(boot ? 40 : 22, 96))}%;--len:${f(rand(90, 260))}px;--d:${f(rand(3, 5))}s;--delay:${f(-rand(0, 4))}s`, DD.chainV);
				for (let i = 0; i < 2; i++) span("cl-gbar", `top:${f(rand(10, 85))}%;--h:${f(rand(3, 8))}px;--delay:${f(-rand(0, 6))}s`);
				for (let i = 0; i < 30; i++) { const d = rand(8, 15); span("cl-pix", `left:${f(rand(0, 100))}%;--w:${Math.round(rand(2, 5))}px;--c:${pick("#7dffd8", "#ff8fc4", 0.7)};--d:${f(d)}s;--delay:${f(-rand(0, d))}s`); }
			}
			if (kind === "dduo") {
				floatUp(12, (i) => (i % 2 ? DD.oslice : DD.peach), 22, 34);
				for (let i = 0; i < 10; i++) span("cl-doodle", `left:${f(rand(4, 96))}%;top:${f(rand(6, 90))}%;--c:${i % 2 ? "#ff8fb4" : "#ff9a5a"};--w:${f(rand(12, 20))}px;--d:${f(rand(4, 7))}s;--delay:${f(-rand(0, 7))}s`, DD.heart);
			}
			if (kind === "dtea") {
				for (let i = 0; i < 3; i++) span("cl-steam", `left:${boot ? 50 + i * 4 : 14 + i * 3}%;bottom:${boot ? 30 : 22}%;--d:${f(rand(3, 4.5))}s;--delay:${f(-i * 1.2)}s`, DD.steam);
				const mc = ["#f2a5c0", "#9cc9a0", "#f6d27a", "#b8a6e6", "#9fd0f0"];
				floatUp(10, DD.mac, 22, 32, (i) => ";color:" + mc[i % 5]);
				glints(18, 4);
			}
			// ---- 西格莉卡 ----
			if (kind === "srune") { // 发光符文 + 符文间连线 + 四角星
				const pts = [];
				for (let i = 0; i < (boot ? 8 : 12); i++) {
					const x = rand(boot ? 42 : 8, 96), y = rand(8, 90); pts.push([x, y]);
					span("cl-rglyph", `left:${f(x)}%;top:${f(y)}%;--w:${f(rand(20, 34))}px;--d:${f(rand(4, 7))}s;--delay:${f(-rand(0, 6))}s;--c:${pick("#ffd36e", "#7fe8d8", 0.6)}`, `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${SD.glyphs[i % SD.glyphs.length]}"/></svg>`);
				}
				let lines = "";
				for (let i = 0; i < pts.length - 1; i++) if (Math.random() < 0.55) lines += `<line x1="${f(pts[i][0])}" y1="${f(pts[i][1])}" x2="${f(pts[i + 1][0])}" y2="${f(pts[i + 1][1])}" style="--delay:${f(-rand(0, 6))}s"/>`;
				out += `<svg class="cl-rlines" viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>`;
				glints(26, 0, "#fff3c8");
			}
			if (kind === "ssun") { // 太阳光芒 + 金色光尘 + 小白花
				span("cl-sun", boot ? "--sx:40%;--sw:40vw" : "--sx:2%;--sw:36vw", `<i class="rays"></i><i class="core"></i>`);
				for (let i = 0; i < 30; i++) { const d = rand(8, 15); span("cl-mote", `left:${f(rand(0, 100))}%;--w:${f(rand(3, 6))}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-40, 40))}px`); }
				for (let i = 0; i < 12; i++) { const d = rand(14, 24); span("cl-pet", `top:${f(rand(-10, 70))}%;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--w:${f(rand(10, 16))}px;opacity:.85`, SD.flower); }
			}
			if (kind === "sroya") { // 风吹草叶 + 小日灵 + 风
				for (let i = 0; i < 16; i++) { const d = rand(10, 18); span("cl-pet", `top:${f(rand(0, 90))}%;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--w:${f(rand(14, 24))}px;color:${pick("#7fc070", "#a8dc8a", 0.6)}`, SD.leaf); }
				for (let i = 0; i < (boot ? 2 : 4); i++) span("cl-bobf", `left:${f(rand(boot ? 44 : 25, 92))}%;top:${f(rand(15, 70))}%;--w:${f(rand(30, 46))}px;--d:${f(rand(3, 5))}s;--delay:${f(-rand(0, 4))}s`, SD.mini);
				for (let i = 0; i < 3; i++) span("cl-gust", `top:${f(rand(10, 80))}%;--d:${f(rand(6, 10))}s;--delay:${f(-rand(0, 10))}s`);
			}
			if (kind === "sorange") { // 小橘子往上飘 + 爱心 + 亮晶晶
				floatUp(12, (i) => (i % 3 ? SD.tang : DD.oslice), 20, 34);
				for (let i = 0; i < 10; i++) span("cl-doodle", `left:${f(rand(4, 96))}%;top:${f(rand(6, 90))}%;--c:${i % 2 ? "#ff9a5a" : "#a07ad0"};--w:${f(rand(12, 20))}px;--d:${f(rand(4, 7))}s;--delay:${f(-rand(0, 7))}s`, DD.heart);
				glints(14, 5, "#ffc46a");
			}
			if (kind === "dnap") {
				zz(6, boot ? 46 : 55, boot ? 66 : 80);
				glints(22, 4, "#d6c8f5");
				bub(8, 14, 34);
			}
			if (kind === "astage") { // 舞台追光 + 音符 + 荧光棒 + 故障条
				for (let i = 0; i < 5; i++) span("cl-spot" + (i % 2 ? " c" : ""), `left:${f(rand(5, 85))}%;--w:${f(rand(12, 20))}vw;--d:${f(rand(4, 7))}s;--delay:${f(-rand(0, 6))}s;--r0:${f(rand(-28, -8))}deg;--r1:${f(rand(8, 28))}deg`);
				for (let i = 0; i < 12; i++) { const d = rand(9, 16); span("cl-note", `left:${f(rand(0, 100))}%;--c:${pick("#ffa3cb", "#7fe9ff")};--w:${f(rand(14, 24))}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-60, 60))}px`, pick(AD.note1, AD.note2)); }
				for (let i = 0; i < 26; i++) span("cl-stick", `left:${f(rand(0, 100))}%;top:${f(rand(70, 98))}%;--w:${f(rand(10, 26))}px;--c:${pick("rgba(255,111,174,.9)", "rgba(127,233,255,.9)", 0.55)};--d:${f(rand(1.2, 2.6))}s;--delay:${f(-rand(0, 2.6))}s`);
				for (let i = 0; i < 2; i++) span("cl-gbar", `top:${f(rand(10, 85))}%;--h:${f(rand(3, 9))}px;--delay:${f(-rand(0, 6))}s`);
			}
			if (kind === "acosmos") { // 星空 + 星辉拖尾 + 像素数据 + 启明星
				for (let i = 0; i < 46; i++) span("cl-star3", `left:${f(rand(0, 100))}%;top:${f(rand(0, 80))}%;--d:${f(rand(2, 6))}s;--delay:${f(-rand(0, 6))}s`);
				for (let i = 0; i < 4; i++) span("cl-trail", `left:${f(rand(-10, 30))}%;top:${f(rand(10, 70))}%;--w:${f(rand(140, 260))}px;--r:${f(rand(-24, -8))}deg;--d:${f(rand(4.5, 8))}s;--delay:${f(-rand(0, 8))}s`);
				for (let i = 0; i < 18; i++) { const d = rand(8, 15); span("cl-pix", `left:${f(rand(0, 100))}%;--w:${Math.round(rand(3, 7))}px;--c:${pick("#ff8fc4", "#9be8ff")};--d:${f(d)}s;--delay:${f(-rand(0, d))}s`); }
				if (!boot) span("cl-pole", "right:7%;top:8%;--w:34px", AD.pole);
			}
			if (kind === "amecha") { // 瞄准环 + 扫描线 + 六边形网格 + 同步读数
				span("cl-ring2", "right:6%;top:10%;--w:150px;--c:#2f7fd8;--d:26s", AD.ring);
				span("cl-ring2 r", "right:calc(6% + 25px);top:calc(10% + 25px);--w:100px;--c:#ff7fb0;--d:18s", AD.ring);
				span("cl-ring2", `left:${boot ? 52 : 30}%;bottom:8%;--w:90px;--c:#2f7fd8;--d:22s`, AD.ring);
				for (let i = 0; i < 2; i++) span("cl-scan2", `--d:${f(rand(5, 8))}s;--delay:${f(-rand(0, 8))}s`);
				for (let i = 0; i < 12; i++) span("cl-hexg", `left:${f(rand(2, 96))}%;top:${f(rand(4, 92))}%;--w:${f(rand(18, 40))}px;--c:${pick("#5fa8ee", "#ff8fbd", 0.6)};--d:${f(rand(3, 6))}s;--delay:${f(-rand(0, 6))}s`, AD.hex);
				span("cl-readout", boot ? "right:4%;bottom:12%" : "right:6%;top:calc(10% + 160px)", boot ? "SYNC <b>100%</b><i></i>" : "SYNC RATE <b>98.7%</b><br>EXOSTRIDER · ONLINE<i></i>");
			}
			if (kind === "afamily") { // 纸飞机 + 涂鸦星星 / 爱心
				for (let i = 0; i < 3; i++) span("cl-plane", `top:${f(rand(8, 55))}%;--w:${f(rand(30, 44))}px;--d:${f(rand(11, 17))}s;--delay:${f(-rand(0, 16))}s`, AD.paper);
				const cols = ["#e8789f", "#f2b25c", "#6fa4d6"];
				for (let i = 0; i < 12; i++) span("cl-doodle", `left:${f(rand(2, 96))}%;top:${f(rand(5, 92))}%;--c:${cols[i % 3]};--w:${f(rand(14, 24))}px;--d:${f(rand(4, 7))}s;--delay:${f(-rand(0, 7))}s`, pick(AD.dStar, AD.dHeart, 0.55));
			}
			if (kind === "asummer") { // 泡泡 + 波光 + 心形水晶 + 太阳 + 棕榈叶影 + 海浪 + 海鸥 + 沙滩球
				span("cl-sun", boot ? "--sx:-8%;--sw:38vw" : "--sx:12%;--sw:30vw", `<i class="rays"></i><i class="core"></i>`);
				(boot ? [[24, 22, 40], [32, 34, 20], [38, 44, 10]] : [[30, 16, 40], [38, 28, 20], [44, 38, 10]]).forEach(([x, y, w]) => span("cl-flare", `left:${x}%;top:${y}%;width:${w}px;height:${w}px`));
				span("cl-palm", `left:-2%;top:-4%;width:${boot ? 24 : 26}%`, AD.palm);
				if (!boot) span("cl-palm r", "right:-3%;top:-6%;width:20%", AD.palm);
				for (let i = 0; i < 14; i++) { const d = rand(14, 26), w = rand(8, 26); span("cl-bub2", `left:${f(rand(0, 100))}%;width:${f(w)}px;height:${f(w)}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-30, 30))}px`); }
				for (let i = 0; i < 14; i++) span("cl-glint", `left:${f(rand(0, 100))}%;top:${f(rand(50, 96))}%;--w:${f(rand(10, 22))}px;--d:${f(rand(2, 4.5))}s;--delay:${f(-rand(0, 4))}s`, CD.sparkle);
				for (let i = 0; i < 6; i++) { const d = rand(16, 26); span("cl-crys", `left:${f(rand(0, 100))}%;--w:${f(rand(12, 20))}px;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--dx:${f(rand(-40, 40))}px`, AD.crystal); }
				for (let i = 0; i < 3; i++) { const d = rand(18, 28); span("cl-gull", `top:${f(rand(6, 26))}%;--d:${f(d)}s;--delay:${f(-rand(0, d))}s;--w:${f(rand(26, 40))}px`, CD.gull); }
				out += `<div class="cl-waves"><svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="--d:9s"><path d="M0 50 Q75 25 150 50 T300 50 T450 50 T600 50 T750 50 T900 50 T1050 50 T1200 50 V120 H0Z" fill="rgba(255,255,255,.35)"/></svg><svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="--d:6s;bottom:-10%"><path d="M0 70 Q75 45 150 70 T300 70 T450 70 T600 70 T750 70 T900 70 T1050 70 T1200 70 V120 H0Z" fill="rgba(80,200,240,.28)"/></svg></div>`;
				if (!boot) span("cl-ball", `left:${f(rand(58, 70))}%;bottom:9%;--w:46px`, AD.ball);
			}
			return out;
		}
		// 爱弥斯动效用到的小图
		const AD = {
			note1: `<svg viewBox="0 0 24 24"><path d="M9 17.5a3 3 0 1 1-2-2.8V4l12-2v13.5a3 3 0 1 1-2-2.8V6.3l-8 1.4z" fill="currentColor"/></svg>`,
			note2: `<svg viewBox="0 0 24 24"><path d="M14 17a3.5 3.5 0 1 1-2-3.2V3h2c0 3 4 4 4 8-1-2-3-3-4-3z" fill="currentColor"/></svg>`,
			pole: `<svg viewBox="0 0 64 64"><path d="M32 6C34 24 38 28 56 32 38 36 34 40 32 58 30 40 26 36 8 32 26 28 30 24 32 6z" fill="currentColor"/></svg>`,
			ring: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor"><circle cx="50" cy="50" r="46" stroke-width="1.2" stroke-dasharray="14 6 2 6"/><circle cx="50" cy="50" r="36" stroke-width=".8" stroke-dasharray="1 4"/><path d="M50 0v10M50 90v10M0 50h10M90 50h10" stroke-width="1.6"/><path d="M50 22l3 5h-6z" fill="currentColor" stroke="none"/></svg>`,
			hex: `<svg viewBox="0 0 52 60" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M26 2l23 13v30L26 58 3 45V15z"/><path d="M26 14l13 8v16l-13 8-13-8V22z" opacity=".5"/></svg>`,
			paper: `<svg viewBox="0 0 48 30"><path d="M2 14L46 2 34 28 24 18z" fill="currentColor"/><path d="M46 2L24 18v10l5-7" fill="rgba(160,180,220,.55)"/></svg>`,
			dStar: `<svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3l3.5 7.5 8 1-6 5.5 1.7 8L15 21l-7.2 4 1.7-8-6-5.5 8-1z"/></svg>`,
			dHeart: `<svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 26C6 19 3 14 4 9.5 5 6 9.5 4.5 12.5 7.5L15 10l2.5-2.5C20.5 4.5 25 6 26 9.5c1 4.5-2 9.5-11 16.5z"/></svg>`,
			crystal: `<svg viewBox="0 0 24 24"><path d="M12 21L3.5 12.5C1 10 2 5.5 5.5 5c2.5-.3 4.5 1.3 6.5 3.5C14 6.3 16 4.7 18.5 5c3.5.5 4.5 5 2 7.5z" fill="currentColor" fill-opacity=".85"/><path d="M8 8l2 2" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>`,
			palm: `<svg viewBox="0 0 200 160" fill="currentColor"><path d="M0 0C40 10 90 30 140 70c-30-6-60-20-80-30 18 18 30 40 34 66-18-16-36-38-46-62-2 26 4 52 10 74C38 98 28 70 26 40 18 60 16 84 18 106 4 86-2 56 0 26z"/><path d="M0 0c50-4 110 6 170 34-34 2-70-2-100-12 30 14 56 34 70 58-28-10-54-28-74-50 12 22 18 46 18 72C66 84 54 58 46 30" opacity=".85"/></svg>`,
			ball: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff"/><path d="M24 2a22 22 0 0 1 20 13L24 24z" fill="#ff5f8f"/><path d="M44 15a22 22 0 0 1-6 25L24 24z" fill="#ffd06a"/><path d="M38 40a22 22 0 0 1-26 3L24 24z" fill="#3fc3ea"/><path d="M12 43A22 22 0 0 1 3 18l21 6z" fill="#ff8a5b"/><circle cx="24" cy="24" r="4" fill="#fff"/></svg>`,
		};

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
					if (skin.bg.zoom) { art.style.transform = `scale(${skin.bg.zoom})`; art.style.transformOrigin = skin.bg.origin || "center"; }
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

		let curSkin = null; // 当前生效的皮肤（Q 版、台词跟着它的角色走）
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
			const lines = charOf(curSkin).lines;
			const line = lines[Math.floor(Math.random() * lines.length)];
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
			// Q 版跟着当前皮肤的角色换
			const want = asset(charOf(curSkin).chibi);
			if (img) {
				if (img.dataset.src !== want) { img.dataset.src = want; img.style.width = ""; img.src = want; }
				placeChibi();
				return;
			}
			img = document.createElement("img");
			img.id = "cl-chibi";
			img.alt = "";
			img.draggable = false;
			img.title = "点我看余额；按住可以拖动";
			// 仓库不带 Q 版图（版权原因）；没放图时退回皮肤徽章，照样能点出余额卡片
			img.onerror = () => { img.onerror = null; img.src = "data:image/svg+xml," + encodeURIComponent(CREST_SVG); img.style.width = "56px"; placeChibi(); };
			img.onload = placeChibi;
			img.dataset.src = want;
			img.src = want;
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
			if (b.layout === "carte") {
				// 卡提希娅：左边逐字浮现的标题，右边立绘（或整张铺满），叠一层这套皮肤的动效
				const c = skin.c;
				const ink = b.light ? c.ink : "#ffffff";
				const letters = [...b.title].map((ch, i, a) => `<span style="animation-delay:${(0.3 + i * 0.06).toFixed(2)}s;background-position:${a.length > 1 ? (i / (a.length - 1) * 100).toFixed(1) : 0}% 50%">${ch}</span>`).join("");
				const art = b.mode === "full"
					// 整张横图：往右推一点、左边渐隐，把人物让到文字右边
					? `<div class="art" style="transform:translateX(${b.shift || 0}vw) scale(${b.scale || 1});-webkit-mask:linear-gradient(90deg,transparent,#000 18%);mask:linear-gradient(90deg,transparent,#000 18%)"><div class="art full" style="background-image:url('${img}');background-position:${b.pos || "center"}"></div></div>`
					: `<div class="art blur" style="background-image:url('${img}')"></div><div class="art sharp" style="background-image:url('${img}');width:${b.w || 40}vw"></div>`;
				const fx = b.fx === "sweep" ? `<div class="sweep"></div>` : b.fx === "moon" ? `<div class="moonglow"></div>` : "";
				const grad = b.grad || (skin.title || "").replace("linear-gradient(100deg", "linear-gradient(90deg");
				const skipC = splash ? "" : `<div class="skip" style="color:${ink}">${b.light ? "跳过" : "ESC 跳过"}</div>`;
				// 爱弥斯：标题下面是英文副标题（和流光字冷暖对比），加载字换字体并流动换色
				const subLine = b.sub
					? `<h2 class="en" style="color:${b.subColor};text-shadow:0 0 18px ${b.subColor}55">${b.sub}</h2>`
					: `<h2>${b.cn}</h2>`;
				const scan = b.scan ? `<div class="scanl"></div>` : "";
				const badge = b.badge ? `<div class="sbadge"${b.badgeColor ? ` style="color:${b.badgeColor};text-shadow:0 1px 3px #fff,0 0 8px #fff"` : ""}>${SUN_SVG}${b.badge}<span>夏日限定</span></div>` : "";
				return `<div class="art" style="background:${b.base}"></div>${fx}${art}<div class="v" style="background:${b.veil}"></div><div class="dec">${carteDecorHtml(b.decor, true)}</div>${scan}${badge}${skipC}
					<div class="box" style="color:${ink};--cb-k1:${b.k1c || c.gold};--cb-grad:${grad};--cb-rule:${b.light ? c.acc : c.gold}">
						<div class="k1">${b.k1}</div><h1>${letters}</h1>${subLine}
						<div class="rule"><i></i><img src="data:image/svg+xml,${encodeURIComponent(CARTE_MARKS[skin.mark] ? CARTE_MARKS[skin.mark](b.light ? c.acc : c.gold, b.light ? c.gold : "#ffffff") : markSvg(skin))}" alt=""><i></i></div>
						<div class="load${b.loadFont ? " fancy" : ""}"${b.loadFont ? ` style="font-family:${b.loadFont},var(--cl-serif);--cb-load:${b.loadGrad}"` : ""}>${b.load} · · ·</div><div class="prog"><i></i></div>
					</div><div class="cap" style="color:${ink}">ILLUST · ${b.credit}</div>`;
			} else if (b.layout === "daily") {
				inner = `<div class="art blur" style="background-image:url('${img}')"></div><div class="art sharp" style="background-image:url('${img}')"></div><div class="v"></div>${skip}
					<div class="box"><div class="k1">${cloverSvg("currentColor")} ${b.k1}</div><h1>${b.title}</h1><h2>${b.cn}</h2><div class="dots"><i></i><i></i><i></i><i></i><i></i></div><div class="load">${b.load}</div></div>`;
			} else if (b.layout === "summer") {
				let bubbles = "";
				for (let i = 0; i < 9; i++) { const w = rand(10, 26); bubbles += `<span class="bub" style="left:${rand(2, 60).toFixed(1)}vw;bottom:-5vh;width:${w.toFixed(0)}px;height:${w.toFixed(0)}px;animation-delay:${(-rand(0, 6)).toFixed(1)}s;--dx:${rand(-4, 4).toFixed(1)}vw"></span>`; }
				inner = `<div class="art blur" style="background-image:url('${img}');background-position:${b.pos}"></div><div class="v"></div><div class="art sharp" style="background-image:url('${img}')"></div>${bubbles}
					<div class="tag">${SUN_SVG} ${b.k1} <span>夏日限定</span></div>${skip}
					<div class="box"><h1>${b.title}</h1><h2>${b.cn}</h2></div>
					<div class="wave"><div class="load">${b.load}</div><div class="bar"><i></i></div></div>`;
			} else {
				inner = `<div class="art zoom" style="background-image:url('${img}');background-position:${b.pos}"></div><div class="v"></div>${skip}
					<div class="box">${crest}<div class="k1">${b.k1}</div><h1>${b.title}</h1><h2>${b.cn}</h2><div class="prog"><i></i></div><div class="load">${b.load}</div></div>`;
			}
			return inner + `<div class="cap">ILLUST · ${b.credit}</div>`;
		}

		/** 给 DSH 自带启动页用的整页内容（宿主会把 __DIR__ 换成本机文件路径）。 */
		function splashPayload(skin) {
			const css = fontFaces((f) => "__DIR__/fonts/" + f) + "\n" + BASE_CSS.slice(0, BASE_CSS.indexOf("html[data-cl-on]{")) + BOOT_CSS + CARTE_CSS + `
html,body{margin:0;height:100%;overflow:hidden;background:${skin.boot.base || (skin.boot.layout === "daily" ? "#f6f5f1" : skin.boot.layout === "day" ? "#fdf6f7" : skin.boot.layout === "summer" ? "#5cc8ff" : "#0c080d")}}
body>main{display:none!important}
#cl-boot.splash{cursor:default;transition:none}
#cl-boot.splash .prog i,#cl-boot.splash .wave .bar i{animation:cl-splash-prog ${BOOT_MS}ms cubic-bezier(.3,.6,.3,1) forwards,cl-splash-glow 1.6s ${BOOT_MS}ms ease-in-out infinite}
@keyframes cl-splash-prog{0%{width:0}100%{width:100%}}
@keyframes cl-splash-glow{0%,100%{opacity:1}50%{opacity:.4}}`;
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
			// 拦住按键和点击，免得 ESC / 点画面把底下的设置窗口也关掉
			const onKey = (e) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); close(); } };
			el.addEventListener("pointerdown", (e) => e.stopPropagation());
			el.addEventListener("click", (e) => { e.stopPropagation(); close(); });
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
						: s.splash && st.patched ? "已替换：打开 DSH 的「正在启动」页面直接显示当前皮肤的启动画面，进入界面后不再重复播放；关闭开关会还原原版"
							: "DSH 自带的「正在启动」页面换成当前皮肤的启动画面（会先备份原文件，DSH 更新后自动重新替换）";
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

			const skinCard = (id) => {
				const k = SKINS[id];
				return h("button", {
					key: id, type: "button", className: "cl-sk",
					"data-on": String(!s.auto && s.skin === id || s.auto && current.id === id),
					onClick: () => {
						const changed = id !== current.id;
						set({ skin: id, auto: false });
						// 换了皮肤就播一遍这套的启动画面（点画面 / ESC 可跳过）
						if (changed && s.enabled && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) props.previewBoot(id);
					},
				},
					h("div", { className: "im", style: { backgroundImage: `url("${asset(k.bg.file)}")` } }),
					h("div", { className: "nm" }, k.name),
					h("div", { className: "dots" }, h("i", { style: { background: k.c.bg } }), h("i", { style: { background: k.c.acc } }), h("i", { style: { background: k.c.gold } })));
			};
			// 皮肤按角色分组
			const groups = Object.keys(CHARS).map((ch) => ({ ch, ids: SKIN_ORDER.filter((id) => (SKINS[id].char || "carlotta") === ch) }));
			const skinBlocks = groups.map((g) => h("div", { key: g.ch, className: "cl-grp" },
				h("div", { className: "cl-grp-h" }, h("b", null, CHARS[g.ch].name), h("i", null, CHARS[g.ch].latin)),
				h("div", { className: "cl-skins" }, g.ids.map(skinCard))));
			const lightOpts = SKIN_ORDER.filter((id) => SKINS[id].scheme === "light");
			const darkOpts = SKIN_ORDER.filter((id) => SKINS[id].scheme === "dark");

			return h("div", { className: "cl-set" },
				h("div", { className: "cl-hd" }, h("b", null, "鸣潮主题"), h("i", null, "Wuthering Waves · " + charOf(current).latin)),
				h("div", { className: "cl-card" },
					h(Row, { title: "主题总开关", hint: "关闭后完全回到 DSH 原生样式，不用重启" }, h(Toggle, { on: s.enabled, onChange: (v) => set({ enabled: v }) }))),
				h("div", { className: "cl-blk" },
					h("div", { className: "cl-h" }, "皮肤"),
					h("div", { className: "cl-hint" }, "点一下立即生效，并播放这套的启动画面（点画面或按 ESC 跳过）；打开 DSH 时的启动画面跟随你最后一次使用的皮肤。"),
					skinBlocks),
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
					h(Row, { title: "背景装饰动效", hint: "晶片、光带、四叶草、风带羽毛、萤火、水下光束、花瓣、海鸥……随皮肤变化" }, h(Toggle, { on: s.decor, onChange: (v) => set({ decor: v }) })),
					h(SplashRow, { s, set }),
					h(Row, { title: "启动画面", hint: "打开 DSH 时播放一次，点击或 ESC 跳过" },
						h("button", { type: "button", className: "cl-btn", onClick: () => props.previewBoot() }, "预览"),
						h(Toggle, { on: s.boot, onChange: (v) => set({ boot: v }) })),
					h(Row, { title: "侧栏 Q 版", hint: "跟着皮肤的角色换；点她会告诉你 DeepSeek 剩余额度和今日已用" }, h(Toggle, { on: s.chibi, onChange: (v) => set({ chibi: v }) })),
					h(Row, { title: "侧栏徽章与名字", hint: "左上角换成皮肤徽章和角色名字样（Carlotta / Cartethyia）" }, h(Toggle, { on: s.brand, onChange: (v) => set({ brand: v }) })),
					h(Row, { title: "峰谷条跟随皮肤配色", hint: "需要已安装「峰谷状态显示器」" }, h(Toggle, { on: s.pvFollow, onChange: (v) => set({ pvFollow: v }) }))),
				h("img", { key: current.char || "carlotta", className: "cl-full", src: asset(charOf(current).full), alt: "", onError: (e) => { e.currentTarget.style.display = "none"; } }));
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
			const tagOf = (skin) => skin.tag || SKIN_TAG[skin.id] || skin.name;
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
				return h("span", { className: "cl-brand" }, h("span", { className: "cl-brand-word" + (charOf(skin).glitch ? " cl-glitch" : ""), "data-t": charOf(skin).latin }, charOf(skin).latin), h("span", { className: "cl-brand-tag" }, tagOf(skin)));
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
				curSkin = skin;
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
				window.requestAnimationFrame(alignHero);
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
						alignHero();
						const s = store.get();
						if (s.enabled) {
							ensureChibi(!!s.chibi);
							if (!document.getElementById("cl-bg") && document.body) { bgKey = ""; sync(); }
						}
					});
				});
				const onResize = () => { placeChibi(); alignHero(); };
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
			const previewBoot = (id) => {
				const s = store.get();
				mountBoot(SKINS[SKINS[id] ? id : activeSkinId(s, getScheme())]);
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
				label: () => "鸣潮主题",
			}, () => h(SettingsSection, { getScheme, previewBoot })), "carlotta-theme: settings section");
		}
		//#endregion

		return { apply, inject: ["slots", "theme"] };
	},
});
