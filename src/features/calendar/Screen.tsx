import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HolidayTicket } from '@/components/HolidayTicket';
import { TimeBanner } from '@/components/TimeBanner';
import { MonthGrid } from '@/components/MonthGrid';
import { MonthHeader } from '@/components/MonthHeader';
import { SheetBand } from '@/components/SheetBand';
import { Elevation, Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useCalendarScreen } from './useScreen';

export function CalendarScreen() {
  const s = useCalendarScreen();
  return (
    <ScrollView
      style={{ backgroundColor: s.colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
    >
      {s.timeBanner ? <TimeBanner {...s.timeBanner} colors={s.colors} /> : null}
      <View
        style={[styles.sheet, { backgroundColor: s.colors.surface, borderColor: s.colors.border }]}
      >
        <SheetBand colors={s.colors}>
          <MonthHeader
            title={s.title}
            subtitle={s.subtitle}
            prevLabel={s.prevLabel}
            nextLabel={s.nextLabel}
            onPrev={s.onPrev}
            onNext={s.onNext}
            colors={s.colors}
          />
        </SheetBand>
        <View style={styles.grid}>
          <MonthGrid weekdayLabels={s.weekdayLabels} weeks={s.weeks} colors={s.colors} />
        </View>
      </View>
      <View style={styles.holidays}>
        <Text style={[Typography.heading, { color: s.colors.text }]}>{s.holidaysTitle}</Text>
        {s.monthHolidays.length === 0 ? (
          <Text style={[Typography.body, { color: s.colors.textMuted }]}>{s.noHolidaysLabel}</Text>
        ) : (
          s.monthHolidays.map((holiday) => (
            <HolidayTicket
              key={holiday.id}
              dateLabel={holiday.dateLabel}
              name={holiday.name}
              colors={s.colors}
            />
          ))
        )}
      </View>
      {s.monthCommemorations.length > 0 ? (
        <View style={styles.holidays}>
          <Text style={[Typography.heading, { color: s.colors.text }]}>
            {s.commemorationsTitle}
          </Text>
          {s.monthCommemorations.map((item) => (
            <HolidayTicket
              key={item.id}
              dateLabel={item.dateLabel}
              name={item.name}
              tone="commemoration"
              colors={s.colors}
            />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sheet: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden', ...Elevation.floating },
  grid: { padding: Spacing.sm },
  holidays: { gap: Spacing.md },
});
