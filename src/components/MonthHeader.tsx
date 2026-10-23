import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

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
  canGoPrev?: boolean;
  canGoNext?: boolean;
  colors: ColorTokens;
}
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
  canGoPrev = true,
  canGoNext = true,
  colors,
}: MonthHeaderProps) {
  const arrow = [styles.arrow, { backgroundColor: colors.background }];
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${jumpLabel}`}
          onPress={onOpenJump}
          style={styles.title}
        >
          <Text style={[Typography.title, { color: colors.text }]}>{title} ▾</Text>
        </Pressable>
        {todayLabel && onToday ? (
          <Pressable
            accessibilityRole="button"
            onPress={onToday}
            style={[styles.today, { backgroundColor: colors.today }]}
          >
            <Text style={[Typography.button, { color: colors.textOnToday }]}>{todayLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={prevLabel}
          accessibilityState={{ disabled: !canGoPrev }}
          disabled={!canGoPrev}
          onPress={onPrev}
          style={[arrow, !canGoPrev && styles.disabled]}
        >
          <Text style={[Typography.title, { color: colors.primary }]}>‹</Text>
        </Pressable>
        <Text style={[Typography.body, styles.subtitle, { color: colors.textMuted }]}>
          {subtitle}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextLabel}
          accessibilityState={{ disabled: !canGoNext }}
          disabled={!canGoNext}
          onPress={onNext}
          style={[arrow, !canGoNext && styles.disabled]}
        >
          <Text style={[Typography.title, { color: colors.primary }]}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: { padding: Spacing.lg, gap: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  title: { flex: 1, minHeight: Layout.minTouchTarget, justifyContent: 'center' },
  subtitle: { flex: 1, textAlign: 'center' },
  today: {
    minHeight: Layout.minTouchTarget,
    minWidth: Layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.cell,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  arrow: {
    width: Layout.minTouchTarget,
    minHeight: Layout.minTouchTarget,
    borderRadius: Radius.cell,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
});
