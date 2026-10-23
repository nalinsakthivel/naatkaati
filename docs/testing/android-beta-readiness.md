# Android beta readiness

23 October 2026. **Not ready for beta sign-off.** This report audits `dev` at `107ac7e` and the Task 6 configuration changes. Tasks 3, 4, and 5 are separate, independently based branches awaiting review; their fixes are not assumed merged or validated together.

## Evidence from the cloud

| Check | Result |
| --- | --- |
| Jest / TypeScript / formatting / data | 23 suites, 169 tests passed on this branch; typecheck, lint, and Python data validation passed. |
| Android production JS export | Passed: 2,030 modules, a nonempty Hermes bundle (about 5.7 MB), and 46 nonempty asset records. This is not an APK/AAB or native build. |
| Expo config introspection | Passed. Package `com.nalindev.naatkaati`, version `1.0.0`, Android/iOS only. Exact-alarm permissions carry removal directives. This inspects config-plugin output, not Gradle's final merged manifest. |
| Expo Doctor 1.21.5 | **18/21 passed.** A real Metro runtime peer mismatch plus two failed external checks; details below. |
| Expo install --check | Online check blocked by HTTP proxy 403. Offline fallback says up to date but explicitly warns it is unreliable. Full compatibility is not established. |
| EAS profiles | Added development client, internal preview APK, and production AAB profiles, with Node 24.19.0/pnpm 11.25.0. Validated with the official `@expo/eas-json` 25.3.0 schema. No signing, upload, or build performed. |
| Icon/splash sources | Source PNGs open successfully. App icon is 1024×1024 RGB; splash 1024×1024 RGBA; adaptive foreground/background 512×512; monochrome 432×432. Source images visually reviewed; native masks/cropping/dark-launch behavior untested. |
| Offline-first architecture | Bundled data and fonts are present; schema/calendar/sync tests pass. Actual offline first launch on a native device is untested. |

The Doctor config-schema check could not reach `exp.host` (`EAI_AGAIN`), and React Native Directory validation received an unexpected server response. Those are unresolved external checks, not passing checks. The peer mismatch is independently reproduced: `expo-router@57.0.27` declares `@expo/metro-runtime ^57.0.17`, while this frozen lockfile resolves `57.0.16`. A successful export does not dismiss that incompatibility. Resolve the compatible dependency graph through supported package tooling, review the lockfile change, and rerun Doctor/build/tests before beta. No dependency was added or changed in this report branch.

## Release blockers and follow-ups

1. **Native build and device evidence:** no Android SDK, emulator, or attached device is available in this cloud machine. Compile the combined reviewed changes, inspect final permissions/components, and run the device matrix below. Task 3's Kotlin alarm/module remains uncompiled here.
2. **Compatibility:** fix the Metro runtime peer mismatch and rerun the two external Doctor checks with access to the required Expo/Directory services. Do not label 18/21 as a clean Doctor result.
3. **Backup policy:** generated config enables Android backup. `src/storage/MMKV.ts` has one `naatkaati` store used by both settings and downloaded datasets (`src/services/sync/datasetStorage.ts`); no backup exclusions were found. VISION.md requires settings retained and downloadable content excluded. This needs a reviewed storage/backup design and restore test; excluding the whole file would also lose settings.
4. **Foreground date rollover:** `useTodayScreen` only refreshes its clock on app foreground events; a continuously visible Today screen can retain yesterday after midnight. Calendar's today marker also lacks a dedicated clock subscription. This is a source-confirmed behavior gap, not a completed device test. Fix and regression-test it before beta.
5. **Signing/project/version:** checked-in app config has no EAS project ID. The owner must confirm/link the correct project and credentials, build a signed candidate, and verify Android versionCode increases relative to Play's last upload. No Expo credential values were requested or stored in chat.
6. **Pending task branches:** review/merge Task 3 widget/reminder recovery, Task 4 UI/localization, and Task 5 validator improvements, then rerun all checks on the combined commit. Individual branch test totals are not a combined release test run.
7. **Content/source review:** all 1,330 Tamil meanings remain unreviewed, six Tamil texts require printed-edition review, and 2,403 month starts are computed. Keep disclaimers and finish the source-verification queue in Task 5's report. Only 2026 holiday data is bundled; decide the supported holiday years for the beta and do not present unverified 2027 projections as official.
8. **Crash/error paths:** verify startup/font failure handling, malformed storage fallback, unavailable external links, notification schedule/cancel failures, denied permissions, and out-of-range dates. Native notification and URL calls currently can reject without a user-visible recovery path. Default router error UI is not evidence of a tested recovery flow.

## Permissions and privacy

Config introspection shows Internet, vibration, legacy external-storage permissions capped at API 32, system-alert-window, and coarse/fine location. Library manifests may add other permissions (for example notification and boot recovery); inspect the **final merged release manifest** before deciding which can be removed. Do not infer the release permission list from config introspection alone.

Exact-alarm permissions are blocked. Location is not requested in the current UI; the location module is present but the app uses fixed Chennai coordinates. No account, advertising, analytics, tracking, or crash-reporting SDK was found in the direct dependency list. Recheck the signed artifact and Play Data Safety answers before upload.

PRIVACY.md now describes the actual fixed-location and GitHub-report flows. City/GPS selection and in-app email fallback are not implemented. The policy correction does not implement those features. Keep privacy disclosures aligned with any future additions.

## Build instructions (not executed here)

Use the existing isolated checkout; do not create a Git worktree unless requested. After reviewing/merging the task branches and resolving blockers, use the frozen pnpm lockfile and run all CI checks. The owner must authenticate EAS through a supported secure route and verify project identity/signing before invoking a build.

```bash
# Installed development client + Metro: native module/device debugging
npx eas-cli@latest build --platform android --profile development

# Standalone internal APK for testers: verify it launches with Metro unavailable
npx eas-cli@latest build --platform android --profile preview

# Store artifact only after beta sign-off; do not submit automatically
npx eas-cli@latest build --platform android --profile production
```

These are future commands, not verified cloud-build outcomes. Store submission and OTA publication are not configured or performed. V1 uses store releases; no OTA dependency is introduced.

## Beta testing checklist

For every row record build SHA/artifact checksum, device/model, Android version, locale, theme, font scale, test date, tester, result, and evidence. All device rows below are **pending**, not passed.

| Area | Required scenarios |
| --- | --- |
| Installation and first launch | Fresh install in airplane mode; Tamil default; skip/finish onboarding; persisted choices after relaunch; no notification or location prompt on launch; uninstall/reinstall; upgrade with existing data. |
| Standalone release | Preview APK launches without Metro; cold/warm start; process death/restart; no debug overlay requirements; low-memory device. Measure cold start and actual APK/download size against VISION.md. |
| Calendar | Official Thai/Chithirai dates, leap day/year transitions, supported endpoints, invalid deep links, timezone outside India, midnight while foregrounded/backgrounded, manual time correction. |
| Widget | Multiple launchers/instances, resize, airplane mode, app process absent, Chennai midnight with non-IST device timezone, Doze/battery saver, reboot/unlock, app update, clock/time changes, force-stop/relaunch. Record inexact-alarm delay. |
| Reminders | Android 13+ allow/deny/permanent deny/settings return, channel disabled, past dates, yearly month mapping, repeated enable without duplicate delivery, cancellation, reboot, timezone changes, foreground/background delivery. |
| UI and accessibility | All screens in Tamil/English and light/dark/system; 320dp width, large display/font settings; Tamil glyph clipping/wrapping; 48dp controls; seven-column grid accuracy; TalkBack Tamil engine; back/gesture/sheet dismissal. |
| Data and error recovery | Fresh airplane-mode use, offline cached use, interrupted update, bad checksum/invalid JSON fallback, corrupt storage, min-app-version skip, retry, missing external link handler. |
| Assets | Adaptive circular/squircle/themed icon masks, monochrome icon, cold splash on light/dark backgrounds, Tamil fonts with no network, Android 12+ launch animation. |
| Privacy and backup | Final merged release permissions, exact alarms absent, no GPS/network personal data access, signed build dependency review, Android backup/restore preserves settings but excludes downloadable caches. |
| Release operations | Signed preview accepted by testers, production AAB generated, unique versionCode, keystore/upload-key backup, privacy URL and Data Safety reviewed, release notes list known limitations. |

Do not distribute the beta as ready until the blockers are resolved and these results are recorded. Source reviews and JavaScript tests are useful evidence, but they cannot certify native device behavior.
