# V1 screen and localization review

23 October 2026. This is a source review plus automated translation/theme tests, not a visual or TalkBack sign-off. The existing flat Tamil-first design, colors, typography, and native system controls are preserved.

| Screen | Review and targeted changes | Remaining device checks |
| --- | --- | --- |
| Onboarding | Two steps, language then appearance; completion/skip persists and protected routes remove onboarding. Made the layout scrollable so text scaling and short screens cannot leave the bottom actions outside a fixed-height container. | 320×568 screen, landscape, largest font/display scale, skip/finish/relaunch, Android back. No city chooser currently exists: Chennai remains the default. |
| Today | Theme tokens, bundled content, date fallback, visible unverified-kural labels/report action, and timezone banner. Upcoming-event timing can now shrink/wrap rather than crowd long Tamil names. | Tamil glyphs and line heights, long occasion names, swipe/vertical-scroll interaction, offline first launch, date rollover while foregrounded. |
| Calendar | Localized weekday/month labels, spoken cell dates, holiday/commemoration shape markers, empty holiday state, native month/year sheet. Increased the Today shortcut to the existing 48dp touch target. | Seven-column cells are narrower than 48dp on small phones; assess selection accuracy and TalkBack traversal without redesigning the grid. Verify first/last supported picker years and disabled navigation behavior. |
| Day detail | Invalid route date falls back with a message; out-of-range dates have a Gregorian fallback. Shares accessible kural/reminder content with Today. | Deep links, Android back, invalid dates, unsupported years, permission denial/settings return, notification-service failure handling. |
| Settings | Native controls preserve OS semantics, localized labels, safe-area top inset, theme tokens, visible sync status. | Choice-sheet dismissal/back, retained choices, dark native controls, sync failure/retry on airplane mode, largest text. |
| About | Source methodology, code/data/kural licenses, report link, theme tokens, scrolling long text. | External-link availability, back navigation, printed license correctness and source-policy updates. Only GitHub report action is implemented; email fallback remains a beta gap. |

## Localization and accessibility evidence

- Tamil/English translation keys match, and all interpolation fields match. Regression tests check every leaf, intentional empty sync-idle text, Tamil default rendering, and language switching.
- Existing light/dark contrast tests cover the main token pairs. These checks do not prove every rendered native control or image meets contrast requirements.
- Most custom actions use the 48dp token and explicit button/link roles; date cells have full spoken labels. Native controls require TalkBack verification on an actual device.
- Tamil typography tokens and existing line heights are unchanged. Single-line grid labels use font fitting, so clipping/legibility must be checked at large text sizes. Do not reduce Tamil line heights to hide overflow.
- Bundled app content is synchronous; no artificial loading screens were added. Font loading uses the splash screen, and dataset sync retains cached/bundled content on failure. Notification/link failures still need end-to-end testing.

Before beta, test every screen in Tamil and English, light/dark/system themes, small/large screens, and at least 1× and 2× font scales. Record build SHA, device, Android version, font scale, TalkBack language/engine, and screenshots. Mark each result pass/fail; these manual checks have not been executed in the cloud.
