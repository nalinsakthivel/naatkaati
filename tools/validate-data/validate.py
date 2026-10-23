#!/usr/bin/env python3
"""Validates every file in data/. Run in CI on every PR. Exits non-zero on the first class of errors.
Rules mirror VISION.md §7 and §9; the app's runtime zod schemas (src/schemas/) enforce the same shapes."""
import datetime as dt, hashlib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2] / "data"
errors = []
def err(msg): errors.append(msg)
def load(path): return json.loads(path.read_text(encoding="utf-8"))
def present(value): return bool(value.strip()) if isinstance(value, str) else bool(value)
def iso(s, where):
    if not isinstance(s, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", s):
        err(f"{where}: bad date {s!r}"); return None
    try: return dt.date.fromisoformat(s)
    except Exception: err(f"{where}: bad date {s!r}")

def holidays():
    for f in sorted((ROOT / "holidays").glob("*.json")):
        d = load(f); ids = set()
        for h in d["holidays"]:
            w = f"{f.name}:{h.get('id')}"
            for k in ("id", "date", "name_ta", "name_en", "applies_to", "category", "source"):
                if not present(h.get(k)): err(f"{w}: missing {k}")
            if h.get("id") in ids: err(f"{w}: duplicate id")
            ids.add(h.get("id"))
            day = iso(h.get("date", ""), w)
            if day and str(day.year) != f.stem: err(f"{w}: date outside file year")
            if not set(h.get("applies_to", [])) <= {"state_govt", "central_govt", "banks"}: err(f"{w}: bad applies_to")
            if h.get("category") not in {"cultural", "national", "religious_holiday", "other"}: err(f"{w}: bad category")

def commemorations():
    d = load(ROOT / "commemorations.json"); ids = set()
    for c in d["commemorations"]:
        w = f"commemorations:{c.get('id')}"
        for k in ("id", "month", "day", "kind", "name_ta", "name_en", "description_ta", "description_en", "source"):
            if not present(c.get(k)): err(f"{w}: missing {k}")
        if c.get("id") in ids: err(f"{w}: duplicate id")
        ids.add(c.get("id"))
        try: dt.date(2024, c["month"], c["day"])
        except Exception: err(f"{w}: impossible month/day")
        if c.get("kind") not in {"birth", "death", "event"}: err(f"{w}: bad kind")
        for g in c.get("designations", []):
            if not g.get("source_url"): err(f"{w}: designation without source_url")

def tamil_months():
    d = load(ROOT / "tamil-months.json"); m = d["months"]
    for a, b in zip(m, m[1:]):
        start, end = iso(a["start"], "tamil-months"), iso(b["start"], "tamil-months")
        if start and end:
            n = (end - start).days
            if not 29 <= n <= 32: err(f"tamil-months: {a['start']} {a['name_en']} has length {n}")
        if b["month"] != a["month"] % 12 + 1: err(f"tamil-months: sequence broken at {b['start']}")
    for e in m:
        if e["source"] not in {"gazette", "computed"}: err(f"tamil-months: bad source at {e['start']}")
        if e["source"] == "gazette" and not e.get("source_url"): err(f"tamil-months: gazette entry without url {e['start']}")

def thirukkural():
    d = load(ROOT / "thirukkural.json"); k = d["kurals"]
    if len(k) != 1330 or len(d["adhikarams"]) != 133: err("thirukkural: wrong counts")
    if [e.get("number") for e in k] != list(range(1, 1331)):
        err("thirukkural: kural numbering must be complete, unique and ordered (1-1330)")
    if [e.get("number") for e in d["adhikarams"]] != list(range(1, 134)):
        err("thirukkural: chapter numbering must be complete, unique and ordered (1-133)")
    for e in k:
        w = f"thirukkural:{e['number']}"
        if isinstance(e["number"], int) and e.get("adhikaram") != (e["number"] - 1) // 10 + 1:
            err(f"{w}: wrong adhikaram")
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
    names, urls = set(), set()
    for ds in load(p)["datasets"]:
        if ds["name"] in names or ds["url"] in urls: err(f"manifest: duplicate dataset {ds['name']}")
        names.add(ds["name"]); urls.add(ds["url"])
        f = ROOT / ds["url"]
        if not f.resolve().is_relative_to(ROOT.resolve()):
            err(f"manifest: dataset path escapes data directory {ds['url']}"); continue
        if not f.exists(): err(f"manifest: {ds['url']} missing")
        else:
            content = f.read_bytes()
            if len(content) != ds["bytes"]: err(f"manifest: byte count stale for {ds['url']}")
            if hashlib.sha256(content).hexdigest() != ds["sha256"]:
                err(f"manifest: checksum stale for {ds['url']} (run tools/build-manifest/build.py)")
            if load(f).get("version") != ds["version"]: err(f"manifest: version stale for {ds['url']}")

def main():
    for check in (holidays, commemorations, tamil_months, thirukkural, manifest):
        try: check()
        except (KeyError, TypeError, ValueError, OSError) as error:
            err(f"{check.__name__}: invalid dataset: {error}")
    if errors:
        print("\n".join(errors)); print(f"\n{len(errors)} error(s)"); return 1
    print("all data valid"); return 0

if __name__ == "__main__":
    sys.exit(main())
