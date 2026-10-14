#!/usr/bin/env python3
"""
Harvests official Tamil dates from the weekly Tamil Nadu Government Gazette (Part I) and appends
them to fixtures/gazette.json. Each Part I issue header reads like:

    No. 33] CHENNAI, WEDNESDAY, AUGUST 17, 2022
    Aavani 1, Subakiruthu, Thiruvalluvar Aandu-2053

One header per Tamil month is enough to pin that month's official start date.

Usage:  python3 fetch_gazette.py --years 2016 2026        (needs internet access to stationeryprinting.tn.gov.in)
Requires: pip install pypdf requests
Run it on your machine or in CI, then re-run generate.py.
"""
import argparse, io, json, re, time, datetime as dt
import requests
from pypdf import PdfReader

URL = "https://stationeryprinting.tn.gov.in/gazette/{year}/{issue}_I.pdf"
MONTHS = "Chithirai|Vaikasi|Vaigasi|Aani|Aadi|Aavani|Avani|Purattasi|Aippasi|Ippasi|Karthigai|Karthikai|Margazhi|Thai|Maasi|Masi|Panguni"
CANON = {"Vaigasi": "Vaikasi", "Avani": "Aavani", "Ippasi": "Aippasi", "Karthikai": "Karthigai", "Masi": "Maasi"}
HEADER = re.compile(
    r"([A-Z]+DAY),\s+([A-Z]+)\s+(\d{1,2}),\s+(\d{4})\s+(" + MONTHS + r")\s+(\d{1,2}),\s*([A-Za-z]+),\s*Thiruvalluvar\s+Aandu\s*[–-]\s*(\d{4})",
    re.I)


def header_of(pdf_bytes):
    text = PdfReader(io.BytesIO(pdf_bytes)).pages[0].extract_text() or ""
    m = HEADER.search(re.sub(r"\s+", " ", text))
    if not m:
        return None
    _, mon, d, y, tmonth, tday, yname, tv = m.groups()
    date = dt.datetime.strptime(f"{mon.title()} {d} {y}", "%B %d %Y").date()
    tmonth = CANON.get(tmonth.title(), tmonth.title())
    return {"date": date.isoformat(), "month_en": tmonth, "day": int(tday), "year_name_en": yname.title(),
            "thiruvalluvar_year": int(tv)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--years", nargs=2, type=int, required=True)
    ap.add_argument("--fixtures", default="fixtures/gazette.json")
    ap.add_argument("--delay", type=float, default=1.0, help="seconds between requests (be polite)")
    a = ap.parse_args()

    data = json.load(open(a.fixtures, encoding="utf-8"))
    have = {f["date"] for f in data["fixtures"]}
    added = 0
    for year in range(a.years[0], a.years[1] + 1):
        for issue in range(1, 54):
            url = URL.format(year=year, issue=issue)
            try:
                r = requests.get(url, timeout=60)
            except requests.RequestException as e:
                print("skip", url, e); continue
            if r.status_code != 200 or not r.content.startswith(b"%PDF"):
                continue
            h = header_of(r.content)
            if h and h["date"] not in have:
                h["source"] = f"TN Gazette No. {issue}, Part I, {h['date']}"
                h["url"] = url
                data["fixtures"].append(h); have.add(h["date"]); added += 1
                print("ok", h["date"], h["month_en"], h["day"])
            elif not h:
                print("no header found", url)
            time.sleep(a.delay)
    data["fixtures"].sort(key=lambda f: f["date"])
    json.dump(data, open(a.fixtures, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"added {added} fixtures")


if __name__ == "__main__":
    main()
