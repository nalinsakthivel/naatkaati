package expo.modules.widgetrefresh

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WidgetRefreshModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WidgetRefresh")
    Function("scheduleNextRefresh") {
      appContext.reactContext?.let { DateChangedReceiver.scheduleNextRefresh(it) }
    }
  }
}
