const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg) { tg.expand(); tg.ready(); document.documentElement.style.setProperty('--tg-bg', tg.themeParams.bg_color || '#090b12'); }
const devTelegramId = localStorage.getItem('devTelegramId') || (crypto.getRandomValues(new Uint32Array(1))[0]).toString();
localStorage.setItem('devTelegramId', devTelegramId);
const socket = io({ auth: { initData: tg ? tg.initData : '', devTelegramId } });
let selectedCardId = null;
function $(id){ return document.getElementById(id); }
function toast(msg){ $('toast').textContent=msg; $('toast').classList.add('show'); setTimeout(()=>$('toast').classList.remove('show'),2400); if(tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success'); }
function headers(){ return tg?.initData ? {'Content-Type':'application/json','x-telegram-init-data':tg.initData} : {'Content-Type':'application/json','x-dev-telegram-id':devTelegramId}; }
function renderState(s){ $('state').textContent=s.state; $('currentBall').textContent=s.currentBall || '--'; $('history').textContent=(s.calledNumbers||[]).slice(-8).reverse().join(' • ') || 'No calls yet'; $('pool').textContent=Number(s.prizePool||0).toFixed(2); }
function renderCard(card){ const wrap=document.createElement('div'); wrap.className='bingo'; card.card.flat().forEach(n=>{ const cell=document.createElement('button'); cell.className='cell'; cell.textContent=n===0?'★':n; if(n===0) cell.classList.add('marked'); cell.onclick=()=>cell.classList.toggle('marked'); wrap.appendChild(cell); }); wrap.onclick=()=>{ selectedCardId=card.id; document.querySelectorAll('.bingo').forEach(x=>x.classList.remove('selected')); wrap.classList.add('selected'); }; $('cards').prepend(wrap); selectedCardId=card.id; wrap.classList.add('selected'); }
async function loadMe(){ const res=await fetch('/api/auth/me',{headers:headers()}); if(res.ok){ const data=await res.json(); $('balance').textContent=Number(data.user.balance).toFixed(2); } }
socket.on('currentState', renderState); socket.on('syncState', renderState); socket.on('numberCalled', d=>renderState(d.state)); socket.on('countdown', d=>$('countdown').textContent=d.seconds); socket.on('walletUpdated', d=>$('balance').textContent=Number(d.balance).toFixed(2)); socket.on('bingoWinner', d=>toast(`🏆 ${d.name} won ${d.amount} ETB`)); socket.on('claimFailed', d=>toast(d.reason || 'Claim failed')); socket.on('chatMessage', d=>{ const p=document.createElement('p'); p.innerHTML=`<b>${d.name}:</b> ${String(d.message).replace(/[<>]/g,'')}`; $('messages').appendChild(p); $('messages').scrollTop=$('messages').scrollHeight; });
$('buyBtn').onclick=()=>socket.emit('buyCard', {}, r=>{ if(!r.ok) return toast(r.error); renderCard(r.card); loadMe(); toast('Card purchased'); });
$('claimBtn').onclick=()=>{ if(!selectedCardId) return toast('Buy/select a card first'); socket.emit('claimBingo',{cardId:selectedCardId}, r=>toast(r.ok?'Bingo verified!':(r.error||r.reason))); };
$('chatForm').onsubmit=e=>{ e.preventDefault(); const msg=$('chatInput').value.trim(); if(msg){ socket.emit('chatMessage',{message:msg}); $('chatInput').value=''; } };
if(tg?.MainButton){ tg.MainButton.setText('BUY CARD'); tg.MainButton.onClick(()=>$('buyBtn').click()); tg.MainButton.show(); }
socket.emit('joinGame'); loadMe().catch(()=>{});
