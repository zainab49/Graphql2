// script/svg.js
export function drawXPProgressChart(data) {
  const svg = document.getElementById("xpChart");
  svg.innerHTML = "";
  if (!data.length) return;
  const [w, h] = [400, 300];
  const m = { top: 20, right: 20, bottom: 60, left: 60 };
  const cw = w - m.left - m.right, ch = h - m.top - m.bottom;
  const maxXP = Math.max(...data.map(d => d.xp));
  let path = "";
  data.forEach((d,i) => {
    const x = m.left + (i/(data.length-1))*cw;
    const y = m.top + ch - (d.xp/maxXP)*ch;
    path += i===0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });
  svg.innerHTML += `
    <defs>
      <linearGradient id="xpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:#4CAF50;stop-opacity:0.1"/>
      </linearGradient>
    </defs>
    <path d="${path} L ${m.left+cw} ${m.top+ch} L ${m.left} ${m.top+ch} Z" fill="url(#xpGrad)"/>
    <path d="${path}" stroke="#4CAF50" stroke-width="3" fill="none"/>
  `;
  data.forEach((d,i) => {
    const x = m.left + (i/(data.length-1))*cw;
    const y = m.top + ch - (d.xp/maxXP)*ch;
    svg.innerHTML += `<circle cx="${x}" cy="${y}" r="4" fill="#2E7D32"/>`;
    svg.innerHTML += `<text x="${x}" y="${h-10}" text-anchor="middle" font-size="10" fill="#666">${d.period}</text>`;
  });
  for (let i=0;i<=4;i++) {
    const y = m.top+(i/4)*ch;
    const val = Math.round(maxXP*(1-i/4));
    svg.innerHTML += `
      <text x="10" y="${y+4}" font-size="10" fill="#666">${val}</text>
      <line x1="${m.left-5}" y1="${y}" x2="${m.left}" y2="${y}" stroke="#ccc"/>
    `;
  }
}

export function drawSuccessRateChart(stats) {
  const svg = document.getElementById("successChart");
  svg.innerHTML = "";
  const cx=200, cy=150, r=80;
  const passedAng = (stats.passed/stats.total)*360;
  svg.innerHTML += `<path d="${describeArc(cx,cy,r,0,passedAng)}" fill="#4CAF50"/>`;
  svg.innerHTML += `<path d="${describeArc(cx,cy,r,passedAng,360)}" fill="#F44336"/>`;
  svg.innerHTML += `
    <text x="${cx}" y="${cy-10}" text-anchor="middle" font-size="24" fill="#333">${stats.successRate}%</text>
    <text x="${cx}" y="${cy+15}" text-anchor="middle" font-size="12" fill="#666">Success Rate</text>
    <circle cx="50" cy="250" r="8" fill="#4CAF50"/><text x="65" y="255" font-size="12" fill="#333">Passed (${stats.passed})</text>
    <circle cx="200" cy="250" r="8" fill="#F44336"/><text x="215" y="255" font-size="12" fill="#333">Failed (${stats.failed})</text>
  `;
}

export function drawXPByProjectChart(data) {
  const svg = document.getElementById("xpByProjectChart");
  svg.innerHTML = "";
  if (!data.length) return;
  const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD'];
  const cx=200, cy=150, r=80;
  const total = data.reduce((s,d)=>s+d.xp,0);
  let angleAcc=0;
  data.forEach((d,i)=> {
    const ang = (d.xp/total)*360;
    svg.innerHTML += `<path d="${describeArc(cx,cy,r,angleAcc,angleAcc+ang)}" fill="${colors[i%colors.length]}"/>`;
    const mid = (angleAcc+ang/2)*Math.PI/180;
    svg.innerHTML += `<text x="${cx+Math.cos(mid)*(r+30)}" y="${cy+Math.sin(mid)*(r+30)}" text-anchor="middle" font-size="10">${d.type}</text>`;
    angleAcc += ang;
  });
}

export function drawSkillsChart(transactions) {
  const svg = document.getElementById("skillsChart");
  svg.innerHTML = "";
  const skills = {};
  transactions.forEach(t => {
    if (t.type==='xp' && t.path) {
      const sk = t.path.split('/').pop()||'other';
      skills[sk] = (skills[sk]||0)+t.amount;
    }
  });
  const arr = Object.entries(skills).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxXP = Math.max(...arr.map(a=>a[1]));
  arr.forEach(([skill,val],i)=>{
    const y = 20 + i*35;
    const w = (val/maxXP)*300;
    svg.innerHTML += `<rect x="80" y="${y}" width="${w}" height="25" rx="4" fill="#667eea"/>`;
    svg.innerHTML += `<text x="75" y="${y+17}" text-anchor="end" font-size="11">${skill}</text>`;
    svg.innerHTML += `<text x="${85+w}" y="${y+17}" font-size="10" fill="#666">${val}</text>`;
  });
}

function describeArc(x,y,r,start,end) {
  const startP = polarToCartesian(x,y,r,end);
  const endP   = polarToCartesian(x,y,r,start);
  const large = end-start<=180?0:1;
  return `M ${x} ${y} L ${startP.x} ${startP.y} A ${r} ${r} 0 ${large} 0 ${endP.x} ${endP.y} Z`;
}

function polarToCartesian(cx,cy,r,deg) {
  const rad = (deg-90)*Math.PI/180;
  return { x: cx + r*Math.cos(rad), y: cy + r*Math.sin(rad) };
}
