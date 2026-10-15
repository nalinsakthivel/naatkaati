import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface TimeBannerProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  colors: ColorTokens;
}

/** Non-blocking notice about the device clock. The text carries the meaning, not the colour. */
export function TimeBanner({ message, actionLabel, onAction, colors }: TimeBannerProps) {
  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: colors.warningSoft }]}
    >
      <Text style={[Typography.body, { color: colors.warning }]}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" style={styles.action}>
          <Text style={[Typography.button, { color: colors.primary }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: Radius.banner, padding: Spacing.lg, gap: Spacing.xs },
  action: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
});
