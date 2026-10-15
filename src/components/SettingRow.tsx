import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Icon, type IconName } from '@/components/Icon';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface SettingRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  /** Rows with `onPress` show a chevron. Rows with `value`/`onValueChange` show a switch. */
  onPress?: () => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  /** Right-aligned text, e.g. a sync status */
  trailingText?: string;
  divided?: boolean;
  colors: ColorTokens;
}

const TILE = Layout.minTouchTarget - Spacing.sm;

/** One settings row: tinted icon tile, title with a muted subtitle, then a chevron or a switch. */
export function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  value,
  onValueChange,
  trailingText,
  divided = false,
  colors,
}: SettingRowProps) {
  const isSwitch = value !== undefined && onValueChange !== undefined;
  const content: ReactNode = (
    <>
      <View style={[styles.tile, { backgroundColor: colors.commemorationSoft }]}>
        <Icon name={icon} size={Spacing.xl - Spacing.xs} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={[Typography.bodyStrong, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {trailingText ? (
        <Text style={[Typography.caption, { color: colors.textMuted }]}>{trailingText}</Text>
      ) : null}
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
          accessibilityLabel={title}
        />
      ) : onPress ? (
        <Icon name="chevron-right" size={Spacing.xl - Spacing.xs} color={colors.textMuted} />
      ) : null}
    </>
  );
  const rowStyle = [
    styles.row,
    divided && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
  ];
  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" style={rowStyle}>
        {content}
      </Pressable>
    );
  }
  return <View style={rowStyle}>{content}</View>;
}

export function SettingGroup({
  title,
  colors,
  children,
}: {
  title: string;
  colors: ColorTokens;
  children: ReactNode;
}) {
  return (
    <View style={styles.group}>
      <Text style={[Typography.caption, styles.groupTitle, { color: colors.textMuted }]}>
        {title}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.sm },
  groupTitle: { paddingHorizontal: Spacing.xs },
  card: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: Layout.minTouchTarget + Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.cell - Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
});
