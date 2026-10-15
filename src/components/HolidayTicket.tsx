import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface HolidayTicketProps {
  dateLabel: string;
  name: string;
  colors: ColorTokens;
}

/** One holiday in the month list: a red date stub beside the official name. */
export function HolidayTicket({ dateLabel, name, colors }: HolidayTicketProps) {
  return (
    <View style={styles.row}>
      <View
        style={[styles.stub, { backgroundColor: colors.holidaySoft, borderColor: colors.holiday }]}
      >
        <Text style={[Typography.bodyStrong, { color: colors.holiday }]}>{dateLabel}</Text>
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
