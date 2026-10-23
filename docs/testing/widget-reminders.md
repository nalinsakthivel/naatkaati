# Android widget and reminders review

Task 3, 23 October 2026. Automated checks validate JavaScript behavior; native alarm delivery and launcher rendering require a development build on a device. Expo Go is unsupported.

## Changes and reviewed behavior

- Create the Android notification channel before requesting permission; expired reminders never prompt.
- Scheduling uses stable `h:`/`c:` identifiers. Expo's Android store and pending intent use that identifier, so rescheduling replaces the pending request. Cancellation uses the same key. Permission denial schedules nothing and the UI offers system settings.
- Widget updates read the current date and bundled/cached data each time, without requiring a network request.
- A native inexact alarm requests a redraw at the next Chennai midnight, matching the current default location. Each widget snapshot arms it. Time/timezone changes, reboot, and app replacement redraw and rearm it. No exact-alarm permission is added. The 30-minute widget update and app foreground refresh remain fallbacks.
- Android may defer inexact alarms in Doze or under manufacturer battery policies. Midnight delivery is best effort, not an exact-time guarantee. Force-stopping the app suppresses background work until the user launches it again.
- Expo Notifications includes reboot recovery for pending notifications. Its yearly triggers use device-local time, with zero-based months; changing the device timezone changes their local firing time. One-off reminders are stored instants. Notification delivery timing remains OS-controlled.

## Required device scenarios (not executed in cloud)

Record device model, Android version, launcher, build SHA, expected/actual date, timestamps, notification count, and screenshots for each result.

| Scenario | Procedure and expected result |
| --- | --- |
| Offline first widget | Install dev build, enable airplane mode, place two widgets. Both show today's Chennai Tamil date and bundled kural. Kill the UI process without force-stop and resize widgets; data remains available. |
| Midnight | Keep the UI closed across 00:00 Asia/Kolkata, both with screen awake and in Doze. Confirm both widget instances advance and record alarm delay; compare with the 30-minute fallback. Repeat when device timezone is outside India. |
| Clock and timezone | Change date forward/backward and switch device timezone. After the system event widgets must reflect the current instant in Chennai, not blindly the device date. Confirm a future midnight alarm remains scheduled. |
| Reboot and update | Place widgets and schedule one-off/yearly reminders, reboot, unlock, then update the app without clearing data. Verify widget redraw, next alarm, retained settings, and one scheduled notification per identifier. |
| Permission | Fresh Android 13+ installation must not prompt on launch. Enable a future reminder; channel exists before prompt. Deny, deny permanently, and grant through system settings. Verify denied state and settings action, no notification on denial, and successful retry. |
| Scheduling/cancellation | Enable the same holiday or commemoration repeatedly and inspect pending requests: one per identifier. Disable it, restart, and verify no delivery. Try a past holiday: no prompt and no pending request. |
| Delivery | Test yearly month mapping and a one-off future day at the configured hour. Confirm one notification, localized content, and device-local timezone semantics. Test Doze and battery saver separately. |
| Force stop/removal | Force-stop, relaunch, and verify recovery. Remove every widget and confirm the midnight alarm is canceled after the next callback; adding a widget rearms it. |

Native compilation, merged manifest inspection, and these scenarios are release gates. The cloud environment currently has no Android SDK, emulator, or attached device.
