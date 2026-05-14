function isTelegramAdmin(id){ return (process.env.ADMIN_IDS||'').split(',').map(s=>s.trim()).includes(String(id)); }
module.exports = { isTelegramAdmin };
