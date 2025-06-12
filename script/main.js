// script/main.js
import { loginUser, logoutUser, getToken } from "./auth.js";
import { getUserInfo, getTransactions, getProgressData } from "./graphql.js";
import { drawXPProgressChart, drawSuccessRateChart, drawXPByProjectChart, drawSkillsChart } from "./svg.js";

// Data processors
function calculateXPOverTime(transactions) {
  const xpTx = transactions.filter(t=>t.type==='xp');
  const monthly = {};
  xpTx.forEach(t=>{
    const d = new Date(t.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    monthly[key] = (monthly[key]||0)+t.amount;
  });
  let cum=0;
  return Object.keys(monthly).sort().map(m=>{
    cum += monthly[m];
    return { period: m, xp: cum };
  }).slice(-6);
}

function calculateProjectStats(data) {
  const projs = data.filter(p=>p.object?.type==='project');
  const passed = projs.filter(p=>p.grade>0).length;
  const total = projs.length;
  return {
    passed,
    failed: total-passed,
    total,
    successRate: total?Math.round((passed/total)*100):0
  };
}

function calculateXPByProjectType(transactions) {
  const map = {};
  transactions.filter(t=>t.type==='xp'&&t.object).forEach(t=>{
    const ty = t.object.type||'other';
    map[ty] = (map[ty]||0)+t.amount;
  });
  return Object.entries(map).map(([type,xp])=>({type,xp}));
}

// UI Elements
const loginSection   = document.getElementById("login-section");
const profileSection = document.getElementById("profile-section");
const loadingSection = document.getElementById("loading");

const loginInput  = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn    = document.getElementById("loginBtn");
const loginError  = document.getElementById("loginError");
const logoutBtn   = document.getElementById("logoutBtn");

// Init
window.addEventListener("DOMContentLoaded", ()=>{
  if (getToken()) showProfile();
  else loginSection.style.display = "block";
});

// Login
loginBtn.addEventListener("click", async ()=>{
  if (!loginInput.value || !passwordInput.value) {
    return loginError.textContent = "Please fill both fields.";
  }
  try {
    await loginUser(loginInput.value.trim(), passwordInput.value.trim());
    loginError.textContent = "";
    showProfile();
  } catch {
    loginError.textContent = "Invalid login credentials.";
  }
});
[loginInput, passwordInput].forEach(i=>
  i.addEventListener("keypress", e=>{
    if (e.key==="Enter") loginBtn.click();
  })
);
logoutBtn.addEventListener("click", logoutUser);

// Main profile loader
async function showProfile() {
  loginSection.style.display   = "none";
  loadingSection.style.display = "block";

  try {
    const user = await getUserInfo();
    document.getElementById("username").textContent = user.login;

    const [tx, pd] = await Promise.all([
      getTransactions(user.id),
      getProgressData(user.id)
    ]);

    const totalXP = tx.filter(t=>t.type==='xp').reduce((s,t)=>s+t.amount,0);
    const projStats  = calculateProjectStats(pd);
    const xpOverTime = calculateXPOverTime(tx);
    const xpByType   = calculateXPByProjectType(tx);

    document.getElementById("xp").textContent               = totalXP.toLocaleString();
    document.getElementById("projectsCompleted").textContent = projStats.passed;
    document.getElementById("auditRatio").textContent        = user.auditRatio?.toFixed(2) || "N/A";
    document.getElementById("currentLevel").textContent      = Math.floor(totalXP/1000)+1;

    drawXPProgressChart(xpOverTime);
    drawSuccessRateChart(projStats);
    drawXPByProjectChart(xpByType);
    drawSkillsChart(tx);

    loadingSection.style.display = "none";
    profileSection.style.display = "block";
  } catch (err) {
  console.error("❌ Error loading profile data:", err);
  loadingSection.innerHTML = `
    <div class="error">
      Failed to load profile data. Please try refreshing.
      <br><br>
      <button onclick="location.reload()">Refresh</button>
    </div>
  `;
}
}
