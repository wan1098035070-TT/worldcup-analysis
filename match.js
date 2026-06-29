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
const realData = globalThis.RealMatchData || { teams: {}, matches: {}, sources: [] };
const realTeamCodes = {
  法国: "FR", 西班牙: "ES", 阿根廷: "AR", 英格兰: "EN", 葡萄牙: "PT", 巴西: "BR",
  荷兰: "NL", 摩洛哥: "MA", 比利时: "BE", 德国: "DE", 克罗地亚: "HR", 哥伦比亚: "CO",
  塞内加尔: "SN", 墨西哥: "MX", 乌拉圭: "UY", 日本: "JP", 瑞士: "CH", 美国: "US",
  伊朗: "IR", 奥地利: "AT", 韩国: "KR", 厄瓜多尔: "EC", 澳大利亚: "AU", 土耳其: "TR",
  苏格兰: "SQ", 瑞典: "SE", 埃及: "EG", 挪威: "NO", 阿尔及利亚: "DZ", 捷克: "CZ",
  卡塔尔: "QA", 科特迪瓦: "CI", 突尼斯: "TN", 加拿大: "CA", 巴拉圭: "PY", 沙特阿拉伯: "SA",
  伊拉克: "IQ", 乌兹别克斯坦: "UZ", 南非: "ZA", 民主刚果: "CD", 巴拿马: "PA", 约旦: "JO",
  加纳: "GH", 波黑: "BA", 佛得角: "CV", 库拉索: "CW", 海地: "HT", 新西兰: "NZ"
};

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

function limit(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function average(numbers, fallback = 0) {
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : fallback;
}

function realTeamInput(teamName) {
  const code = realTeamCodes[teamName];
  return realData.teams?.[teamName] || realData.teamsByCode?.[code] || null;
}

function realMatchInput(aTeam, bTeam) {
  const direct = realData.matches?.[`${aTeam.name}:${bTeam.name}`];
  if (direct) return { ...direct, reversed: false };
  const reverse = realData.matches?.[`${bTeam.name}:${aTeam.name}`];
  if (reverse) return { ...reverse, reversed: true };
  const aCode = realTeamCodes[aTeam.name];
  const bCode = realTeamCodes[bTeam.name];
  const directCode = realData.matchesByCode?.[`${aCode}:${bCode}`];
  if (directCode) return { ...directCode, reversed: false };
  const reverseCode = realData.matchesByCode?.[`${bCode}:${aCode}`];
  return reverseCode ? { ...reverseCode, reversed: true } : null;
}

function realSourceSummary() {
  const hasElo = Boolean(realTeamInput(teamA.name)?.elo && realTeamInput(teamB.name)?.elo);
  const hasForm = Boolean(realTeamInput(teamA.name)?.recent && realTeamInput(teamB.name)?.recent);
  const hasFixture = Boolean(realMatchInput(teamA, teamB)?.eloFixture);
  const oddsStatus = realData.sources?.find((source) => source.name === "The Odds API")?.status || "not_configured";
  return [
    hasElo ? "真实Elo" : "Elo回退",
    hasForm ? "近期赛果" : "近况回退",
    hasFixture ? "赛程Elo" : "赛程回退",
    oddsStatus === "ok" ? "真实赔率" : "赔率待接入"
  ].join(" · ");
}

function teamModelProfile(team) {
  const real = realTeamInput(team.name);
  const squad = SquadData.getSquad(team.name);
  const ratings = squad.map((player) => Number(player.rating)).filter(Number.isFinite);
  const byRole = (role) => squad.filter((player) => player.position === role);
  const avgRating = average(ratings, 7);
  const attackRating = average(byRole("FWD").map((player) => Number(player.rating)).filter(Number.isFinite), avgRating);
  const midRating = average(byRole("MID").map((player) => Number(player.rating)).filter(Number.isFinite), avgRating);
  const defenseRating = average([...byRole("DEF"), ...byRole("GK")].map((player) => Number(player.rating)).filter(Number.isFinite), avgRating);
  const elo = real?.elo || baseStrength(team);
  const eloRank = real?.eloRank || team.rank;
  const rankIndex = limit((130 - eloRank) / 129, 0.08, 1);
  const squadCoverage = limit(squad.length / 11, 0.62, 1);
  const injuryRisk = Number.isFinite(real?.injuryRisk)
    ? limit(real.injuryRisk, 0, 0.35)
    : limit(0.04 + pseudo(`${team.name}-injury-risk`) * 0.12 - squadCoverage * 0.04, 0.02, 0.16);
  const lineupBoost = (avgRating - 7.2) * 0.09 + (squadCoverage - 0.85) * 0.18 - injuryRisk * 0.5;
  const attack = limit(0.76 + rankIndex * 0.54 + (attackRating - 7) * 0.08 + (midRating - 7) * 0.04 + lineupBoost, 0.62, 1.72);
  const defense = limit(0.72 + rankIndex * 0.45 + (defenseRating - 7) * 0.08 + lineupBoost * 0.8, 0.58, 1.58);
  const formSeed = pseudo(`${team.name}-last-10-form`);
  const recentGf = Number.isFinite(real?.recent?.gf)
    ? real.recent.gf
    : limit(0.85 + attack * 0.64 + formSeed * 0.62, 0.55, 2.8);
  const recentGa = Number.isFinite(real?.recent?.ga)
    ? real.recent.ga
    : limit(1.95 - defense * 0.62 + (1 - formSeed) * 0.42, 0.45, 2.45);
  return {
    elo,
    eloRank,
    attack,
    defense,
    recentGf,
    recentGa,
    injuryRisk,
    lineupQuality: limit(avgRating / 10, 0.62, 0.9),
    squadCoverage,
    avgRating,
    real
  };
}

function poisson(k, lambda) {
  let factorial = 1;
  for (let i = 2; i <= k; i += 1) factorial *= i;
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial;
}

function buildPoissonScoreModel() {
  const home = teamModelProfile(teamA);
  const away = teamModelProfile(teamB);
  const realMatch = realMatchInput(teamA, teamB);
  const fixture = realMatch?.eloFixture;
  const eloDiff = home.elo - away.elo;
  const homePrior = match.probabilities.home;
  const awayPrior = match.probabilities.away;
  const drawPrior = match.probabilities.draw;
  const fixtureHomeWin = fixture
    ? (realMatch.reversed ? 1 - fixture.homeWinExpectation : fixture.homeWinExpectation)
    : null;
  const realTotalLine = Number.isFinite(realMatch?.totalLine) ? realMatch.totalLine : null;
  const marketTotal = limit(
    (realTotalLine || 2.28)
      + (home.attack + away.attack - 2.1) * 0.38
      + (0.25 - drawPrior) * 0.9
      + (1 - (home.defense + away.defense) / 2) * 0.24,
    1.75,
    3.55
  );
  const homeEdge = limit(
    0.5
      + eloDiff / 1200
      + (home.attack - away.defense) * 0.14
      + (home.recentGf - away.recentGa) * 0.035
      + (homePrior - awayPrior) * 0.28
      + (fixtureHomeWin === null ? 0 : (fixtureHomeWin - 0.5) * 0.22)
      - home.injuryRisk * 0.08
      + away.injuryRisk * 0.08,
    0.25,
    0.75
  );
  const homeLambda = limit(marketTotal * homeEdge, 0.35, 3.75);
  const awayLambda = limit(marketTotal * (1 - homeEdge), 0.25, 3.35);
  const cells = [];
  let total = 0;
  for (let homeGoals = 0; homeGoals <= 6; homeGoals += 1) {
    for (let awayGoals = 0; awayGoals <= 6; awayGoals += 1) {
      const probability = poisson(homeGoals, homeLambda) * poisson(awayGoals, awayLambda);
      cells.push({ homeGoals, awayGoals, score: `${homeGoals}-${awayGoals}`, probability });
      total += probability;
    }
  }
  cells.forEach((cell) => { cell.probability /= total || 1; });
  const resultProbs = cells.reduce((acc, cell) => {
    if (cell.homeGoals > cell.awayGoals) acc.home += cell.probability;
    else if (cell.homeGoals === cell.awayGoals) acc.draw += cell.probability;
    else acc.away += cell.probability;
    return acc;
  }, { home: 0, draw: 0, away: 0 });
  const resultKey = resultProbs.draw >= resultProbs.home && resultProbs.draw >= resultProbs.away
    ? "draw"
    : resultProbs.home >= resultProbs.away ? "home" : "away";
  const matchesResult = (cell) => {
    if (resultKey === "home") return cell.homeGoals > cell.awayGoals;
    if (resultKey === "away") return cell.homeGoals < cell.awayGoals;
    return cell.homeGoals === cell.awayGoals;
  };
  const rankedCells = cells.slice().sort((a, b) => b.probability - a.probability);
  const predicted = rankedCells.find(matchesResult) || rankedCells[0];
  const topScorelines = [
    predicted,
    ...rankedCells.filter((cell) => cell.score !== predicted.score)
  ].slice(0, 5);
  const confidence = limit(
    58
      + Math.max(resultProbs.home, resultProbs.away, resultProbs.draw) * 32
      + Math.min(home.squadCoverage, away.squadCoverage) * 10
      - (home.injuryRisk + away.injuryRisk) * 35,
    55,
    92
  );
  return {
    home,
    away,
    expectedGoals: { home: homeLambda, away: awayLambda, total: marketTotal },
    resultProbs,
    topScorelines,
    predicted,
    confidence,
    realMatch,
    factors: [
      ["Elo/排名", `${Math.round(home.elo)} : ${Math.round(away.elo)}`],
      ["进攻强度", `${home.attack.toFixed(2)} : ${away.attack.toFixed(2)}`],
      ["防守强度", `${home.defense.toFixed(2)} : ${away.defense.toFixed(2)}`],
      ["近期均进球", `${home.recentGf.toFixed(1)} : ${away.recentGf.toFixed(1)}`],
      ["近期均失球", `${home.recentGa.toFixed(1)} : ${away.recentGa.toFixed(1)}`],
      ["大小球线", `${marketTotal.toFixed(2)}`],
      ["伤停风险", `${Math.round(home.injuryRisk * 100)}% : ${Math.round(away.injuryRisk * 100)}%`],
      ["预计首发质量", `${home.avgRating.toFixed(1)} : ${away.avgRating.toFixed(1)}`]
    ]
  };
}

const scoreModel = globalThis.ScoreModel ? ScoreModel.build(teamA, teamB) : buildPoissonScoreModel();

function winnerKey() {
  const { home, draw, away } = scoreModel.resultProbs;
  if (draw >= home && draw >= away) return "draw";
  return home >= away ? "home" : "away";
}

function predictedScoreline() {
  return [scoreModel.predicted.homeGoals, scoreModel.predicted.awayGoals];
}

function scorelineCandidates() {
  const labels = ["主推", "稳态", "拉开", "小胜", "冷门"];
  return scoreModel.topScorelines.map((item, index) => ({
    ...item,
    label: labels[index] || "备选"
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
  const stageLabel = scheduledInfo?.round || scheduledInfo?.stage || `${match.group}组`;
  document.querySelector("#matchGroup").textContent = `${stageLabel} · ${scheduledInfo ? MatchSchedule.formatChinaTime(scheduledInfo) : "Match Center"}`;
  document.querySelector("#matchTitle").innerHTML = `<span class="flag-mark">${flagFor(teamA.name)}</span>${teamA.name} vs <span class="flag-mark">${flagFor(teamB.name)}</span>${teamB.name}`;
  const venueLine = scheduledInfo ? `比赛时间 ${MatchSchedule.formatChinaTime(scheduledInfo)}，地点 ${scheduledInfo.stadium} · ${scheduledInfo.city}。` : "";
  document.querySelector("#matchSubtitle").textContent = `${venueLine}${confedNames[teamA.confed]} FIFA ${teamA.rank} 对 ${confedNames[teamB.confed]} FIFA ${teamB.rank}，胜率、阵容、赔率、交锋和临场情报集中追踪。`;
  document.querySelector("#detailAWin").textContent = pct(scoreModel.resultProbs.home);
  document.querySelector("#detailDraw").textContent = pct(scoreModel.resultProbs.draw);
  document.querySelector("#detailBWin").textContent = pct(scoreModel.resultProbs.away);
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
  const aOdds = decimalOdds(scoreModel.resultProbs.home);
  const drawOdds = decimalOdds(scoreModel.resultProbs.draw);
  const bOdds = decimalOdds(scoreModel.resultProbs.away);
  const leader = winnerKey() === "draw" ? "平局保护权重最高" : `${winnerKey() === "home" ? teamA.name : teamB.name}胜面更高`;
  const marketPulse = Math.round((Math.max(scoreModel.resultProbs.home, scoreModel.resultProbs.away) - scoreModel.resultProbs.draw) * 100);

  deck.innerHTML = `
    <aside class="forecast-side">
      <span class="forecast-kicker">POISSON SCORE FORECAST</span>
      <strong>${flagFor(teamA.name)} ${teamA.name} vs ${flagFor(teamB.name)} ${teamB.name}</strong>
      <small>${kickoff} · ${venue}</small>
      <div class="forecast-mini-list">
        <div><span>市场脉冲</span><b>${marketPulse > 0 ? "+" : ""}${marketPulse}</b></div>
        <div><span>预测置信</span><b>${Math.round(scoreModel.confidence)}%</b></div>
        <div><span>盘口方向</span><b>${leader}</b></div>
        <div><span>预期进球</span><b>${scoreModel.expectedGoals.home.toFixed(2)} : ${scoreModel.expectedGoals.away.toFixed(2)}</b></div>
        <div><span>数据源</span><b>${realSourceSummary()}</b></div>
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
        <div><span>${teamA.name}胜</span><b>${pct(scoreModel.resultProbs.home)}</b><i style="width:${scoreModel.resultProbs.home * 100}%"></i></div>
        <div><span>平局</span><b>${pct(scoreModel.resultProbs.draw)}</b><i style="width:${scoreModel.resultProbs.draw * 100}%"></i></div>
        <div><span>${teamB.name}胜</span><b>${pct(scoreModel.resultProbs.away)}</b><i style="width:${scoreModel.resultProbs.away * 100}%"></i></div>
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

    <section class="forecast-factors">
      ${scoreModel.factors.map(([label, value]) => `
        <article>
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `).join("")}
    </section>
  `;
}

function renderOverview() {
  const strengthGap = Math.round(baseStrength(teamA) - baseStrength(teamB));
  const rows = [
    ["比赛时间", scheduledInfo ? MatchSchedule.formatChinaTime(scheduledInfo) : "待公布"],
    ["比赛场地", scheduledInfo ? scheduledInfo.city : "待公布"],
    ["泊松主胜", pct(scoreModel.resultProbs.home)],
    ["泊松平局", pct(scoreModel.resultProbs.draw)],
    ["泊松客胜", pct(scoreModel.resultProbs.away)],
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
    ["模型稳定性", Math.round(scoreModel.confidence)]
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
    ["主胜", scoreModel.resultProbs.home],
    ["平局", scoreModel.resultProbs.draw],
    ["客胜", scoreModel.resultProbs.away]
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
    ["预期进球", `${scoreModel.expectedGoals.home.toFixed(2)} : ${scoreModel.expectedGoals.away.toFixed(2)}`],
    ["最大风险", scoreModel.resultProbs.draw > 0.24 ? "平局拉高" : "强弱分化"],
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
