const { STATES } = require('../utils/constants');
const allowed = { [STATES.WAITING]:[STATES.COUNTDOWN], [STATES.COUNTDOWN]:[STATES.RUNNING,STATES.WAITING], [STATES.RUNNING]:[STATES.FINISHED], [STATES.FINISHED]:[STATES.PAYOUT], [STATES.PAYOUT]:[STATES.NEXT_ROUND], [STATES.NEXT_ROUND]:[STATES.WAITING] };
function assertTransition(from,to){ if(from===to) return true; if(!allowed[from] || !allowed[from].includes(to)) throw new Error(`Invalid state transition ${from} -> ${to}`); return true; }
module.exports = { assertTransition };
