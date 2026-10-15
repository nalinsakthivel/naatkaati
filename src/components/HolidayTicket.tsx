import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface HolidayTicketProps {
  dateLabel: string;
  name: string;
  tone?: 'holiday' | 'commemoration';
  colors: ColorTokens;
}

/** One holiday in the month list: a red date stub beside the official name. */
export function HolidayTicket({ dateLabel, name, tone = 'holiday', colors }: HolidayTicketProps) {
  const accent = tone === 'holiday' ? colors.holiday : colors.commemoration;
  const soft = tone === 'holiday' ? colors.holidaySoft : colors.commemorationSoft;
  return (
    <View style={styles.row}>
      <View style={[styles.stub, { backgroundColor: soft, borderColor: accent }]}>
        <Text style={[Typography.bodyStrong, { color: accent }]}>{dateLabel}</Text>
      </View>
      <Text style={[Typography.body, styles.name, { color: colors.text }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
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
