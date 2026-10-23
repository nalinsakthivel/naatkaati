# UI and UX Revamp Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task with a final independent review.

**Goal:** Revamp all existing screens into a clear Tamil-first daily calendar.

**Architecture:** Keep thin routes and Screen/useScreen separation. Add presentational header/day-navigation components and a shared UI clock hook. Reorder existing day content through a slot rather than duplicating calendar logic.

**Tech Stack:** Expo 57, React Native, TypeScript, existing Expo UI and Jest.

**Spec:** ../specs/2026-10-23-ui-ux-revamp-design.md

## Global Constraints

- No dependencies, dataset/schema/sync changes, accounts or tracking.
- Preserve Tamil-first localization and the existing palette.
- Keep native controls for system choices and existing router tabs.

## Review Focus

- Large Tamil text: allow wrapping/scrolling, preserve existing line heights.
- Navigation without gestures: previous/next/today and event-row actions remain discoverable.
- Midnight and foreground changes: shared clock updates dates and cleans up listeners/timers.
- Async failures: show failure feedback and retain reminder state after failed scheduling/cancellation.
- Dark theme: shared headers/cards and native navigation colors use theme tokens.

### Task 1: Shared navigation and clock

Files: create src/components/ScreenHeader.tsx, DateNavigator.tsx and src/hooks/useClock.ts; update HolidayTicket.tsx and theme typography.

Interfaces: ScreenHeader consumes title/subtitle/colors; DateNavigator consumes localized previous/today/next labels and callbacks; useClock(): Date; HolidayTicket gains optional onPress.

- [x] Add failing tests for event-row interaction and a visible clock ticking across midnight.
- [x] Implement clock timer/foreground refresh and presentational controls; preserve read-only ticket use.
- [x] Run focused tests and typecheck.

### Task 2: Today, day detail and calendar

Files: update HeroDate.tsx, DayBody.tsx, MonthHeader.tsx, DayCell.tsx, UpcomingList.tsx and corresponding screen/hooks.

Interfaces: DayBody gains optional beforeDetails ReactNode slot and localized section/empty-state labels; calendar rows gain date-opening callbacks and navigation bounds.

- [x] Add behavior coverage for day controls and bounded month navigation.
- [x] Implement compact date card, content order, visible navigation, tappable agenda rows and marker legend.
- [x] Run component/hook tests and typecheck.

### Task 3: Settings, onboarding, About and feedback

Files: update settings/onboarding/about Screen.tsx and useScreen.ts, RootStack.tsx, native row wrappers, useReminders.ts, translations.

Interfaces: onboarding exposes back action; reminder UI supports a localized failure state; native choice/switch rows accept optional descriptive text where supported.

- [x] Add failing reminder error tests and onboarding back-flow tests; retain translation parity coverage.
- [x] Implement grouped settings, scrollable introduction, themed navigation, readable About cards and failure feedback.
- [x] Run the full Jest suite, typecheck, lint and data validator.

### Task 4: Review and publish branch

- [x] Export Android production JS and verify bundle/assets.
- [x] Request independent code review and address concrete findings.
- [x] Commit and push feat/ui-ux-revamp; create PR against dev if API access permits. Record native/device and network limitations.
