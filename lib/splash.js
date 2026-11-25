/**
 * 用珂莱塔启动画面替换 DSH 桌面版自带的「正在启动」页（resources/splash.html）。
 *
 * DSH 在后台启动、插件加载之前就显示这个本地网页，插件代码那时还没运行，
 * 所以只能改这个文件本身：
 *   - 第一次替换前把原文件备份成 splash.html.carlotta-orig；
 *   - 改后的 splash.html = 原文件 + 一段脚本：去读 <数据目录>/splash/page.js，
 *     有内容就盖上珂莱塔画面，没有（或读失败）就照常显示原版；
 *   - 每次换皮肤，只更新 <数据目录>/splash 里的 page.js、boot.webp、字体，不再碰 DSH 目录；
 *   - 关闭开关时用备份还原原文件；
 *   - DSH 更新会覆盖 splash.html，插件启动时发现标记没了就自动重新替换。
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, renameSync, unlinkSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";

export const MARKER = "<!-- carlotta-theme splash -->";

/** 找 DSH 安装目录里的 splash.html。宿主跑在 DSH Desktop.exe（Electron 当 Node 用）里。 */
export function findSplash(env = process.env, execPath = process.execPath) {
	const candidates = [];
	if (env.CARLOTTA_SPLASH_FILE) candidates.push(env.CARLOTTA_SPLASH_FILE);
	if (process.resourcesPath) candidates.push(join(process.resourcesPath, "splash.html"));
	if (execPath) candidates.push(join(dirname(execPath), "resources", "splash.html"));
	for (const c of candidates) if (c && existsSync(c)) return c;
	return null;
}

export function createSplash({ dataDir, assetRoot, splashFile }) {
	const dir = join(dataDir, "splash");
	const backup = splashFile ? splashFile + ".carlotta-orig" : null;
	const dirUrl = pathToFileURL(dir).href;

	const isPatched = () => {
		try { return !!splashFile && readFileSync(splashFile, "utf8").includes(MARKER); } catch { return false; }
	};

	function patch() {
		const current = readFileSync(splashFile, "utf8");
		if (current.includes(MARKER)) return;
		// 只在原文件是 DSH 原版时备份；已有备份说明 DSH 更新过，用新的原版覆盖备份
		writeFileSync(backup, current, "utf8");
		const loader = `${MARKER}
<script src="${dirUrl}/page.js?t=${Date.now()}"></script>
<script>
(function () {
  var c = window.__CL_SPLASH;
  if (!c || !c.html) return;
  try {
    var st = document.createElement("style");
    st.textContent = c.css;
    document.head.appendChild(st);
    document.body.insertAdjacentHTML("beforeend", c.html);
  } catch (e) {}
})();
</script>
`;
		const next = current.includes("</body>") ? current.replace("</body>", loader + "</body>") : current + loader;
		const tmp = splashFile + ".carlotta-tmp";
		writeFileSync(tmp, next, "utf8");
		renameSync(tmp, splashFile);
	}

	function restore() {
		if (!splashFile) return;
		if (backup && existsSync(backup)) {
			const orig = readFileSync(backup, "utf8");
			if (!orig.includes(MARKER)) writeFileSync(splashFile, orig, "utf8");
			unlinkSync(backup);
		} else if (isPatched()) {
			// 没有备份就把自己加的那段剪掉
			const cur = readFileSync(splashFile, "utf8");
			const i = cur.indexOf(MARKER);
			const j = cur.indexOf("</script>\n", cur.indexOf("</script>", i) + 9);
			if (i >= 0 && j > i) writeFileSync(splashFile, cur.slice(0, i) + cur.slice(j + 10), "utf8");
		}
	}

	/** 写 page.js + 当前皮肤的启动图 + 字体 */
	function writeContent({ skin, css, html }) {
		if (!existsSync(dir)) mkdirSync(join(dir, "fonts"), { recursive: true });
		if (!existsSync(join(dir, "fonts"))) mkdirSync(join(dir, "fonts"), { recursive: true });
		const img = join(assetRoot, "boot", skin + ".webp");
		if (existsSync(img)) copyFileSync(img, join(dir, "boot.webp"));
		else if (existsSync(join(dir, "boot.webp"))) unlinkSync(join(dir, "boot.webp")); // 这套没放启动图：别留着上一套的
		const fontDir = join(assetRoot, "fonts");
		if (existsSync(fontDir)) for (const f of readdirSync(fontDir)) copyFileSync(join(fontDir, f), join(dir, "fonts", f));
		const fill = (t) => String(t).split("__DIR__").join(dirUrl);
		const js = "window.__CL_SPLASH = " + JSON.stringify({ skin, css: fill(css), html: fill(html) }).replace(/</g, "\\u003c") + ";\n";
		writeFileSync(join(dir, "page.js"), js, "utf8");
	}

	function clearContent() {
		try { unlinkSync(join(dir, "page.js")); } catch {}
	}

	return {
		state() {
			return { supported: !!splashFile, patched: isPatched(), path: splashFile || "" };
		},
		/** body = { enabled, skin, css, html } */
		apply(body) {
			if (!splashFile) return { supported: false, patched: false, error: "找不到 splash.html" };
			try {
				if (body && body.enabled) {
					if (!/^[a-z]+$/.test(String(body.skin)) || typeof body.css !== "string" || typeof body.html !== "string") {
						return { supported: true, patched: isPatched(), error: "内容格式不对" };
					}
					writeContent(body);
					patch();
				} else {
					clearContent();
					restore();
				}
				return { supported: true, patched: isPatched() };
			} catch (e) {
				return { supported: true, patched: isPatched(), error: String(e && e.code || e && e.message || e).slice(0, 80) };
			}
		},
		/** 插件启动时：开关开着但 DSH 更新把替换覆盖掉了 → 重新替换（内容沿用上次写好的 page.js） */
		heal(enabled) {
			if (!splashFile || !enabled) return;
			try { if (!isPatched() && existsSync(join(dir, "page.js"))) patch(); } catch {}
		},
	};
}
