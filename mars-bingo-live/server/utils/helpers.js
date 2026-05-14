function nowIso(){ return new Date().toISOString(); }
function toCents(amount){ const n = Number(amount); if(!Number.isFinite(n) || n < 0) throw new Error('Invalid amount'); return Math.round(n * 100); }
function fromCents(cents){ return Math.round(Number(cents || 0)) / 100; }
function safeJsonParse(value, fallback){ try { return JSON.parse(value); } catch { return fallback; } }
function clampInt(value, min, max, fallback){ const n = Number.parseInt(value, 10); if(!Number.isFinite(n)) return fallback; return Math.max(min, Math.min(max, n)); }
function publicUser(user){ return user ? { id:user.id, telegramId:user.telegram_id, username:user.username, firstName:user.first_name, balance:fromCents(user.balance_cents), banned:!!user.banned } : null; }
module.exports = { nowIso, toCents, fromCents, safeJsonParse, clampInt, publicUser };
