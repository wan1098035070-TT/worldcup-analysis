import json
import os
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "real-data.js"
KNOCKOUT_OUT = ROOT / "data" / "knockout-schedule.js"
BASE = "https://www.eloratings.net"

TEAM_CODES = {
    "法国": "FR",
    "西班牙": "ES",
    "阿根廷": "AR",
    "英格兰": "EN",
    "葡萄牙": "PT",
    "巴西": "BR",
    "荷兰": "NL",
    "摩洛哥": "MA",
    "比利时": "BE",
    "德国": "DE",
    "克罗地亚": "HR",
    "哥伦比亚": "CO",
    "塞内加尔": "SN",
    "墨西哥": "MX",
    "乌拉圭": "UY",
    "日本": "JP",
    "瑞士": "CH",
    "美国": "US",
    "伊朗": "IR",
    "奥地利": "AT",
    "韩国": "KR",
    "厄瓜多尔": "EC",
    "澳大利亚": "AU",
    "土耳其": "TR",
    "苏格兰": "SQ",
    "瑞典": "SE",
    "埃及": "EG",
    "挪威": "NO",
    "阿尔及利亚": "DZ",
    "捷克": "CZ",
    "卡塔尔": "QA",
    "科特迪瓦": "CI",
    "突尼斯": "TN",
    "加拿大": "CA",
    "巴拉圭": "PY",
    "沙特阿拉伯": "SA",
    "伊拉克": "IQ",
    "乌兹别克斯坦": "UZ",
    "南非": "ZA",
    "民主刚果": "CD",
    "巴拿马": "PA",
    "约旦": "JO",
    "加纳": "GH",
    "波黑": "BA",
    "佛得角": "CV",
    "库拉索": "CW",
    "海地": "HT",
    "新西兰": "NZ",
}


def fetch_text(url):
    req = urllib.request.Request(url, headers={"User-Agent": "worldcup-analysis/1.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8", "replace")


def parse_world_ratings():
    rows = fetch_text(f"{BASE}/World.tsv").splitlines()
    ratings = {}
    for row in rows:
        fields = row.split("\t")
        if len(fields) < 4:
            continue
        rank, _, code, elo = fields[:4]
        try:
            ratings[code] = {"eloRank": int(rank), "elo": int(elo)}
        except ValueError:
            continue
    return ratings


def parse_latest_form(team_codes):
    rows = fetch_text(f"{BASE}/latest.tsv").splitlines()
    form = {code: [] for code in team_codes}
    for row in rows:
        fields = row.split("\t")
        if len(fields) < 7:
            continue
        _, _, _, home, away, home_goals, away_goals = fields[:7]
        if home not in form and away not in form:
            continue
        try:
            hg = int(home_goals)
            ag = int(away_goals)
        except ValueError:
            continue
        if home in form and len(form[home]) < 10:
            form[home].append({"gf": hg, "ga": ag})
        if away in form and len(form[away]) < 10:
            form[away].append({"gf": ag, "ga": hg})
    return {
        code: {
            "matches": len(items),
            "gf": round(sum(item["gf"] for item in items) / len(items), 2) if items else None,
            "ga": round(sum(item["ga"] for item in items) / len(items), 2) if items else None,
        }
        for code, items in form.items()
    }


def parse_fixtures(team_codes):
    rows = fetch_text(f"{BASE}/fixtures.tsv").splitlines()
    fixtures = {}
    wanted = set(team_codes)
    for row in rows:
        fields = row.split("\t")
        if len(fields) < 12:
            continue
        year, month, day, home, away, tournament, host = fields[:7]
        if home not in wanted or away not in wanted:
            continue
        key = f"{home}:{away}"
        try:
            fixtures[key] = {
                "date": f"{year}-{month}-{day}",
                "tournament": tournament,
                "host": host,
                "homeRank": int(fields[7]),
                "awayRank": int(fields[8]),
                "homeElo": int(fields[9]),
                "awayElo": int(fields[10]),
                "homeWinExpectation": float(fields[11]) / 100,
            }
        except ValueError:
            continue
    return fixtures


def parse_world_cup_knockout(team_codes):
    rows = fetch_text(f"{BASE}/fixtures.tsv").splitlines()
    reverse = {code: name for name, code in TEAM_CODES.items()}
    matches = []
    for row in rows:
        fields = row.split("\t")
        if len(fields) < 12:
            continue
        year, month, day, home, away, tournament, host = fields[:7]
        if tournament != "WC" or home not in team_codes or away not in team_codes:
            continue
        try:
            month_num = int(month)
            day_num = int(day)
        except ValueError:
            continue
        if (month_num, day_num) < (6, 28):
            continue
        home_name = reverse.get(home)
        away_name = reverse.get(away)
        if not home_name or not away_name:
            continue
        date = f"{year}-{month}-{day}"
        matches.append({
            "id": f"KO-{date}-{home}-{away}",
            "stage": "淘汰赛",
            "round": "1/16决赛" if month_num < 7 or day_num <= 3 else "淘汰赛",
            "group": "KO",
            "home": home_name,
            "away": away_name,
            "homeCode": home,
            "awayCode": away,
            "date": date,
            "dateTime": f"{date}T12:00:00-04:00",
            "timeTbd": True,
            "stadium": "待官方确认",
            "city": {"US": "USA", "MX": "Mexico", "CA": "Canada"}.get(host, host or "TBD"),
            "country": host or "TBD",
            "source": "World Football Elo fixtures.tsv",
            "eloFixture": {
                "homeRank": int(fields[7]),
                "awayRank": int(fields[8]),
                "homeElo": int(fields[9]),
                "awayElo": int(fields[10]),
                "homeWinExpectation": float(fields[11]) / 100,
            }
        })
    return sorted(matches, key=lambda item: (item["date"], item["homeCode"], item["awayCode"]))


def try_fetch_odds():
    api_key = os.getenv("ODDS_API_KEY")
    sport = os.getenv("ODDS_API_SPORT_KEY", "soccer_fifa_world_cup")
    if not api_key:
        return {"status": "missing_api_key", "matches": {}}
    query = urllib.parse.urlencode({
        "apiKey": api_key,
        "regions": os.getenv("ODDS_API_REGIONS", "us,uk,eu"),
        "markets": "h2h,totals",
        "oddsFormat": "decimal",
    })
    url = f"https://api.the-odds-api.com/v4/sports/{sport}/odds?{query}"
    try:
        data = json.loads(fetch_text(url))
        return {"status": "ok", "raw": data}
    except Exception as exc:
        return {"status": f"error: {type(exc).__name__}", "matches": {}}


def build_snapshot():
    codes = set(TEAM_CODES.values())
    ratings = parse_world_ratings()
    forms = parse_latest_form(codes)
    fixtures = parse_fixtures(codes)
    odds = try_fetch_odds()
    teams = {}
    teams_by_code = {}
    for zh_name, code in TEAM_CODES.items():
        item = {"code": code}
        item.update(ratings.get(code, {}))
        form = forms.get(code, {})
        if form.get("gf") is not None:
            item["recent"] = {
                "matches": form["matches"],
                "gf": form["gf"],
                "ga": form["ga"],
                "source": "World Football Elo latest.tsv",
            }
        teams[zh_name] = item
        teams_by_code[code] = item
    matches = {}
    matches_by_code = {}
    reverse = {code: name for name, code in TEAM_CODES.items()}
    for key, fixture in fixtures.items():
        home_code, away_code = key.split(":")
        home = reverse.get(home_code)
        away = reverse.get(away_code)
        if not home or not away:
            continue
        matches[f"{home}:{away}"] = {
            "eloFixture": fixture,
            "source": "World Football Elo fixtures.tsv",
        }
        matches_by_code[f"{home_code}:{away_code}"] = {
            "eloFixture": fixture,
            "source": "World Football Elo fixtures.tsv",
        }
    return {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "sources": [
            {"name": "World Football Elo Ratings", "url": f"{BASE}/World.tsv", "fields": ["elo", "eloRank"]},
            {"name": "World Football Elo latest results", "url": f"{BASE}/latest.tsv", "fields": ["recent.gf", "recent.ga"]},
            {"name": "World Football Elo fixtures", "url": f"{BASE}/fixtures.tsv", "fields": ["fixture Elo", "win expectation"]},
            {"name": "The Odds API", "url": "https://the-odds-api.com/", "status": odds["status"]},
        ],
        "teams": teams,
        "teamsByCode": teams_by_code,
        "matches": matches,
        "matchesByCode": matches_by_code,
    }


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    data = build_snapshot()
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    OUT.write_text(f"globalThis.RealMatchData = {payload};\n", encoding="utf-8")
    knockout = {
        "updatedAt": data["updatedAt"],
        "source": "World Football Elo fixtures.tsv",
        "matches": parse_world_cup_knockout(set(TEAM_CODES.values())),
    }
    knockout_payload = json.dumps(knockout, ensure_ascii=False, indent=2)
    KNOCKOUT_OUT.write_text(f"globalThis.KnockoutSchedule = {knockout_payload};\n", encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Wrote {KNOCKOUT_OUT}")


if __name__ == "__main__":
    main()
