import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HolidayTicket } from '@/components/HolidayTicket';
import { TimeBanner } from '@/components/TimeBanner';
import { MonthJumpSheet } from '@/components/native/MonthJumpSheet';
import { SwipeView } from '@/components/SwipeView';
import { MonthGrid } from '@/components/MonthGrid';
import { MonthHeader } from '@/components/MonthHeader';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useCalendarScreen } from './useScreen';

export function CalendarScreen() {
  const s = useCalendarScreen();
  return (
    <SwipeView onSwipeLeft={s.onNext} onSwipeRight={s.onPrev}>
      <ScrollView
        style={{ backgroundColor: s.colors.background }}
        contentContainerStyle={styles.content}
      >
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
        <View style={[styles.sheet, { backgroundColor: s.colors.surface }]}>
          <MonthGrid weekdayLabels={s.weekdayLabels} weeks={s.weeks} colors={s.colors} />
        </View>
        <View style={styles.holidays}>
          <Text style={[Typography.heading, { color: s.colors.text }]}>{s.holidaysTitle}</Text>
          {s.monthHolidays.length === 0 ? (
            <Text style={[Typography.body, { color: s.colors.textMuted }]}>
              {s.noHolidaysLabel}
            </Text>
          ) : (
            <View style={[styles.list, { backgroundColor: s.colors.surface }]}>
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
            <View style={[styles.list, { backgroundColor: s.colors.surface }]}>
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
      </ScrollView>
      <MonthJumpSheet {...s.jump} />
    </SwipeView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sheet: { borderRadius: Radius.card, padding: Spacing.sm },
  list: { borderRadius: Radius.card, paddingHorizontal: Spacing.lg },
  holidays: { gap: Spacing.md },
});
