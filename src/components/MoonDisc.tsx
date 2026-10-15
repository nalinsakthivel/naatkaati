import { StyleSheet, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';

interface MoonDiscProps {
  /** Elongation from the sun, 0-360. Below 180 the moon is waxing (lit on the right). */
  angle: number;
  /** Lit fraction, 0-1 */
  illumination: number;
  size: number;
  colors: ColorTokens;
}

/** Stylised phase disc: a lit disc slid across a dark one. The phase name is always shown as text too. */
export function MoonDisc({ angle, illumination, size, colors }: MoonDiscProps) {
  const shift = (1 - illumination) * size * (angle < 180 ? 1 : -1);
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.disc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.border,
          borderColor: colors.textMuted,
        },
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          transform: [{ translateX: shift }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  disc: { overflow: 'hidden', borderWidth: 1 },
});
