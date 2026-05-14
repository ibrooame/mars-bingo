const fs = require('fs');
const path = require('path');
const logDir = path.join(process.cwd(), 'logs');
function ensureDir(){ if(!fs.existsSync(logDir)) fs.mkdirSync(logDir,{recursive:true}); }
function write(level, args){ const line = JSON.stringify({ts:new Date().toISOString(), level, msg:args.map(a=>a instanceof Error?{message:a.message,stack:a.stack}:a)}) ; console[level === 'error' ? 'error' : 'log'](line); try{ ensureDir(); fs.appendFileSync(path.join(logDir,'app.log'), line+'\n'); }catch(e){} }
module.exports = { info:(...a)=>write('info',a), warn:(...a)=>write('warn',a), error:(...a)=>write('error',a) };
