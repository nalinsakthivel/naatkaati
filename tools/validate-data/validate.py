#!/usr/bin/env python3
"""Validates every file in data/. Run in CI on every PR. Exits non-zero on the first class of errors.
Rules mirror VISION.md §7 and §9; the app's runtime zod schemas (src/schemas/) enforce the same shapes."""
import datetime as dt, hashlib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2] / "data"
errors = []
def err(msg): errors.append(msg)
def iso(s, where):
    try: return dt.date.fromisoformat(s)
    except Exception: err(f"{where}: bad date {s!r}")

def holidays():
    for f in sorted((ROOT / "holidays").glob("*.json")):
        d = json.load(open(f, encoding="utf-8")); ids = set()
        for h in d["holidays"]:
            w = f"{f.name}:{h.get('id')}"
            for k in ("id", "date", "name_ta", "name_en", "applies_to", "category", "source"):
                if not h.get(k): err(f"{w}: missing {k}")
            if h.get("id") in ids: err(f"{w}: duplicate id")
            ids.add(h.get("id"))
            day = iso(h.get("date", ""), w)
            if day and str(day.year) != f.stem: err(f"{w}: date outside file year")
            if not set(h.get("applies_to", [])) <= {"state_govt", "central_govt", "banks"}: err(f"{w}: bad applies_to")
            if h.get("category") not in {"cultural", "national", "religious_holiday", "other"}: err(f"{w}: bad category")

def commemorations():
    d = json.load(open(ROOT / "commemorations.json", encoding="utf-8")); ids = set()
    for c in d["commemorations"]:
        w = f"commemorations:{c.get('id')}"
        for k in ("id", "month", "day", "kind", "name_ta", "name_en", "description_ta", "description_en", "source"):
            if not c.get(k): err(f"{w}: missing {k}")
        if c.get("id") in ids: err(f"{w}: duplicate id")
        ids.add(c.get("id"))
        try: dt.date(2024, c["month"], c["day"])
        except Exception: err(f"{w}: impossible month/day")
        if c.get("kind") not in {"birth", "death", "event"}: err(f"{w}: bad kind")
        for g in c.get("designations", []):
            if not g.get("source_url"): err(f"{w}: designation without source_url")

def tamil_months():
    d = json.load(open(ROOT / "tamil-months.json", encoding="utf-8")); m = d["months"]
    for a, b in zip(m, m[1:]):
        n = (iso(b["start"], "tamil-months") - iso(a["start"], "tamil-months")).days
        if not 29 <= n <= 32: err(f"tamil-months: {a['start']} {a['name_en']} has length {n}")
        if b["month"] != a["month"] % 12 + 1: err(f"tamil-months: sequence broken at {b['start']}")
    for e in m:
        if e["source"] not in {"gazette", "computed"}: err(f"tamil-months: bad source at {e['start']}")
        if e["source"] == "gazette" and not e.get("source_url"): err(f"tamil-months: gazette entry without url {e['start']}")

def thirukkural():
    d = json.load(open(ROOT / "thirukkural.json", encoding="utf-8")); k = d["kurals"]
    if len(k) != 1330 or len(d["adhikarams"]) != 133: err("thirukkural: wrong counts")
    for e in k:
        w = f"thirukkural:{e['number']}"
        if len(e["lines_ta"]) != 2 or not all(e["lines_ta"]): err(f"{w}: lines_ta must have 2 lines")
        if re.search(r"[\u0BA5-\u0BA7]", "".join(e["lines_ta"])): err(f"{w}: invalid Tamil code point")
        if e["text_status"] not in {"verified", "corrected", "needs_review", "single_source"}: err(f"{w}: bad text_status")
        if e.get("meaning_ta"):
            if not e.get("meaning_ta_author"): err(f"{w}: meaning without author")
            rb = e.get("meaning_ta_reviewed_by")
            if rb is not None and (not isinstance(rb, str) or not rb.strip()): err(f"{w}: bad meaning_ta_reviewed_by")
        if re.search(r"[?!]\.$", e["translation_en"] + "\n" + e["explanation_en"]): err(f"{w}: doubled end punctuation")

def manifest():
    p = ROOT / "manifest.json"
    if not p.exists(): err("manifest.json missing (run tools/build-manifest/build.py)"); return
    for ds in json.load(open(p))["datasets"]:
        f = ROOT / ds["url"]
        if not f.exists(): err(f"manifest: {ds['url']} missing")
        elif hashlib.sha256(f.read_bytes()).hexdigest() != ds["sha256"]:
            err(f"manifest: checksum stale for {ds['url']} (run tools/build-manifest/build.py)")

for check in (holidays, commemorations, tamil_months, thirukkural, manifest):
    check()
if errors:
    print("\n".join(errors)); print(f"\n{len(errors)} error(s)"); sys.exit(1)
print("all data valid")
