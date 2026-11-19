// 测试服务器：用插件自己的宿主路由 + 测试页，模拟 DSH 的同源环境。
// 用法：node test/serve.mjs [端口]   设置数据写到 test/.data（不碰真实 AppData）
import http from "node:http";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, ".data");
mkdirSync(dataDir, { recursive: true });
process.env.APPDATA = dataDir;
const { apply, quotaRoute } = await import("../lib/index.js");
const { createQuota } = await import("../lib/quota.js");
const table = new Map();
apply({ inject(deps, cb) { if (deps.includes("credentials")) return; cb({ effect(fn) { fn(); }, webServer: { register({ path, handler }) { table.set(path, handler); } } }); } });
// 测试页用假余额：每次查询少 0.37 元，模拟在用
let fakeBalance = 52.6;
const quota = createQuota({ dataDir, resolveKey: async () => "sk-fake", getAccount: () => null,
	fetchImpl: async () => ({ ok: true, json: async () => ({ is_available: true, balance_infos: [{ currency: "CNY", total_balance: (fakeBalance -= 0.37).toFixed(2) }] }) }) });
const qr = quotaRoute(quota);
table.set(qr.path, qr.handler);

const port = Number(process.argv[2] || 47811);
http.createServer((req, res) => {
	const path = new URL(req.url, "http://x").pathname;
	if (table.has(path)) return table.get(path)(req, res);
	const send = (file, type) => { try { res.writeHead(200, { "content-type": type, "cache-control": "no-store" }); res.end(readFileSync(file)); } catch { res.writeHead(404); res.end(); } };
	if (path === "/" || path === "/test/harness.html") return send(join(here, "harness.html"), "text/html; charset=utf-8");
	if (path === "/dsh-carlotta-theme/client.js") return send(join(here, "../lib/client.js"), "text/javascript; charset=utf-8");
	if (path.startsWith("/test/vendor/")) return send(join(here, "vendor", path.slice(13)), "text/javascript");
	res.writeHead(404); res.end();
}).listen(port, "127.0.0.1", () => console.log("http://127.0.0.1:" + port + "/"));
