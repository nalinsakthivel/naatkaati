import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Spacing, Typography } from '@/themes/Theme';

interface ScreenHeaderProps {
  /** Small brand line above the title */
  kicker: string;
  title: string;
  subtitle?: string;
  /** Right-aligned control, e.g. the location pill */
  action?: ReactNode;
  colors: ColorTokens;
}

const KICKER_SPACING = 1.5;

export function ScreenHeader({ kicker, title, subtitle, action, colors }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text style={[Typography.caption, styles.kicker, { color: colors.primary }]}>{kicker}</Text>
        <Text accessibilityRole="header" style={[Typography.title, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  titles: { flex: 1, gap: Spacing.xxs },
  kicker: { letterSpacing: KICKER_SPACING },
});
