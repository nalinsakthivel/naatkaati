import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MonthHeaderProps {
  title: string;
  subtitle: string;
  prevLabel: string;
  nextLabel: string;
  jumpLabel: string;
  todayLabel?: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenJump: () => void;
  onToday?: () => void;
  colors: ColorTokens;
}

const CHEVRON = Spacing.md;
const CHEVRON_STROKE = 2;

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
  return (
    <View style={styles.header}>
      <View style={styles.titles}>
        <Pressable
          onPress={onOpenJump}
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${jumpLabel}`}
          style={styles.titleButton}
        >
          <Text style={[Typography.title, { color: colors.text }]}>{title}</Text>
          <View style={[styles.caret, { borderTopColor: colors.primary }]} />
        </Pressable>
        <Text style={[Typography.caption, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      {todayLabel && onToday ? (
        <Pressable
          onPress={onToday}
          accessibilityRole="button"
          style={[styles.today, { backgroundColor: colors.today }]}
        >
          <Text style={[Typography.caption, { color: colors.textOnToday }]}>{todayLabel}</Text>
        </Pressable>
      ) : null}
      <Pressable
        onPress={onPrev}
        accessibilityRole="button"
        accessibilityLabel={prevLabel}
        style={[styles.arrow, { backgroundColor: colors.surface }]}
      >
        <View style={[styles.chevron, styles.left, { borderColor: colors.primary }]} />
      </Pressable>
      <Pressable
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        style={[styles.arrow, { backgroundColor: colors.surface }]}
      >
        <View style={[styles.chevron, styles.right, { borderColor: colors.primary }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  titles: { flex: 1 },
  titleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: Layout.minTouchTarget,
  },
  caret: {
    borderLeftWidth: Spacing.xs,
    borderRightWidth: Spacing.xs,
    borderTopWidth: Spacing.xs,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  today: {
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  arrow: {
    width: Layout.minTouchTarget,
    height: Layout.minTouchTarget,
    borderRadius: Layout.minTouchTarget / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // A square with two visible edges, rotated into a chevron
  chevron: { width: CHEVRON, height: CHEVRON, borderTopWidth: CHEVRON_STROKE },
  left: {
    borderLeftWidth: CHEVRON_STROKE,
    transform: [{ rotate: '-45deg' }, { translateX: Spacing.xxs }, { translateY: Spacing.xxs }],
  },
  right: {
    borderRightWidth: CHEVRON_STROKE,
    transform: [{ rotate: '45deg' }, { translateX: -Spacing.xxs }, { translateY: Spacing.xxs }],
  },
});
