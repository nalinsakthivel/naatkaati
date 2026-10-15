import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';
import { StyleSheet, Text, View } from 'react-native';

interface HolidayChipProps {
  name: string;
  categoryLabel: string;
  detail?: string;
  colors: ColorTokens;
}

const MARKER = Spacing.xl;

export function HolidayChip({ name, categoryLabel, detail, colors }: HolidayChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: colors.holidaySoft }]}>
      <View style={[styles.marker, { backgroundColor: colors.holiday }]} />
      <View style={styles.text}>
        <Text style={[Typography.heading, { color: colors.text }]}>{name}</Text>
        <Text style={[Typography.caption, { color: colors.holiday }]}>{categoryLabel}</Text>
        {detail ? (
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{detail}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  marker: { width: MARKER, height: MARKER, borderRadius: MARKER / 2 },
  text: { flex: 1 },
});
