import { StyleSheet, Text, View } from 'react-native';
import { DayCell, type DayCellProps } from '@/components/DayCell';
import type { ColorTokens } from '@/themes/Colors';
import { Spacing, Typography } from '@/themes/Theme';

export type MonthGridCell = Omit<DayCellProps, 'colors'> & { key: string };

interface MonthGridProps {
  weekdayLabels: readonly string[];
  weeks: readonly (readonly MonthGridCell[])[];
  colors: ColorTokens;
}

export function MonthGrid({ weekdayLabels, weeks, colors }: MonthGridProps) {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        {weekdayLabels.map((label, index) => (
          <Text
            key={label}
            style={[
              Typography.caption,
              styles.weekday,
              { color: index === 0 ? colors.holiday : colors.textMuted },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
      {weeks.map((week) => (
        <View key={week[0].key} style={styles.row}>
          {week.map(({ key, ...cell }) => (
            <DayCell key={key} {...cell} colors={colors} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: Spacing.xs },
  row: { flexDirection: 'row', gap: Spacing.xs },
  weekday: { flex: 1, textAlign: 'center', paddingVertical: Spacing.xs },
});
