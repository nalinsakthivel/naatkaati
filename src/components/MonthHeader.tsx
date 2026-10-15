import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Spacing, Typography } from '@/themes/Theme';

interface MonthHeaderProps {
  title: string;
  subtitle: string;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  colors: ColorTokens;
}

/** Month title and arrows, drawn inside the indigo SheetBand. */
export function MonthHeader({
  title,
  subtitle,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  colors,
}: MonthHeaderProps) {
  const arrowStyle = [styles.arrow, { borderColor: colors.textOnPrimary }];
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onPrev}
        accessibilityRole="button"
        accessibilityLabel={prevLabel}
        style={arrowStyle}
      >
        <Text style={[Typography.title, styles.glyph, { color: colors.textOnPrimary }]}>‹</Text>
      </Pressable>
      <View style={styles.titles}>
        <Text style={[Typography.title, { color: colors.textOnPrimary }]}>{title}</Text>
        <Text style={[Typography.caption, { color: colors.textOnPrimary }]}>{subtitle}</Text>
      </View>
      <Pressable
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        style={arrowStyle}
      >
        <Text style={[Typography.title, styles.glyph, { color: colors.textOnPrimary }]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  titles: { flex: 1, alignItems: 'center' },
  arrow: {
    width: Layout.minTouchTarget,
    height: Layout.minTouchTarget,
    borderRadius: Layout.minTouchTarget / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { lineHeight: Layout.minTouchTarget - Spacing.sm, textAlign: 'center' },
});
