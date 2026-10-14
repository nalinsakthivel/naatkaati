# Data Sources

Where every dataset in `data/` comes from, its license, how often it changes, and what to watch out for.
Researched October 2026. Re-check official sources before each yearly update.

**Rule:** official primary sources (G.O.s, gazettes, DoPT/RBI orders) beat news sites, and news sites beat holiday aggregators. Aggregator sites are never a `source`.

---

## 1. Holidays

### 1.1 Tamil Nadu state + bank holidays (`applies_to: state_govt, banks`)

| | |
|---|---|
| **Primary source** | Tamil Nadu Government G.O. under the Negotiable Instruments Act, issued every November for the next year |
| **2026** | G.O.(Ms.) No. 708, dated 11-11-2025: 24 holidays. Already in `data/holidays/2026.json` |
| **2027** | Not released yet. Expected around November 2026. Third-party "2027 lists" online are projections, do not use them |
| **Where to find** | TN Gazette (stationeryprinting.tn.gov.in), tn.gov.in, compliance mirrors like simpliance.in |
| **License** | Government facts; not copyrightable |
| **Watch out** | Ad-hoc holidays mid-year (e.g. G.O. Ms. No. 239 for the 23-04-2026 election, rain holidays by district collectors). Moon-sighting dates can shift by a day via later orders |

Key facts from G.O. 708:
- The same list applies to state offices, PSUs, and commercial and co-operative banks.
- 1 April (annual closing) is a **bank-only** holiday.
- All state offices are closed on **all Saturdays and Sundays**. Compute this in-app, don't store it.

### 1.2 Central government holidays in Tamil Nadu (`applies_to: central_govt`)

| | |
|---|---|
| **Primary source** | DoPT O.M. (14 compulsory holidays nationwide) + **CGEWCC Chennai** order adding 3 local holidays for Central Government offices in Tamil Nadu |
| **2026** | DoPT O.M. F.No.12/2/2023-JCA dated 03-07-2025 + CGEWCC Chennai order dated 05-12-2025 (17 holidays). Plus DoPT order of 09-04-2026 adding 14 April (Ambedkar's birthday). Already in the dataset |
| **2027** | DoPT O.M. dated 16-07-2026 is out; the CGEWCC Chennai list usually follows in December |
| **Watch out** | Use the **Chennai** list, not the Delhi Annexure-I. DoPT revisions mid-year (e.g. Bakrid moved to 28-05-2026 via O.M. of 22-05-2026) |

Restricted holidays are **not** included in V1. They are optional per employee and mostly religious.

### 1.3 Bank holidays (rule-based)

| | |
|---|---|
| **Rule** | Sundays + **2nd and 4th Saturdays** of every month (RBI rule since 2015). A 5th Saturday is a working day |
| **Specific dates** | Same as the TN G.O. list (banks follow the state NI Act notification) + bank-only days |
| **Cross-check** | RBI Holiday Matrix, region "Chennai": rbi.org.in/scripts/HolidayMatrixDisplay.aspx |
| **Implementation** | Compute Saturdays/Sundays in `src/calendar/`; store only notified dates |

---

## 2. Tamil month table (`data/tamil-months.json`, built)

**Official reference: the Tamil Nadu Government Gazette.** Every weekly Part I issue prints the Tamil date in its header (e.g. "WEDNESDAY, AUGUST 17, 2022 — Aavani 1, Subakiruthu, Thiruvalluvar Aandu–2053"). Each header pins one month start: `start = date − (day − 1)`.

| | |
|---|---|
| **Where** | stationeryprinting.tn.gov.in/gazette/{year}/{issue}_I.pdf (2016 onward, ~52 issues per year) |
| **Fixtures** | `tools/generate-tamil-months/fixtures/gazette.json`: 9 Gazette headers + 2 holiday G.O. dates so far, each with its URL |
| **Harvesting** | `fetch_gazette.py` (run locally or by the monthly GitHub Action; the Gazette site is not reachable from every network) |
| **Computed baseline** | `tamil-panchanga-calendar` sidereal ingress (Lahiri) + Chennai sunset from `kalagana` |

**Finding:** official dates follow the Vakya panchangam. The computed rule matched only 7 of 9 official month starts (e.g. Purattasi 2022: ingress 07:22 IST, official start the next day). So the generator is **official-first**: Gazette/G.O. dates override computed ones, and each month carries `source: gazette | computed`.

**Library caveats found during testing:**
- `tamil-panchanga-calendar`'s own `from_date()` is unreliable at month boundaries (it skips Thai 1, 2026), so we use only its ingress times.
- `kalagana` has no Tamil solar month (only lunar masa), so it is used for sunset times only, not as a cross-check.

**To do:** harvest all Gazette issues from 2016 onward (`fetch_gazette.py --years 2016 2026`). That will make every month from 2016 to today official.

---

## 3. Thirukkural (`data/thirukkural.json`, built)

Built reproducibly by `tools/build-thirukkural/build.py`. Every field records its source in the file's `sources` and `field_sources` blocks.

| Field | Source | License |
|---|---|---|
| `lines_ta` (Tamil couplet) | tk120404/thirukkural on GitHub, cross-checked against libkural 1.0.1 (PyPI, derived from Project Madurai) | Original text is public domain |
| `adhikaram`, `iyal`, `paal` (structure, names) | tk120404/thirukkural (`detail.json`) | Apache-2.0 repo; chapter names are part of the public-domain work |
| `translation_en` (verse) | G.U. Pope, Drew, Lazarus & Ellis, *Tirukkural: English Translation and Commentary* (W.H. Allen, 1886), as e-published by Project Madurai | Public domain; Project Madurai credit kept in the file |
| `explanation_en` (prose) | Same 1886 edition | Public domain |
| `meaning_ta` | All 1330 drafted (`meaning_ta_author: claude-draft`), **pending human review** | Project data license |

Spot-checked: English verse and prose match the Project Madurai e-text of the 1886 edition.

### Text quality report

| Status | Count | Meaning |
|---|---|---|
| `verified` | 1253 | Both copies agree (ignoring spacing and punctuation) |
| `corrected` | 52 | Fixed by hand, reason in `text_note` |
| `single_source` | 19 | Second copy is visibly corrupt there; first copy kept (each reviewed) |
| `needs_review` | 6 | **Confirm against a printed edition before release** (143, 165, 254, 330, 360, 650) |

The 48 word-level corrections were found while reading every kural to write its Tamil meaning; they are listed in `TEXT_FIXES` in the build script.

Both copies trace back to the same Project Madurai conversion from an old Tamil encoding (TSCII), which mapped some vowel signs to invalid code points. The build script fixes these deterministically (8 kurals) and fails if any invalid code point remains.

### English text repair (October 2026)

An external correction report (`thirukkural_correction_report.json`, 102 changes) found joined verse lines, doubled "?." punctuation, two truncated prose endings, and three chapter-title typos. All 102 are now produced by `build.py` itself, so they survive rebuilds:

- **Root causes fixed in the script:** tk120404 glued Pope's two verse lines together in about 250 kurals, and truncated some prose entries mid-sentence. The build now restores both from libkural (same 1886 edition, complete text with line breaks) whenever the wording matches. It only adds a final period after a letter or ")", never after "?" or "!".
- **Beyond the report:** 32 more truncated prose endings restored, and the verse line-join repaired in about 475 kurals, all from libkural's complete text.
- **Deliberate differences from the report:** kurals 31 and 37 keep the original "?" and "!" endings, which match the Project Madurai transcription.
- **Editorial items still open:** adhikaram 57's English title "Absence of Terrorism" (Pope's 19th-century wording for not ruling through fear) and review of all Tamil meanings.

### Excluded on purpose

⚠️ The tk120404 repo also contains modern commentaries (Mu. Varadarasanar, Solomon Pappaiah, M. Karunanidhi) and a modern English "Translation" field. **These are still under copyright in India and are never imported.** The repo's Apache label cannot license text its authors don't own.

Parimelalagar's commentary (13th century) is public domain, but it is in medieval Tamil and reads the Kural through a religious lens, which conflicts with this project's philosophy.

### Tamil meanings
- Written fresh by contributors, with `meaning_ta_author` and `meaning_ta_reviewed_by`.
- Rebuilding the dataset preserves existing meanings.
- The daily kural rotates only through kurals with a reviewed `meaning_ta`; until then the app can show the kural with its English rendering.

---

## 4. Cities and districts

| | |
|---|---|
| **Source** | GeoNames `cities15000` dump (download.geonames.org/export/dump/): name, lat/lon, **IANA timezone** |
| **License** | **CC BY 4.0. Attribution must be shown to app users** (Licenses screen), not only in the repo |
| **Tamil names** | GeoNames `alternateNames` (language `ta`) where available; fill gaps by hand with a source |
| **TN districts (38)** | Official list from tn.gov.in for district names in Tamil and English (needed later for FCM district topics) |
| **Plan** | Script to filter to India + major diaspora cities, output `data/cities.json` |

---

## 5. Commemoration days

Seeded in `data/commemorations.json` with **verified** entries only:

| Date | Entry | Source verified |
|---|---|---|
| 25 Jan | Tamil Language Martyrs' Day (official from 2025) | ✅ |
| 14 Apr | Dr. B.R. Ambedkar's birthday (TN "Day of Equality") | ✅ |
| 18 Jul | Tamil Nadu Day (1967 renaming resolution) | ✅ |
| 17 Sep | Thanthai Periyar's birthday (TN "Social Justice Day", declared 2021) | ✅ |
| 1 Nov | State formation day (1956); also observed as Tamil Nadu Day from 2026 | ✅ |
| 24 Dec | Thanthai Periyar's death anniversary | ✅ |

**Still to research and verify (each needs a source before merging):**
Bharathidasan (birth, death), Subramania Bharati (birth, death), C.N. Annadurai (birth, death), K. Kamaraj (birth, also "Kalvi Valarchi Naal"), V.O. Chidambaram Pillai, Iyothee Thass, Dr. Muthulakshmi Reddy, Tamil declared a classical language (2004), Thiruvalluvar statue at Kanyakumari (2000), major archaeological milestones (Keezhadi), scientists and educators from Tamil Nadu.

### Inclusion criteria (proposed)
1. Significant to Tamil society, language, social reform, science, or history.
2. Person has died (no living people), or the entry is an event.
3. Date verified by a primary source or a reputable news/reference source.
4. Description is neutral, one line, factual. No praise or attack language.
5. For deaths in difficult circumstances, describe the cause the person stood for, never how they died.

### Why the `designations` field exists
Official names for these days change with governments. Tamil Nadu Day moved to 1 November (2019), then to 18 July (2021), and since July 2026 both days are observed. So each entry records the **historical event** (stable) separately from **official designations** (dated, sourced). The app shows the designation only when it applies.

---

## 6. Licensing summary

| Dataset | Source license | Our redistribution |
|---|---|---|
| Holidays | Government facts | Project data license |
| Tamil month table | Generated by our scripts | Project data license |
| Gazette fixtures | Government publication, facts only | Project data license, with URL per entry |
| Kural text + PD English | Public domain | Project Madurai credit kept in `sources` |
| Tamil meanings | Written by contributors | Project data license (contributors agree in CONTRIBUTING.md) |
| Cities | GeoNames CC BY 4.0 | CC BY 4.0, **attribution in app** |
| Commemorations | Facts + our own descriptions | Project data license |

**Decision still needed:** the project data license (CC BY-SA 4.0 or CC0). It must be compatible with GeoNames CC BY 4.0 for `cities.json`.

---

## 7. Product decision this research surfaced

The official G.O. names **14 April** as "Tamil New Year's Day" (Chithirai 1), while the app defaults to Thai 1 as Tamil New Year.

Recommendation:
- Holiday entries always use the **official G.O. wording** (data accuracy).
- The Tamil New Year **setting** only affects the cultural label shown on Thai 1 vs Chithirai 1, never the holiday data.
- The About screen explains both positions neutrally.
