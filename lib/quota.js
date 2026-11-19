/**
 * 余额与「今日已用」。
 *
 * - 余额：优先 DSH 凭据里的 DEEPSEEK_API_KEY → 官方 https://api.deepseek.com/user/balance；
 *   没有 Key 或失败时，退回 DSH 登录的 DeepSeek 账号（deepseekAccount.getBalance）。
 * - 今日已用：DeepSeek 没有「今日用量」接口，所以按北京时间每天记一本小账：
 *   同一天里每次读到的余额比上次少，就把差额记为已用；余额变多（充值）只更新基线、不算用量。
 *   账本存在 <数据目录>/ledger.json。插件第一次运行的那一天，只能从开始记账的时刻算起。
 *
 * API Key 只在内存里用来发请求，不写日志、不写文件、不返回给页面。
 */
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

export const BALANCE_URL = "https://api.deepseek.com/user/balance";
const CACHE_MS = 30_000;

export function beijingDay(ms) {
	return new Date(ms + 8 * 3600_000).toISOString().slice(0, 10);
}

const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
const round2 = (v) => Math.round(v * 100) / 100;

function secretOf(resolved) {
	if (typeof resolved === "string") return resolved;
	if (resolved && typeof resolved.value === "string") return resolved.value;
	return "";
}

/** 官方余额接口返回 → { balance, currency } */
export function parseApiBalance(data) {
	const list = Array.isArray(data && data.balance_infos) ? data.balance_infos : [];
	if (!list.length) return null;
	const pick = list.find((x) => String(x.currency).toUpperCase() === "CNY") || list[0];
	const total = num(pick.total_balance);
	if (total === null) return null;
	return { balance: total, currency: String(pick.currency || "CNY").toUpperCase(), available: data.is_available !== false };
}

/** DSH 账号服务返回 → { balance, currency }（充值钱包 + 赠金钱包合计，CNY 优先） */
export function parseAccountBalance(result) {
	if (!result || result.status !== "ready") return null;
	const wallets = [...(Array.isArray(result.value) ? result.value : []), ...(Array.isArray(result.bonusWallets) ? result.bonusWallets : [])]
		.filter((w) => w && num(w.balance) !== null);
	if (!wallets.length) return null;
	const cur = (w) => String(w.currency || "CNY").toUpperCase();
	const currency = wallets.some((w) => cur(w) === "CNY") ? "CNY" : cur(wallets[0]);
	const balance = wallets.filter((w) => cur(w) === currency).reduce((s, w) => s + Number(w.balance), 0);
	return { balance: round2(balance), currency, available: true };
}

export function createQuota({ dataDir, resolveKey, getAccount, fetchImpl = fetch, now = () => Date.now() }) {
	const ledgerFile = join(dataDir, "ledger.json");
	let cache = null;
	let inflight = null;

	const readLedger = () => { try { return JSON.parse(readFileSync(ledgerFile, "utf8")); } catch { return null; } };
	const writeLedger = (obj) => {
		try {
			if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
			writeFileSync(ledgerFile + ".tmp", JSON.stringify(obj), "utf8");
			renameSync(ledgerFile + ".tmp", ledgerFile);
		} catch {}
	};

	/** 用一次新读到的余额更新账本，返回今日已用。 */
	function track(balance, currency) {
		const t = now();
		const day = beijingDay(t);
		let led = readLedger();
		if (!led || led.day !== day || led.currency !== currency || num(led.lastBalance) === null) {
			// 新的一天：如果昨天的账本存在且是连着的，就从「昨天最后一次余额」开始算，
			// 这样零点到第一次查询之间用掉的也能算进今天（比较接近真实）。
			// 只接「昨天」的账本；隔了好几天没开就不接，免得把几天的用量都算到今天。
			const carry = led && led.currency === currency && num(led.lastBalance) !== null && led.day === beijingDay(t - 86400_000);
			const start = carry ? num(led.lastBalance) : balance;
			led = { day, currency, lastBalance: start, used: 0, since: carry ? null : t };
		}
		if (balance < led.lastBalance) led.used = round2(led.used + (led.lastBalance - balance));
		led.lastBalance = balance;
		led.updatedAt = t;
		writeLedger(led);
		return { used: led.used, since: led.since };
	}

	async function fetchByKey() {
		let key = "";
		try { key = secretOf(await resolveKey()); } catch { key = ""; }
		if (!key) return { ok: false, code: "NO_KEY" };
		try {
			const r = await fetchImpl(BALANCE_URL, { headers: { authorization: "Bearer " + key, accept: "application/json" }, signal: AbortSignal.timeout(8000) });
			if (!r.ok) return { ok: false, code: "HTTP_" + r.status };
			const info = parseApiBalance(await r.json());
			return info ? { ok: true, source: "apikey", ...info } : { ok: false, code: "SHAPE" };
		} catch { return { ok: false, code: "NETWORK" }; }
	}

	async function fetchByAccount() {
		let account = null;
		try { account = getAccount ? getAccount() : null; } catch { account = null; }
		if (!account || typeof account.getBalance !== "function") return { ok: false, code: "NO_ACCOUNT" };
		try {
			const result = await Promise.race([
				account.getBalance({ version: "unknown", locale: "zh_CN", timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60 }),
				new Promise((res) => setTimeout(() => res(null), 8000)),
			]);
			const info = parseAccountBalance(result);
			return info ? { ok: true, source: "account", ...info } : { ok: false, code: "NO_ACCOUNT" };
		} catch { return { ok: false, code: "NO_ACCOUNT" }; }
	}

	async function read(force) {
		if (!force && cache && now() - cache.at < CACHE_MS) return cache.body;
		if (inflight) return inflight;
		inflight = (async () => {
			let res = await fetchByKey();
			if (!res.ok) {
				const acc = await fetchByAccount();
				if (acc.ok) res = acc;
			}
			let body;
			if (res.ok) {
				const { used, since } = track(res.balance, res.currency);
				body = { ok: true, balance: res.balance, currency: res.currency, todayUsed: used, since, source: res.source, available: res.available, at: now() };
			} else {
				body = { ok: false, code: res.code, at: now() };
			}
			cache = { at: now(), body };
			return body;
		})();
		try { return await inflight; } finally { inflight = null; }
	}

	return { read };
}
