import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HolidayTicket } from '@/components/HolidayTicket';
import { TimeBanner } from '@/components/TimeBanner';
import { MonthJumpSheet } from '@/components/native/MonthJumpSheet';
import { SwipeView } from '@/components/SwipeView';
import { MonthGrid } from '@/components/MonthGrid';
import { ScreenHeader } from '@/components/ScreenHeader';
import { MonthHeader } from '@/components/MonthHeader';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useCalendarScreen } from './useScreen';

const MARKER = Spacing.sm;

export function CalendarScreen() {
  const s = useCalendarScreen();
  return (
    <SwipeView onSwipeLeft={s.onNext} onSwipeRight={s.onPrev}>
      <ScrollView
        style={{ backgroundColor: s.colors.background }}
        contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
      >
        <ScreenHeader kicker={s.kicker} title={s.screenTitle} colors={s.colors} />
        {s.timeBanner ? <TimeBanner {...s.timeBanner} colors={s.colors} /> : null}
        <MonthHeader
          title={s.title}
          subtitle={s.subtitle}
          prevLabel={s.prevLabel}
          nextLabel={s.nextLabel}
          jumpLabel={s.jumpLabel}
          todayLabel={s.todayLabel}
          onPrev={s.onPrev}
          onNext={s.onNext}
          onOpenJump={s.onOpenJump}
          onToday={s.onToday}
          colors={s.colors}
        />
        <View
          style={[
            styles.sheet,
            { backgroundColor: s.colors.surface, borderColor: s.colors.border },
          ]}
        >
          <MonthGrid weekdayLabels={s.weekdayLabels} weeks={s.weeks} colors={s.colors} />
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: s.colors.holiday }]} />
            <Text style={[Typography.caption, { color: s.colors.textMuted }]}>
              {s.legend.holiday}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.square, { backgroundColor: s.colors.commemoration }]} />
            <Text style={[Typography.caption, { color: s.colors.textMuted }]}>
              {s.legend.commemoration}
            </Text>
          </View>
        </View>
        <View style={styles.holidays}>
          <Text style={[Typography.heading, { color: s.colors.text }]}>{s.holidaysTitle}</Text>
          {s.monthHolidays.length === 0 ? (
            <Text style={[Typography.body, { color: s.colors.textMuted }]}>
              {s.noHolidaysLabel}
            </Text>
          ) : (
            <View
              style={[
                styles.list,
                { backgroundColor: s.colors.surface, borderColor: s.colors.border },
              ]}
            >
              {s.monthHolidays.map((holiday, index) => (
                <HolidayTicket
                  key={holiday.id}
                  divided={index > 0}
                  dateLabel={holiday.dateLabel}
                  name={holiday.name}
                  colors={s.colors}
                />
              ))}
            </View>
          )}
        </View>
        {s.monthCommemorations.length > 0 ? (
          <View style={styles.holidays}>
            <Text style={[Typography.heading, { color: s.colors.text }]}>
              {s.commemorationsTitle}
            </Text>
            <View
              style={[
                styles.list,
                { backgroundColor: s.colors.surface, borderColor: s.colors.border },
              ]}
            >
              {s.monthCommemorations.map((item, index) => (
                <HolidayTicket
                  key={item.id}
                  divided={index > 0}
                  dateLabel={item.dateLabel}
                  name={item.name}
                  tone="commemoration"
                  colors={s.colors}
                />
              ))}
            </View>
          </View>
        ) : null}
        <Text style={[Typography.caption, styles.hint, { color: s.colors.textMuted }]}>
          {s.swipeHint}
        </Text>
      </ScrollView>
      <MonthJumpSheet {...s.jump} />
    </SwipeView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Layout.dockClearance,
    gap: Spacing.lg,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sheet: { borderRadius: Radius.card, borderWidth: 1, padding: Spacing.sm },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xl },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  dot: { width: MARKER, height: MARKER, borderRadius: MARKER / 2 },
  square: { width: MARKER, height: MARKER },
  hint: { textAlign: 'center' },
  list: { borderRadius: Radius.card, borderWidth: 1, paddingHorizontal: Spacing.lg },
  holidays: { gap: Spacing.md },
});
