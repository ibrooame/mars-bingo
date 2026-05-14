const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders:'draft-7', legacyHeaders:false });
const walletLimiter = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders:'draft-7', legacyHeaders:false });
module.exports = { apiLimiter, walletLimiter };
