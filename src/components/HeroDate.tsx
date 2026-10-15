import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeroDateProps {
  day: string;
  weekdayLabel: string;
  monthName: string;
  yearLabel: string;
  gregorianLabel: string;
  isRedLetter: boolean;
  colors: ColorTokens;
  children?: ReactNode;
}

const SUN = 200;
const SUN_OFFSET = -SUN / 3;
const SUN_OPACITY = 0.16;
const RULE_WIDTH = Spacing.xxl + Spacing.sm;
const RULE_HEIGHT = Spacing.xs;

export function HeroDate({
  day,
  weekdayLabel,
  monthName,
  yearLabel,
  gregorianLabel,
  isRedLetter,
  colors,
  children,
}: HeroDateProps) {
  const numeralColor = isRedLetter ? colors.heroHoliday : colors.onHero;
  return (
    <View style={[styles.panel, { backgroundColor: colors.hero }]}>
      <View
        importantForAccessibility="no-hide-descendants"
        style={[styles.sun, { backgroundColor: colors.heroAccent, opacity: SUN_OPACITY }]}
      />
      <View style={styles.top}>
        <Text style={[Typography.heroCaption, { color: colors.onHero }]}>{monthName}</Text>
        <View style={[styles.pill, { backgroundColor: colors.heroSoft }]}>
          <Text style={[Typography.caption, { color: colors.onHero }]}>{yearLabel}</Text>
        </View>
      </View>
      <View
        style={styles.body}
        accessible
        accessibilityLabel={`${day} ${monthName}, ${weekdayLabel}, ${yearLabel}, ${gregorianLabel}`}
      >
        <Text style={[Typography.heroDate, { color: numeralColor }]}>{day}</Text>
        <Text style={[Typography.title, { color: numeralColor }]}>{weekdayLabel}</Text>
        <View style={[styles.rule, { backgroundColor: colors.heroAccent }]} />
        <Text style={[Typography.body, { color: colors.onHeroMuted }]}>{gregorianLabel}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: Radius.hero, overflow: 'hidden', padding: Spacing.xl, gap: Spacing.lg },
  sun: {
    position: 'absolute',
    top: SUN_OFFSET,
    right: SUN_OFFSET,
    width: SUN,
    height: SUN,
    borderRadius: SUN / 2,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: {
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
  },
  body: { gap: Spacing.xs },
  rule: { width: RULE_WIDTH, height: RULE_HEIGHT, borderRadius: RULE_HEIGHT / 2 },
});
