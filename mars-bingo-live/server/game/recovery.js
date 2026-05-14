async function recoverEngine(engine){ await engine.init(); return engine.serialize(); }
module.exports = { recoverEngine };
