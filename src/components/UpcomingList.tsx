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

const STUB = Spacing.xs + Spacing.xxs;

/** The next holiday and the next commemoration, each opening that day. */
export function UpcomingList({ title, rows, colors }: UpcomingListProps) {
  if (rows.length === 0) return null;
  return (
    <View style={styles.block}>
      <Text style={[Typography.heading, { color: colors.text }]}>{title}</Text>
      {rows.map((row) => {
        const accent = row.tone === 'holiday' ? colors.holiday : colors.commemoration;
        return (
          <Pressable
            key={row.id}
            onPress={row.onPress}
            accessibilityRole="button"
            accessibilityLabel={`${row.kindLabel}: ${row.name}, ${row.whenLabel}`}
            style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.stub, { backgroundColor: accent }]} />
            <View style={styles.text}>
              <Text style={[Typography.caption, { color: accent }]}>{row.kindLabel}</Text>
              <Text style={[Typography.bodyStrong, { color: colors.text }]}>{row.name}</Text>
            </View>
            <Text style={[Typography.bodyStrong, styles.when, { color: colors.text }]}>
              {row.whenLabel}
            </Text>
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
    borderRadius: Radius.banner,
    borderWidth: 1,
    overflow: 'hidden',
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  stub: { alignSelf: 'stretch', width: STUB },
  text: { flex: 1, paddingVertical: Spacing.md },
  when: { textAlign: 'right', flexShrink: 1, maxWidth: '50%' },
});
