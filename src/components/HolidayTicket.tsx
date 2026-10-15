import type { ColorTokens } from '@/themes/Colors';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { StyleSheet, Text, View } from 'react-native';

interface HolidayTicketProps {
  dateLabel: string;
  name: string;
  tone?: 'holiday' | 'commemoration';
  divided?: boolean;
  colors: ColorTokens;
}

export function HolidayTicket({
  dateLabel,
  name,
  tone = 'holiday',
  divided = false,
  colors,
}: HolidayTicketProps) {
  const accent = tone === 'holiday' ? colors.holiday : colors.commemoration;
  return (
    <View
      style={[
        styles.row,
        divided && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <Text style={[Typography.bodyStrong, styles.date, { color: accent }]}>{dateLabel}</Text>
      <Text style={[Typography.body, styles.name, { color: colors.text }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: Layout.minTouchTarget,
    paddingVertical: Spacing.sm,
  },
  date: { width: Layout.minTouchTarget + Spacing.lg },
  name: { flex: 1 },
});
