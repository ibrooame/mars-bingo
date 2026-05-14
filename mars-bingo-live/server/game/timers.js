class TimerRegistry { constructor(){ this.timers=new Set(); } setTimeout(fn,ms){ const t=setTimeout(()=>{this.timers.delete(t); fn();},ms); this.timers.add(t); return t; } setInterval(fn,ms){ const t=setInterval(fn,ms); this.timers.add(t); return t; } clearAll(){ for(const t of this.timers){ clearTimeout(t); clearInterval(t); } this.timers.clear(); } }
module.exports = { TimerRegistry };
