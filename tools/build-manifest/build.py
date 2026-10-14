#!/usr/bin/env python3
"""Regenerates data/manifest.json: one entry per dataset with a SHA-256 checksum.
The version of a dataset increments automatically whenever its checksum changes.
Usage: python3 tools/build-manifest/build.py"""
import hashlib, json, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2] / "data"
DATASETS = {  # name -> (path, min_app_version)
    "tamil-months": ("tamil-months.json", "1.0.0"),
    "thirukkural": ("thirukkural.json", "1.0.0"),
    "commemorations": ("commemorations.json", "1.0.0"),
}

def main():
    for f in sorted((ROOT / "holidays").glob("*.json")):
        DATASETS[f"holidays-{f.stem}"] = (f"holidays/{f.name}", "1.0.0")
    for opt in ("cities.json", "announcements.json"):
        if (ROOT / opt).exists():
            DATASETS[opt[:-5]] = (opt, "1.0.0" if opt == "cities.json" else "1.1.0")
    path = ROOT / "manifest.json"
    old = {d["name"]: d for d in json.load(open(path))["datasets"]} if path.exists() else {}
    out = []
    for name, (rel, minv) in sorted(DATASETS.items()):
        sha = hashlib.sha256((ROOT / rel).read_bytes()).hexdigest()
        prev = old.get(name)
        version = prev["version"] + (prev["sha256"] != sha) if prev else 1
        out.append({"name": name, "url": rel, "version": version, "sha256": sha,
                    "bytes": (ROOT / rel).stat().st_size, "min_app_version": minv})
    json.dump({"schema_version": 1, "datasets": out}, open(path, "w"), indent=1)
    print(f"{len(out)} datasets")

if __name__ == "__main__":
    main()
