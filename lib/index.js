/**
 * dsh-carlotta-theme —— 宿主半边（host half）
 *
 * 浏览器半边（lib/client.js）负责全部换肤；宿主这里只做三件事：
 *   1. 把 assets/ 里的图片、字体按固定路径提供给页面（只读、白名单）。
 *   2. 保存主题设置：DSH 桌面版每次启动端口都会变，浏览器 localStorage 会跟着丢，
 *      所以设置写在本机文件里（%APPDATA%\dsh-carlotta-theme\settings.json）。
 *   3. 保存用户自己拖进来的背景图 / GIF / 视频，每套皮肤一份。
 *
 * 所有接口只接受本机回环地址的同源请求。
 */
import { readdirSync, statSync, createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { createQuota } from "./quota.js";
import { createSplash, findSplash } from "./splash.js";

export const name = "dsh-carlotta-theme";

const BASE = "/dsh-carlotta-theme";
const ASSET_ROOT = fileURLToPath(new URL("../assets/", import.meta.url));
const DATA_DIR = process.env.APPDATA ? join(process.env.APPDATA, "dsh-carlotta-theme") : join(homedir(), ".dsh-carlotta-theme");
const SETTINGS_FILE = join(DATA_DIR, "settings.json");
const SKIN_IDS = ["night", "day", "prism", "daily", "summer"];
const MAX_UPLOAD = 150 * 1024 * 1024;
const MAX_SETTINGS = 64 * 1024;

const TYPES = {
	".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
	".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4", ".webm": "video/webm",
};
const UPLOAD_EXT = { "image/webp": ".webp", "image/png": ".png", "image/jpeg": ".jpg", "image/gif": ".gif", "video/mp4": ".mp4", "video/webm": ".webm" };

/** 只接受本机回环、非跨站请求。 */
function trusted(req) {
	const host = String(req.headers.host ?? "").toLowerCase().replace(/:\d+$/, "").replace(/^\[|\]$/g, "");
	if (host !== "127.0.0.1" && host !== "localhost" && host !== "::1") return false;
	if (String(req.headers["sec-fetch-site"] ?? "").toLowerCase() === "cross-site") return false;
	const origin = req.headers.origin;
	if (origin) {
		try {
			const o = new URL(origin);
			if (!["127.0.0.1", "localhost", "[::1]", "::1"].includes(o.hostname)) return false;
		} catch { return false; }
	}
	return true;
}

function sendJson(req, res, status, body) {
	if (res.destroyed || res.writableEnded) return;
	res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
	res.end(req.method === "HEAD" ? undefined : JSON.stringify(body));
}

function listAssets(dir = ASSET_ROOT) {
	const out = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...listAssets(full));
		else if (TYPES[extname(entry.name).toLowerCase()]) out.push(full);
	}
	return out;
}

async function serveFile(req, res, file, type, cacheable) {
	if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405, { allow: "GET, HEAD" }); res.end(); return; }
	let size;
	try { size = statSync(file).size; } catch { res.writeHead(404); res.end(); return; }
	const headers = {
		"content-type": type,
		"cache-control": cacheable ? "public, max-age=31536000, immutable" : "no-cache",
		"accept-ranges": "bytes",
		"x-content-type-options": "nosniff",
	};
	let start = 0, end = size - 1, status = 200;
	const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ""));
	if (m && (m[1] || m[2])) {
		start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
		end = m[1] && m[2] ? Math.min(end, Number(m[2])) : end;
		if (start > end || start >= size) { res.writeHead(416, { "content-range": "bytes */" + size }); res.end(); return; }
		status = 206;
		headers["content-range"] = `bytes ${start}-${end}/${size}`;
	}
	headers["content-length"] = end - start + 1;
	res.writeHead(status, headers);
	if (req.method === "HEAD") { res.end(); return; }
	try { await pipeline(createReadStream(file, { start, end }), res); }
	catch (e) { if (!res.destroyed) res.destroy(e); }
}

function readBody(req, limit) {
	return new Promise((resolve) => {
		const chunks = [];
		let size = 0, done = false;
		const finish = (v) => { if (done) return; done = true; resolve(v); };
		req.on("data", (c) => {
			size += c.length;
			if (size > limit) { finish(null); req.destroy(); return; }
			chunks.push(c);
		});
		req.on("end", () => finish(Buffer.concat(chunks)));
		req.on("error", () => finish(null));
		req.on("aborted", () => finish(null));
	});
}

function ensureDataDir() { if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true }); }

function readSettings() {
	try { return JSON.parse(readFileSync(SETTINGS_FILE, "utf8")); } catch { return {}; }
}

function writeSettings(obj) {
	ensureDataDir();
	const tmp = SETTINGS_FILE + ".tmp";
	writeFileSync(tmp, JSON.stringify(obj, null, 2), "utf8");
	renameSync(tmp, SETTINGS_FILE);
}

function userBgFile(skin) {
	if (!existsSync(DATA_DIR)) return null;
	for (const name of readdirSync(DATA_DIR)) {
		if (name.startsWith("userbg-" + skin + ".")) return join(DATA_DIR, name);
	}
	return null;
}

export function routes() {
	const list = [];
	// 1) 静态素材：启动时扫描一次，按文件逐条注册精确路径
	for (const file of listAssets()) {
		const rel = relative(ASSET_ROOT, file).split(sep).join("/");
		const type = TYPES[extname(file).toLowerCase()];
		list.push({ path: BASE + "/a/" + rel, handler: (req, res) => serveFile(req, res, file, type, true) });
	}
	// 2) 设置
	list.push({
		path: BASE + "/settings",
		handler: async (req, res) => {
			if (!trusted(req)) return sendJson(req, res, 403, { ok: false });
			if (req.method === "GET" || req.method === "HEAD") return sendJson(req, res, 200, { ok: true, settings: readSettings() });
			if (req.method !== "POST") return sendJson(req, res, 405, { ok: false });
			const body = await readBody(req, MAX_SETTINGS);
			let value = null;
			try { value = body ? JSON.parse(body.toString("utf8")) : null; } catch { value = null; }
			if (!value || typeof value !== "object" || Array.isArray(value)) return sendJson(req, res, 400, { ok: false });
			try { writeSettings(value); } catch { return sendJson(req, res, 500, { ok: false }); }
			return sendJson(req, res, 200, { ok: true });
		},
	});
	// 3) 自定义背景：GET 读取 / POST 上传 / DELETE 删除，?skin=night
	list.push({
		path: BASE + "/userbg",
		handler: async (req, res) => {
			if (!trusted(req)) return sendJson(req, res, 403, { ok: false });
			const skin = new URL(req.url || "/", "http://localhost").searchParams.get("skin");
			if (!SKIN_IDS.includes(skin)) return sendJson(req, res, 400, { ok: false });
			if (req.method === "GET" || req.method === "HEAD") {
				const file = userBgFile(skin);
				if (!file) return sendJson(req, res, 404, { ok: false });
				const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
				return serveFile(req, res, file, type, false);
			}
			if (req.method === "DELETE") {
				const file = userBgFile(skin);
				try { if (file) unlinkSync(file); } catch {}
				return sendJson(req, res, 200, { ok: true });
			}
			if (req.method !== "POST") return sendJson(req, res, 405, { ok: false });
			const type = String(req.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();
			const ext = UPLOAD_EXT[type];
			if (!ext) return sendJson(req, res, 415, { ok: false, code: "TYPE" });
			const body = await readBody(req, MAX_UPLOAD);
			if (!body || body.length === 0) return sendJson(req, res, 413, { ok: false, code: "SIZE" });
			try {
				ensureDataDir();
				const old = userBgFile(skin);
				if (old) unlinkSync(old);
				writeFileSync(join(DATA_DIR, "userbg-" + skin + ext), body);
			} catch { return sendJson(req, res, 500, { ok: false }); }
			return sendJson(req, res, 200, { ok: true, type });
		},
	});
	return list;
}

/** DSH 自带启动页替换：GET 查状态 / POST {enabled, skin, css, html} */
export function splashRoute(splash) {
	return {
		path: BASE + "/splash",
		handler: async (req, res) => {
			if (!trusted(req)) return sendJson(req, res, 403, { ok: false });
			if (req.method === "GET" || req.method === "HEAD") return sendJson(req, res, 200, splash.state());
			if (req.method !== "POST") return sendJson(req, res, 405, { ok: false });
			const body = await readBody(req, 1024 * 1024);
			let value = null;
			try { value = body ? JSON.parse(body.toString("utf8")) : null; } catch { value = null; }
			if (!value || typeof value !== "object") return sendJson(req, res, 400, { ok: false });
			return sendJson(req, res, 200, splash.apply(value));
		},
	};
}

/** 余额 / 今日已用：GET /dsh-carlotta-theme/quota[?refresh=1] */
export function quotaRoute(quota) {
	return {
		path: BASE + "/quota",
		handler: async (req, res) => {
			if (!trusted(req)) return sendJson(req, res, 403, { ok: false });
			if (req.method !== "GET" && req.method !== "HEAD") return sendJson(req, res, 405, { ok: false });
			const force = new URL(req.url || "/", "http://localhost").searchParams.get("refresh") === "1";
			try { return sendJson(req, res, 200, await quota.read(force)); }
			catch { return sendJson(req, res, 200, { ok: false, code: "ERROR" }); }
		},
	};
}

export function apply(ctx) {
	ctx.inject(["webServer"], (scope) => {
		const splash = createSplash({ dataDir: DATA_DIR, assetRoot: ASSET_ROOT, splashFile: findSplash() });
		// DSH 更新会把替换过的启动页覆盖回原版：开关开着就自动补回
		const saved = readSettings();
		splash.heal(saved.enabled !== false && saved.boot !== false && saved.splash !== false);
		for (const { path, handler } of [...routes(), splashRoute(splash)]) {
			scope.effect(() => scope.webServer.register({ kind: "exact", path, handler }), "carlotta-theme: " + path);
		}
	});
	// 余额单独一组：没有凭据服务的环境里，换肤照常工作，只是查不到余额。
	ctx.inject(["webServer", "credentials"], (scope) => {
		const quota = createQuota({
			dataDir: DATA_DIR,
			resolveKey: () => scope.credentials.resolve("DEEPSEEK_API_KEY"),
			getAccount: () => { try { return scope.get("deepseekAccount"); } catch { return null; } },
		});
		const { path, handler } = quotaRoute(quota);
		scope.effect(() => scope.webServer.register({ kind: "exact", path, handler }), "carlotta-theme: quota");
		// 每 15 分钟记一次账，充值和用量都能及时反映到「今日已用」
		scope.effect(() => {
			const timer = setInterval(() => { quota.read(true).catch(() => {}); }, 15 * 60_000);
			timer.unref?.();
			return () => clearInterval(timer);
		}, "carlotta-theme: quota poll");
	});
}
