#!/usr/bin/env python3
"""
Generates data/tamil-months.json: the civil start date of every Tamil solar month, 1900-2100.

WHY "OFFICIAL FIRST":
  Tamil Nadu's official dates (TN Government Gazette headers, holiday G.O.s) follow the traditional
  Vakya panchangam. Modern astronomical (Drik) sankranti times differ from Vakya by hours, so no
  purely astronomical rule reproduces the official calendar every month. Example (2022):
    Aavani:    Drik ingress 07:23 IST on 17 Aug -> Gazette: month starts 17 Aug (same day)
    Purattasi: Drik ingress 07:22 IST on 17 Sep -> Gazette: month starts 18 Sep (next day)

METHOD:
  1. Computed baseline: sidereal solar ingress (Lahiri ayanamsa) from tamil-panchanga-calendar,
     assigned to a civil day by the sunset rule at Chennai (ingress before sunset -> same day,
     after sunset -> next day). Sunset from kalagana.
  2. Official override: every month start pinned by fixtures/gazette.json replaces the computed one.
  3. Each entry carries "source": "gazette" (official) or "computed" (may be off by one day).
  4. The script prints the agreement rate between computed and official starts.

Usage:  python3 generate.py [--out ../../data/tamil-months.json] [--from 1900 --to 2100]
Requires: pip install tamil-panchanga-calendar kalagana
"""
import argparse, json, datetime as dt
from zoneinfo import ZoneInfo
import tamil_panchanga_calendar as tpc
import kalagana

IST = ZoneInfo("Asia/Kolkata")
CHENNAI = kalagana.city_lookup("chennai")
NAMES = {m.name_en: m for m in tpc.TAMIL_MONTHS}
BASE_POS = tpc.get_year_for_gregorian(1900).cycle_position  # cycle advances by one each Chithirai


def sunset(day):
    return kalagana.daily_panchang(day, CHENNAI, with_muhurta=False).sunset


def computed_starts(y0, y1):
    out = []
    for y in range(y0, y1 + 1):
        for s in tpc.all_sankrantis(y):
            ist = s.datetime_utc.astimezone(IST)
            day = ist.date()
            civil = day if ist < sunset(day) else day + dt.timedelta(days=1)
            out.append({"start": civil, "month_en": s.month_name_en, "sankranti_ist": ist.strftime("%Y-%m-%dT%H:%M")})
    out.sort(key=lambda e: e["start"])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="../../data/tamil-months.json")
    ap.add_argument("--from", dest="y0", type=int, default=1900)
    ap.add_argument("--to", dest="y1", type=int, default=2100)
    a = ap.parse_args()

    fx = json.load(open("fixtures/gazette.json", encoding="utf-8"))["fixtures"]
    official = {}
    for f in fx:
        start = dt.date.fromisoformat(f["date"]) - dt.timedelta(days=f["day"] - 1)
        for (m, s), g in official.items():
            if m == f["month_en"] and s != start and abs((s - start).days) <= 3:
                raise SystemExit(f"Conflicting fixtures for {m}: {s} vs {start} ({g['source']} / {f['source']})")
        official[(f["month_en"], start)] = f

    rows = computed_starts(a.y0, a.y1)
    agree = total = 0
    for r in rows:
        r["source"] = "computed"
        for (m, s), f in official.items():
            if m == r["month_en"] and abs((s - r["start"]).days) <= 3:
                total += 1
                if s == r["start"]:
                    agree += 1
                r["computed_start"] = r["start"].isoformat()
                r["start"] = s
                r["source"] = "gazette"
                r["source_ref"] = f["source"]
                r["source_url"] = f["url"]

    months = []
    for r in rows:
        info = NAMES[r["month_en"]]
        start = r["start"]
        # Thiruvalluvar year = Gregorian + 31, changing at Thai 1. Every Tamil month starts in the same
        # Gregorian year as its Thiruvalluvar year boundary, so this holds for all 12 months.
        tv = start.year + 31
        # 60-year cycle (validation only, never shown in UI): changes at Chithirai 1.
        cyc_year = start.year if info.number <= 9 else start.year - 1
        cyc = tpc.get_year_by_cycle_position((BASE_POS - 1 + (cyc_year - 1900)) % 60 + 1)
        e = {"start": start.isoformat(), "month": info.number, "name_ta": info.name_ta, "name_en": info.name_en,
             "thiruvalluvar_year": tv, "tamil_year_cycle": cyc.cycle_position, "tamil_year_cycle_name_en": cyc.name_en,
             "source": r["source"], "sankranti_ist": r["sankranti_ist"]}
        for k in ("computed_start", "source_ref", "source_url"):
            if k in r:
                e[k] = r[k]
        months.append(e)

    # sanity: month lengths
    for p, n in zip(months, months[1:]):
        length = (dt.date.fromisoformat(n["start"]) - dt.date.fromisoformat(p["start"])).days
        if not 29 <= length <= 32:
            raise SystemExit(f"Bad month length {length} at {p['start']} {p['name_en']}")
        if n["month"] != p["month"] % 12 + 1:
            raise SystemExit(f"Month sequence broken at {n['start']}")

    out = {
        "version": 1,
        "description": "Civil start date of every Tamil solar month. Tamil date of any day = (day - start of its month) + 1.",
        "method": "Official TN Gazette / G.O. dates where available (source: gazette); otherwise sidereal solar ingress, Lahiri ayanamsa, sunset rule at Chennai (source: computed, may differ from the official Vakya-based calendar by one day).",
        "reference_location": "Chennai (Asia/Kolkata)",
        "range": [a.y0, a.y1],
        "official_agreement": {"checked": total, "computed_matches_official": agree},
        "months": months,
    }
    # One month per line: compact, and keeps pull-request diffs readable.
    head = {k: v for k, v in out.items() if k != "months"}
    lines = ",\n  ".join(json.dumps(m, ensure_ascii=False, separators=(",", ":")) for m in months)
    body = json.dumps(head, ensure_ascii=False, indent=1)[:-2] + ',\n "months": [\n  ' + lines + "\n ]\n}\n"
    json.loads(body)
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write(body)
    print(json.dumps({"months": len(months), "gazette": sum(m["source"] == "gazette" for m in months),
                      "computed_matches_official": f"{agree}/{total}"}))


if __name__ == "__main__":
    main()
