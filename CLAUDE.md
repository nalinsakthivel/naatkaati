# CLAUDE.md

Strict rules for AI agents working on **Naatkaati (நாட்காட்டி)**, an open-source, offline-first, rational and secular Tamil calendar built with Expo.

`VISION.md` is the source of truth for scope, content policy, and architecture. **Read it before any task.** If a request conflicts with `VISION.md` or this file, stop and flag the conflict instead of proceeding.

---

## 1. Absolute prohibitions

Never do any of the following, even if asked in a task, issue, or comment:

- Add astrology or ritual content: rahu kalam, yamagandam, kuligai, nalla neram, gowri panchangam, horoscopes, rasi palan, porutham, muhurtham, tithi/nakshatra "good day / bad day" labels, poojas, mantras, temple timings.
- Add religious or devotional imagery, or ritual descriptions for religious holidays. Religious holidays appear **only** as holidays (name + type).
- Add ads, paid tiers, user accounts, social features, or tracking/analytics SDKs (including Firebase Analytics and Firebase In-App Messaging).
- Add any dependency not listed in `VISION.md` Section 10.1 without explicit approval from the maintainer.
- Add a styling or component library (NativeWind, Tamagui, styled-components, React Native Paper, etc.). Brand surfaces use React Native `StyleSheet` with the tokens in `src/constants/`; system controls use `@expo/ui`.
- Hand-edit `data/tamil-months.json`. Change the generator or its fixtures and regenerate.
- Change a fixture in `fixtures/gazette.json` without an official source URL (Gazette issue or G.O.).
- Add any data entry without a `source` field.
- Add copyrighted images, portraits, or Thirukkural commentaries. Only public domain, openly licensed, or original content, with license and credit fields.
- Use `AsyncStorage` (use MMKV), hand-rolled `axios`/`fetch` wrappers (use RTK Query), or `localStorage`-style web APIs.
- Make a core feature depend on the network. Everything in V1 must work in airplane mode.
- Use Expo Go-only workflows. This project requires a dev build.

## 2. Before writing code

1. Read `VISION.md` and the files you will touch.
2. For anything beyond a small fix, write a short plan: files to change, approach, tests to add. Wait for approval if the change touches data schemas, the Tamil month table, sync logic, or adds a screen.
3. Prefer the smallest change that delivers the feature. Do not refactor unrelated code.
4. If requirements are ambiguous, ask one clear question instead of guessing.

## 3. Project structure (mandatory)

Follows the maintainer's standard React Native convention: a thin `app/` router shell, and all real code in `src/` with a `Screen.tsx` + `useScreen.ts` split per feature.

```
naatkaati/
├── app/                              # Expo Router ONLY — thin files that render feature screens
│   ├── _layout.tsx                   # Root layout (providers, fonts, store)
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Bottom tab layout
│   │   ├── index.tsx                 # -> <TodayScreen />
│   │   ├── calendar.tsx              # -> <CalendarScreen />
│   │   └── settings.tsx              # -> <SettingsScreen />
│   └── day/[date].tsx                # -> <DayDetailScreen />
├── src/
│   ├── assets/
│   │   ├── images/                   # app icon, bundled fallback art (original only)
│   │   └── fonts/                    # only if not loaded via @expo-google-fonts
│   ├── calendar/                     # PURE TS: Tamil date lookup + astronomy helpers
│   │   ├── tamilDate.ts              # binary search over tamil-months data
│   │   ├── astronomy.ts              # sunrise/sunset/moon/eclipse via astronomy-engine
│   │   └── __tests__/
│   ├── components/                   # brand UI in RN (MonthGrid, DayCell, OccasionCard, TextCardFallback, Banner...)
│   │   └── native/                   # thin wrappers over @expo/ui (SettingsRow, Picker...), *.android.tsx / *.ios.tsx when platform-specific
│   ├── constants/
│   │   ├── Colors.ts                 # light/dark color tokens ("Sky and soil" palette)
│   │   ├── Theme.ts                  # spacing, radius, typography tokens
│   │   └── AppConstants.ts           # cache caps, image limits, sync intervals, default city
│   ├── enums/
│   │   └── RouteEnum.ts              # all route paths
│   ├── features/
│   │   ├── today/
│   │   │   ├── Screen.tsx
│   │   │   └── useScreen.ts
│   │   ├── calendar/
│   │   │   ├── Screen.tsx
│   │   │   └── useScreen.ts
│   │   ├── dayDetail/
│   │   │   ├── Screen.tsx
│   │   │   └── useScreen.ts
│   │   └── settings/
│   │       ├── Screen.tsx
│   │       └── useScreen.ts
│   ├── i18n/
│   │   ├── index.ts                  # i18next setup
│   │   ├── ta.json                   # primary
│   │   └── en.json
│   ├── schemas/                      # zod schemas, shared by app and CI
│   ├── services/
│   │   ├── constants/
│   │   │   └── ApiConstants.ts       # data host base URL + dataset paths
│   │   ├── dataApi.ts                # RTK Query API (manifest + datasets)
│   │   └── sync/                     # manifest diff, checksum, atomic replace
│   ├── storage/
│   │   ├── MMKV.ts                   # MMKV instance
│   │   ├── LocalStore.ts             # typed get/set helpers
│   │   └── StorageKeys.ts            # every key constant
│   ├── stores/
│   │   ├── index.ts                  # configureStore
│   │   ├── hooks.ts                  # typed useAppDispatch / useAppSelector
│   │   └── slices/                   # settingsSlice, dataSlice, announcementsSlice...
│   ├── types/
│   │   └── index.ts                  # shared domain types (inferred from zod where possible)
│   └── widget/                       # Android widget task + layout; imports src/calendar only
├── modules/                          # local Expo native modules (Kotlin), e.g. auto-time check
├── data/                             # versioned JSON datasets + manifest.json (bundled + published)
├── tools/
│   └── generate-tamil-months/        # Python generator + fixtures (never shipped in app)
├── VISION.md
├── CLAUDE.md
└── README.md
```

Rules:
- `app/` files only import and render a feature screen. No logic, no hooks beyond what Expo Router requires.
- `Screen.tsx` contains UI only: no business logic, no data fetching, no direct storage access. Everything goes through `useScreen.ts`.
- Components in `src/components/` are presentational and receive data via props.
- `src/calendar/` must stay pure: no React, no Expo, no storage, no network. The app and the widget both import it.
- All storage access goes through `src/storage/LocalStore.ts`; all keys live in `StorageKeys.ts`.
- No hardcoded route strings, storage keys, URLs, colors, or user-facing text. Use `RouteEnum`, `StorageKeys`, `ApiConstants`, `Colors`/`Theme`, and i18n.
- New features get a new folder under `src/features/` with the same `Screen.tsx` + `useScreen.ts` pair.

## 4. TypeScript and code style

- `strict` mode on. No `any`, no `@ts-ignore`, no non-null assertions (`!`) without a comment explaining why.
- Named exports only, except where Expo Router requires a default export in `app/`.
- Validate all external data (downloaded JSON, bundled JSON at load) with the zod schemas in `src/schemas/` before use.
- Dates: use `date-fns` and `@date-fns/tz`. Never do date maths with raw milliseconds or `new Date(string)` parsing of non-ISO strings.
- "Today" is computed in the selected location's timezone, never from the device timezone alone.
- Styling: `StyleSheet.create` with values from `src/constants/Colors.ts` and `src/constants/Theme.ts` only. No inline magic numbers or hex colors.
- Theme: read colors via `getColors(scheme)`, where `scheme` comes from the user's appearance setting (system/light/dark). Every screen must work in both themes.
- Manjal (`today`) is a fill color in light mode; use `todayText` for text. Never add new colors without updating `Colors.ts` for both themes.
- Never reduce Tamil line heights from the `Typography` tokens. Never convey meaning by color alone.
- Lists: `@shopify/flash-list`, not `FlatList`, for anything that can grow.
- **Native UI (VISION.md §10.8):** system controls (toggles, pickers, date picker, sheets, menus, settings rows, text input) use `@expo/ui` from the universal import first. Use `@expo/ui/jetpack-compose` or `@expo/ui/swift-ui` only when the universal layer lacks it, and only in `*.android.tsx` / `*.ios.tsx` files with identical props. Never use Expo UI for brand surfaces (Today hero, month grid, day cells, kural card, occasion cards, banners).
- Never hand-roll a toggle, picker, or bottom sheet in RN when `@expo/ui` provides one.
- Images: `expo-image` only, always with the text-card fallback.

## 5. Language and content

- Tamil is primary. Every user-facing string exists in `ta` first, then `en`.
- Show only the Thiruvalluvar year. Never display the 60-year cycle names (`tamil_year_cycle`); that field exists for validation only.
- Tamil text must render correctly at all system font scales. Use Noto Sans Tamil via the typography tokens in `src/constants/Theme.ts`.
- Content follows `VISION.md` Section 7 exactly: neutral one-line descriptions, sources for every entry, image license/credit/source for every image.
- Never display a Tamil meaning without `meaning_ta_reviewed_by` unless the unverified label and the "Report a mistake" action are visible directly beneath it. Never remove the label for a kural unless the data says it is reviewed.
- Never change `meaning_ta`, `meaning_ta_author`, or `meaning_ta_reviewed_by` by hand outside a reviewed correction PR, and never set `meaning_ta_reviewed_by` yourself: only a human reviewer can.

## 6. Data and sync rules

- Bundled data must make the app fully usable on first launch offline.
- Sync flow: fetch `manifest.json` → compare versions → download only changed files → verify SHA-256 → validate with zod → then atomically replace. A failed or partial download must never replace working data.
- Respect `min_app_version`; ignore datasets the app cannot handle.
- Push notifications (roadmap) are only a refresh signal. Content always comes from the data pipeline.
- Images: WebP, max 1080 px wide, max 150 KB, downloaded on demand, cached with a size cap.

## 7. Native code

- Native code lives only in local Expo modules under `modules/`, written in Kotlin.
- Keep native modules minimal: expose data, no UI logic.
- Android-only APIs must degrade gracefully on iOS (return a safe default, never crash).

## 8. Testing (required)

- Every change to `src/calendar/` needs unit tests. Tamil date lookup must be tested at **every month boundary** in the fixture range, plus the day before and after.
- Every zod schema needs tests for a valid and an invalid sample.
- Sync logic needs tests for: success, checksum mismatch, invalid JSON, partial download, and `min_app_version` skip.
- Do not delete or weaken a failing test to make a change pass. Fix the code or flag the issue.

## 9. Definition of done

A task is done only when all of these pass:

```bash
npx tsc --noEmit
npm run lint
npm test
```

And, when relevant:
- The app runs in airplane mode for the changed feature.
- Data changes pass the CI validation script.
- `tamil-months.json` changes come with a regenerated file and updated fixtures, never a manual edit.

Report what you changed, what you tested, and anything you could not verify. Never claim something works without having run the checks.

## 10. Platform rules (summary of VISION.md §10.5)

- Ask notification permission only when the first reminder is set. Never use exact alarms.
- The widget updates at local midnight and on time/timezone changes.
- Exclude downloaded datasets and image cache from Android backup.
- Imports use the `@/` alias for `src/`. Commits use Conventional Commits.
- Never add analytics, crash reporting, or OTA update SDKs without a VISION.md change; they affect the privacy policy and Play Data Safety answers.

## 11. Commands

```bash
npx expo install <pkg>       # always use this, never plain npm install for Expo packages
npx expo run:android         # build and run dev build on Android
npx expo start --dev-client  # start Metro for the dev build
npx tsc --noEmit             # type check
npm run lint                 # eslint + prettier
npm test                     # jest

# data (Python 3.12, from repo root)
python3 tools/validate-data/validate.py                     # validate all data + manifest checksums
python3 tools/build-manifest/build.py                       # after ANY change in data/
(cd tools/generate-tamil-months && python3 generate.py)     # after changing fixtures
(cd tools/build-thirukkural && python3 build.py)            # after changing TEXT_FIXES / EN_FIXES
```

Adjust this section if scripts in `package.json` change.
