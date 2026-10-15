import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
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

const CHEVRON = Spacing.xl - Spacing.xs;

/** Month switcher: round arrows either side of the title. Tapping the title opens the month jump. */
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
  const arrow = [styles.arrow, { backgroundColor: colors.surface, borderColor: colors.border }];
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          onPress={onPrev}
          accessibilityRole="button"
          accessibilityLabel={prevLabel}
          style={arrow}
        >
          <Icon name="chevron-left" size={CHEVRON} color={colors.text} />
        </Pressable>
        <Pressable
          onPress={onOpenJump}
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${jumpLabel}`}
          style={styles.titles}
        >
          <Text style={[Typography.heading, { color: colors.text }]}>{title}</Text>
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{subtitle}</Text>
        </Pressable>
        <Pressable
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel={nextLabel}
          style={arrow}
        >
          <Icon name="chevron-right" size={CHEVRON} color={colors.text} />
        </Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, alignSelf: 'stretch' },
  titles: {
    flex: 1,
    alignItems: 'center',
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
  },
  arrow: {
    width: Layout.minTouchTarget,
    height: Layout.minTouchTarget,
    borderRadius: Layout.minTouchTarget / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: {
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
});
