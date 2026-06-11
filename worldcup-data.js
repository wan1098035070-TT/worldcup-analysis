globalThis.WorldCupData = (() => {
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
  const teamImpacts = Object.fromEntries(teams.map((team) => [team.name, 0]));

  const pct = (value) => `${(value * 100).toFixed(1)}%`;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function impliedProb(decimalOdds) {
    return decimalOdds && decimalOdds > 1 ? 1 / decimalOdds : 0;
  }

  function marketProbabilities() {
    const raw = teams.map((team) => ({ name: team.name, raw: impliedProb(team.odds) }));
    const total = raw.reduce((sum, item) => sum + item.raw, 0) || 1;
    return Object.fromEntries(raw.map((item) => [item.name, item.raw / total]));
  }

  function baseStrength(team, impacts = teamImpacts) {
    const rankScore = 2140 - team.rank * 7.4;
    const tierBoost = team.tier === "争冠第一梯队" ? 58 : team.tier === "深度竞争层" ? 30 : team.tier === "高爆冷潜力" ? 12 : 0;
    const hostBoost = team.host ? 28 : 0;
    return rankScore + tierBoost + hostBoost + (impacts[team.name] || 0);
  }

  function matchProbability(teamA, teamB, impacts = teamImpacts) {
    const diff = baseStrength(teamA, impacts) - baseStrength(teamB, impacts);
    const draw = clamp(0.27 - Math.min(Math.abs(diff), 260) / 1400, 0.18, 0.29);
    const nonDraw = 1 - draw;
    const aShare = 1 / (1 + Math.pow(10, -diff / 420));
    return {
      home: nonDraw * aShare,
      draw,
      away: nonDraw * (1 - aShare)
    };
  }

  function titleProbabilities(impacts = teamImpacts) {
    const market = marketProbabilities();
    const raw = teams.map((team) => {
      const strength = baseStrength(team, impacts);
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

  function groupMatches(impacts = teamImpacts) {
    const matches = [];
    [...new Set(teams.map((team) => team.group))].sort().forEach((group) => {
      const groupTeams = teams.filter((team) => team.group === group);
      for (let i = 0; i < groupTeams.length; i += 1) {
        for (let j = i + 1; j < groupTeams.length; j += 1) {
          const id = `${group}-${encodeURIComponent(groupTeams[i].name)}-${encodeURIComponent(groupTeams[j].name)}`;
          matches.push({ id, group, a: groupTeams[i], b: groupTeams[j], probabilities: matchProbability(groupTeams[i], groupTeams[j], impacts) });
        }
      }
    });
    return matches;
  }

  function findTeam(name) {
    return teams.find((team) => team.name === name);
  }

  function findMatch(group, aName, bName, impacts = teamImpacts) {
    return groupMatches(impacts).find((match) => match.group === group && match.a.name === aName && match.b.name === bName);
  }

  return {
    teams,
    confedNames,
    bookmakerReferences,
    teamImpacts,
    pct,
    baseStrength,
    titleProbabilities,
    matchProbability,
    groupMatches,
    findTeam,
    findMatch
  };
})();
