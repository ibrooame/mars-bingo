const tg = window.Telegram.WebApp;
tg.expand();

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('user-balance').innerText = urlParams.get('bal') || '0';
    generateGrid();
    setInterval(syncLiveNumbers, 5000);
};

let cardState = Array(25).fill(false);
function generateGrid() {
    const grid = document.getElementById('bingo-grid');
    let nums = [];
    while(nums.length < 25) {
        let r = Math.floor(Math.random() * 75) + 1;
        if(!nums.includes(r)) nums.push(r);
    }
    grid.innerHTML = '';
    nums.forEach((n, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if(i === 12) { cell.innerHTML = '★'; cell.classList.add('marked'); cardState[i] = true; }
        else { cell.innerText = n; cell.onclick = () => { cell.classList.toggle('marked'); cardState[i] = !cardState[i]; }; }
        grid.appendChild(cell);
    });
}
async function syncLiveNumbers() {
    try {
        const res = await fetch('live.json?v=' + Date.now());
        const data = await res.json();
        const called = data.numbers || [];
        document.getElementById('current-number').innerText = called[called.length - 1] || "--";
        document.getElementById('call-history').innerText = "History: " + called.slice(-5).reverse().join(', ');
    } catch (e) { console.log("Syncing..."); }
}
function claimWin() { tg.showAlert("Win Claimed! Admin will verify."); }

