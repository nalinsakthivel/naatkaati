#!/usr/bin/env python3
"""
Builds data/cities.json from GeoNames (CC BY 4.0; attribution must be shown in the app's Licenses screen).

Keeps: all Indian cities with population >= 15,000, plus major Tamil diaspora cities (list below).
Fields: id (geonameid), name_en, name_ta (GeoNames alternate name in Tamil, if any), lat, lon, timezone,
        country, admin1 (state code), population.

Usage:  python3 tools/build-cities/build.py      (needs internet access to download.geonames.org)
"""
import csv, io, json, pathlib, urllib.request, zipfile

BASE = "https://download.geonames.org/export/dump/"
OUT = pathlib.Path(__file__).resolve().parents[2] / "data" / "cities.json"
DIASPORA = {  # geonames country code -> city names to keep (Tamil diaspora)
    "LK": {"Colombo", "Jaffna", "Trincomalee", "Batticaloa", "Kandy"},
    "SG": {"Singapore"}, "MY": {"Kuala Lumpur", "Ipoh", "Penang", "George Town", "Klang"},
    "GB": {"London"}, "CA": {"Toronto", "Montreal"}, "US": {"New York City", "San Jose", "Dallas", "Houston", "Chicago"},
    "AU": {"Sydney", "Melbourne"}, "AE": {"Dubai", "Abu Dhabi"}, "QA": {"Doha"}, "SA": {"Riyadh"},
    "FR": {"Paris"}, "DE": {"Berlin", "Frankfurt am Main"}, "CH": {"Zurich", "Geneva"}, "MU": {"Port Louis"},
    "ZA": {"Durban"}, "RE": {"Saint-Denis"}, "NZ": {"Auckland"}, "KW": {"Kuwait City"}, "OM": {"Muscat"},
}

def fetch_zip(name):
    with urllib.request.urlopen(BASE + name, timeout=300) as r:
        z = zipfile.ZipFile(io.BytesIO(r.read()))
    return z.read(z.namelist()[0]).decode("utf-8")

def main():
    rows = list(csv.reader(io.StringIO(fetch_zip("cities15000.zip")), delimiter="\t", quoting=csv.QUOTE_NONE))
    keep = {}
    for r in rows:
        gid, name, cc, admin1, pop, tz = r[0], r[1], r[8], r[10], int(r[14] or 0), r[17]
        if cc == "IN" or name in DIASPORA.get(cc, ()):
            keep[gid] = {"id": int(gid), "name_en": name, "name_ta": None, "lat": round(float(r[4]), 4),
                         "lon": round(float(r[5]), 4), "timezone": tz, "country": cc, "admin1": admin1, "population": pop}
    # Tamil names: alternateNamesV2 is large (~600 MB unzipped); stream only isolanguage 'ta' rows for kept ids.
    with urllib.request.urlopen(BASE + "alternateNamesV2.zip", timeout=900) as r:
        z = zipfile.ZipFile(io.BytesIO(r.read()))
    with z.open("alternateNamesV2.txt") as fh:
        for line in io.TextIOWrapper(fh, encoding="utf-8"):
            p = line.rstrip("\n").split("\t")
            if len(p) > 4 and p[2] == "ta" and p[1] in keep:
                if keep[p[1]]["name_ta"] is None or p[4] == "1":   # prefer the 'preferred name' flag
                    keep[p[1]]["name_ta"] = p[3]
    cities = sorted(keep.values(), key=lambda c: (c["country"] != "IN", c["admin1"] != "25", -c["population"]))
    out = {"version": 1,
           "attribution": "City data from GeoNames (https://www.geonames.org/), licensed under CC BY 4.0.",
           "note": "admin1 '25' = Tamil Nadu. name_ta is null where GeoNames has no Tamil name; contributors can add one with a source.",
           "cities": cities}
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(cities)} cities, {sum(1 for c in cities if c['name_ta'])} with Tamil names")

if __name__ == "__main__":
    main()
