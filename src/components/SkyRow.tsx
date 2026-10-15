import { MoonDisc } from '@/components/MoonDisc';
import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

export function SkyRow({ sunrise, sunset, moon, colors }: SkyRowProps) {
  return (
    <View style={styles.row}>
      <Tile label={sunrise.label} colors={colors}>
        <Text style={[Typography.heading, { color: colors.onHero }]}>{sunrise.value}</Text>
      </Tile>
      <Tile label={sunset.label} colors={colors}>
        <Text style={[Typography.heading, { color: colors.onHero }]}>{sunset.value}</Text>
      </Tile>
      <Tile label={moon.value} colors={colors} accessibilityLabel={`${moon.label}: ${moon.value}`}>
        <MoonDisc
          angle={moon.angle}
          illumination={moon.illumination}
          size={MOON_SIZE}
          colors={colors}
        />
      </Tile>
    </View>
  );
}

function Tile({
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
    <View
      style={[styles.tile, { backgroundColor: colors.heroSoft }]}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.slot}>{children}</View>
      <Text style={[Typography.caption, styles.label, { color: colors.onHeroMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch', gap: Spacing.sm },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.banner,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  slot: { height: MOON_SIZE, justifyContent: 'center', alignItems: 'center' },
  label: { textAlign: 'center' },
});
