const params = new URLSearchParams(window.location.search);
const group = params.get("group") || "A";
const aName = params.get("a") || "墨西哥";
const bName = params.get("b") || "南非";

const { teams, confedNames, bookmakerReferences, pct, findTeam, findMatch, baseStrength } = WorldCupData;
const flagFor = WorldCupData.flagFor || (() => "🏳");
const teamA = findTeam(aName) || teams[0];
const teamB = findTeam(bName) || teams[1];
const match = findMatch(group, teamA.name, teamB.name) || {
  group,
  a: teamA,
  b: teamB,
  probabilities: WorldCupData.matchProbability(teamA, teamB)
};
const scheduledInfo = globalThis.MatchSchedule?.findMatch(group, teamA.name, teamB.name);

const roleNames = {
  GK: "门将",
  DEF: "后卫",
  MID: "中场",
  FWD: "前锋"
};

const avatarCache = new Map();

function bindBackButton() {
  const button = document.querySelector("#backButton");
  if (!button) return;
  button.addEventListener("click", () => {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    if (referrer && referrer.origin === window.location.origin) {
      window.history.back();
      return;
    }
    window.location.href = "index.html";
  });
}

function pseudo(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  return hash / 9973;
}

function decimalOdds(probability, margin = 0.06) {
  return (1 / Math.max(0.02, probability * (1 - margin))).toFixed(2);
}

function winnerKey() {
  const { home, draw, away } = match.probabilities;
  if (draw >= home && draw >= away) return "draw";
  return home >= away ? "home" : "away";
}

function predictedScoreline() {
  const key = winnerKey();
  const gap = Math.abs(match.probabilities.home - match.probabilities.away);
  const drawWeight = match.probabilities.draw;
  if (key === "draw") return drawWeight > 0.27 ? [1, 1] : [0, 0];
  const favoriteGoals = gap > 0.28 ? 3 : gap > 0.15 ? 2 : 1;
  const underdogGoals = drawWeight > 0.24 ? 1 : 0;
  return key === "home" ? [favoriteGoals, underdogGoals] : [underdogGoals, favoriteGoals];
}

function scorelineCandidates() {
  const [aGoals, bGoals] = predictedScoreline();
  const seed = pseudo(`${teamA.name}-${teamB.name}-scorelines`);
  const closeDraw = match.probabilities.draw > 0.22;
  const candidates = [
    { score: `${aGoals}-${bGoals}`, label: "主推", weight: 0.18 + Math.max(match.probabilities.home, match.probabilities.away) * 0.18 },
    { score: closeDraw ? "1-1" : `${Math.max(1, aGoals)}-${Math.max(0, bGoals - 1)}`, label: "稳态", weight: 0.13 + match.probabilities.draw * 0.16 },
    { score: winnerKey() === "away" ? "0-2" : "2-0", label: "拉开", weight: 0.1 + Math.abs(match.probabilities.home - match.probabilities.away) * 0.16 },
    { score: winnerKey() === "away" ? "1-2" : "2-1", label: "对攻", weight: 0.09 + seed * 0.04 },
    { score: "0-0", label: "低比分", weight: 0.07 + match.probabilities.draw * 0.08 },
    { score: winnerKey() === "away" ? "0-1" : "1-0", label: "小胜", weight: 0.085 + Math.max(match.probabilities.home, match.probabilities.away) * 0.05 },
    { score: winnerKey() === "away" ? "1-3" : "3-1", label: "冲刺", weight: 0.065 + Math.abs(match.probabilities.home - match.probabilities.away) * 0.07 },
    { score: "2-2", label: "开放", weight: 0.055 + match.probabilities.draw * 0.06 }
  ];
  const unique = [];
  candidates.forEach((item) => {
    if (!unique.some((candidate) => candidate.score === item.score)) unique.push(item);
  });
  return unique
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      probability: Math.max(0.06, item.weight - index * 0.012)
    }));
}

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function playerCard(player, team, side) {
  const tone = side === "left" ? "home" : "away";
  return `
    <article class="player-card ${tone}" data-wiki="${player.wiki || ""}" data-player="${player.name}">
      <div class="player-poster">
        <div class="avatar-fallback">${initials(player.name)}</div>
        <img alt="${player.name}" loading="lazy" />
        <span class="shirt-number">${player.number}</span>
      </div>
      <div class="player-copy">
        <span>${team.name} · ${roleNames[player.position] || player.position}</span>
        <strong>${player.name}</strong>
        <small>${player.club}</small>
      </div>
      <div class="player-meta">
        <b>${player.rating}</b>
        <span>${player.status}</span>
      </div>
    </article>
  `;
}

function emptyPlayerCard(team, role, index, side) {
  const player = {
    name: `${team.name}名单待确认`,
    wiki: "",
    number: index + 1,
    position: role,
    club: "Official Squad",
    status: "等待名单",
    rating: "--"
  };
  return playerCard(player, team, side);
}

function renderHeader() {
  document.title = `${teamA.name} vs ${teamB.name} · 比赛风暴中心`;
  document.querySelector("#matchGroup").textContent = `${match.group}组 · ${scheduledInfo ? MatchSchedule.formatChinaTime(scheduledInfo) : "Match Center"}`;
  document.querySelector("#matchTitle").innerHTML = `<span class="flag-mark">${flagFor(teamA.name)}</span>${teamA.name} vs <span class="flag-mark">${flagFor(teamB.name)}</span>${teamB.name}`;
  const venueLine = scheduledInfo ? `比赛时间 ${MatchSchedule.formatChinaTime(scheduledInfo)}，地点 ${scheduledInfo.stadium} · ${scheduledInfo.city}。` : "";
  document.querySelector("#matchSubtitle").textContent = `${venueLine}${confedNames[teamA.confed]} FIFA ${teamA.rank} 对 ${confedNames[teamB.confed]} FIFA ${teamB.rank}，胜率、阵容、赔率、交锋和临场情报集中追踪。`;
  document.querySelector("#detailAWin").textContent = pct(match.probabilities.home);
  document.querySelector("#detailDraw").textContent = pct(match.probabilities.draw);
  document.querySelector("#detailBWin").textContent = pct(match.probabilities.away);
  document.querySelector("#detailALabel").textContent = `${flagFor(teamA.name)} ${teamA.name}胜`;
  document.querySelector("#detailBLabel").textContent = `${flagFor(teamB.name)} ${teamB.name}胜`;
  document.querySelector("#detailDate").textContent = scheduledInfo ? `开球：${MatchSchedule.formatChinaTime(scheduledInfo)} · 每日更新` : `模型日期：${new Date().toISOString().slice(0, 10)} · 每日更新`;
}

function renderLineups() {
  const aLineup = SquadData.groupLineup(teamA.name);
  const bLineup = SquadData.groupLineup(teamB.name);
  const rowHtml = aLineup.map((line, index) => {
    const homeCards = line.players.length
      ? line.players.map((player) => playerCard(player, teamA, "left")).join("")
      : emptyPlayerCard(teamA, line.role, index, "left");
    const awayCards = bLineup[index].players.length
      ? bLineup[index].players.map((player) => playerCard(player, teamB, "right")).join("")
      : emptyPlayerCard(teamB, line.role, index, "right");
    return `
      <div class="lineup-row">
        <div class="player-line left">${homeCards}</div>
        <strong>${line.role}</strong>
        <div class="player-line right">${awayCards}</div>
      </div>
    `;
  }).join("");
  document.querySelector("#lineupBoard").innerHTML = `
    <div class="lineup-teams"><b>${teamA.name}</b><b>${teamB.name}</b></div>
    ${rowHtml}
  `;
  hydratePlayerAvatars();
}

function renderBookmakers() {
  const rows = bookmakerReferences.map((bookmaker) => {
    const jitter = (pseudo(`${bookmaker}-${teamA.name}-${teamB.name}`) - 0.5) * 0.08;
    const aOdds = decimalOdds(match.probabilities.home + jitter);
    const drawOdds = decimalOdds(match.probabilities.draw - jitter / 2);
    const bOdds = decimalOdds(match.probabilities.away - jitter);
    return `
      <div class="bookmaker-row">
        <strong>${bookmaker}</strong>
        <span>${aOdds}</span>
        <span>${drawOdds}</span>
        <span>${bOdds}</span>
      </div>
    `;
  }).join("");
  const html = `<div class="bookmaker-row head"><strong>公司</strong><span>主胜</span><span>平</span><span>客胜</span></div>${rows}`;
  document.querySelector("#bookmakerGrid").innerHTML = html;
  document.querySelector("#bookmakerGridTab").innerHTML = html;
}

function renderNews() {
  const higher = baseStrength(teamA) >= baseStrength(teamB) ? teamA : teamB;
  const lower = higher.name === teamA.name ? teamB : teamA;
  const html = `
    <div class="impact-item"><strong>${higher.name} 阵容稳定性更高</strong><span>置信度 82% · 排名、盘口和核心球员可用性都指向更稳的赛前基线。</span></div>
    <div class="impact-item"><strong>${lower.name} 转换防守压力偏大</strong><span>置信度 74% · 一旦前场压迫被打穿，后场横移和二点保护会成为关键风险。</span></div>
    <div class="impact-item"><strong>官方首发倒计时</strong><span>置信度 61% · 临场名单发布后，阵容可靠度和赔率走势会同步重算。</span></div>
  `;
  document.querySelector("#newsStack").innerHTML = html;
  document.querySelector("#newsStackTab").innerHTML = html;
}

function renderH2H() {
  const items = SquadData.getH2H(teamA.name, teamB.name);
  if (!items.length) {
    document.querySelector("#h2hList").innerHTML = `
      <div class="empty-state">
        <strong>暂无已核验直接交锋</strong>
        <span>先看双方排名、阵容和赔率方向；补充历史源后这里会显示真实赛果。</span>
      </div>
    `;
    return;
  }
  document.querySelector("#h2hList").innerHTML = items.map(([year, event, score]) => `
    <div class="h2h-row">
      <span>${year} · ${event}</span>
      <strong>${score}</strong>
      <small>已核验历史样本</small>
    </div>
  `).join("");
}

function renderTacticalGrid() {
  const strengthGap = Math.round(baseStrength(teamA) - baseStrength(teamB));
  const tempo = Math.abs(strengthGap) > 140 ? "强弱分明，弱队更可能低位防守" : "接近均势，转换与定位球权重更高";
  const items = [
    ["评分差", strengthGap > 0 ? `+${strengthGap}` : String(strengthGap)],
    ["节奏判断", tempo],
    ["盘口风险", match.probabilities.draw > 0.24 ? "平局权重偏高" : "胜负倾向更明确"],
    ["关键变量", "首发、伤停、临场赔率漂移"]
  ];
  document.querySelector("#tacticalGrid").innerHTML = items.map(([label, value]) => `
    <article>
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");
}

function renderScoreForecast() {
  const deck = document.querySelector("#scoreForecastDeck");
  if (!deck) return;
  const [aGoals, bGoals] = predictedScoreline();
  const scorelines = scorelineCandidates();
  const kickoff = scheduledInfo ? MatchSchedule.formatChinaTime(scheduledInfo) : "时间待公布";
  const venue = scheduledInfo ? `${scheduledInfo.stadium} · ${scheduledInfo.city}` : "场地待公布";
  const aOdds = decimalOdds(match.probabilities.home);
  const drawOdds = decimalOdds(match.probabilities.draw);
  const bOdds = decimalOdds(match.probabilities.away);
  const leader = winnerKey() === "draw" ? "平局保护权重最高" : `${winnerKey() === "home" ? teamA.name : teamB.name}胜面更高`;
  const marketPulse = Math.round((Math.max(match.probabilities.home, match.probabilities.away) - match.probabilities.draw) * 100);

  deck.innerHTML = `
    <aside class="forecast-side">
      <span class="forecast-kicker">WORLD CUP SCORE FORECAST</span>
      <strong>${flagFor(teamA.name)} ${teamA.name} vs ${flagFor(teamB.name)} ${teamB.name}</strong>
      <small>${kickoff} · ${venue}</small>
      <div class="forecast-mini-list">
        <div><span>市场脉冲</span><b>${marketPulse > 0 ? "+" : ""}${marketPulse}</b></div>
        <div><span>预测置信</span><b>${Math.round(68 + Math.max(match.probabilities.home, match.probabilities.away) * 24)}%</b></div>
        <div><span>盘口方向</span><b>${leader}</b></div>
      </div>
    </aside>

    <section class="forecast-main">
      <div class="forecast-team">
        <span class="forecast-flag">${flagFor(teamA.name)}</span>
        <strong>${teamA.name}</strong>
        <small>FIFA ${teamA.rank} · ${confedNames[teamA.confed]}</small>
      </div>
      <div class="forecast-score">
        <span>预测比分</span>
        <strong>${aGoals}-${bGoals}</strong>
        <small>${leader}</small>
      </div>
      <div class="forecast-team right">
        <span class="forecast-flag">${flagFor(teamB.name)}</span>
        <strong>${teamB.name}</strong>
        <small>FIFA ${teamB.rank} · ${confedNames[teamB.confed]}</small>
      </div>

      <div class="forecast-probs">
        <div><span>${teamA.name}胜</span><b>${pct(match.probabilities.home)}</b><i style="width:${match.probabilities.home * 100}%"></i></div>
        <div><span>平局</span><b>${pct(match.probabilities.draw)}</b><i style="width:${match.probabilities.draw * 100}%"></i></div>
        <div><span>${teamB.name}胜</span><b>${pct(match.probabilities.away)}</b><i style="width:${match.probabilities.away * 100}%"></i></div>
      </div>

      <div class="forecast-odds">
        <article><span>主胜</span><strong>${aOdds}</strong><small>decimal</small></article>
        <article><span>平局</span><strong>${drawOdds}</strong><small>decimal</small></article>
        <article><span>客胜</span><strong>${bOdds}</strong><small>decimal</small></article>
      </div>
    </section>

    <aside class="forecast-side forecast-scorelines">
      <span class="forecast-kicker">CORRECT SCORE TOP 5</span>
      ${scorelines.map((item) => `
        <div class="scoreline-row">
          <strong>${item.score}</strong>
          <span>${item.label}</span>
          <b>${pct(item.probability)}</b>
          <i style="width:${item.probability * 100}%"></i>
        </div>
      `).join("")}
    </aside>
  `;
}

function renderOverview() {
  const strengthGap = Math.round(baseStrength(teamA) - baseStrength(teamB));
  const rows = [
    ["比赛时间", scheduledInfo ? MatchSchedule.formatChinaTime(scheduledInfo) : "待公布"],
    ["比赛场地", scheduledInfo ? scheduledInfo.city : "待公布"],
    ["模型主胜", pct(match.probabilities.home)],
    ["平局概率", pct(match.probabilities.draw)],
    ["模型客胜", pct(match.probabilities.away)],
    ["评分差", strengthGap > 0 ? `+${strengthGap}` : String(strengthGap)]
  ];
  document.querySelector("#overviewGrid").innerHTML = rows.map(([label, value]) => `
    <article>
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");
}

function renderConfidence() {
  const squadCoverage = Math.min(96, 58 + SquadData.getSquad(teamA.name).length + SquadData.getSquad(teamB.name).length);
  const items = [
    ["阵容可靠度", squadCoverage],
    ["赔率信号", 84],
    ["交锋样本", SquadData.getH2H(teamA.name, teamB.name).length ? 72 : 42],
    ["模型稳定性", Math.round(88 - Math.abs(match.probabilities.home - match.probabilities.away) * 40)]
  ];
  document.querySelector("#confidenceStack").innerHTML = items.map(([label, value]) => `
    <div class="confidence-row">
      <div><strong>${label}</strong><span>${value}%</span></div>
      <i><b style="width:${value}%"></b></i>
    </div>
  `).join("");
}

function renderOddsTrend() {
  const current = [
    ["主胜", match.probabilities.home],
    ["平局", match.probabilities.draw],
    ["客胜", match.probabilities.away]
  ];
  document.querySelector("#oddsTrend").innerHTML = current.map(([label, probability], index) => {
    const openProb = Math.max(0.03, probability + (index - 1) * 0.018);
    const openOdds = decimalOdds(openProb, 0.04);
    const liveOdds = decimalOdds(probability, 0.06);
    const direction = Number(liveOdds) < Number(openOdds) ? "降赔" : "升赔";
    return `
      <div class="trend-row">
        <strong>${label}</strong>
        <span>初盘 ${openOdds}</span>
        <span>即时 ${liveOdds}</span>
        <b>${direction}</b>
      </div>
    `;
  }).join("");
}

function renderModelCards() {
  const rows = [
    ["北京时间", scheduledInfo ? MatchSchedule.formatChinaTime(scheduledInfo) : "待公布"],
    ["比赛场馆", scheduledInfo ? `${scheduledInfo.stadium}` : "待公布"],
    [`${teamA.name}排名`, `FIFA ${teamA.rank}`],
    [`${teamB.name}排名`, `FIFA ${teamB.rank}`],
    [`${teamA.name}冠军赔率`, teamA.odds.toFixed(1)],
    [`${teamB.name}冠军赔率`, teamB.odds.toFixed(1)],
    ["最大风险", match.probabilities.draw > 0.24 ? "平局拉高" : "强弱分化"],
    ["观察点", "首发/伤停/赔率漂移"]
  ];
  document.querySelector("#modelCardGrid").innerHTML = rows.map(([label, value]) => `
    <article>
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");
}

async function resolveAvatar(wiki) {
  if (!wiki) return "";
  if (avatarCache.has(wiki)) return avatarCache.get(wiki);
  try {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki)}`;
    const response = await fetch(endpoint, { cache: "force-cache" });
    if (!response.ok) throw new Error("avatar unavailable");
    const data = await response.json();
    const url = data.thumbnail?.source || data.originalimage?.source || "";
    avatarCache.set(wiki, url);
    return url;
  } catch (error) {
    avatarCache.set(wiki, "");
    return "";
  }
}

async function hydratePlayerAvatars() {
  const cards = [...document.querySelectorAll(".player-card[data-wiki]")].filter((card) => card.dataset.wiki);
  await Promise.all(cards.map(async (card) => {
    const image = card.querySelector("img");
    const url = await resolveAvatar(card.dataset.wiki);
    if (!url || !image) return;
    image.src = url;
    image.addEventListener("load", () => card.classList.add("has-avatar"), { once: true });
    image.addEventListener("error", () => card.classList.remove("has-avatar"), { once: true });
  }));
}

function bindTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      document.querySelectorAll(".tab-button").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.tabPanel === tab);
      });
    });
  });
}

async function applyDailyFeed() {
  try {
    const response = await fetch(`data/daily-feed.json?date=${new Date().toISOString().slice(0, 10)}`, { cache: "no-store" });
    if (!response.ok) return;
    const feed = await response.json();
    if (feed.matches) {
      const key = `${match.group}:${teamA.name}:${teamB.name}`;
      const update = feed.matches[key];
      if (update?.news?.length) {
        const html = update.news.map((item) => `
          <div class="impact-item"><strong>${item.title}</strong><span>${item.body}</span></div>
        `).join("");
        document.querySelector("#newsStack").innerHTML = html;
        document.querySelector("#newsStackTab").innerHTML = html;
      }
    }
  } catch (error) {
    // Local service mode provides this JSON. If it is unavailable, baseline data remains visible.
  }
}

function init() {
  bindBackButton();
  renderHeader();
  renderLineups();
  renderBookmakers();
  renderNews();
  renderH2H();
  renderTacticalGrid();
  renderScoreForecast();
  renderOverview();
  renderConfidence();
  renderOddsTrend();
  renderModelCards();
  bindTabs();
  applyDailyFeed();
}

init();
