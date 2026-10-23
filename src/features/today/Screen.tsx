import { ScrollView, StyleSheet } from 'react-native';
import { DayBody } from '@/components/DayBody';
import { DateNavigator } from '@/components/DateNavigator';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SwipeView } from '@/components/SwipeView';
import { TimeBanner } from '@/components/TimeBanner';
import { UpcomingList } from '@/components/UpcomingList';
import { Layout, Spacing } from '@/themes/Theme';
import { useTodayScreen } from './useScreen';

export function TodayScreen() {
  const s = useTodayScreen();
  return (
    <SwipeView onSwipeLeft={s.onNextDay} onSwipeRight={s.onPreviousDay}>
      <ScrollView
        style={{ backgroundColor: s.colors.background }}
        contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
      >
        <ScreenHeader title={s.title} subtitle={s.locationLabel} colors={s.colors} />
        <DateNavigator {...s.navigation} colors={s.colors} />
        {s.timeBanner ? <TimeBanner {...s.timeBanner} colors={s.colors} /> : null}
        <DayBody
          {...s}
          beforeDetails={
            <UpcomingList title={s.upcoming.title} rows={s.upcoming.rows} colors={s.colors} />
          }
        />
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
});
