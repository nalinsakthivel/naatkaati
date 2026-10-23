import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Spacing, Typography } from '@/themes/Theme';

export function ScreenHeader({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle?: string;
  colors: ColorTokens;
}) {
  return (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={[Typography.screenTitle, { color: colors.text }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[Typography.body, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({ header: { gap: Spacing.xs } });
