import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';
import { StyleSheet, Text, View } from 'react-native';

interface CommemorationCardProps {
  name: string;
  kindLabel: string;
  description: string;
  designations: readonly string[];
  colors: ColorTokens;
}

const MARKER = Spacing.lg;

export function CommemorationCard({
  name,
  kindLabel,
  description,
  designations,
  colors,
}: CommemorationCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.commemorationSoft }]}>
      <View style={styles.header}>
        <View style={[styles.marker, { backgroundColor: colors.commemoration }]} />
        <Text style={[Typography.caption, { color: colors.commemoration }]}>{kindLabel}</Text>
      </View>
      <Text style={[Typography.heading, { color: colors.text }]}>{name}</Text>
      <Text style={[Typography.body, { color: colors.text }]}>{description}</Text>
      {designations.map((designation) => (
        <Text key={designation} style={[Typography.caption, { color: colors.textMuted }]}>
          {designation}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.card, padding: Spacing.lg, gap: Spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  marker: { width: MARKER / 2, height: MARKER / 2 },
});
