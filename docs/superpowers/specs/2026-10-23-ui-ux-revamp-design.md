# Naatkaati UI and UX revamp

The user requested a revamp of every screen, beyond the earlier sizing fixes. The implementation direction is a Today-first calendar with visible navigation, readable Tamil, and a consistent flat interface. This direction is the implementer's choice within that request.

## Approach

Keep the current Today / Calendar / Settings navigation and native system controls. A calendar-first replacement would change the app's entry flow; retaining the paper-calendar styling would leave the identified hierarchy problems in place. Simplify the existing flow instead: compact Tamil date, today's occasions, upcoming dates, astronomy and kural in clear sections. No decorative paper stack or tearing animation in the main day flow.

## Screens

- Today and day detail: consistent heading, visible previous / today / next controls, compact date summary, occasions and an honest empty state. Upcoming events precede secondary content. Keep kural meaning, unverified labels and report action visible together.
- Calendar: plain month controls with an always-available Today action, readable day labels and marker legend. Month-list events open their date. Disable month arrows at picker bounds.
- Settings: separate display, holiday, data and app sections; explain choices using existing localized hints. Keep Expo UI switches, pickers and sheets.
- Onboarding: short introduction, scrollable two-step language/appearance flow, visible back/skip/continue actions. No nonexistent city picker.
- About: clear app/version summary, readable method/license sections, report action and useful failure feedback.

## Shared behavior and constraints

- Preserve Tamil-first content, English parity, indigo/turmeric palette, native bottom tabs, offline data and all calendar calculation/verification policy.
- Use existing React Native/Expo 57 dependencies, StyleSheet and theme tokens. No dependencies, dataset/schema/sync changes, accounts or tracking.
- Explicit controls must work without swiping. Update the clock while visible and after foregrounding so Today and calendar markers do not become stale at midnight.
- Native navigation bars inherit app theme colors. Custom action targets use the existing 48dp minimum; seven-column calendar width remains constrained on narrow phones and needs device testing.
- Notification/link errors produce localized feedback rather than an unhandled rejected promise. Do not claim a notification was scheduled on failure.

## Validation

Behavior tests cover date controls, event-row presses, midnight/foreground clock updates, onboarding back/completion, reminder failures, and translation parity. Run all tests, typecheck, formatting, dataset validation and Android production JS export. Native visual/TalkBack verification remains explicitly pending without a device.
