import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MoonDisc } from '@/components/MoonDisc';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Spacing, Typography } from '@/themes/Theme';

export interface SkyItem {
  label: string;
  value: string;
}

export interface MoonItem extends SkyItem {
  angle: number;
  illumination: number;
}

interface SkyRowProps {
  sunrise: SkyItem;
  sunset: SkyItem;
  moon: MoonItem;
  colors: ColorTokens;
}

const MOON_SIZE = Spacing.xl + Spacing.xs;

/**
 * Sunrise, sunset and moon phase as three columns at the foot of the date sheet. Each column puts
 * its main value in a slot of the same height, with the label underneath, so values line up even
 * when a Tamil label wraps to two lines.
 */
export function SkyRow({ sunrise, sunset, moon, colors }: SkyRowProps) {
  const divider = [styles.divider, { backgroundColor: colors.border }];
  return (
    <View style={styles.row}>
      <Column label={sunrise.label} colors={colors}>
        <Text style={[Typography.heading, { color: colors.text }]}>{sunrise.value}</Text>
      </Column>
      <View style={divider} />
      <Column label={sunset.label} colors={colors}>
        <Text style={[Typography.heading, { color: colors.text }]}>{sunset.value}</Text>
      </Column>
      <View style={divider} />
      <Column
        label={moon.value}
        colors={colors}
        accessibilityLabel={`${moon.label}: ${moon.value}`}
      >
        <MoonDisc
          angle={moon.angle}
          illumination={moon.illumination}
          size={MOON_SIZE}
          colors={colors}
        />
      </Column>
    </View>
  );
}

function Column({
  label,
  colors,
  accessibilityLabel,
  children,
}: {
  label: string;
  colors: ColorTokens;
  accessibilityLabel?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.column} accessible accessibilityLabel={accessibilityLabel}>
      <View style={styles.slot}>{children}</View>
      <Text style={[Typography.caption, styles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.lg },
  column: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  slot: { height: MOON_SIZE, justifyContent: 'center', alignItems: 'center' },
  label: { textAlign: 'center' },
  divider: { width: 1, alignSelf: 'stretch', minHeight: Layout.minTouchTarget },
});
