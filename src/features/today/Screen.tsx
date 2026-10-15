import { ScrollView, StyleSheet, Text } from 'react-native';
import { TimeBanner } from '@/components/TimeBanner';
import { DayBody } from '@/components/DayBody';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { useTodayScreen } from './useScreen';

export function TodayScreen() {
  const { topInset, locationLabel, timeBanner, ...day } = useTodayScreen();
  return (
    <ScrollView
      style={{ backgroundColor: day.colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: topInset + Spacing.lg }]}
    >
      {timeBanner ? <TimeBanner {...timeBanner} colors={day.colors} /> : null}
      <DayBody {...day} />
      <Text style={[Typography.caption, styles.location, { color: day.colors.textMuted }]}>
        {locationLabel}
      </Text>
    </ScrollView>
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
});
