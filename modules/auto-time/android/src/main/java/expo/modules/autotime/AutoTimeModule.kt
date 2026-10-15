package expo.modules.autotime

import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Exposes whether Android's automatic date/time and automatic timezone are on.
 * Data only, no UI. If a setting cannot be read, it reports "on" so the app never shows a false warning.
 */
class AutoTimeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AutoTime")

    Function("getStatus") {
      val resolver = appContext.reactContext?.contentResolver
      mapOf(
        "autoTime" to isEnabled(resolver, Settings.Global.AUTO_TIME),
        "autoTimeZone" to isEnabled(resolver, Settings.Global.AUTO_TIME_ZONE)
      )
    }
  }

  private fun isEnabled(resolver: android.content.ContentResolver?, name: String): Boolean {
    if (resolver == null) return true
    return Settings.Global.getInt(resolver, name, 1) == 1
  }
}
