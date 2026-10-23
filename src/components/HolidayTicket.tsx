import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface HolidayTicketProps {
  dateLabel: string;
  name: string;
  tone?: 'holiday' | 'commemoration';
  colors: ColorTokens;
  onPress?: () => void;
}

/** One holiday in the month list: a red date stub beside the official name. */
export function HolidayTicket({
  dateLabel,
  name,
  tone = 'holiday',
  colors,
  onPress,
}: HolidayTicketProps) {
  const accent = tone === 'holiday' ? colors.holiday : colors.commemoration;
  const soft = tone === 'holiday' ? colors.holidaySoft : colors.commemorationSoft;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${dateLabel}, ${name}`}
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.stub, { backgroundColor: soft, borderColor: accent }]}>
        <Text style={[Typography.bodyStrong, { color: accent }]}>{dateLabel}</Text>
      </View>
      <Text style={[Typography.body, styles.name, { color: colors.text }]}>{name}</Text>
      {onPress ? (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[Typography.heading, { color: colors.textMuted }]}
        >
          ›
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: Layout.minTouchTarget,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.banner,
  },
  stub: {
    minWidth: Layout.minTouchTarget + Spacing.lg,
    alignItems: 'center',
    borderRadius: Radius.cell,
    borderWidth: 1,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  name: { flex: 1 },
});
