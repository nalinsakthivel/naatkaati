#!/usr/bin/env python3
"""
Builds data/thirukkural.json from public sources, reproducibly.

Sources (see SOURCES below and DATA_SOURCES.md):
  1. tk120404/thirukkural (GitHub, Apache-2.0): Tamil couplet text + paal/iyal/adhikaram structure.
     ONLY the original-text and structure fields are used. The modern commentaries in that repo
     (mv = Mu. Varadarasanar, sp = Solomon Pappaiah, mk = M. Karunanidhi) and the "Translation" field
     are deliberately excluded because they are still under copyright.
  2. G.U. Pope, W.H. Drew, J. Lazarus, F.W. Ellis, "Tirukkural: English Translation and Commentary"
     (W.H. Allen & Co, 1886) - public domain. Text as e-published by Project Madurai (pmuni0153).
     Used for translation_en (verse) and explanation_en (prose).
  3. libkural 1.0.1 (PyPI, BSD-2, Muthiah Annamalai; derived from Project Madurai) - independent
     copy of the Tamil text, used only to cross-check source 1.

Usage:  python3 build.py  [--out ../../data/thirukkural.json]
"""
import argparse, io, json, re, tarfile, unicodedata, urllib.request

TK_KURAL = "https://raw.githubusercontent.com/tk120404/thirukkural/master/thirukkural.json"
TK_DETAIL = "https://raw.githubusercontent.com/tk120404/thirukkural/master/detail.json"
LIBKURAL = "https://files.pythonhosted.org/packages/source/l/libkural/libkural-1.0.1.tar.gz"

SOURCES = [
    {
        "id": "tk120404",
        "name": "tk120404/thirukkural (GitHub)",
        "url": "https://github.com/tk120404/thirukkural",
        "license": "Apache-2.0 (repository). The kural text itself is public domain.",
        "used_for": ["lines_ta", "adhikaram", "iyal", "paal"],
        "excluded": "Modern commentaries (mv, sp, mk) and the 'Translation' field: still under copyright.",
    },
    {
        "id": "pope-1886",
        "name": "Tirukkural: English Translation and Commentary, by Rev. Dr. G.U. Pope, Rev. W.H. Drew, Rev. John Lazarus and F.W. Ellis (W.H. Allen & Co, London, 1886)",
        "url": "https://projectmadurai.org/pm_etexts/utf8/pmuni0153.html",
        "license": "Public domain (published 1886). E-text by Project Madurai.",
        "used_for": ["translation_en", "explanation_en"],
        "notice": (
            "Etext input & proof-reading, web & pdf versions: Dr. K. Kalyanasundaram, Lausanne, Switzerland. "
            "(c) Project Madurai, 1998-2021. Project Madurai is an open, voluntary, worldwide initiative devoted to "
            "preparation of electronic texts of tamil literary works and to distribute them free on the Internet. "
            "Details of Project Madurai are available at https://www.projectmadurai.org/"
        ),
    },
    {
        "id": "libkural",
        "name": "libkural 1.0.1 by Muthiah Annamalai (PyPI)",
        "url": "https://pypi.org/project/libkural/",
        "license": "BSD-2-Clause (code); text derived from Project Madurai",
        "used_for": ["cross-check of lines_ta only"],
    },
]

# Both copies of the text inherit the same legacy-encoding (TSCII -> Unicode) conversion error:
# vowel signs were mapped to unassigned code points. Fix them deterministically.
CODEPOINT_FIXES = {"\u0BA7": "\u0BBF",  # -> ி (vowel sign I)
                   "\u0BA6": "\u0BC6"}  # -> ெ (vowel sign E)

# Manual corrections, each with a reason. Reviewed against both sources.
MANUAL = {
    1117: (["அறுவாய் நிறைந்த அவிர்மதிக்குப் போல", "மறுவுண்டோ மாதர் முகத்து."],
           "Removed duplicated syllable 'க்குப்' present in tk120404; libkural reading."),
    1202: (["எனைத்தொன்று இனிதேகாண் காமம்தாம் வீழ்வார்", "நினைப்ப வருவதொன்று ஏல்."],
           "Both sources read 'எனைத்தொனறு' (missing pulli); corrected to 'எனைத்தொன்று'."),
    599:  (["பரியது கூர்ங்கோட்டது ஆயினும் யானை", "வெரூஉம் புலிதாக் குறின்."],
           "Both sources have a misplaced vowel sign from legacy encoding ('ெவ்ருஉம்'); corrected to 'வெரூஉம்'."),
    1192: (["வாழ்வார்க்கு வானம் பயந்தற்றால் வீழ்வார்க்கு", "வீழ்வார் அளிக்கும் அளி."],
           "Removed stray space ('அளி க்கும்') left by legacy-encoding conversion."),
    988:  (["இன்மை ஒருவற்கு இளிவன்று சால்பென்னும்", "திண்மைஉண் டாகப் பெறின்."],
           "Spacing in line 2 taken from libkural."),
}

# Word-level corrections found while reviewing every kural for the Tamil meanings.
# Each is a legacy-encoding error present in the source text. Format: (wrong, right[, needs_review]).
TEXT_FIXES = {
    51: ("மனைக்தக்க", "மனைத்தக்க"),
    90: ("குநழ்யும்", "குழையும்"),
    98: ("சிறுமையுவு", "சிறுமையுள்"),
    114: ("காணப்ப படும்", "காணப் படும்"),
    154: ("பொற்யுடைமை", "பொறையுடைமை"),
    165: ("வழுக்காயும்", "வழுக்கியும்", True),
    204: ("அறஞ்சூழம்", "அறஞ்சூழும்"),
    208: ("அஇஉறைந் தற்று", "அடிஉறைந் தற்று"),
    253: ("நன்னூக்காது", "நன்றூக்காது"),
    269: ("தலைப்பட் டவர்க்குல்", "தலைப்பட் டவர்க்கு"),
    287: ("புரிந்தார்கண்ட இல்", "புரிந்தார்கண் இல்"),
    290: ("புத்தே ளுளகு", "புத்தே ளுலகு"),
    298: ("புறள்தூய்மை", "புறந்தூய்மை"),
    318: ("தன்னுயிர்ககு ஏன்னாமை", "தன்னுயிர்க்கு இன்னாமை"),
    347: ("தவர் க்கு", "தவர்க்கு"),
    408: ("பட் ட", "பட்ட"),
    412: ("செவுக்குண", "செவிக்குண"),
    434: ("த்ரூஉம்", "தரூஉம்"),
    445: ("சூழ்வாரைக் சூழ்ந்து", "சூழ்வாரைச் சூழ்ந்து"),
    449: ("முதலிலார்க", "முதலிலார்க்கு"),
    469: ("தவுறுண்டு", "தவறுண்டு"),
    529: ("தமராகிக் தற்றுறந்தார்", "தமராகித் தற்றுறந்தார்"),
    530: ("இழைத் திருந்து", "இழைத்திருந்து"),
    532: ("கொன் றாங்கு", "கொன்றாங்கு"),
    639: ("பக்கததுள்", "பக்கத்துள்"),
    651: ("த்ருஉம்", "தரூஉம்"),
    653: ("ஒஓதல்", "ஓஒதல்"),
    711: ("அவையறிநது", "அவையறிந்து"),
    775: ("வேல்கொண டெறிய", "வேல்கொண்டு எறிய"),
    784: ("மேற்செனறு", "மேற்சென்று"),
    795: ("வல்லார்நடபு", "வல்லார்நட்பு"),
    855: ("மிக்லூக்கும்", "மிகலூக்கும்"),
    858: ("மிக்லூக்கின்", "மிகலூக்கின்"),
    908: ("பெட் டாங்கு", "பெட்டாங்கு"),
    934: ("சீரழக்கும்", "சீரழிக்கும்"),
    950: ("நாற் கூற்றே", "நாற்கூற்றே"),
    956: ("என் பார்", "என்பார்"),
    976: ("கொள் வேம்", "கொள்வேம்"),
    1129: ("இவ் வூர்", "இவ்வூர்"),
    1130: ("இவ் வூர்", "இவ்வூர்"),
    1143: ("கெளவை", "கௌவை"),
    1147: ("கெளவை", "கௌவை"),
    1148: ("கெளவை", "கௌவை"),
    1150: ("கெளவை", "கௌவை"),
    1217: ("கனவனால்", "கனவினால்"),
    1264: ("கோடுகொ டேறுமென்", "கோடுகொண் டேறுமென்"),
    1267: ("விரன்", "வரின்"),
    1284: ("என் னெஞ்சு", "என்னெஞ்சு"),
}


# Editorial English fixes from the external correction report (thirukkural_correction_report.json).
# Applied only if the automatic repair above did not already produce the corrected text.
EN_FIXES = {
    6:  ("explanation_en", "long proposer", "long prosper", "Editorial emendation: 'proposer' is a typo in the Project Madurai transcription."),
    16: ("translation_en", "are shed 'Tis", "are shed. 'Tis", "Sentence boundary restored (Project Madurai)."),
    36: ("translation_en", "virtue now Say", "virtue now. Say", "Sentence boundary restored (Project Madurai)."),
    49: ("explanation_en", "called virtue The", "called virtue. The", "Sentence boundary restored."),
    231: ("explanation_en", "with praise There", "with praise. There", "Sentence boundary restored."),
}

# English chapter-title fixes from the external review.
TITLE_FIXES = {
    15: ('another"s', "another's"),
    36: ("Conciousness", "Consciousness"),
    113: ('Love"s', "Love's"),
}

# Readings where the two sources differ and a human must confirm against a printed edition.
NEEDS_REVIEW = {
    143: "Second source reads 'புரிந்துதொழுகு'; common editions read 'புரிந்தொழுகு'.",
    254: "Second source reads 'அருளல்லது யாதெனின்'; verify against a printed edition.",
    330: "Sandhi/spacing differs between sources ('உயிருடம்பின் நீக்கியா ரென்ப' vs 'உயிர் உடம்பின் நீக்கியார் என்ப').",
    360: "Verify 'இவ்மூன்றன்' against a printed edition.",
    650: "Both sources differ ('இணருழ்த்தும்' / 'இண்ருழ்த்தும்'); common editions read 'இணரூழ்த்தும்'.",
}


def fetch(url):
    with urllib.request.urlopen(url, timeout=60) as r:
        return r.read()


def clean(t):
    t = unicodedata.normalize("NFC", t)
    for bad, good in CODEPOINT_FIXES.items():
        t = t.replace(bad, good)
    return re.sub(r"\s+", " ", t).strip()


def end_sentence(t):
    """Add a final period only if the text ends in a letter or ')'; never after ? ! or a closing quote."""
    t = t.rstrip()
    return t + "." if t and (t[-1].isalnum() or t[-1] == ")") else t


def squash(t):
    return re.sub(r"[\s\.\,;:!\?'\"-]+", "", t).lower()


def english_verse(n, tk_text, lk_rec):
    """Pope's two-line verse. tk120404 glued the two lines together without a space in ~250 kurals;
    libkural keeps the line break, so use its line split whenever the wording matches."""
    t = clean(tk_text)
    if lk_rec and lk_rec[0] and squash(" ".join(lk_rec[0])) == squash(t):
        t = " ".join(lk_rec[0])
    else:
        t = re.sub(r"(?<=[a-z,;:!?.])(?=[A-Z])", " ", t)          # 'gainIn' -> 'gain In'
        t = re.sub(r"(?<=[,;:!?.])(?='[A-Za-z])", " ", t)         # "gain,'Tis" -> "gain, 'Tis"
    t = re.sub(r"([?!])\.$", r"\1", t)
    return end_sentence(t)


def english_prose(n, tk_text, lk_rec):
    """Prose rendering. tk120404 truncates some entries mid-sentence; restore from libkural when
    the tk text is a strict prefix of the libkural text (same source, Pope 1886 edition)."""
    t = clean(tk_text).rstrip(".").rstrip()
    if lk_rec and lk_rec[1]:
        full = lk_rec[1]
        if len(full) > len(t) + 3 and squash(full).startswith(squash(t)):
            t = full
    t = re.sub(r"([?!])\.$", r"\1", t)
    return end_sentence(t)


def assert_valid(text, n):
    for c in text:
        try:
            unicodedata.name(c)
        except ValueError:
            raise SystemExit(f"Kural {n}: unassigned code point U+{ord(c):04X} remains")


def tight(t):
    return re.sub(r"[\s\.\,\?\!;:]+", "", t)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="../../data/thirukkural.json")
    args = ap.parse_args()

    # Preserve contributor-written Tamil meanings across rebuilds.
    existing = {}
    try:
        with open(args.out, encoding="utf-8") as f:
            for k in json.load(f).get("kurals", []):
                if k.get("meaning_ta"):
                    existing[k["number"]] = {x: k[x] for x in ("meaning_ta", "meaning_ta_author", "meaning_ta_reviewed_by", "meaning_ta_note") if x in k}
    except FileNotFoundError:
        pass

    tk = json.loads(fetch(TK_KURAL).decode("utf-8-sig"))["kural"]
    detail = json.loads(fetch(TK_DETAIL).decode("utf-8-sig"))[0]["section"]["detail"]

    with tarfile.open(fileobj=io.BytesIO(fetch(LIBKURAL))) as tf:
        src = tf.extractfile("libkural-1.0.1/libkural.py").read().decode("utf-8")
    lk, lk_en = {}, {}
    for m in re.finditer(r"Kural\.factory\((\d+),u'''(.*?)''',u'''(.*?)''',u'''(.*?)''','''(.*?)''','''(.*?)'''\)", src, re.S):
        n = int(m.group(1))
        lk[n] = clean(m.group(4))
        unesc = lambda t: t.replace("\\\\'", "'").replace("\\'", "'")
        lk_en[n] = ([clean(x) for x in unesc(m.group(5)).split("\n") if x.strip()], clean(unesc(m.group(6))))

    paals, iyals, adhikarams, chapter_of = [], [], [], {}
    for p in detail:
        paals.append({"number": p["number"], "name_ta": p["name"], "name_en": p["translation"]})
        for i in p["chapterGroup"]["detail"]:
            iyals.append({"number": i["number"], "paal": p["number"], "name_ta": i["name"], "name_en": i["translation"]})
            for c in i["chapters"]["detail"]:
                name_en = c["translation"]
                if c["number"] in TITLE_FIXES:
                    name_en = name_en.replace(*TITLE_FIXES[c["number"]])
                adhikarams.append({"number": c["number"], "iyal": i["number"], "paal": p["number"],
                                   "name_ta": c["name"], "name_en": name_en,
                                   "first_kural": c["start"], "last_kural": c["end"]})
                for n in range(c["start"], c["end"] + 1):
                    chapter_of[n] = c["number"]

    kurals, stats = [], {"agree": 0, "fixed_codepoints": 0, "manual": 0, "needs_review": 0}
    for k in sorted(tk, key=lambda x: x["Number"]):
        n = k["Number"]
        raw = k["Line1"] + k["Line2"]
        lines = [clean(k["Line1"]), clean(k["Line2"])]
        if any(c in raw for c in CODEPOINT_FIXES):
            stats["fixed_codepoints"] += 1
        entry = {"number": n, "adhikaram": chapter_of[n], "lines_ta": lines,
                 "translation_en": english_verse(n, k["couplet"], lk_en.get(n)),
                 "explanation_en": english_prose(n, k["explanation"], lk_en.get(n)),
                 "meaning_ta": None, "text_status": "verified"}
        if n in TEXT_FIXES:
            wrong, right, *flag = TEXT_FIXES[n]
            joined = " | ".join(entry["lines_ta"])
            if wrong not in joined:
                raise SystemExit(f"Kural {n}: expected text '{wrong}' not found")
            entry["lines_ta"] = joined.replace(wrong, right).split(" | ")
            entry["text_note"] = f"Corrected '{wrong}' to '{right}' (legacy-encoding error in source)."
            entry["text_status"] = "needs_review" if flag else "corrected"
            stats["text_fixes"] = stats.get("text_fixes", 0) + 1
        elif n in MANUAL:
            entry["lines_ta"], note = MANUAL[n]
            entry["text_note"] = note
            entry["text_status"] = "corrected"
            stats["manual"] += 1
        elif n in NEEDS_REVIEW:
            entry["text_note"] = NEEDS_REVIEW[n]
            entry["text_status"] = "needs_review"
            stats["needs_review"] += 1
        elif tight(" ".join(lines)) == tight(lk.get(n, "")):
            stats["agree"] += 1
        else:
            entry["text_status"] = "single_source"
        if n in EN_FIXES:
            field, wrong, right, note = EN_FIXES[n]
            if wrong in entry[field]:
                entry[field] = entry[field].replace(wrong, right)
                entry["english_note"] = note
        entry.update(existing.get(n, {}))
        for l in entry["lines_ta"]:
            assert_valid(l, n)
        kurals.append(entry)

    assert len(kurals) == 1330 and len(adhikarams) == 133
    out = {
        "version": 1,
        "description": "Thirukkural by Thiruvalluvar: 1330 kurals in 133 adhikarams, with public-domain English renderings.",
        "sources": SOURCES,
        "field_sources": {"lines_ta": ["tk120404", "libkural"], "translation_en": ["pope-1886"],
                          "explanation_en": ["pope-1886"], "adhikaram/iyal/paal": ["tk120404"],
                          "meaning_ta": ["naatkaati-contributors"]},
        "text_status_legend": {
            "verified": "Tamil text identical in both independent copies (ignoring spacing/punctuation)",
            "corrected": "Manually corrected; see text_note",
            "needs_review": "Copies differ; confirm against a printed edition before release",
            "single_source": "Differs from the second copy only because the second copy is corrupt; first copy kept",
        },
        "meaning_ta_policy": "Written by project contributors only, never copied from modern commentaries (Mu. Varadarasanar, M. Karunanidhi, Solomon Pappaiah, etc.). Entries authored 'claude-draft' are AI drafts in original wording, faithful to the kural. They are shown in the app with a visible 'not yet verified' label and a 'Report a mistake' action until a human reviewer sets meaning_ta_reviewed_by. Corrections arrive through the kural-correction issue template.",
        "paals": paals, "iyals": iyals, "adhikarams": adhikarams, "kurals": kurals,
    }
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(json.dumps(stats))


if __name__ == "__main__":
    main()
