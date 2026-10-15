import type { ColorTokens } from '@/themes/Colors';
import { FontFamily, Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface DayCellProps {
  day: string;
  tamilLabel: string;
  inMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  isTamilMonthStart: boolean;
  isHoliday: boolean;
  hasCommemoration: boolean;
  accessibilityLabel: string;
  onPress: () => void;
  colors: ColorTokens;
}

export function DayCell({
  day,
  tamilLabel,
  inMonth,
  isToday,
  isSunday,
  isTamilMonthStart,
  isHoliday,
  hasCommemoration,
  accessibilityLabel,
  onPress,
  colors,
}: DayCellProps) {
  const numberColor = !inMonth
    ? colors.otherMonthText
    : isToday
      ? colors.textOnToday
      : isHoliday || isSunday
        ? colors.holiday
        : colors.text;
  const monthStartColor = isTamilMonthStart && inMonth && !isToday;
  const subColor = monthStartColor
    ? colors.primary
    : !inMonth
      ? colors.otherMonthText
      : isToday
        ? colors.textOnToday
        : colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.cell,
        isToday && { backgroundColor: colors.today },
        isHoliday && inMonth && !isToday && { backgroundColor: colors.holidaySoft },
      ]}
    >
      <Text style={[Typography.gridDay, { color: numberColor }]}>{day}</Text>
      <Text
        style={[
          Typography.gridTamilDay,
          monthStartColor && { fontFamily: FontFamily.bodySemiBold },
          { color: subColor },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {tamilLabel}
      </Text>
      <View style={styles.markers}>
        {isHoliday && inMonth ? (
          <View
            style={[styles.dot, { backgroundColor: isToday ? colors.textOnToday : colors.holiday }]}
          />
        ) : null}
        {hasCommemoration && inMonth ? (
          <View
            style={[
              styles.square,
              { backgroundColor: isToday ? colors.textOnToday : colors.commemoration },
            ]}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const MARKER_SIZE = Spacing.xs + Spacing.xxs;

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    minHeight: Layout.minTouchTarget + Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.cell,
    paddingHorizontal: Spacing.xxs,
  },
  markers: { flexDirection: 'row', gap: Spacing.xxs, height: MARKER_SIZE },
  dot: { width: MARKER_SIZE, height: MARKER_SIZE, borderRadius: MARKER_SIZE / 2 },
  square: { width: MARKER_SIZE, height: MARKER_SIZE },
});
