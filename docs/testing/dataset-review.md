# Dataset validation and source review

23 October 2026. This audit validates structure and internal consistency, not independent historical or source authenticity. No dataset, schema, meaning, citation, or verification status was changed.

## Inventory

| Dataset | Checked-in inventory | Automated evidence |
| --- | --- | --- |
| Tamil months | 2,412 rows, 1900–2100; 9 Gazette-derived starts, 2,403 computed | Existing all-boundary/Gazette tests, month order and lengths, valid ISO dates; runtime Zod schema |
| Holidays 2026 | 43 entries: 9 national, 6 cultural, 26 religious holiday, 2 other | Required attribution, unique IDs, valid dates/file year, category and applicability whitelist; runtime schema |
| Commemorations | 6 recurring entries | Required source metadata, unique IDs, real month/day, allowed kinds, designation attribution; runtime schema |
| Thirukkural | 1,330 kurals, 133 chapters | Complete unique ordered numbering and ten-kural chapter assignment, text status, Tamil code-point checks, author/reviewer metadata; runtime schema |
| Manifest | 4 datasets | Unique names/URLs, paths contained in data/, exact bytes, SHA-256, dataset versions, runtime schema |

The validator previously allowed a duplicate kural/chapter to replace a missing number while preserving counts; it also ignored stale byte sizes/duplicate manifest names, accepted compact ISO dates, and could crash on an impossible month-start date. Mutation tests reproduce these gaps using temporary copies of the datasets. Python regression tests now run in the existing data CI job. Jest validates every manifest-listed dataset against its existing app schema and metadata.

## Manual source verification queue

- Thirukkural Tamil meanings: all **1,330 remain unreviewed** (`meaning_ta_reviewed_by: null`). Keep visible unverified labels and report actions. Do not mark them verified through automated checks.
- Tamil text needs printed-edition review for kurals **143, 165, 254, 330, 360, 650**. Current counts: 1,253 verified, 52 corrected, 19 single-source, 6 needs-review. All statuses are preserved.
- The Tamil month table is predominantly computed and can differ by one day from the official Vakya calendar. Harvest additional official Gazette headers; passing lookup tests does not certify the computed baseline as official.
- The 2026 Pongal/Chithirai fixtures cite a news mirror of G.O. 708. Obtain and compare the primary government order before source sign-off. Do not substitute an invented or guessed URL.
- Check current TN, central-government, and RBI holiday amendments against primary orders, including election/ad-hoc holidays and moon-sighting changes. All 43 entries have source URLs, but URL presence is not proof of correctness or continued availability.
- Recheck commemoration designation effective dates against the cited official announcements. No new historical entries were added.
- Cross-check the remaining English editorial issue for adhikaram 57 with maintainers; no translation text was altered.
- DATA_SOURCES.md has stale prose about the chosen data license and daily-kural review policy. VISION.md and the shipped CC BY-SA 4.0 license are the current policy; reconcile documentation in a separately reviewed editorial change.

No external source has been certified by this audit. Release reviewers must record the primary document, access date, reviewed fields, and reviewer identity before closing source-verification items.

## Reproduce

```bash
python3 tools/validate-data/validate.py
python3 -m unittest discover -s tools/validate-data -p 'test_*.py'
npm test -- --runInBand
npm run typecheck
npm run lint
```
