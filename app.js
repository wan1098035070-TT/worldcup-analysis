const teams = [
  { name: "法国", group: "I", confed: "UEFA", rank: 1, tier: "争冠第一梯队", host: false, odds: 7.5 },
  { name: "西班牙", group: "H", confed: "UEFA", rank: 2, tier: "争冠第一梯队", host: false, odds: 8.0 },
  { name: "阿根廷", group: "J", confed: "CONMEBOL", rank: 3, tier: "争冠第一梯队", host: false, odds: 8.5 },
  { name: "英格兰", group: "L", confed: "UEFA", rank: 4, tier: "争冠第一梯队", host: false, odds: 8.5 },
  { name: "葡萄牙", group: "K", confed: "UEFA", rank: 5, tier: "争冠第一梯队", host: false, odds: 9.5 },
  { name: "巴西", group: "C", confed: "CONMEBOL", rank: 6, tier: "争冠第一梯队", host: false, odds: 10.0 },
  { name: "荷兰", group: "F", confed: "UEFA", rank: 7, tier: "深度竞争层", host: false, odds: 13.0 },
  { name: "摩洛哥", group: "C", confed: "CAF", rank: 8, tier: "深度竞争层", host: false, odds: 26.0 },
  { name: "比利时", group: "G", confed: "UEFA", rank: 9, tier: "深度竞争层", host: false, odds: 19.0 },
  { name: "德国", group: "E", confed: "UEFA", rank: 10, tier: "深度竞争层", host: false, odds: 12.0 },
  { name: "克罗地亚", group: "L", confed: "UEFA", rank: 11, tier: "深度竞争层", host: false, odds: 34.0 },
  { name: "哥伦比亚", group: "K", confed: "CONMEBOL", rank: 13, tier: "深度竞争层", host: false, odds: 29.0 },
  { name: "塞内加尔", group: "I", confed: "CAF", rank: 14, tier: "深度竞争层", host: false, odds: 51.0 },
  { name: "墨西哥", group: "A", confed: "CONCACAF", rank: 15, tier: "高爆冷潜力", host: true, odds: 34.0 },
  { name: "乌拉圭", group: "H", confed: "CONMEBOL", rank: 17, tier: "深度竞争层", host: false, odds: 26.0 },
  { name: "日本", group: "F", confed: "AFC", rank: 18, tier: "高爆冷潜力", host: false, odds: 41.0 },
  { name: "瑞士", group: "B", confed: "UEFA", rank: 19, tier: "高爆冷潜力", host: false, odds: 67.0 },
  { name: "美国", group: "D", confed: "CONCACAF", rank: 20, tier: "高爆冷潜力", host: true, odds: 34.0 },
  { name: "伊朗", group: "G", confed: "AFC", rank: 21, tier: "高爆冷潜力", host: false, odds: 101.0 },
  { name: "奥地利", group: "J", confed: "UEFA", rank: 22, tier: "高爆冷潜力", host: false, odds: 51.0 },
  { name: "韩国", group: "A", confed: "AFC", rank: 23, tier: "高爆冷潜力", host: false, odds: 81.0 },
  { name: "厄瓜多尔", group: "E", confed: "CONMEBOL", rank: 24, tier: "高爆冷潜力", host: false, odds: 67.0 },
  { name: "澳大利亚", group: "D", confed: "AFC", rank: 25, tier: "稳定出线竞争层", host: false, odds: 101.0 },
  { name: "土耳其", group: "D", confed: "UEFA", rank: 26, tier: "高爆冷潜力", host: false, odds: 67.0 },
  { name: "苏格兰", group: "C", confed: "UEFA", rank: 27, tier: "稳定出线竞争层", host: false, odds: 101.0 },
  { name: "瑞典", group: "F", confed: "UEFA", rank: 29, tier: "稳定出线竞争层", host: false, odds: 81.0 },
  { name: "埃及", group: "G", confed: "CAF", rank: 31, tier: "稳定出线竞争层", host: false, odds: 81.0 },
  { name: "挪威", group: "I", confed: "UEFA", rank: 32, tier: "高爆冷潜力", host: false, odds: 41.0 },
  { name: "阿尔及利亚", group: "J", confed: "CAF", rank: 33, tier: "稳定出线竞争层", host: false, odds: 101.0 },
  { name: "捷克", group: "A", confed: "UEFA", rank: 34, tier: "稳定出线竞争层", host: false, odds: 101.0 },
  { name: "卡塔尔", group: "B", confed: "AFC", rank: 35, tier: "抢分竞争层", host: false, odds: 201.0 },
  { name: "科特迪瓦", group: "E", confed: "CAF", rank: 37, tier: "稳定出线竞争层", host: false, odds: 101.0 },
  { name: "突尼斯", group: "F", confed: "CAF", rank: 39, tier: "抢分竞争层", host: false, odds: 201.0 },
  { name: "加拿大", group: "B", confed: "CONCACAF", rank: 40, tier: "高爆冷潜力", host: true, odds: 67.0 },
  { name: "巴拉圭", group: "D", confed: "CONMEBOL", rank: 42, tier: "稳定出线竞争层", host: false, odds: 101.0 },
  { name: "沙特阿拉伯", group: "H", confed: "AFC", rank: 50, tier: "抢分竞争层", host: false, odds: 251.0 },
  { name: "伊拉克", group: "I", confed: "AFC", rank: 56, tier: "抢分竞争层", host: false, odds: 301.0 },
  { name: "乌兹别克斯坦", group: "K", confed: "AFC", rank: 58, tier: "抢分竞争层", host: false, odds: 251.0 },
  { name: "南非", group: "A", confed: "CAF", rank: 59, tier: "抢分竞争层", host: false, odds: 301.0 },
  { name: "民主刚果", group: "K", confed: "CAF", rank: 60, tier: "抢分竞争层", host: false, odds: 301.0 },
  { name: "巴拿马", group: "L", confed: "CONCACAF", rank: 61, tier: "抢分竞争层", host: false, odds: 501.0 },
  { name: "约旦", group: "J", confed: "AFC", rank: 62, tier: "抢分竞争层", host: false, odds: 501.0 },
  { name: "加纳", group: "L", confed: "CAF", rank: 64, tier: "稳定出线竞争层", host: false, odds: 151.0 },
  { name: "波黑", group: "B", confed: "UEFA", rank: 70, tier: "抢分竞争层", host: false, odds: 301.0 },
  { name: "佛得角", group: "H", confed: "CAF", rank: 72, tier: "抢分竞争层", host: false, odds: 501.0 },
  { name: "库拉索", group: "E", confed: "CONCACAF", rank: 75, tier: "长线黑马", host: false, odds: 1001.0 },
  { name: "海地", group: "C", confed: "CONCACAF", rank: 83, tier: "长线黑马", host: false, odds: 1001.0 },
  { name: "新西兰", group: "G", confed: "OFC", rank: 89, tier: "长线黑马", host: false, odds: 1001.0 }
];

const confedNames = {
  UEFA: "欧洲",
  CAF: "非洲",
  AFC: "亚洲",
  CONCACAF: "中北美",
  CONMEBOL: "南美",
  OFC: "大洋洲"
};

const bookmakerReferences = ["Oddschecker", "OddsPortal", "Oddspedia", "DraftKings", "FanDuel", "BetMGM", "bet365"];
const impactLedger = [];
const teamImpacts = Object.fromEntries(teams.map((team) => [team.name, 0]));
let followedTeamNames = JSON.parse(localStorage.getItem("worldcup-followed-teams") || "null") || ["法国", "巴西", "日本", "美国"];

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function decimalFromInput(value, format) {
  const text = String(value).trim();
  if (!text) return null;
  if (format === "decimal") return Number(text);
  if (format === "american") {
    const american = Number(text);
    if (!Number.isFinite(american) || american === 0) return null;
    return american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1;
  }
  if (format === "fractional") {
    const parts = text.split("/");
    if (parts.length !== 2) return null;
    const top = Number(parts[0]);
    const bottom = Number(parts[1]);
    if (!Number.isFinite(top) || !Number.isFinite(bottom) || bottom === 0) return null;
    return top / bottom + 1;
  }
  return null;
}

function impliedProb(decimalOdds) {
  return decimalOdds && decimalOdds > 1 ? 1 / decimalOdds : 0;
}

function marketProbabilities() {
  const raw = teams.map((team) => ({ name: team.name, raw: impliedProb(team.odds) }));
  const total = raw.reduce((sum, item) => sum + item.raw, 0) || 1;
  return Object.fromEntries(raw.map((item) => [item.name, item.raw / total]));
}

function baseStrength(team) {
  const rankScore = 2140 - team.rank * 7.4;
  const tierBoost = team.tier === "争冠第一梯队" ? 58 : team.tier === "深度竞争层" ? 30 : team.tier === "高爆冷潜力" ? 12 : 0;
  const hostBoost = team.host ? 28 : 0;
  return rankScore + tierBoost + hostBoost + teamImpacts[team.name];
}

function titleProbabilities() {
  const market = marketProbabilities();
  const raw = teams.map((team) => {
    const strength = baseStrength(team);
    const modelPrior = Math.exp((strength - 1830) / 155);
    const marketSignal = Math.pow(Math.max(market[team.name], 0.0002), 0.78);
    const blended = modelPrior * 0.58 + marketSignal * 90 * 0.42;
    return { ...team, strength, market: market[team.name], raw: blended };
  });
  const total = raw.reduce((sum, item) => sum + item.raw, 0) || 1;
  return raw
    .map((item) => ({ ...item, titleProb: item.raw / total }))
    .sort((a, b) => b.titleProb - a.titleProb);
}

function matchProbability(teamA, teamB) {
  const a = baseStrength(teamA);
  const b = baseStrength(teamB);
  const diff = a - b;
  const draw = clamp(0.27 - Math.min(Math.abs(diff), 260) / 1400, 0.18, 0.29);
  const nonDraw = 1 - draw;
  const aShare = 1 / (1 + Math.pow(10, -diff / 420));
  return {
    home: nonDraw * aShare,
    draw,
    away: nonDraw * (1 - aShare)
  };
}

function groupMatches() {
  const matches = [];
  [...new Set(teams.map((team) => team.group))].sort().forEach((group) => {
    const groupTeams = teams.filter((team) => team.group === group);
    for (let i = 0; i < groupTeams.length; i += 1) {
      for (let j = i + 1; j < groupTeams.length; j += 1) {
        matches.push({ group, a: groupTeams[i], b: groupTeams[j], probabilities: matchProbability(groupTeams[i], groupTeams[j]) });
      }
    }
  });
  return matches;
}

function scheduledMatches() {
  if (!globalThis.MatchSchedule) return groupMatches();
  return MatchSchedule.matches.map((scheduled) => {
    const a = teams.find((team) => team.name === scheduled.home);
    const b = teams.find((team) => team.name === scheduled.away);
    if (!a || !b) return null;
    return {
      id: scheduled.id,
      group: scheduled.group,
      a,
      b,
      schedule: scheduled,
      probabilities: matchProbability(a, b)
    };
  }).filter(Boolean);
}

function unique(field) {
  return [...new Set(teams.map((team) => team[field]))].sort((a, b) => String(a).localeCompare(String(b), "zh-CN"));
}

function matchHeat(match) {
  const titleMap = Object.fromEntries(titleProbabilities().map((team) => [team.name, team.titleProb]));
  const titleWeight = (titleMap[match.a.name] || 0) + (titleMap[match.b.name] || 0);
  const rankWeight = (100 - Math.min(match.a.rank, 100)) + (100 - Math.min(match.b.rank, 100));
  const groupWeight = ["C", "F", "H", "I", "K", "L"].includes(match.group) ? 18 : 8;
  return titleWeight * 420 + rankWeight + groupWeight;
}

function followedMatchWeight(match) {
  let weight = 0;
  if (followedTeamNames.includes(match.a.name)) weight += 92;
  if (followedTeamNames.includes(match.b.name)) weight += 92;
  return weight;
}

function teamNextMatch(teamName) {
  return scheduledMatches().find((match) => match.a.name === teamName || match.b.name === teamName);
}

function fillSelectors() {
  const manualTeam = document.querySelector("#manualTeam");
  const teamFilter = document.querySelector("#teamFilter");
  teams
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .forEach((team) => {
      manualTeam.add(new Option(team.name, team.name));
      teamFilter.add(new Option(team.name, team.name));
    });
  unique("group").forEach((group) => document.querySelector("#groupFilter").add(new Option(`${group}组`, group)));
}

function renderTitleChart() {
  const ranked = titleProbabilities();
  const top = ranked.slice(0, 12);
  const max = top[0]?.titleProb || 1;
  document.querySelector("#titleChart").innerHTML = top.map((team, index) => `
    <div class="prob-row">
      <div class="prob-name">${team.name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, team.titleProb / max * 100)}%"></div></div>
      <div class="prob-value">${pct(team.titleProb)}</div>
      <div class="prob-rank">#${index + 1}</div>
    </div>
  `).join("");
  document.querySelector("#heroFavorite").textContent = ranked[0].name;
  document.querySelector("#heroProbability").textContent = `夺冠概率 ${pct(ranked[0].titleProb)}`;
  document.querySelector("#modelNarrative").textContent = `当前冠军概率最高为${ranked[0].name}，前四为${ranked.slice(0, 4).map((team) => team.name).join("、")}。`;
}

function renderOddsRows() {
  const ranked = titleProbabilities();
  const byName = Object.fromEntries(ranked.map((team) => [team.name, team]));
  const rows = teams
    .slice()
    .sort((a, b) => byName[b.name].titleProb - byName[a.name].titleProb)
    .map((team) => {
      const model = byName[team.name];
      return `
        <tr>
          <td><strong>${team.name}</strong></td>
          <td><input class="odds-input" data-team="${team.name}" value="${team.odds}" /></td>
          <td>${pct(model.market)}</td>
          <td>${pct(model.titleProb)}</td>
        </tr>
      `;
    }).join("");
  document.querySelector("#oddsRows").innerHTML = rows;
  document.querySelectorAll(".odds-input").forEach((input) => {
    input.addEventListener("change", () => {
      const team = teams.find((item) => item.name === input.dataset.team);
      const parsed = decimalFromInput(input.value, document.querySelector("#oddsFormat").value);
      if (team && parsed) {
        team.odds = parsed;
        renderAll();
      }
    });
  });
}

function renderImpactLog() {
  const log = document.querySelector("#impactLog");
  document.querySelector("#impactCount").textContent = impactLedger.length;
  if (!impactLedger.length) {
    log.innerHTML = `<div class="impact-item"><strong>暂无冲击</strong><span>输入每日动向摘要或手动调整球队评级后，这里会记录变化。</span></div>`;
    return;
  }
  log.innerHTML = impactLedger.slice().reverse().map((item) => `
    <div class="impact-item">
      <strong>${item.team} ${item.points > 0 ? "+" : ""}${item.points}评级点</strong>
      <span>${item.reason}</span>
    </div>
  `).join("");
}

function renderFeaturedMatches() {
  const allMatches = scheduledMatches();
  const seen = new Set();
  const followedFeatured = followedTeamNames
    .slice()
    .reverse()
    .map((teamName) => allMatches.find((match) => match.a.name === teamName || match.b.name === teamName))
    .filter(Boolean)
    .filter((match) => {
      const key = `${match.group}:${match.a.name}:${match.b.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const hotFeatured = allMatches
    .filter((match) => !seen.has(`${match.group}:${match.a.name}:${match.b.name}`))
    .sort((a, b) => (followedMatchWeight(b) + matchHeat(b)) - (followedMatchWeight(a) + matchHeat(a)));
  const featured = [...followedFeatured, ...hotFeatured].slice(0, 4);
  document.querySelector("#featuredMatches").innerHTML = featured.map((match, index) => {
    const href = `match.html?group=${encodeURIComponent(match.group)}&a=${encodeURIComponent(match.a.name)}&b=${encodeURIComponent(match.b.name)}`;
    const topProb = Math.max(match.probabilities.home, match.probabilities.away);
    const followedTeam = [match.a.name, match.b.name].find((name) => followedTeamNames.includes(name));
    return `
      <a class="featured-card" href="${href}">
        <div class="feature-rank">0${index + 1}</div>
        <div>
          <strong>${match.a.name} vs ${match.b.name}</strong>
          <span>${followedTeam ? `关注 ${followedTeam} · ` : ""}${MatchSchedule.formatChinaTime(match.schedule)} · ${match.schedule.city}</span>
        </div>
        <div class="feature-prob">${pct(topProb)}</div>
      </a>
    `;
  }).join("");
}

function renderIntelFeed() {
  const ranked = titleProbabilities();
  const generated = [
    { tag: "赔率", confidence: 86, title: `${ranked[0].name}仍是市场第一风向`, body: `冠军概率 ${pct(ranked[0].titleProb)}，市场与模型信号一致。` },
    { tag: "焦点", confidence: 78, title: "强组比赛优先核验首发", body: "C/F/H/I/K/L 组强队密度较高，赛前阵容变化会放大胜率波动。" },
    { tag: "提醒", confidence: 72, title: "关注盘口与模型分歧", body: "若即时赔率连续下调但模型未同步，应优先检查伤停和首发消息。" }
  ];
  const manual = impactLedger.slice(-3).map((item) => ({
    tag: item.points > 0 ? "利好" : item.points < 0 ? "风险" : "记录",
    confidence: item.points === 0 ? 55 : Math.min(92, 64 + Math.abs(item.points)),
    title: `${item.team} ${item.points > 0 ? "+" : ""}${item.points}评级点`,
    body: item.reason
  }));
  document.querySelector("#intelFeed").innerHTML = [...manual, ...generated].slice(0, 5).map((item) => `
    <div class="intel-item">
      <div class="intel-topline"><span>${item.tag}</span><b>${item.confidence}%</b></div>
      <strong>${item.title}</strong>
      <small>${item.body}</small>
      <i style="width:${item.confidence}%"></i>
    </div>
  `).join("");
}

function toggleFollow(teamName) {
  if (followedTeamNames.includes(teamName)) {
    followedTeamNames = followedTeamNames.filter((name) => name !== teamName);
  } else {
    followedTeamNames = [...followedTeamNames, teamName].slice(-6);
  }
  localStorage.setItem("worldcup-followed-teams", JSON.stringify(followedTeamNames));
  renderMatchday();
}

function renderFollowedTeams() {
  const summary = document.querySelector("#followSummary");
  if (summary) summary.textContent = `已关注 ${followedTeamNames.length}/6`;
  const rankedByTitle = Object.fromEntries(titleProbabilities().map((team) => [team.name, team]));
  const followed = followedTeamNames
    .map((name) => teams.find((team) => team.name === name))
    .filter(Boolean);
  const suggestions = titleProbabilities()
    .filter((team) => !followedTeamNames.includes(team.name))
    .slice(0, Math.max(0, 6 - followed.length));
  const rows = [...followed, ...suggestions].slice(0, 6);
  document.querySelector("#followedTeams").innerHTML = rows.map((team) => {
    const active = followedTeamNames.includes(team.name);
    const nextMatch = teamNextMatch(team.name);
    const href = nextMatch ? `match.html?group=${encodeURIComponent(nextMatch.group)}&a=${encodeURIComponent(nextMatch.a.name)}&b=${encodeURIComponent(nextMatch.b.name)}` : "#";
    const opponent = nextMatch ? (nextMatch.a.name === team.name ? nextMatch.b.name : nextMatch.a.name) : "待定";
    const actionText = active ? "移除" : "加入";
    return `
      <div class="follow-row ${active ? "active" : ""}">
        <a href="${href}">
          <strong>${team.name}</strong>
          <span>${team.group}组 · 下场 vs ${opponent} · 夺冠 ${pct(rankedByTitle[team.name].titleProb)}</span>
        </a>
        <div class="follow-actions">
          <a href="${href}" aria-label="查看${team.name}下一场比赛">查看</a>
          <button class="follow-button ${active ? "active" : ""}" data-team="${team.name}" aria-pressed="${active}">${actionText}</button>
        </div>
      </div>
    `;
  }).join("");
  document.querySelectorAll(".follow-button").forEach((button) => {
    button.addEventListener("click", () => toggleFollow(button.dataset.team));
  });
}

function renderOddsMovers() {
  const rows = titleProbabilities()
    .map((team) => ({
      ...team,
      gap: team.titleProb - team.market,
      trend: Math.round((team.titleProb - team.market) * 1000) / 10
    }))
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, 5);
  document.querySelector("#oddsMovers").innerHTML = rows.map((team) => `
    <div class="mover-row">
      <strong>${team.name}</strong>
      <span>${team.gap >= 0 ? "模型高于市场" : "市场高于模型"}</span>
      <b>${team.trend >= 0 ? "↑" : "↓"} ${team.trend >= 0 ? "+" : ""}${team.trend.toFixed(1)}%</b>
    </div>
  `).join("");
}

function renderMatchday() {
  renderFeaturedMatches();
  renderIntelFeed();
  renderFollowedTeams();
  renderOddsMovers();
}

function renderMatches() {
  const group = document.querySelector("#groupFilter").value;
  const team = document.querySelector("#teamFilter").value;
  const matches = scheduledMatches().filter((match) => {
    const groupOk = group === "all" || match.group === group;
    const teamOk = team === "all" || match.a.name === team || match.b.name === team;
    return groupOk && teamOk;
  });
  document.querySelector("#matchSummary").textContent = `显示${matches.length}场比赛，时间为北京时间，概率已包含最新冲击。`;
  document.querySelector("#matchList").innerHTML = matches.map((match) => {
    const detailHref = `match.html?group=${encodeURIComponent(match.group)}&a=${encodeURIComponent(match.a.name)}&b=${encodeURIComponent(match.b.name)}`;
    return `
    <a class="match-card match-link" href="${detailHref}" aria-label="查看${match.a.name}对${match.b.name}的赔率、阵容和历史数据">
      <div><span class="group-badge">${match.group}</span></div>
      <div class="fixture">
        ${match.a.name} vs ${match.b.name}
        <small>${MatchSchedule.formatChinaTime(match.schedule)} · ${match.schedule.stadium} · ${match.schedule.city}</small>
      </div>
      <div class="prob-split">
        <div class="match-prob"><span>${match.a.name}胜</span>${pct(match.probabilities.home)}</div>
        <div class="match-prob"><span>平局</span>${pct(match.probabilities.draw)}</div>
        <div class="match-prob"><span>${match.b.name}胜</span>${pct(match.probabilities.away)}</div>
      </div>
    </a>
  `;
  }).join("");
}

async function loadDailyFeed() {
  const updatedAt = document.querySelector(".source-note");
  const today = new Date().toISOString().slice(0, 10);
  const lastLoaded = localStorage.getItem("worldcup-last-feed-date");
  if (lastLoaded === today) {
    updatedAt.textContent = `模型日期：${today} · 已读取今日缓存`;
    return;
  }
  try {
    const response = await fetch(`data/daily-feed.json?date=${today}`, { cache: "no-store" });
    if (!response.ok) throw new Error("feed unavailable");
    const feed = await response.json();
    if (feed.odds) {
      Object.entries(feed.odds).forEach(([teamName, odds]) => {
        const team = teams.find((item) => item.name === teamName);
        if (team && Number.isFinite(Number(odds))) team.odds = Number(odds);
      });
    }
    if (feed.impacts) {
      feed.impacts.forEach((item) => {
        if (!item.team || !Number.isFinite(Number(item.points))) return;
        teamImpacts[item.team] = (teamImpacts[item.team] || 0) + Number(item.points);
        impactLedger.push({ team: item.team, points: Number(item.points), reason: item.reason || "每日自动更新" });
      });
    }
    localStorage.setItem("worldcup-last-feed-date", today);
    updatedAt.textContent = `模型日期：${feed.date || today} · 自动更新完成`;
    renderAll();
  } catch (error) {
    updatedAt.textContent = `模型日期：${today} · 等待数据源`;
  }
}

function parseSummary() {
  const text = document.querySelector("#dailySummary").value.trim();
  if (!text) return;
  const rules = [
    { words: ["伤停", "受伤", "缺阵", "停赛", "内讧"], points: -34 },
    { words: ["疲劳", "轮换", "赛程密集", "状态差"], points: -16 },
    { words: ["复出", "回归", "状态好", "连胜", "主场氛围强"], points: 22 },
    { words: ["核心复出", "主力复出", "士气高"], points: 34 }
  ];
  let applied = 0;
  teams.forEach((team) => {
    if (!text.includes(team.name)) return;
    rules.forEach((rule) => {
      if (rule.words.some((word) => text.includes(word))) {
        teamImpacts[team.name] += rule.points;
        impactLedger.push({ team: team.name, points: rule.points, reason: `摘要识别：${rule.words.find((word) => text.includes(word))}` });
        applied += 1;
      }
    });
  });
  if (!applied) {
    impactLedger.push({ team: "全局", points: 0, reason: "摘要已记录，等待更明确的球队与关键词信号。" });
  }
  document.querySelector("#dailySummary").value = "";
  renderAll();
}

function applyManualImpact() {
  const team = document.querySelector("#manualTeam").value;
  const points = Number(document.querySelector("#manualImpact").value);
  if (!team || !Number.isFinite(points) || points === 0) return;
  teamImpacts[team] += points;
  impactLedger.push({ team, points, reason: "手动精算调整" });
  document.querySelector("#manualImpact").value = 0;
  renderAll();
}

function downloadSnapshot() {
  const ranked = titleProbabilities().slice(0, 16).map((team) => ({
    team: team.name,
    titleProbability: pct(team.titleProb),
    marketProbability: pct(team.market),
    strength: Math.round(team.strength)
  }));
  const payload = {
    generatedAt: new Date().toISOString(),
    bookmakerReferences,
    impacts: impactLedger,
    topTitleProbabilities: ranked,
    matches: scheduledMatches().map((match) => ({
      group: match.group,
      fixture: `${match.a.name} vs ${match.b.name}`,
      beijingTime: match.schedule ? MatchSchedule.formatChinaTime(match.schedule) : "",
      venue: match.schedule ? `${match.schedule.stadium}, ${match.schedule.city}` : "",
      aWin: pct(match.probabilities.home),
      draw: pct(match.probabilities.draw),
      bWin: pct(match.probabilities.away)
    }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "world-cup-actuary-snapshot.json";
  link.click();
  URL.revokeObjectURL(url);
}

function resetModel() {
  Object.keys(teamImpacts).forEach((team) => { teamImpacts[team] = 0; });
  impactLedger.splice(0, impactLedger.length);
  renderAll();
}

function renderAll() {
  renderTitleChart();
  renderOddsRows();
  renderImpactLog();
  renderMatches();
  renderMatchday();
}

function init() {
  fillSelectors();
  document.querySelector("#teamCount").textContent = teams.length;
  document.querySelector("#matchCount").textContent = scheduledMatches().length;
  document.querySelector("#oddsBookCount").textContent = bookmakerReferences.length;
  document.querySelector("#applySummary").addEventListener("click", parseSummary);
  document.querySelector("#applyManualImpact").addEventListener("click", applyManualImpact);
  document.querySelector("#resetModel").addEventListener("click", resetModel);
  document.querySelector("#downloadSnapshot").addEventListener("click", downloadSnapshot);
  document.querySelector("#refreshMatchday").addEventListener("click", renderMatchday);
  document.querySelector("#groupFilter").addEventListener("change", renderMatches);
  document.querySelector("#teamFilter").addEventListener("change", renderMatches);
  document.querySelector("#oddsFormat").addEventListener("change", () => {
    document.querySelectorAll(".odds-input").forEach((input) => { input.value = ""; });
  });
  renderAll();
  loadDailyFeed();
}

init();
