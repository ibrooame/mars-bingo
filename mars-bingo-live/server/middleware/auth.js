const crypto = require('crypto');
function adminAuth(req,res,next){ const provided=req.headers['x-admin-secret'] || req.query.adminSecret || req.body?.adminSecret; const expected=process.env.ADMIN_SECRET || ''; if(!expected || expected==='change-this-admin-secret') return res.status(503).json({error:'Admin secret not configured'}); const a=Buffer.from(String(provided||'')); const b=Buffer.from(expected); if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return res.status(401).json({error:'Unauthorized'}); next(); }
module.exports = { adminAuth };
