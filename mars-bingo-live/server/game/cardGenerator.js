const ranges = [[1,15],[16,30],[31,45],[46,60],[61,75]];
function uniqueNums(min,max,count){ const pool=[]; for(let i=min;i<=max;i++) pool.push(i); const out=[]; while(out.length<count){ const idx=Math.floor(Math.random()*pool.length); out.push(pool.splice(idx,1)[0]); } return out; }
function generateCard(){ const columns = ranges.map(([min,max])=>uniqueNums(min,max,5)); const grid=[]; for(let r=0;r<5;r++){ const row=[]; for(let c=0;c<5;c++) row.push(columns[c][r]); grid.push(row); } grid[2][2] = 0; return grid; }
module.exports = { generateCard };
