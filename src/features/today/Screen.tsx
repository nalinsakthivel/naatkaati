import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
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
  jump: {
    alignSelf: 'center',
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.chip,
  },
});
