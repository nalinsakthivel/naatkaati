import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DayBody } from '@/components/DayBody';
import { SwipeView } from '@/components/SwipeView';
import { TimeBanner } from '@/components/TimeBanner';
import { UpcomingList } from '@/components/UpcomingList';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useTodayScreen } from './useScreen';

export function TodayScreen() {
  const {
    topInset,
    locationLabel,
    timeBanner,
    upcoming,
    isToday,
    jumpLabel,
    calendarLabel,
    settingsLabel,
    onOpenCalendar,
    onOpenSettings,
    onNextDay,
    onPreviousDay,
    onJumpToToday,
    ...day
  } = useTodayScreen();
  return (
    <SwipeView onSwipeLeft={onNextDay} onSwipeRight={onPreviousDay}>
      <ScrollView
        style={{ backgroundColor: day.colors.background }}
        contentContainerStyle={[styles.content, { paddingTop: topInset + Spacing.lg }]}
      >
        <View style={styles.bar}>
          {[
            { label: calendarLabel, onPress: onOpenCalendar },
            { label: settingsLabel, onPress: onOpenSettings },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              accessibilityRole="button"
              style={[styles.barButton, { backgroundColor: day.colors.surface }]}
            >
              <Text style={[Typography.bodyStrong, { color: day.colors.primary }]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {timeBanner ? <TimeBanner {...timeBanner} colors={day.colors} /> : null}
        {isToday ? null : (
          <Pressable
            onPress={onJumpToToday}
            accessibilityRole="button"
            style={[styles.jump, { backgroundColor: day.colors.primary }]}
          >
            <Text style={[Typography.button, { color: day.colors.textOnPrimary }]}>
              {jumpLabel}
            </Text>
          </Pressable>
        )}
        <DayBody {...day} />
        <UpcomingList title={upcoming.title} rows={upcoming.rows} colors={day.colors} />
        <Text style={[Typography.caption, styles.location, { color: day.colors.textMuted }]}>
          {locationLabel}
        </Text>
      </ScrollView>
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
  location: { textAlign: 'center' },
  bar: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm },
  barButton: {
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.chip,
  },
  jump: {
    alignSelf: 'center',
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.chip,
  },
});
