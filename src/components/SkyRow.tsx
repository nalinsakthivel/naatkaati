import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from '@/components/Icon';
import { MoonDisc } from '@/components/MoonDisc';
import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';

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

const MOON_SIZE = Spacing.lg + Spacing.xs;
const ICON_SIZE = Spacing.lg + Spacing.xs;
const VALUE_MIN_SCALE = 0.8;

/** Sunrise, sunset and moon phase as one bordered card of three cells. */
export function SkyRow({ sunrise, sunset, moon, colors }: SkyRowProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Cell
        icon={<SkyIcon name="sunrise" colors={colors} />}
        value={sunrise.value}
        label={sunrise.label}
        colors={colors}
      />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Cell
        icon={<SkyIcon name="sunset" colors={colors} />}
        value={sunset.value}
        label={sunset.label}
        colors={colors}
      />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Cell
        icon={
          <MoonDisc
            angle={moon.angle}
            illumination={moon.illumination}
            size={MOON_SIZE}
            colors={colors}
          />
        }
        value={moon.value}
        label={moon.label}
        colors={colors}
      />
    </View>
  );
}

function SkyIcon({ name, colors }: { name: IconName; colors: ColorTokens }) {
  return <Icon name={name} size={ICON_SIZE} color={colors.primary} />;
}

function Cell({
  icon,
  value,
  label,
  colors,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  colors: ColorTokens;
}) {
  return (
    <View style={styles.cell} accessible accessibilityLabel={`${label}: ${value}`}>
      {icon}
      <View style={styles.text}>
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={VALUE_MIN_SCALE}
          style={[Typography.bodyStrong, { color: colors.text }]}
        >
          {value}
        </Text>
        <Text numberOfLines={2} style={[Typography.caption, { color: colors.textMuted }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.card,
    borderWidth: 1,
    paddingVertical: Spacing.md,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  text: { flex: 1 },
  divider: { width: 1, alignSelf: 'stretch' },
});
