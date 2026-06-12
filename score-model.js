globalThis.ScoreModel = (() => {
  const teamCodes = {
    法国: "FR", 西班牙: "ES", 阿根廷: "AR", 英格兰: "EN", 葡萄牙: "PT", 巴西: "BR",
    荷兰: "NL", 摩洛哥: "MA", 比利时: "BE", 德国: "DE", 克罗地亚: "HR", 哥伦比亚: "CO",
    塞内加尔: "SN", 墨西哥: "MX", 乌拉圭: "UY", 日本: "JP", 瑞士: "CH", 美国: "US",
    伊朗: "IR", 奥地利: "AT", 韩国: "KR", 厄瓜多尔: "EC", 澳大利亚: "AU", 土耳其: "TR",
    苏格兰: "SQ", 瑞典: "SE", 埃及: "EG", 挪威: "NO", 阿尔及利亚: "DZ", 捷克: "CZ",
    卡塔尔: "QA", 科特迪瓦: "CI", 突尼斯: "TN", 加拿大: "CA", 巴拉圭: "PY", 沙特阿拉伯: "SA",
    伊拉克: "IQ", 乌兹别克斯坦: "UZ", 南非: "ZA", 民主刚果: "CD", 巴拿马: "PA", 约旦: "JO",
    加纳: "GH", 波黑: "BA", 佛得角: "CV", 库拉索: "CW", 海地: "HT", 新西兰: "NZ"
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function pseudo(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
    return hash / 9973;
  }

  function average(numbers, fallback = 0) {
    return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : fallback;
  }

  function realTeamInput(teamName) {
    const realData = globalThis.RealMatchData || {};
    const code = teamCodes[teamName];
    return realData.teams?.[teamName] || realData.teamsByCode?.[code] || null;
  }

  function realMatchInput(aTeam, bTeam) {
    const realData = globalThis.RealMatchData || {};
    const direct = realData.matches?.[`${aTeam.name}:${bTeam.name}`];
    if (direct) return { ...direct, reversed: false };
    const reverse = realData.matches?.[`${bTeam.name}:${aTeam.name}`];
    if (reverse) return { ...reverse, reversed: true };
    const aCode = teamCodes[aTeam.name];
    const bCode = teamCodes[bTeam.name];
    const directCode = realData.matchesByCode?.[`${aCode}:${bCode}`];
    if (directCode) return { ...directCode, reversed: false };
    const reverseCode = realData.matchesByCode?.[`${bCode}:${aCode}`];
    return reverseCode ? { ...reverseCode, reversed: true } : null;
  }

  function fallbackStrength(team) {
    const rankScore = 2140 - team.rank * 7.4;
    const tierBoost = team.tier === "争冠第一梯队" ? 58 : team.tier === "深度竞争层" ? 30 : team.tier === "高爆冷潜力" ? 12 : 0;
    const hostBoost = team.host ? 28 : 0;
    return rankScore + tierBoost + hostBoost;
  }

  function basePrior(teamA, teamB) {
    const strength = globalThis.WorldCupData?.baseStrength || fallbackStrength;
    const diff = strength(teamA) - strength(teamB);
    const draw = clamp(0.27 - Math.min(Math.abs(diff), 260) / 1400, 0.18, 0.29);
    const nonDraw = 1 - draw;
    const homeShare = 1 / (1 + Math.pow(10, -diff / 420));
    return {
      home: nonDraw * homeShare,
      draw,
      away: nonDraw * (1 - homeShare)
    };
  }

  function teamProfile(team) {
    const real = realTeamInput(team.name);
    const squad = globalThis.SquadData?.getSquad(team.name) || [];
    const ratings = squad.map((player) => Number(player.rating)).filter(Number.isFinite);
    const byRole = (role) => squad.filter((player) => player.position === role);
    const avgRating = average(ratings, 7);
    const attackRating = average(byRole("FWD").map((player) => Number(player.rating)).filter(Number.isFinite), avgRating);
    const midRating = average(byRole("MID").map((player) => Number(player.rating)).filter(Number.isFinite), avgRating);
    const defenseRating = average([...byRole("DEF"), ...byRole("GK")].map((player) => Number(player.rating)).filter(Number.isFinite), avgRating);
    const elo = real?.elo || fallbackStrength(team);
    const eloRank = real?.eloRank || team.rank;
    const rankIndex = clamp((130 - eloRank) / 129, 0.08, 1);
    const squadCoverage = clamp(squad.length / 11, 0.62, 1);
    const injuryRisk = Number.isFinite(real?.injuryRisk)
      ? clamp(real.injuryRisk, 0, 0.35)
      : clamp(0.04 + pseudo(`${team.name}-injury-risk`) * 0.12 - squadCoverage * 0.04, 0.02, 0.16);
    const lineupBoost = (avgRating - 7.2) * 0.09 + (squadCoverage - 0.85) * 0.18 - injuryRisk * 0.5;
    const attack = clamp(0.76 + rankIndex * 0.54 + (attackRating - 7) * 0.08 + (midRating - 7) * 0.04 + lineupBoost, 0.62, 1.72);
    const defense = clamp(0.72 + rankIndex * 0.45 + (defenseRating - 7) * 0.08 + lineupBoost * 0.8, 0.58, 1.58);
    const formSeed = pseudo(`${team.name}-last-10-form`);
    const recentGf = Number.isFinite(real?.recent?.gf)
      ? real.recent.gf
      : clamp(0.85 + attack * 0.64 + formSeed * 0.62, 0.55, 2.8);
    const recentGa = Number.isFinite(real?.recent?.ga)
      ? real.recent.ga
      : clamp(1.95 - defense * 0.62 + (1 - formSeed) * 0.42, 0.45, 2.45);
    return { elo, eloRank, attack, defense, recentGf, recentGa, injuryRisk, squadCoverage, avgRating, real };
  }

  function poisson(k, lambda) {
    let factorial = 1;
    for (let i = 2; i <= k; i += 1) factorial *= i;
    return Math.exp(-lambda) * Math.pow(lambda, k) / factorial;
  }

  function build(teamA, teamB) {
    const home = teamProfile(teamA);
    const away = teamProfile(teamB);
    const prior = basePrior(teamA, teamB);
    const realMatch = realMatchInput(teamA, teamB);
    const fixture = realMatch?.eloFixture;
    const fixtureHomeWin = fixture
      ? (realMatch.reversed ? 1 - fixture.homeWinExpectation : fixture.homeWinExpectation)
      : null;
    const marketTotal = clamp(
      (Number.isFinite(realMatch?.totalLine) ? realMatch.totalLine : 2.28)
        + (home.attack + away.attack - 2.1) * 0.38
        + (0.25 - prior.draw) * 0.9
        + (1 - (home.defense + away.defense) / 2) * 0.24,
      1.75,
      3.55
    );
    const homeEdge = clamp(
      0.5
        + (home.elo - away.elo) / 1200
        + (home.attack - away.defense) * 0.14
        + (home.recentGf - away.recentGa) * 0.035
        + (prior.home - prior.away) * 0.28
        + (fixtureHomeWin === null ? 0 : (fixtureHomeWin - 0.5) * 0.22)
        - home.injuryRisk * 0.08
        + away.injuryRisk * 0.08,
      0.25,
      0.75
    );
    const homeLambda = clamp(marketTotal * homeEdge, 0.35, 3.75);
    const awayLambda = clamp(marketTotal * (1 - homeEdge), 0.25, 3.35);
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
    const confidence = clamp(
      58 + Math.max(resultProbs.home, resultProbs.away, resultProbs.draw) * 32 + Math.min(home.squadCoverage, away.squadCoverage) * 10 - (home.injuryRisk + away.injuryRisk) * 35,
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

  function probabilities(teamA, teamB) {
    return build(teamA, teamB).resultProbs;
  }

  return { build, probabilities, realTeamInput, realMatchInput, teamCodes };
})();
