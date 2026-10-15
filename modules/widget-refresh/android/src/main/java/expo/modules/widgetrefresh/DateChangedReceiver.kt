package expo.modules.widgetrefresh

import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent

/**
 * Asks the home-screen widget to redraw when the date rolls over at local midnight, or when the
 * clock or timezone changes, so the widget never shows yesterday.
 */
class DateChangedReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val provider = ComponentName(context.packageName, "${context.packageName}.widget.NaatkaatiWidget")
    val ids = AppWidgetManager.getInstance(context).getAppWidgetIds(provider)
    if (ids.isEmpty()) return
    val update = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
      .setComponent(provider)
      .putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
    context.sendBroadcast(update)
  }
}
