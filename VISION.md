# Naatkaati (நாட்காட்டி) — Project Vision

> Final name, confirmed October 2026.

## 1. One-line summary

An open-source, offline-first, **rational and secular Tamil calendar** for Android, focused on Tamil identity, practical daily use, and science, with **no astrology and no religious ritual content**.

## 2. Why this exists

Existing Tamil calendar apps are mostly ad-heavy, closed-source, and built around astrology (rahu kalam, nalla neram, horoscopes, muhurtham). Many people only need the Tamil date, holidays, and culturally meaningful days. This app serves them with a clean, fast, trustworthy tool that works without internet.

## 3. Core principles (non-negotiable)

1. **Rational and secular.** Present Tamil time-keeping as culture and astronomy, never as astrology or religious instruction.
2. **Tamil-first.** Tamil is the primary language of the UI and content. English is secondary.
3. **Offline-first.** Every core feature works with zero network. The network is only used to pull optional data updates.
4. **Open source and open data.** The code and all calendar data are public. Every data entry must cite a source.
5. **Privacy.** No accounts, no ads, no analytics that identify users, no tracking SDKs.
6. **Light and fast.** Must run well on low-end Android phones and low-bandwidth connections.
7. **Minimal.** Ship only the much-needed functions. Every new feature must justify itself.

## 4. Explicit non-goals (do NOT build)

AI agents and contributors must not add any of the following, even if requested in an issue, without a change to this document first:

- Rahu kalam, yamagandam, kuligai, nalla neram, gowri panchangam
- Horoscopes, rasi palan, daily predictions, compatibility (porutham)
- Muhurtham / auspicious dates for marriage, house-warming, etc.
- Tithi/nakshatra-based "good day / bad day" labels
- Ritual instructions, poojas, mantras, temple timings
- Ads, paid tiers, user accounts, social features

## 5. Target users

- Tamil speakers in Tamil Nadu and the diaspora who want the Tamil date and holiday info without astrology
- Office workers, students, and bank users who need to know closures
- People interested in Tamil language, literature, and history

## 6. V1 scope

| # | Feature | Description |
|---|---------|-------------|
| 1 | Tamil + Gregorian date | Show Tamil month, day, and Thiruvalluvar year (Gregorian + 31) alongside the English date |
| 2 | Month view | Calendar grid with both dates and markers for holidays and special days |
| 3 | Holidays | Tamil Nadu government holidays, central government holidays, bank holidays |
| 4 | Tamil cultural days | Pongal, Uzhavar Thirunal, Thiruvalluvar Day, Kaanum Pongal, Tamil New Year |
| 5 | Commemoration days | Birth/death anniversaries of thinkers and reformers, Tamil language and historical events (curated list) |
| 6 | Sky and science | Sunrise, sunset, moon phase, eclipse dates, computed on-device |
| 7 | Thirukkural of the day | One kural daily with a simple Tamil meaning |
| 8 | Home-screen widget | Today's Tamil date, any holiday, and the kural |
| 9 | Reminders | Local notifications for holidays and commemoration days the user selects |

### V1 settings

- Language: Tamil (default) / English
- Tamil New Year: **Thai 1 (default)** / Chithirai 1. This only changes the cultural label; holiday data always keeps the official G.O. wording (14 April is officially "Tamil New Year's Day").
- Location: for sunrise/sunset (default: Chennai; manual city pick, optional GPS)
- Holiday categories to show (state, central, bank)
- Appearance: system (default) / light / dark

## 7. Content policy

### Religious holidays
Religious festivals that are official holidays appear **only as holidays**, with name and holiday type. No ritual details, stories, or "how to celebrate" content.

### Commemoration days
An entry qualifies if the person or event is significant to Tamil society, language, social reform, science, or history. Each entry needs a name in Tamil and English, the date, a one-line neutral description, and a source.

### Images for special occasions
- Holidays, cultural days, and commemoration days may have an optional image.
- Allowed: public domain or openly licensed images (e.g. Wikimedia Commons with a compatible license), or original illustrations made for the project.
- Not allowed: copyrighted photos or portraits without permission, religious or devotional imagery, astrology imagery, ads or logos.
- Every image needs license, credit, and source fields, and the credit is shown in the app.
- The app must always look complete without images (a styled text card is the fallback).

### Thirukkural meanings
The kural text is public domain. **Meanings must be either written by the project or taken from a source that is verifiably public domain or openly licensed.** Do not copy copyrighted commentaries.

#### Unverified meanings: shown with a disclaimer, corrected through reports
- All Tamil meanings are currently AI drafts (`meaning_ta_author: "claude-draft"`). They **are shown in the app**, always with a visible label, because real readers find mistakes faster than a closed review.
- Any meaning without `meaning_ta_reviewed_by` shows this label directly under it (never hidden in a menu):
  - ta: "இந்த விளக்கம் இன்னும் சரிபார்க்கப்படவில்லை. பிழை இருந்தால் தெரிவியுங்கள்."
  - en: "This meaning has not been verified yet. Please report any mistake."
- Next to the label: a **"பிழையைத் தெரிவி / Report a mistake"** action. It opens a prefilled GitHub issue (template `kural-correction`) with the kural number, the field, and the app version filled in. No in-app tracking, no account inside the app.
- For users without a GitHub account, the same action offers a prefilled email to the project address as a fallback.
- When a reviewer confirms or fixes a meaning, they set `meaning_ta_reviewed_by` and the label disappears for that kural after the next data sync.
- The label also applies to the 6 kurals whose Tamil **text** is marked `needs_review`.
- Kurals with a `meaning_ta_note` (e.g. 37, which has two traditional readings) show the note when the meaning is expanded.

## 8. Calendar calculation

- The Tamil calendar is a **solar** calendar. A Tamil month begins when the sun enters the next sidereal rasi (sankranti).
- The rule for which civil day a month starts on (based on the time of sankranti relative to sunset) must be implemented exactly and documented.
- **Accuracy is the top technical priority.**
- The method used (ayanamsa, day-assignment rule, reference location) is stated in the app's About screen.

### 8.0 Approach: official-first precomputed month table

Tamil month boundaries change only about 12 times a year, so Tamil dates are **precomputed offline and shipped as data**, not calculated live in the app.

**Key finding (October 2026):** Tamil Nadu's official dates (TN Gazette headers, holiday G.O.s) follow the traditional **Vakya** panchangam, not modern astronomy. No single astronomical rule reproduces them: in 2022 the Drik ingress for Aavani was 07:23 IST and the Gazette started the month the same day, while for Purattasi it was 07:22 IST and the Gazette started the month the next day. Computed dates matched official dates in 7 of 9 checked months.

1. **Official data wins.** `tools/generate-tamil-months/fixtures/gazette.json` holds official dates from TN Gazette Part I headers (every Wednesday, e.g. "Aavani 1, Subakiruthu, Thiruvalluvar Aandu–2053") and holiday G.O.s. Each pins one month start. `fetch_gazette.py` harvests them; a monthly GitHub Action opens a PR with new ones.
2. **Computed baseline elsewhere.** For months without an official date: sidereal solar ingress (Lahiri, via `tamil-panchanga-calendar`), assigned to a civil day by the **sunset rule at Chennai** (sunset times from `kalagana`). These may differ from the official calendar by one day.
3. **Output:** `data/tamil-months.json`, 2,412 months (1900–2100), one per line:
   ```json
   {"start":"2026-01-15","month":10,"name_ta":"தை","name_en":"Thai","thiruvalluvar_year":2057,"tamil_year_cycle":39,"source":"gazette", ...}
   ```
   `source` is `gazette` (official) or `computed`. The file reports `official_agreement` (how often the computed rule matched official dates).
4. **Validation in CI:** the table must regenerate byte-for-byte from the fixtures; month lengths 29–32 days; month sequence unbroken; conflicting fixtures fail the build.
5. **In the app:** Tamil date = binary search on this table. Instant, offline, and identical in the app and the widget.
6. **Honesty in UI:** the About screen explains the method. Day cells show no per-day warning, but a Tamil-date correction is one tap away (Report a problem).
7. **Roadmap:** a Vakya implementation would make future years match official dates without waiting for the Gazette.

### 8.0.1 Year display
- The UI shows **only the Thiruvalluvar year** (e.g. திருவள்ளுவர் ஆண்டு 2057).
- The traditional 60-year cycle names (Pilava, Subakiruthu…) are kept in `tamil-months.json` **only for validation** against the TN Gazette and are never displayed.

### 8.0.2 What runs live on-device

Only general astronomy, via `astronomy-engine`: sunrise, sunset, moon phase, and eclipses for the selected location. No Tamil-specific logic runs live.

### 8.1 Date and timezone handling

- The Tamil date table is referenced to Chennai (IST), matching the official Tamil Nadu calendar. A given civil date maps to the same Tamil date everywhere.
- "Today" is derived from device time converted into the **selected location's timezone**, not blindly the device timezone. Sunrise, sunset, and moon times also use the selected location.
- On Android, the app checks whether **automatic date/time and automatic timezone** are enabled (`Settings.Global.AUTO_TIME` and `Settings.Global.AUTO_TIME_ZONE`, via a small Kotlin native module).
- If either is off, show a **non-blocking banner** explaining that dates may be wrong, with a button that opens the system date/time settings. Never block app usage.
- If device timezone and selected location timezone differ, show the location's date and indicate which location it is for.
- iOS has no public API for this setting; the check is skipped there.

## 9. Data architecture

No traditional backend and no database. All content is static, public, and the same for every user, so it lives as versioned JSON in the repository.

```
data/
  holidays/
    2026.json
    2027.json
  commemorations.json      # recurring, by month/day
  thirukkural.json         # 1330 kurals, structure, English renderings, Tamil meanings
  announcements.json       # in-app messages (see 9.4)
  manifest.json            # dataset list, versions, checksums
```

### 9.1 Data pipeline

1. **GitHub repo is the source of truth.** All content changes come in as pull requests.
2. **A GitHub Action validates every PR:** JSON schema, required `source` field on every entry, no duplicate `id`s, valid dates. Invalid data cannot be merged.
3. **On merge, an Action publishes** the `data/` files to static hosting (GitHub Pages or Firebase Hosting) and regenerates `manifest.json` with new versions and checksums.
4. **The app ships with bundled data,** so it works offline on first launch.
5. **When online, the app fetches only `manifest.json`,** compares versions, downloads only changed files, verifies checksums, and stores them in MMKV. A failed or partial download never replaces working data.

### 9.2 Extensibility (content-driven, not hardcoded)

New content must be addable without a Play Store release.

- `manifest.json` lists datasets generically. Adding a new dataset is a new manifest entry, not a code change.
- All dated content shares a common base shape: `id`, `date` (or `month` + `day` for recurring), `name_ta`, `name_en`, `category`, `source`. The UI renders any category that fits this shape.
- A dataset that needs a genuinely new screen declares `min_app_version`. Older apps ignore it instead of breaking.

```json
{
  "schema_version": 1,
  "datasets": [
    { "name": "holidays-2026", "url": "holidays/2026.json", "version": 3, "sha256": "...", "min_app_version": "1.0.0" },
    { "name": "commemorations", "url": "commemorations.json", "version": 5, "sha256": "...", "min_app_version": "1.0.0" },
    { "name": "announcements", "url": "announcements.json", "version": 1, "sha256": "...", "min_app_version": "1.1.0" }
  ]
}
```

### 9.2.1 Images

Images are **not bundled** in the APK, to keep the app small. They are downloaded on demand and cached.

```
data/
  images/
    pongal-2026.webp
    periyar.webp
```

Entries reference images with an optional `image` object:

```json
"image": {
  "url": "images/periyar.webp",
  "sha256": "...",
  "license": "CC BY-SA 4.0",
  "credit": "Author name",
  "source": "https://commons.wikimedia.org/..."
}
```

- Format: WebP, max width 1080 px, max 150 KB per image. The GitHub Action rejects images over the limit or entries missing `license`, `credit`, or `source`.
- Download only when the occasion is near (e.g. within 7 days) or when the user opens it, and only on Wi-Fi if the user enables "save data".
- Cache with a size cap; evict old images first.
- Offline or missing image: show the styled text card fallback.

### 9.3 When Firebase is allowed

Firebase is **not** used for content storage. It may be added only for a specific feature that genuinely needs a live backend:

- **FCM push notifications** (planned, see Section 12).
- Future features with user-created data, large queryable data, or real-time content, if they are ever added to this document.

Firebase Analytics and Firebase In-App Messaging are not used, as they conflict with the privacy principle. Crashlytics, if added, must be opt-in.

### 9.4 In-app messages

In-app messages flow through the same validated pipeline, not through a third-party service.

```json
{
  "id": "2026-11-data-update",
  "message_ta": "...",
  "message_en": "...",
  "start_date": "2026-11-01",
  "end_date": "2026-11-15",
  "min_app_version": "1.1.0",
  "source": "maintainer"
}
```

- The app shows active messages (between `start_date` and `end_date`) as a dismissible banner.
- Dismissed message `id`s are stored in MMKV and never shown again.
- Messages must follow the content policy in Section 7: informational only, no promotions or ads.

### 9.5 Push notifications

- Delivered via **FCM topics**, so no user accounts or personal identifiers are needed.
- Topics per district (e.g. `district-chennai`), chosen by the user in settings, plus a general `all` topic.
- A push is only a **signal to refresh**. It triggers a manifest check; the actual content always comes from the validated data pipeline.
- Main use case: sudden holiday declarations, such as district-wise rain holidays.
- Local reminders (holidays, commemorations) remain on-device local notifications and never need FCM.

### Example: holiday entry

```json
{
  "id": "tn-2026-pongal",
  "date": "2026-01-15",
  "name_ta": "பொங்கல்",
  "name_en": "Pongal",
  "applies_to": ["state_govt", "banks"],
  "category": "cultural",
  "source": "TN G.O.(Ms.) No. 708, dated 11-11-2025",
  "source_url": "https://..."
}
```

`applies_to`: any of `state_govt` | `central_govt` | `banks`
`category`: `cultural` | `national` | `religious_holiday` | `other`

- Holiday names follow the **official order's wording** exactly.
- Weekends are rule-based and computed in-app, never stored: Sundays and 2nd/4th Saturdays for banks; all Saturdays and Sundays for TN state offices (per the yearly G.O.).
- Sources and licensing for every dataset are tracked in `DATA_SOURCES.md`.

### Example: commemoration entry

```json
{
  "id": "periyar-birth",
  "month": 9,
  "day": 17,
  "name_ta": "தந்தை பெரியார் பிறந்தநாள்",
  "name_en": "Periyar's Birth Anniversary",
  "kind": "birth",
  "description_ta": "...",
  "description_en": "...",
  "designations": [
    { "name_ta": "சமூக நீதி நாள்", "name_en": "Social Justice Day", "declared": "2021-09-06", "source_url": "https://..." }
  ],
  "source": "...",
  "source_url": "https://..."
}
```

`designations` records official names given to a day by governments, each dated and sourced, kept separate from the historical event because they change over time.

## 10. Tech stack and conventions

- **Expo** (SDK 56 or later, required for stable Expo UI) with TypeScript, using a **dev build via EAS** (required for MMKV, the widget, and the local native module). Expo Go is not supported.
- Install all packages with `npx expo install` so versions match the SDK.
- Folder convention: thin Expo Router `app/` shell, all code in `src/` with `src/features/{name}/Screen.tsx` + `useScreen.ts` pairs. The full tree and rules are in `CLAUDE.md` Section 3.
- The calendar module (Tamil date lookup + astronomy helpers) is **pure TypeScript** with no React dependency, fully unit-tested, and shared by the app and the widget.

### 10.1 Packages

**Core and app structure**

| Package | Purpose |
|---|---|
| `expo`, `expo-dev-client` | Base framework and dev build |
| `expo-router` | Navigation |
| `@reduxjs/toolkit` + `react-redux` | State slices; RTK Query for `manifest.json` and dataset fetching |
| `react-native-mmkv` + `react-native-nitro-modules` | Settings, downloaded data, dismissed announcements (nitro-modules is a required peer of MMKV v4) |
| `zod` | Runtime validation of downloaded JSON; same schemas reused in CI |

**Calendar and dates**

| Package | Purpose |
|---|---|
| `data/tamil-months.json` (own dataset, Section 8.0) | Tamil date lookup by binary search |
| `astronomy-engine` | Sunrise, sunset, moon phase, eclipses (on-device) |
| `date-fns` + `@date-fns/tz` | Date maths and location-timezone handling |

**UI**

| Package | Purpose |
|---|---|
| `@expo/ui` | Native system controls: Jetpack Compose on Android, SwiftUI on iOS (stable since SDK 56). See §10.8 for what uses it |
| Custom month grid (no library) | Tamil + English dates per cell, kept light |
| `@shopify/flash-list` | Holiday, commemoration, and kural lists |
| `@expo-google-fonts/catamaran` + `@expo-google-fonts/noto-sans-tamil` + `expo-font` | Catamaran for display/headings, Noto Sans Tamil for body |
| `i18next` + `react-i18next` | Tamil-first UI strings |
| `expo-image` | Occasion images with disk caching and WebP |

**Device and system**

| Package | Purpose |
|---|---|
| `expo-localization` | Device timezone and locale |
| `expo-location` | Optional GPS city detection (bundled city list is primary) |
| `expo-notifications` | Local reminders |
| `expo-intent-launcher` | Opens Android date/time settings from the timezone banner |
| Local Expo module, Kotlin (`npx create-expo-module --local`) | Reads `AUTO_TIME` / `AUTO_TIME_ZONE` |
| `react-native-android-widget` | Android home-screen widget; runs JS, so it reuses the calendar module |

**Data sync**

| Package | Purpose |
|---|---|
| `expo-file-system` | Downloading and storing datasets and images |
| `expo-crypto` | SHA-256 checksum verification |
| `expo-network` | Wi-Fi detection for "save data" |
| `expo-background-task` | Periodic background manifest check |

**Roadmap only (not in V1)**

| Package | Purpose |
|---|---|
| `react-native-view-shot` + `expo-sharing` | Shareable occasion cards |
| `@react-native-firebase/app` + `@react-native-firebase/messaging` | FCM district topics (`expo-notifications` cannot subscribe to topics) |
| `expo-widgets` | iOS widget for the future iOS build (iOS-only, renders SwiftUI via `@expo/ui`) |

**Tooling and testing**

| Package | Purpose |
|---|---|
| `typescript`, `eslint`, `prettier` | Code quality |
| `jest` + `jest-expo` | Unit tests, especially Tamil date lookup at every month boundary |
| `@testing-library/react-native` | Component tests |
| Python: `tamil-panchanga-calendar`, `kalagana`, `pypdf` | Tamil month generator (sidereal ingress, Chennai sunset) and Gazette fixture harvesting; never shipped in the app |

### 10.2 Open decisions (to confirm before coding)

- Verify `react-native-android-widget` and `react-native-mmkv` support the chosen Expo SDK and New Architecture. Alternative for widgets: Voltra (JSX to Glance/SwiftUI, one codebase for both platforms).

### 10.3 Theming

Design tokens live in `src/constants/Colors.ts` and `src/constants/Theme.ts`.

- **Palette, "Sky and soil":** Iravu night indigo (brand), Manjal turmeric (today, the only bright highlight), Sembaruthi hibiscus red (holidays and Sundays), Nel paddy green (cultural days), Kolam white (light background), Mai ink (text).
- Light and dark themes; dark mode is an indigo night sky, not neutral black.
- **Type:** Catamaran for display and headings (the big Tamil date is the app's signature element), Noto Sans Tamil for body text.
- All text/background pairs meet WCAG AA. Tamil line heights stay at ~1.5x font size.
- Calendar meaning is never conveyed by color alone; every marker also has a label or icon.

### 10.4 App identity and project setup

- **Name:** Naatkaati (நாட்காட்டி). **Android package / iOS bundle ID:** `com.nalindev.naatkaati`. Check Play Store for name conflicts before first release.
- **Node:** version pinned in `.nvmrc` (24 LTS). **Package manager:** npm.
- **Path alias:** `@/` → `src/` (configure `tsconfig.json` `paths` and `babel-plugin-module-resolver`). Imports never use long relative paths like `../../../`.
- **Git hooks:** Husky + lint-staged run eslint/prettier on staged files. **Commits:** Conventional Commits (`feat:`, `fix:`, `data:`, `docs:`, `chore:`, `test:`).
- **Licenses:** code **GPL-3.0-or-later** (`/LICENSE`, `package.json` `"license": "GPL-3.0-or-later"`); data **CC BY-SA 4.0** (`data/LICENSE`). See `CONTRIBUTING.md`.

### 10.5 Android platform rules

- **Notification permission (Android 13+):** request only when the user sets their first reminder, with a short explanation. Never on first launch. If denied, reminders show as disabled with a way to re-enable.
- **No exact alarms:** day-level reminders use inexact scheduling (`expo-notifications` date triggers). Never request `SCHEDULE_EXACT_ALARM` or `USE_EXACT_ALARM`.
- **Widget refresh:** Android's minimum widget update period is 30 minutes, so explicitly schedule a widget update at local midnight, and also on time, timezone, and date changes. The widget must never show yesterday's date.
- **Backup:** Android Auto Backup includes settings (MMKV settings store) but excludes downloaded datasets and the image cache. They are re-downloadable and would waste the user's backup quota.
- **Target SDK:** follow the current Play Store minimum target API level at release time.

### 10.6 First launch and settings

- **Onboarding (3 screens max, skippable):** language (Tamil/English) → city or district (manual list first, GPS optional) → appearance (system/light/dark). The district is stored for future FCM topics.
- **Settings:** language, Tamil New Year label (Thai 1 / Chithirai 1), location, holiday categories, appearance, **numerals** (Arabic 1 2 3 by default, optional Tamil numerals ௧ ௨ ௩), reminders, data saver, Licenses, About, Report a problem.
- **Tamil numerals** apply to the Tamil date display only; Gregorian dates stay in Arabic numerals.

### 10.7 Release and privacy

- **Privacy policy:** `PRIVACY.md`, published on GitHub Pages and linked in the Play listing and the About screen. It must stay true: no accounts, no analytics, no ads; location stays on device; data downloads contain no user identifiers.
- **Play Data Safety:** "No data collected" while the app has no FCM and uses location only on-device. **Re-check the answers when FCM or Crashlytics are added.**
- **Signing:** EAS-managed credentials with Play App Signing. Back up the upload keystore and credentials to two separate secure places.
- **Updates:** **store releases only for V1, no EAS Update (OTA).** Content already updates through the data pipeline; OTA adds a third-party update server and complexity. Revisit after V1.
- **Bug reports without tracking:** Settings → "Report a problem" opens a prefilled GitHub issue (bug-report template, with app version and Android version), with a prefilled email fallback. No crash SDK in V1.
- **Accessibility:** test TalkBack with Tamil text before every release; Tamil screen-reader support varies by device and TTS engine.

### 10.8 Native UI with Expo UI

Use the platform's own UI for **system controls**, and our own design for **brand surfaces**.

| Use | Where | How |
|---|---|---|
| **Expo UI, universal import** (`@expo/ui`) | Settings rows, toggles, pickers (language, city, appearance, numerals), date picker, bottom sheets, context menus, text input, onboarding choices | Default choice. One import, Compose on Android, SwiftUI on iOS |
| **Expo UI, platform import** (`@expo/ui/jetpack-compose`, `@expo/ui/swift-ui`) | Only when the universal layer lacks a component or modifier | In platform files: `Name.android.tsx` / `Name.ios.tsx`, same props on both |
| **Custom React Native** (`StyleSheet` + `src/constants/` tokens) | Today hero (big Tamil date), month grid and day cells, kural card, occasion cards, banners, widget | These carry the "Sky and soil" identity and must look the same on both platforms |

Rules:
- Expo UI content always sits inside its `Host` component; RN content inside Expo UI goes through `RNHostView`.
- Pass our theme colors to Expo UI components where they accept colors (accent = `primary`); otherwise accept the platform look for system controls.
- Native controls use the system font. Verify Tamil renders correctly in every Expo UI control on a real Android device and an iPhone; Tamil text inside brand surfaces always uses our `Typography` tokens.
- The Android widget stays on `react-native-android-widget` for V1. The future iOS widget uses `expo-widgets` with `@expo/ui/swift-ui`.

## 11. Quality bar

- Cold start under 2 seconds on a low-end Android device
- Fully functional in airplane mode
- APK size kept small; no heavy dependencies without justification
- Tamil text renders correctly at all font scales
- Accessible: screen-reader labels, sufficient contrast

## 12. Roadmap after V1

- In-app messages via `announcements.json` (Section 9.4)
- FCM push notifications by district topic for sudden holiday declarations (Section 9.5)
- Shareable occasion cards: generated on-device from the occasion image (or text-card fallback), Tamil date, and kural, sized for WhatsApp/status sharing. Image credit and a small app mark included; no tracking links.
- Vakya panchangam implementation, so future years match official dates before the Gazette publishes them
- Agricultural season markers (pattam)
- School exam and holiday calendars
- ICS feed for Google Calendar subscription
- iOS build

## 13. Rules for AI agents and contributors

1. Read this file before making changes. If a request conflicts with it, stop and flag the conflict.
2. Never add anything listed in Section 4.
3. Never add data without a `source`.
4. Keep the calendar module pure, typed, and covered by tests.
5. Never hand-edit `data/tamil-months.json`. Change the generator or its fixtures and regenerate.
6. Prefer the smallest change that delivers the feature.
7. Write user-facing text in Tamil first, then English.

## 14. Decisions log

| Date | Decision |
|---|---|
| 2026-10 | App name: **Naatkaati (நாட்காட்டி)** |
| 2026-10 | UI shows only the Thiruvalluvar year; 60-year cycle names are validation-only data |
| 2026-10 | Adhikaram 57 keeps Pope's English title "Absence of Terrorism"; revisit only if users report it as confusing |
| 2026-10 | Tamil meanings ship as unverified drafts with a visible label and a report action |
| 2026-10 | Code license: **GPL-3.0-or-later** |
| 2026-10 | Data license: **CC BY-SA 4.0** (GeoNames material stays CC BY 4.0 with attribution) |
| 2026-10 | Tamil dates are official-first: TN Gazette/G.O. dates override computed ones |
| 2026-10 | V1 ships through store releases only (no OTA); no crash SDK |
| 2026-10 | Expo UI for native system controls (SDK 56+); custom RN for brand surfaces |
