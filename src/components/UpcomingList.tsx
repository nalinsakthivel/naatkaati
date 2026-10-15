import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

export interface UpcomingRow {
  id: string;
  kindLabel: string;
  name: string;
  /** e.g. "In 5 days" */
  whenLabel: string;
  tone: 'holiday' | 'commemoration';
  onPress: () => void;
}

interface UpcomingListProps {
  title: string;
  rows: readonly UpcomingRow[];
  colors: ColorTokens;
}

const MARKER = Spacing.md;

/** The next holiday and the next commemoration, each opening that day. */
export function UpcomingList({ title, rows, colors }: UpcomingListProps) {
  if (rows.length === 0) return null;
  return (
    <View style={styles.block}>
      <Text style={[Typography.heading, { color: colors.text }]}>{title}</Text>
      {rows.map((row) => {
        const isHoliday = row.tone === 'holiday';
        const accent = isHoliday ? colors.holiday : colors.commemoration;
        const soft = isHoliday ? colors.holidaySoft : colors.commemorationSoft;
        return (
          <Pressable
            key={row.id}
            onPress={row.onPress}
            accessibilityRole="button"
            accessibilityLabel={`${row.kindLabel}: ${row.name}, ${row.whenLabel}`}
            style={[styles.row, { backgroundColor: colors.surface }]}
          >
            <View style={[styles.badge, { backgroundColor: soft }]}>
              {/* Round = holiday, square = commemoration, as in the month grid */}
              <View
                style={[
                  styles.marker,
                  { backgroundColor: accent },
                  isHoliday && styles.markerRound,
                ]}
              />
            </View>
            <View style={styles.text}>
              <Text style={[Typography.caption, { color: accent }]}>{row.kindLabel}</Text>
              <Text style={[Typography.bodyStrong, { color: colors.text }]}>{row.name}</Text>
            </View>
            <View style={[styles.when, { backgroundColor: colors.background }]}>
              <Text style={[Typography.caption, { color: colors.text }]}>{row.whenLabel}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Layout.minTouchTarget + Spacing.md,
    borderRadius: Radius.card,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  badge: {
    width: Layout.minTouchTarget,
    height: Layout.minTouchTarget,
    borderRadius: Radius.banner,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: { width: MARKER, height: MARKER },
  markerRound: { borderRadius: MARKER / 2 },
  text: { flex: 1 },
  when: {
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
});
