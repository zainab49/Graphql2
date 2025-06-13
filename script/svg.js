
// XP Progress Over Time chart 

export function drawXPProgressChart(data) {
  const svg = document.getElementById("xpChart");
  svg.innerHTML = "";
  if (!data.length) return;
  
  const [w, h] = [400, 300];
  const m = { top: 30, right: 30, bottom: 70, left: 70 };
  const cw = w - m.left - m.right, ch = h - m.top - m.bottom;
  const maxXP = Math.max(...data.map(d => d.xp));
  
  // Create gradient definitions
  svg.innerHTML += `
    <defs>
      <linearGradient id="xpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#5E0055;stop-opacity:0.8"/>
        <stop offset="50%" style="stop-color:#470058;stop-opacity:0.4"/>
        <stop offset="100%" style="stop-color:#3F0059;stop-opacity:0.1"/>
      </linearGradient>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#5E0055"/>
        <stop offset="50%" style="stop-color:#FF6B8A"/>
        <stop offset="100%" style="stop-color:#5E0055"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
      </filter>
    </defs>
  `;
  
  // Draw grid lines
  for (let i = 0; i <= 4; i++) {
    const y = m.top + (i/4) * ch;
    svg.innerHTML += `
      <line x1="${m.left}" y1="${y}" x2="${m.left + cw}" y2="${y}" 
            stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="5,5"/>
    `;
  }
  
  // Create path for area and line
  let path = "";
  data.forEach((d, i) => {
    const x = m.left + (i / (data.length - 1)) * cw;
    const y = m.top + ch - (d.xp / maxXP) * ch;
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });
  
  // Draw area chart
  svg.innerHTML += `
    <path d="${path} L ${m.left + cw} ${m.top + ch} L ${m.left} ${m.top + ch} Z" 
          fill="url(#xpGradient)" filter="url(#shadow)"/>
  `;
  
  // Draw line with glow effect
  svg.innerHTML += `
    <path d="${path}" stroke="url(#lineGradient)" stroke-width="4" 
          fill="none" filter="url(#glow)"/>
  `;
  
  // Draw data points
  data.forEach((d, i) => {
    const x = m.left + (i / (data.length - 1)) * cw;
    const y = m.top + ch - (d.xp / maxXP) * ch;
    svg.innerHTML += `
      <circle cx="${x}" cy="${y}" r="6" fill="#FF6B8A" stroke="#FFFFFF" 
              stroke-width="2" filter="url(#glow)"/>
    `;
    // Period labels
    svg.innerHTML += `
      <text x="${x}" y="${h - 20}" text-anchor="middle" font-size="11" 
            fill="rgba(255,255,255,0.8)" font-weight="500">${d.period}</text>
    `;
  });
  
  // Y-axis labels
  for (let i = 0; i <= 4; i++) {
    const y = m.top + (i / 4) * ch;
    const val = Math.round(maxXP * (1 - i / 4));
    svg.innerHTML += `
      <text x="25" y="${y + 4}" font-size="11" fill="rgba(255,255,255,0.7)" 
            text-anchor="middle" font-weight="500">${val.toLocaleString()}</text>
    `;
  }
  
  // Chart title
  svg.innerHTML += `
    <text x="${w/2}" y="20" text-anchor="middle" font-size="12" 
          fill="rgba(255,255,255,0.9)" font-weight="600">XP Progress</text>
  `;
}

export function drawSuccessRateChart(stats) {
  const svg = document.getElementById("successChart");
  svg.innerHTML = "";
  
  const cx = 200, cy = 140, r = 70;
  const passedAngle = (stats.passed / stats.total) * 360;
  
  svg.innerHTML += `
    <defs>
      <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00E676"/>
        <stop offset="100%" style="stop-color:#4CAF50"/>
      </linearGradient>
      <linearGradient id="failGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FF6B8A"/>
        <stop offset="100%" style="stop-color:#FF4757"/>
      </linearGradient>
      <filter id="pieGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;
  
  // Background circle
  svg.innerHTML += `
    <circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="none" 
            stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
  `;
  
  // Success arc
  svg.innerHTML += `
    <path d="${describeArc(cx, cy, r, 0, passedAngle)}" 
          fill="url(#successGradient)" filter="url(#pieGlow)"/>
  `;
  
  // Fail arc
  if (passedAngle < 360) {
    svg.innerHTML += `
      <path d="${describeArc(cx, cy, r, passedAngle, 360)}" 
            fill="url(#failGradient)" filter="url(#pieGlow)"/>
    `;
  }
  
  // Center text
  svg.innerHTML += `
    <text x="${cx}" y="${cy - 15}" text-anchor="middle" font-size="28" 
          fill="#FFFFFF" font-weight="800" filter="url(#glow)">${stats.successRate}%</text>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" 
          fill="rgba(255,255,255,0.8)" font-weight="500">Success Rate</text>
  `;
  
  // Legend
  svg.innerHTML += `
    <g transform="translate(50, 240)">
      <circle cx="0" cy="0" r="6" fill="url(#successGradient)"/>
      <text x="15" y="4" font-size="12" fill="rgba(255,255,255,0.9)" font-weight="500">
        Passed (${stats.passed})
      </text>
      <circle cx="120" cy="0" r="6" fill="url(#failGradient)"/>
      <text x="135" y="4" font-size="12" fill="rgba(255,255,255,0.9)" font-weight="500">
        Failed (${stats.failed})
      </text>
    </g>
  `;
}

export function drawXPByProjectChart(data) {
  const svg = document.getElementById("xpByProjectChart");
  svg.innerHTML = "";
  if (!data.length) return;
  
  const neonColors = [
    ['#FF6B8A', '#FF4757'],
    ['#5E0055', '#470058'],
    ['#00E676', '#4CAF50'],
    ['#FF9F43', '#FF7675'],
    ['#6C5CE7', '#A29BFE'],
    ['#00CEC9', '#55A3FF']
  ];
  
  const cx = 200, cy = 140, r = 70;
  const total = data.reduce((s, d) => s + d.xp, 0);
  
  svg.innerHTML += `
    <defs>
      ${neonColors.map((colors, i) => `
        <linearGradient id="projectGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors[0]}"/>
          <stop offset="100%" style="stop-color:${colors[1]}"/>
        </linearGradient>
      `).join('')}
      <filter id="segmentGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;
  
  let angleAcc = 0;
  data.forEach((d, i) => {
    const angle = (d.xp / total) * 360;
    const midAngle = (angleAcc + angle / 2) * Math.PI / 180;
    
    // Draw segment
    svg.innerHTML += `
      <path d="${describeArc(cx, cy, r, angleAcc, angleAcc + angle)}" 
            fill="url(#projectGrad${i % neonColors.length})" 
            filter="url(#segmentGlow)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    `;
    
    // Label
    const labelRadius = r + 25;
    const labelX = cx + Math.cos(midAngle) * labelRadius;
    const labelY = cy + Math.sin(midAngle) * labelRadius;
    
    svg.innerHTML += `
      <text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="10" 
            fill="rgba(255,255,255,0.9)" font-weight="500">${d.type}</text>
      <text x="${labelX}" y="${labelY + 12}" text-anchor="middle" font-size="9" 
            fill="rgba(255,255,255,0.7)">${d.xp.toLocaleString()} XP</text>
    `;
    
    angleAcc += angle;
  });
}

export function drawSkillsChart(transactions) {
  const svg = document.getElementById("skillsChart");
  svg.innerHTML = "";
  
  const skills = {};
  transactions.forEach(t => {
    if (t.type === 'xp' && t.path) {
      const skill = t.path.split('/').pop() || 'other';
      skills[skill] = (skills[skill] || 0) + t.amount;
    }
  });
  
  const skillsArray = Object.entries(skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxXP = Math.max(...skillsArray.map(a => a[1]));
  
  svg.innerHTML += `
    <defs>
      <linearGradient id="skillBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#5E0055"/>
        <stop offset="50%" style="stop-color:#FF6B8A"/>
        <stop offset="100%" style="stop-color:#470058"/>
      </linearGradient>
      <filter id="barGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;
  
  skillsArray.forEach(([skill, value], i) => {
    const y = 30 + i * 32;
    const barWidth = Math.max((value / maxXP) * 320, 10);
    
    // Background bar
    svg.innerHTML += `
      <rect x="90" y="${y}" width="320" height="20" rx="10" 
            fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    `;
    
    // Progress bar
    svg.innerHTML += `
      <rect x="90" y="${y}" width="${barWidth}" height="20" rx="10" 
            fill="url(#skillBarGrad)" filter="url(#barGlow)"/>
    `;
    
    // Skill name
    svg.innerHTML += `
      <text x="85" y="${y + 14}" text-anchor="end" font-size="11" 
            fill="rgba(255,255,255,0.9)" font-weight="600">${skill}</text>
    `;
    
    // Value
    svg.innerHTML += `
      <text x="${95 + barWidth}" y="${y + 14}" font-size="10" 
            fill="rgba(255,255,255,0.8)" font-weight="500">${value.toLocaleString()}</text>
    `;
  });
  
  // Chart title
  svg.innerHTML += `
    <text x="230" y="15" text-anchor="middle" font-size="12" 
          fill="rgba(255,255,255,0.9)" font-weight="600">Top Skills by XP</text>
  `;
}

function describeArc(x, y, r, startAngle, endAngle) {
  const start = polarToCartesian(x, y, r, endAngle);
  const end = polarToCartesian(x, y, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${x} ${y} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}