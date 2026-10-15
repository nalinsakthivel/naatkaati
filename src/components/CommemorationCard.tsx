import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';

interface CommemorationCardProps {
  name: string;
  kindLabel: string;
  description: string;
  designations: readonly string[];
  colors: ColorTokens;
}

const BAR = Spacing.xs + Spacing.xxs;

/** A commemoration day. The square bar mirrors the square marker used in the month grid. */
export function CommemorationCard({
  name,
  kindLabel,
  description,
  designations,
  colors,
}: CommemorationCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.commemorationSoft }]}>
      <View style={[styles.bar, { backgroundColor: colors.commemoration }]} />
      <View style={styles.text}>
        <Text style={[Typography.heading, { color: colors.text }]}>{name}</Text>
        <Text style={[Typography.caption, { color: colors.commemoration }]}>{kindLabel}</Text>
        <Text style={[Typography.body, { color: colors.text }]}>{description}</Text>
        {designations.map((designation) => (
          <Text key={designation} style={[Typography.caption, { color: colors.textMuted }]}>
            {designation}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: Radius.banner, overflow: 'hidden' },
  bar: { width: BAR },
  text: { flex: 1, padding: Spacing.lg, gap: Spacing.xs },
});
