import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface HeroDateProps {
  day: string;
  weekdayLabel: string;
  monthName: string;
  yearLabel: string;
  gregorianLabel: string;
  isRedLetter: boolean;
  colors: ColorTokens;
  showStack?: boolean;
  children?: ReactNode;
}

/** Compact date summary: Tamil first, Gregorian reference and year always visible. */
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
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View
        style={styles.summary}
        accessible
        accessibilityLabel={`${day} ${monthName}, ${weekdayLabel}, ${yearLabel}, ${gregorianLabel}`}
      >
        <View style={[styles.number, { backgroundColor: colors.today }]}>
          <Text style={[Typography.dateSummary, { color: colors.textOnToday }]}>{day}</Text>
        </View>
        <View style={styles.details}>
          <Text style={[Typography.title, { color: colors.text }]}>{monthName}</Text>
          <Text
            style={[Typography.bodyStrong, { color: isRedLetter ? colors.holiday : colors.text }]}
          >
            {weekdayLabel}
          </Text>
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{yearLabel}</Text>
        </View>
      </View>
      <Text
        style={[
          Typography.body,
          styles.gregorian,
          { color: colors.textMuted, borderColor: colors.border },
        ]}
      >
        {gregorianLabel}
      </Text>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  summary: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  number: {
    minWidth: Layout.minTouchTarget + Spacing.xxl,
    minHeight: Layout.minTouchTarget + Spacing.xxl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.banner,
  },
  details: { flex: 1, gap: Spacing.xxs },
  gregorian: { borderTopWidth: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
});
