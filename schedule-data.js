globalThis.MatchSchedule = (() => {
  const source = "FIFA schedule page cross-checked with NBC Sports and Sky Sports, June 2026";
  const timeZone = "Asia/Shanghai";
  const sourceTimeZone = "ET";

  const rows = [
    ["A", "墨西哥", "南非", "2026-06-11T15:00:00-04:00", "Estadio Azteca", "Mexico City", "Mexico"],
    ["A", "韩国", "捷克", "2026-06-11T22:00:00-04:00", "Estadio Akron", "Guadalajara", "Mexico"],
    ["B", "加拿大", "波黑", "2026-06-12T15:00:00-04:00", "BMO Field", "Toronto", "Canada"],
    ["D", "美国", "巴拉圭", "2026-06-12T21:00:00-04:00", "SoFi Stadium", "Los Angeles", "USA"],
    ["B", "卡塔尔", "瑞士", "2026-06-13T15:00:00-04:00", "Levi's Stadium", "San Francisco Bay Area", "USA"],
    ["C", "巴西", "摩洛哥", "2026-06-13T18:00:00-04:00", "MetLife Stadium", "New York/New Jersey", "USA"],
    ["C", "海地", "苏格兰", "2026-06-13T21:00:00-04:00", "Gillette Stadium", "Boston", "USA"],
    ["D", "澳大利亚", "土耳其", "2026-06-14T00:00:00-04:00", "BC Place", "Vancouver", "Canada"],
    ["E", "德国", "库拉索", "2026-06-14T13:00:00-04:00", "NRG Stadium", "Houston", "USA"],
    ["F", "荷兰", "日本", "2026-06-14T16:00:00-04:00", "AT&T Stadium", "Dallas", "USA"],
    ["E", "科特迪瓦", "厄瓜多尔", "2026-06-14T19:00:00-04:00", "Lincoln Financial Field", "Philadelphia", "USA"],
    ["F", "瑞典", "突尼斯", "2026-06-14T22:00:00-04:00", "Estadio BBVA", "Monterrey", "Mexico"],
    ["H", "西班牙", "佛得角", "2026-06-15T12:00:00-04:00", "Mercedes-Benz Stadium", "Atlanta", "USA"],
    ["G", "比利时", "埃及", "2026-06-15T15:00:00-04:00", "Lumen Field", "Seattle", "USA"],
    ["H", "沙特阿拉伯", "乌拉圭", "2026-06-15T18:00:00-04:00", "Hard Rock Stadium", "Miami", "USA"],
    ["G", "伊朗", "新西兰", "2026-06-15T21:00:00-04:00", "SoFi Stadium", "Los Angeles", "USA"],
    ["I", "法国", "塞内加尔", "2026-06-16T15:00:00-04:00", "MetLife Stadium", "New York/New Jersey", "USA"],
    ["I", "伊拉克", "挪威", "2026-06-16T18:00:00-04:00", "Gillette Stadium", "Boston", "USA"],
    ["J", "阿根廷", "阿尔及利亚", "2026-06-16T21:00:00-04:00", "Arrowhead Stadium", "Kansas City", "USA"],
    ["J", "奥地利", "约旦", "2026-06-17T00:00:00-04:00", "Levi's Stadium", "San Francisco Bay Area", "USA"],
    ["K", "葡萄牙", "民主刚果", "2026-06-17T13:00:00-04:00", "NRG Stadium", "Houston", "USA"],
    ["L", "英格兰", "克罗地亚", "2026-06-17T16:00:00-04:00", "AT&T Stadium", "Dallas", "USA"],
    ["L", "加纳", "巴拿马", "2026-06-17T19:00:00-04:00", "BMO Field", "Toronto", "Canada"],
    ["K", "乌兹别克斯坦", "哥伦比亚", "2026-06-17T22:00:00-04:00", "Estadio Azteca", "Mexico City", "Mexico"],
    ["A", "捷克", "南非", "2026-06-18T12:00:00-04:00", "Mercedes-Benz Stadium", "Atlanta", "USA"],
    ["B", "瑞士", "波黑", "2026-06-18T15:00:00-04:00", "SoFi Stadium", "Los Angeles", "USA"],
    ["B", "加拿大", "卡塔尔", "2026-06-18T18:00:00-04:00", "BC Place", "Vancouver", "Canada"],
    ["A", "墨西哥", "韩国", "2026-06-18T21:00:00-04:00", "Estadio Akron", "Guadalajara", "Mexico"],
    ["D", "美国", "澳大利亚", "2026-06-19T15:00:00-04:00", "Lumen Field", "Seattle", "USA"],
    ["C", "苏格兰", "摩洛哥", "2026-06-19T18:00:00-04:00", "Gillette Stadium", "Boston", "USA"],
    ["C", "巴西", "海地", "2026-06-19T21:00:00-04:00", "Lincoln Financial Field", "Philadelphia", "USA"],
    ["D", "土耳其", "巴拉圭", "2026-06-20T00:00:00-04:00", "Levi's Stadium", "San Francisco Bay Area", "USA"],
    ["F", "荷兰", "瑞典", "2026-06-20T13:00:00-04:00", "NRG Stadium", "Houston", "USA"],
    ["E", "德国", "科特迪瓦", "2026-06-20T16:00:00-04:00", "BMO Field", "Toronto", "Canada"],
    ["E", "厄瓜多尔", "库拉索", "2026-06-20T20:00:00-04:00", "Arrowhead Stadium", "Kansas City", "USA"],
    ["F", "突尼斯", "日本", "2026-06-21T00:00:00-04:00", "Estadio BBVA", "Monterrey", "Mexico"],
    ["H", "西班牙", "沙特阿拉伯", "2026-06-21T12:00:00-04:00", "Mercedes-Benz Stadium", "Atlanta", "USA"],
    ["G", "比利时", "伊朗", "2026-06-21T15:00:00-04:00", "SoFi Stadium", "Los Angeles", "USA"],
    ["H", "乌拉圭", "佛得角", "2026-06-21T18:00:00-04:00", "Hard Rock Stadium", "Miami", "USA"],
    ["G", "新西兰", "埃及", "2026-06-21T21:00:00-04:00", "BC Place", "Vancouver", "Canada"],
    ["J", "阿根廷", "奥地利", "2026-06-22T13:00:00-04:00", "AT&T Stadium", "Dallas", "USA"],
    ["I", "法国", "伊拉克", "2026-06-22T17:00:00-04:00", "Lincoln Financial Field", "Philadelphia", "USA"],
    ["I", "挪威", "塞内加尔", "2026-06-22T20:00:00-04:00", "MetLife Stadium", "New York/New Jersey", "USA"],
    ["J", "约旦", "阿尔及利亚", "2026-06-22T23:00:00-04:00", "Levi's Stadium", "San Francisco Bay Area", "USA"],
    ["K", "葡萄牙", "乌兹别克斯坦", "2026-06-23T13:00:00-04:00", "NRG Stadium", "Houston", "USA"],
    ["L", "英格兰", "加纳", "2026-06-23T16:00:00-04:00", "Gillette Stadium", "Boston", "USA"],
    ["L", "巴拿马", "克罗地亚", "2026-06-23T19:00:00-04:00", "BMO Field", "Toronto", "Canada"],
    ["K", "哥伦比亚", "民主刚果", "2026-06-23T22:00:00-04:00", "Estadio Akron", "Guadalajara", "Mexico"],
    ["B", "瑞士", "加拿大", "2026-06-24T15:00:00-04:00", "BC Place", "Vancouver", "Canada"],
    ["B", "波黑", "卡塔尔", "2026-06-24T15:00:00-04:00", "Lumen Field", "Seattle", "USA"],
    ["C", "苏格兰", "巴西", "2026-06-24T18:00:00-04:00", "Hard Rock Stadium", "Miami", "USA"],
    ["C", "摩洛哥", "海地", "2026-06-24T18:00:00-04:00", "Mercedes-Benz Stadium", "Atlanta", "USA"],
    ["A", "捷克", "墨西哥", "2026-06-24T21:00:00-04:00", "Estadio Azteca", "Mexico City", "Mexico"],
    ["A", "南非", "韩国", "2026-06-24T21:00:00-04:00", "Estadio BBVA", "Monterrey", "Mexico"],
    ["E", "厄瓜多尔", "德国", "2026-06-25T16:00:00-04:00", "MetLife Stadium", "New York/New Jersey", "USA"],
    ["E", "库拉索", "科特迪瓦", "2026-06-25T16:00:00-04:00", "Lincoln Financial Field", "Philadelphia", "USA"],
    ["F", "日本", "瑞典", "2026-06-25T19:00:00-04:00", "AT&T Stadium", "Dallas", "USA"],
    ["F", "突尼斯", "荷兰", "2026-06-25T19:00:00-04:00", "Arrowhead Stadium", "Kansas City", "USA"],
    ["D", "土耳其", "美国", "2026-06-25T22:00:00-04:00", "SoFi Stadium", "Los Angeles", "USA"],
    ["D", "巴拉圭", "澳大利亚", "2026-06-25T22:00:00-04:00", "Levi's Stadium", "San Francisco Bay Area", "USA"],
    ["I", "挪威", "法国", "2026-06-26T15:00:00-04:00", "Gillette Stadium", "Boston", "USA"],
    ["I", "塞内加尔", "伊拉克", "2026-06-26T15:00:00-04:00", "BMO Field", "Toronto", "Canada"],
    ["H", "佛得角", "沙特阿拉伯", "2026-06-26T20:00:00-04:00", "NRG Stadium", "Houston", "USA"],
    ["H", "乌拉圭", "西班牙", "2026-06-26T20:00:00-04:00", "Estadio Akron", "Guadalajara", "Mexico"],
    ["G", "新西兰", "比利时", "2026-06-26T23:00:00-04:00", "BC Place", "Vancouver", "Canada"],
    ["G", "埃及", "伊朗", "2026-06-26T23:00:00-04:00", "Lumen Field", "Seattle", "USA"],
    ["L", "巴拿马", "英格兰", "2026-06-27T17:00:00-04:00", "MetLife Stadium", "New York/New Jersey", "USA"],
    ["L", "克罗地亚", "加纳", "2026-06-27T17:00:00-04:00", "Lincoln Financial Field", "Philadelphia", "USA"],
    ["K", "哥伦比亚", "葡萄牙", "2026-06-27T19:30:00-04:00", "Hard Rock Stadium", "Miami", "USA"],
    ["K", "民主刚果", "乌兹别克斯坦", "2026-06-27T19:30:00-04:00", "Mercedes-Benz Stadium", "Atlanta", "USA"],
    ["J", "阿尔及利亚", "奥地利", "2026-06-27T22:00:00-04:00", "Arrowhead Stadium", "Kansas City", "USA"],
    ["J", "约旦", "阿根廷", "2026-06-27T22:00:00-04:00", "AT&T Stadium", "Dallas", "USA"]
  ];

  const matches = rows.map(([group, home, away, dateTime, stadium, city, country], index) => ({
    id: `M${String(index + 1).padStart(2, "0")}`,
    group,
    home,
    away,
    dateTime,
    stadium,
    city,
    country,
    stage: "小组赛"
  }));

  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  });

  function formatChinaTime(match) {
    return formatter.format(new Date(match.dateTime));
  }

  function formatChinaDate(match) {
    return dateFormatter.format(new Date(match.dateTime));
  }

  function findMatch(group, aName, bName) {
    return matches.find((match) => (
      match.group === group &&
      ((match.home === aName && match.away === bName) || (match.home === bName && match.away === aName))
    ));
  }

  function teamMatches(teamName) {
    return matches.filter((match) => match.home === teamName || match.away === teamName);
  }

  function nextTeamMatch(teamName, now = new Date("2026-06-10T00:00:00+08:00")) {
    return teamMatches(teamName).find((match) => new Date(match.dateTime) >= now);
  }

  return {
    matches,
    source,
    timeZone,
    sourceTimeZone,
    formatChinaTime,
    formatChinaDate,
    findMatch,
    teamMatches,
    nextTeamMatch
  };
})();
