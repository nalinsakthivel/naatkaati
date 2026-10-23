import { ScrollView, StyleSheet, Text } from 'react-native';
import { DayBody } from '@/components/DayBody';
import { DateNavigator } from '@/components/DateNavigator';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SwipeView } from '@/components/SwipeView';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { useDayDetailScreen } from './useScreen';

export function DayDetailScreen() {
  const s = useDayDetailScreen();
  return (
    <SwipeView onSwipeLeft={s.onNextDay} onSwipeRight={s.onPreviousDay}>
      <ScrollView
        style={{ backgroundColor: s.colors.background }}
        contentContainerStyle={styles.content}
      >
        <ScreenHeader title={s.title} colors={s.colors} />
        <DateNavigator {...s.navigation} colors={s.colors} />
        {s.invalidDateLabel ? (
          <Text accessibilityRole="alert" style={[Typography.body, { color: s.colors.warning }]}>
            {s.invalidDateLabel}
          </Text>
        ) : null}
        <DayBody {...s} />
      </ScrollView>
    </SwipeView>
  );
}
const styles = StyleSheet.create({
  content: {
    padding: Layout.screenPaddingH,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
});
