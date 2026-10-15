import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeroDate } from '@/components/HeroDate';
import { HolidayChip } from '@/components/HolidayChip';
import { KuralCard } from '@/components/KuralCard';
import { SkyRow } from '@/components/SkyRow';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { useTodayScreen } from './useScreen';

export function TodayScreen() {
  const s = useTodayScreen();
  return (
    <ScrollView
      style={{ backgroundColor: s.colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
    >
      {s.hero ? (
        <HeroDate {...s.hero} colors={s.colors}>
          <SkyRow sunrise={s.sunrise} sunset={s.sunset} moon={s.moon} colors={s.colors} />
        </HeroDate>
      ) : null}
      <Text style={[Typography.caption, styles.location, { color: s.colors.textMuted }]}>
        {s.locationLabel}
      </Text>
      {s.holidays.length > 0 ? (
        <View style={styles.block}>
          {s.holidays.map((holiday) => (
            <HolidayChip
              key={holiday.id}
              name={holiday.name}
              categoryLabel={holiday.categoryLabel}
              colors={s.colors}
            />
          ))}
        </View>
      ) : null}
      {s.kural ? <KuralCard {...s.kural} onReport={s.onReportKural} colors={s.colors} /> : null}
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
  block: { gap: Spacing.sm },
});
