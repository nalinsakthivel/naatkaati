import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';

interface HolidayChipProps {
  name: string;
  categoryLabel: string;
  colors: ColorTokens;
}

const BAR = Spacing.xs + Spacing.xxs;

/** Holiday ribbon. The bar is a shape, and the category is written out, so it never relies on colour alone. */
export function HolidayChip({ name, categoryLabel, colors }: HolidayChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: colors.holidaySoft }]}>
      <View style={[styles.bar, { backgroundColor: colors.holiday }]} />
      <View style={styles.text}>
        <Text style={[Typography.heading, { color: colors.text }]}>{name}</Text>
        <Text style={[Typography.caption, { color: colors.holiday }]}>{categoryLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', borderRadius: Radius.banner, overflow: 'hidden' },
  bar: { width: BAR },
  text: { flex: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
});
