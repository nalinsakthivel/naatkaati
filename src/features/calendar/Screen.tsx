import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HolidayTicket } from '@/components/HolidayTicket';
import { TimeBanner } from '@/components/TimeBanner';
import { MonthJumpSheet } from '@/components/native/MonthJumpSheet';
import { SwipeView } from '@/components/SwipeView';
import { MonthGrid } from '@/components/MonthGrid';
import { MonthHeader } from '@/components/MonthHeader';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useCalendarScreen } from './useScreen';

export function CalendarScreen() {
  const s = useCalendarScreen();
  return (
    <SwipeView onSwipeLeft={s.onNext} onSwipeRight={s.onPrev}>
      <ScrollView
        style={{ backgroundColor: s.colors.background }}
        contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
      >
        <ScreenHeader title={s.screenTitle} subtitle={s.screenSubtitle} colors={s.colors} />
        {s.timeBanner ? <TimeBanner {...s.timeBanner} colors={s.colors} /> : null}
        <View
          style={[
            styles.sheet,
            { backgroundColor: s.colors.surface, borderColor: s.colors.border },
          ]}
        >
          <MonthHeader
            title={s.title}
            subtitle={s.subtitle}
            prevLabel={s.prevLabel}
            nextLabel={s.nextLabel}
            jumpLabel={s.jumpLabel}
            todayLabel={s.todayLabel}
            canGoPrev={s.canGoPrev}
            canGoNext={s.canGoNext}
            onPrev={s.onPrev}
            onNext={s.onNext}
            onOpenJump={s.onOpenJump}
            onToday={s.onToday}
            colors={s.colors}
          />

          <View style={styles.grid}>
            <MonthGrid weekdayLabels={s.weekdayLabels} weeks={s.weeks} colors={s.colors} />
            <View style={styles.legend}>
              {s.legend.map((label, i) => (
                <Text key={label} style={[Typography.caption, { color: s.colors.textMuted }]}>
                  {i === 0 ? '●' : '■'} {label}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.holidays}>
          <Text style={[Typography.heading, { color: s.colors.text }]}>{s.holidaysTitle}</Text>
          {s.monthHolidays.length === 0 ? (
            <Text style={[Typography.body, { color: s.colors.textMuted }]}>
              {s.noHolidaysLabel}
            </Text>
          ) : (
            s.monthHolidays.map((holiday) => (
              <HolidayTicket
                key={holiday.id}
                dateLabel={holiday.dateLabel}
                name={holiday.name}
                onPress={holiday.onPress}
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
                onPress={item.onPress}
                tone="commemoration"
                colors={s.colors}
              />
            ))}
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
    gap: Spacing.xl,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sheet: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  grid: { paddingHorizontal: Spacing.xs, paddingBottom: Spacing.lg },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.md,
  },
  holidays: { gap: Spacing.md },
});
