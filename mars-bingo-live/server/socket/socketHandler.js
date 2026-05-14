const { validateTelegramInitData } = require('../utils/crypto');
const { ensureUser, getUserById } = require('../database/queries/wallet');
const db = require('../database/db');
const { SOCKET_EVENTS } = require('../utils/constants');
const { fromCents } = require('../utils/helpers');
const logger = require('../utils/logger');
async function socketAuth(socket,next){ try{ if(process.env.NODE_ENV==='development' && socket.handshake.auth?.devTelegramId){ socket.user=await ensureUser({id:socket.handshake.auth.devTelegramId, username:'dev'}); return next(); } const result=validateTelegramInitData(socket.handshake.auth?.initData, process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN); if(!result.ok) return next(new Error(result.reason)); socket.user=await ensureUser(result.user); if(socket.user.banned) return next(new Error('User banned')); next(); }catch(e){ next(e); } }
function registerSocketHandlers(io, engine){ io.use(socketAuth); io.on('connection', socket=>{ logger.info('socket connected', socket.id, socket.user.id); socket.join(`user:${socket.user.id}`); socket.emit(SOCKET_EVENTS.CURRENT_STATE, engine.serialize()); socket.emit(SOCKET_EVENTS.WALLET_UPDATED,{balance:fromCents(socket.user.balance_cents)});
  socket.on(SOCKET_EVENTS.JOIN_GAME, ()=>{ socket.join('game'); socket.emit(SOCKET_EVENTS.SYNC_STATE, engine.serialize()); });
  socket.on(SOCKET_EVENTS.LEAVE_GAME, ()=>socket.leave('game'));
  socket.on(SOCKET_EVENTS.BUY_CARD, async(_,ack)=>{ try{ const card=await engine.buyCard(socket.user.id); const user=await getUserById(socket.user.id); socket.emit(SOCKET_EVENTS.WALLET_UPDATED,{balance:fromCents(user.balance_cents)}); io.emit(SOCKET_EVENTS.SYNC_STATE, engine.serialize()); if(ack) ack({ok:true, card}); }catch(e){ if(ack) ack({ok:false,error:e.message}); else socket.emit('errorMessage',{error:e.message}); } });
  socket.on(SOCKET_EVENTS.CLAIM_BINGO, async(data,ack)=>{ try{ const result=await engine.claim(socket.user.id, Number(data?.cardId)); if(!result.valid){ socket.emit(SOCKET_EVENTS.CLAIM_FAILED,result); if(ack) ack({ok:false,...result}); return; } if(ack) ack({ok:true,...result}); }catch(e){ socket.emit(SOCKET_EVENTS.CLAIM_FAILED,{reason:e.message}); if(ack) ack({ok:false,error:e.message}); } });
  socket.on(SOCKET_EVENTS.CHAT_MESSAGE, async(data,ack)=>{ try{ const msg=String(data?.message||'').trim().slice(0,180); if(!msg) return; await db.run('INSERT INTO chat_messages(user_id,round_id,message) VALUES(?,?,?)',[socket.user.id,engine.round?.id||null,msg]); const payload={userId:socket.user.id,name:socket.user.username||socket.user.first_name||'Player',message:msg,createdAt:new Date().toISOString()}; io.emit(SOCKET_EVENTS.CHAT_MESSAGE,payload); if(ack) ack({ok:true}); }catch(e){ if(ack) ack({ok:false,error:e.message}); } });
  socket.on(SOCKET_EVENTS.SYNC_STATE, ()=>socket.emit(SOCKET_EVENTS.SYNC_STATE, engine.serialize()));
  socket.on(SOCKET_EVENTS.HEARTBEAT, ack=>{ const payload={ts:Date.now()}; if(typeof ack==='function') ack(payload); else socket.emit(SOCKET_EVENTS.HEARTBEAT,payload); });
  socket.on('disconnect', reason=>logger.info('socket disconnected', socket.id, reason));
 }); }
module.exports = { registerSocketHandlers };
