// 宿主半边的离线测试：模拟 DSH 的 webServer.register，起一个真实 http 服务验证路由。
import http from "node:http";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const tmp = mkdtempSync(join(tmpdir(), "cl-theme-"));
process.env.APPDATA = tmp;
const { apply, name } = await import("../lib/index.js");
assert.equal(name, "dsh-carlotta-theme");

// 假 ctx：inject 立刻回调，effect 立刻执行
const table = new Map();
const scope = {
	effect(fn) { const d = fn(); if (typeof d === "function") cleanups.push(d); },
	webServer: { register({ kind, path, handler }) { assert.equal(kind, "exact"); table.set(path, handler); return () => table.delete(path); } },
	credentials: { resolve: async () => null },   // 测试环境：没有 Key
	get: () => null,
};
const cleanups = [];
const injected = [];
apply({ inject(deps, cb) { injected.push(deps.join("+")); cb(scope); } });
assert.deepEqual(injected, ["webServer", "webServer+credentials"]);

const server = http.createServer((req, res) => {
	const path = new URL(req.url, "http://x").pathname;
	const handler = table.get(path);
	if (!handler) { res.writeHead(404); res.end(); return; }
	handler(req, res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const url = (p) => `http://127.0.0.1:${port}${p}`;
let pass = 0;
const ok = (msg) => { pass++; console.log("  ✓ " + msg); };

try {
	// 素材
	const need = ["bg/night.webp", "bg/summer.webp", "boot/day.webp", "img/chibi.png", "img/crest.svg", "fonts/Caveat-600.woff2"];
	for (const p of need) assert.ok(table.has("/dsh-carlotta-theme/a/" + p), "missing route " + p);
	ok(`注册了 ${table.size} 条路由，关键素材齐全`);
	let r = await fetch(url("/dsh-carlotta-theme/a/bg/night.webp?v=1.0.0"));
	assert.equal(r.status, 200);
	assert.equal(r.headers.get("content-type"), "image/webp");
	assert.ok((await r.arrayBuffer()).byteLength > 10000);
	ok("背景图可读取，类型正确");
	r = await fetch(url("/dsh-carlotta-theme/a/fonts/Caveat-600.woff2"), { headers: { range: "bytes=0-99" } });
	assert.equal(r.status, 206);
	assert.equal((await r.arrayBuffer()).byteLength, 100);
	ok("支持分段读取（视频需要）");

	// 设置
	r = await fetch(url("/dsh-carlotta-theme/settings"));
	assert.deepEqual(await r.json(), { ok: true, settings: {} });
	r = await fetch(url("/dsh-carlotta-theme/settings"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ skin: "summer", alpha: 0.6 }) });
	assert.equal(r.status, 200);
	r = await fetch(url("/dsh-carlotta-theme/settings"));
	assert.equal((await r.json()).settings.skin, "summer");
	assert.ok(existsSync(join(tmp, "dsh-carlotta-theme", "settings.json")));
	ok("设置能保存到文件并读回");
	r = await fetch(url("/dsh-carlotta-theme/settings"), { method: "POST", body: "not json" });
	assert.equal(r.status, 400);
	ok("坏数据被拒绝");

	// 非本机来源
	const evil = await new Promise((resolve) => {
		const req = http.request({ host: "127.0.0.1", port, path: "/dsh-carlotta-theme/settings", headers: { host: "evil.example.com" } }, (res) => { res.resume(); resolve(res.statusCode); });
		req.end();
	});
	assert.equal(evil, 403);
	r = await fetch(url("/dsh-carlotta-theme/settings"), { headers: { origin: "https://evil.example.com" } });
	assert.equal(r.status, 403);
	ok("外部来源的请求被拒绝");

	// 自定义背景
	const png = readFileSync(new URL("../assets/img/chibi.png", import.meta.url));
	r = await fetch(url("/dsh-carlotta-theme/userbg?skin=day"), { method: "POST", headers: { "content-type": "image/png" }, body: png });
	assert.deepEqual(await r.json(), { ok: true, type: "image/png" });
	r = await fetch(url("/dsh-carlotta-theme/userbg?skin=day"));
	assert.equal(r.status, 200);
	assert.equal((await r.arrayBuffer()).byteLength, png.length);
	ok("自定义背景上传后能读回");
	r = await fetch(url("/dsh-carlotta-theme/userbg?skin=day"), { method: "POST", headers: { "content-type": "text/html" }, body: "<script>" });
	assert.equal(r.status, 415);
	r = await fetch(url("/dsh-carlotta-theme/userbg?skin=../../x"), { method: "POST", headers: { "content-type": "image/png" }, body: png });
	assert.equal(r.status, 400);
	ok("非图片类型、非法皮肤名被拒绝");
	r = await fetch(url("/dsh-carlotta-theme/userbg?skin=day"), { method: "DELETE" });
	assert.equal(r.status, 200);
	r = await fetch(url("/dsh-carlotta-theme/userbg?skin=day"));
	assert.equal(r.status, 404);
	ok("删除自定义背景后恢复默认");

	// 余额路由（没有 Key、没有账号 → 明确告诉页面 NO_KEY）
	r = await fetch(url("/dsh-carlotta-theme/quota"));
	assert.deepEqual((await r.json()).code, "NO_KEY");
	ok("没配 Key 时余额接口返回 NO_KEY");

	// 余额 + 今日已用（用假接口和可调时钟）
	const { createQuota, parseAccountBalance } = await import("../lib/quota.js");
	let balance = 50, clock = Date.parse("2026-11-19T02:00:00Z"); // 北京时间 10:00
	let seenAuth = "";
	const fakeFetch = async (u, opt) => {
		assert.equal(u, "https://api.deepseek.com/user/balance");
		seenAuth = opt.headers.authorization;
		return { ok: true, json: async () => ({ is_available: true, balance_infos: [{ currency: "CNY", total_balance: String(balance), granted_balance: "0", topped_up_balance: String(balance) }] }) };
	};
	const qdir = join(tmp, "q");
	const q = createQuota({ dataDir: qdir, resolveKey: async () => ({ value: "sk-test" }), getAccount: () => null, fetchImpl: fakeFetch, now: () => clock });
	let v = await q.read(true);
	assert.equal(seenAuth, "Bearer sk-test");
	assert.equal(v.balance, 50); assert.equal(v.todayUsed, 0); assert.ok(v.since);
	balance = 48.7; clock += 3600_000; v = await q.read(true);
	assert.equal(v.todayUsed, 1.3);
	balance = 100; clock += 60_000; v = await q.read(true);          // 充值
	assert.equal(v.todayUsed, 1.3);
	balance = 99.5; clock += 60_000; v = await q.read(true);
	assert.equal(v.todayUsed, 1.8);
	ok("今日已用：扣费累加、充值不算用量");
	v = await q.read(false);
	assert.equal(v.todayUsed, 1.8);
	ok("30 秒内重复点击用缓存，不重复请求");
	clock = Date.parse("2026-11-19T17:00:00Z"); balance = 99; v = await q.read(true);   // 北京时间次日 01:00
	assert.equal(v.todayUsed, 0.5); assert.equal(v.since, null);
	ok("跨天自动清零，并接上昨天最后的余额");
	assert.ok(!readFileSync(join(qdir, "ledger.json"), "utf8").includes("sk-test"));
	ok("账本里不含 API Key");
	// 没 Key → 退回 DSH 账号
	const q2 = createQuota({ dataDir: join(tmp, "q2"), resolveKey: async () => null, fetchImpl: fakeFetch, now: () => clock,
		getAccount: () => ({ getBalance: async () => ({ status: "ready", value: [{ currency: "CNY", balance: "10.5" }], bonusWallets: [{ currency: "CNY", balance: "2" }] }) }) });
	v = await q2.read(true);
	assert.equal(v.source, "account"); assert.equal(v.balance, 12.5);
	assert.equal(parseAccountBalance({ status: "not_logged_in" }), null);
	ok("没 Key 时用 DSH 登录账号查余额（充值 + 赠金）");

	// DSH 自带启动页替换（用临时的假 splash.html）
	const { createSplash, MARKER } = await import("../lib/splash.js");
	const { writeFileSync: wf, mkdirSync: md } = await import("node:fs");
	const res = join(tmp, "resources"); md(res, { recursive: true });
	const sf = join(res, "splash.html");
	const ORIGINAL = "<!doctype html><html><head></head><body><main>Starting DSH</main></body></html>";
	wf(sf, ORIGINAL);
	const sp = createSplash({ dataDir: join(tmp, "sd"), assetRoot: (await import("node:url")).fileURLToPath(new URL("../assets/", import.meta.url)), splashFile: sf });
	assert.deepEqual(sp.state(), { supported: true, patched: false, path: sf });
	let st = sp.apply({ enabled: true, skin: "night", css: "body{color:red} url(__DIR__/fonts/x.woff2)", html: "<div id=cl-boot><img src='__DIR__/boot.webp'></div>" });
	assert.equal(st.patched, true, JSON.stringify(st));
	const patched = readFileSync(sf, "utf8");
	assert.ok(patched.includes(MARKER) && patched.includes("<main>Starting DSH</main>"));
	assert.equal(readFileSync(sf + ".carlotta-orig", "utf8"), ORIGINAL);
	const page = readFileSync(join(tmp, "sd", "splash", "page.js"), "utf8");
	assert.ok(page.startsWith("window.__CL_SPLASH") && page.includes("file:///") && !page.includes("__DIR__"));
	assert.ok(existsSync(join(tmp, "sd", "splash", "fonts", "Caveat-600.woff2")));
	ok("替换启动页：备份原文件、写入画面、路径换成本机文件");
	st = sp.apply({ enabled: true, skin: "summer", css: "x", html: "<div></div>" });
	assert.equal(readFileSync(sf, "utf8"), patched);
	ok("换皮肤只更新内容，不重复改 DSH 文件");
	wf(sf, ORIGINAL + "<!-- dsh updated -->");          // 模拟 DSH 更新覆盖
	sp.heal(true);
	assert.ok(readFileSync(sf, "utf8").includes(MARKER));
	ok("DSH 更新覆盖后自动重新替换");
	st = sp.apply({ enabled: false });
	assert.equal(readFileSync(sf, "utf8"), ORIGINAL + "<!-- dsh updated -->");
	assert.ok(!existsSync(sf + ".carlotta-orig"));
	assert.equal(st.patched, false);
	ok("关闭后原样还原");
	assert.equal(createSplash({ dataDir: tmp, assetRoot: tmp, splashFile: null }).apply({ enabled: true }).supported, false);
	assert.equal(sp.apply({ enabled: true, skin: "../x", css: "", html: "" }).error, "内容格式不对");
	ok("找不到文件 / 坏数据时不出错");

	cleanups.forEach((d) => d());
	console.log(`\n全部通过（${pass} 项）`);
} finally {
	server.close();
	rmSync(tmp, { recursive: true, force: true });
}
