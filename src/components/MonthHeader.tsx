import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface MonthHeaderProps {
  title: string;
  subtitle: string;
  prevLabel: string;
  nextLabel: string;
  jumpLabel: string;
  /** Shown only when another month than the current one is visible */
  todayLabel?: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenJump: () => void;
  onToday?: () => void;
  colors: ColorTokens;
}

/** Month title, arrows and shortcuts, drawn inside the indigo SheetBand. */
export function MonthHeader({
  title,
  subtitle,
  prevLabel,
  nextLabel,
  jumpLabel,
  todayLabel,
  onPrev,
  onNext,
  onOpenJump,
  onToday,
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
        <Pressable
          onPress={onOpenJump}
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${jumpLabel}`}
          style={styles.titleButton}
        >
          <Text style={[Typography.title, { color: colors.textOnPrimary }]}>{title} ▾</Text>
        </Pressable>
        <Text style={[Typography.caption, { color: colors.textOnPrimary }]}>{subtitle}</Text>
        {todayLabel && onToday ? (
          <Pressable
            onPress={onToday}
            accessibilityRole="button"
            style={[styles.today, { borderColor: colors.today }]}
          >
            <Text style={[Typography.caption, { color: colors.today }]}>{todayLabel}</Text>
          </Pressable>
        ) : null}
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
  titles: { flex: 1, alignItems: 'center', gap: Spacing.xxs },
  titleButton: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
  today: {
    minHeight: Layout.minTouchTarget,
    minWidth: Layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
  },
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
