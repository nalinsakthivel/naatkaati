package expo.modules.widgetrefresh

import android.appwidget.AppWidgetManager
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import java.util.Calendar
import java.util.TimeZone

/**
 * Asks the home-screen widget to redraw when the date rolls over at local midnight, or when the
 * clock or timezone changes, so the widget never shows yesterday.
 */
class DateChangedReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action !in setOf(
        MIDNIGHT_ACTION, Intent.ACTION_DATE_CHANGED, Intent.ACTION_TIME_CHANGED,
        Intent.ACTION_TIMEZONE_CHANGED, Intent.ACTION_BOOT_COMPLETED, Intent.ACTION_MY_PACKAGE_REPLACED
      )) return
    scheduleNextRefresh(context)
    val provider = ComponentName(context.packageName, "${context.packageName}.widget.NaatkaatiWidget")
    val ids = AppWidgetManager.getInstance(context).getAppWidgetIds(provider)
    if (ids.isEmpty()) return
    val update = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
      .setComponent(provider)
      .putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
    context.sendBroadcast(update)
  }

  companion object {
    private const val MIDNIGHT_ACTION = "expo.modules.widgetrefresh.MIDNIGHT"

    fun scheduleNextRefresh(context: Context) {
      val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
      val operation = PendingIntent.getBroadcast(
        context, 0,
        Intent(context, DateChangedReceiver::class.java).setAction(MIDNIGHT_ACTION),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
      )
      val provider = ComponentName(context.packageName, "${context.packageName}.widget.NaatkaatiWidget")
      if (AppWidgetManager.getInstance(context).getAppWidgetIds(provider).isEmpty()) {
        alarmManager.cancel(operation)
        return
      }
      // Matches loadWidgetSnapshot's current default location, independent of device timezone.
      val midnight = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata")).apply {
        add(Calendar.DAY_OF_YEAR, 1)
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
      }
      // Intentionally inexact: no exact-alarm permission. Doze/OEM policy may delay delivery.
      alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, midnight.timeInMillis, operation)
    }
  }
}
