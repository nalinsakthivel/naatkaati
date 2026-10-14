# Contributing to Naatkaati (நாட்காட்டி)

நன்றி! Thank you for helping build an open, rational Tamil calendar. You don't need to be a developer to contribute.

Before anything else, read [`VISION.md`](./VISION.md). It defines what this app is, and just as importantly, what it will never include (no astrology, no ads, no tracking).

## Ways to help

### 1. Report a mistake (no coding)
Use the issue templates:
- **Kural correction:** wrong Tamil meaning, kural text, or English rendering
- **Holiday / date correction:** wrong or missing holiday, wrong Tamil date
- **Commemoration suggestion:** a day that matters to Tamil society
- **Bug report:** something broken in the app

### 2. Review Thirukkural meanings (Tamil readers)
All 1330 Tamil meanings are first drafts. To review an adhikaram (10 kurals):
1. Comment on the review tracking issue to claim an adhikaram.
2. Read each kural and its `meaning_ta` in `data/thirukkural.json`.
3. Open a PR that fixes any meaning and sets `"meaning_ta_reviewed_by": "<your GitHub username>"` on every kural you checked.
4. Write meanings in your own words. **Never copy modern commentaries** (Mu. Varadarasanar, M. Karunanidhi, Solomon Pappaiah, etc.); they are copyrighted.

### 3. Improve data
- Every entry needs a `source` (a G.O., Gazette issue, official site, or reliable reference) and, where possible, a `source_url`.
- Never edit `data/tamil-months.json` by hand. Add official dates to `tools/generate-tamil-months/fixtures/gazette.json` and re-run the generator.
- Never edit `data/thirukkural.json`'s Tamil text by hand. Corrections go into `tools/build-thirukkural/build.py` (`TEXT_FIXES`) and the file is rebuilt.
- Images must be public domain, openly licensed, or your own work, with `license`, `credit`, and `source`.

### 4. Write code
1. Read [`CLAUDE.md`](./CLAUDE.md) for structure, style, and testing rules. They apply to humans too.
2. Open an issue before large changes.
3. Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `data:`, `docs:`, `chore:`, `test:`.
4. Make sure `npx tsc --noEmit`, `npm run lint`, and `npm test` pass.

## Licensing of contributions
By submitting a contribution you agree that:
- **Code** you contribute is licensed under **GPL-3.0-or-later**, the project's code license.
- **Data and text** you contribute (anything in `data/`, including Tamil meanings) is licensed under **CC BY-SA 4.0**, the project's data license.
- You have the right to submit it: it is your own work, public domain, or under a compatible license that you state in the PR.

## Code of conduct
Be respectful. See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
