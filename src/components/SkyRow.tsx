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

/** Sunrise, sunset and moon phase as three columns at the foot of the date sheet. */
export function SkyRow({ sunrise, sunset, moon, colors }: SkyRowProps) {
  const divider = [styles.divider, { backgroundColor: colors.border }];
  return (
    <View style={styles.row}>
      <Column item={sunrise} colors={colors} />
      <View style={divider} />
      <Column item={sunset} colors={colors} />
      <View style={divider} />
      <Column
        item={moon}
        colors={colors}
        leading={
          <MoonDisc
            angle={moon.angle}
            illumination={moon.illumination}
            size={MOON_SIZE}
            colors={colors}
          />
        }
      />
    </View>
  );
}

function Column({
  item,
  colors,
  leading,
}: {
  item: SkyItem;
  colors: ColorTokens;
  leading?: React.ReactNode;
}) {
  return (
    <View style={styles.column}>
      {leading}
      <Text style={[Typography.caption, { color: colors.textMuted }]}>{item.label}</Text>
      <Text style={[Typography.bodyStrong, styles.value, { color: colors.text }]}>
        {item.value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch', padding: Spacing.lg },
  column: { flex: 1, alignItems: 'center', gap: Spacing.xxs },
  value: { textAlign: 'center' },
  divider: { width: 1, marginVertical: Spacing.xs, minHeight: Layout.minTouchTarget },
});
