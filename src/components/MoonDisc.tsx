import type { ColorTokens } from '@/themes/Colors';
import { StyleSheet, View } from 'react-native';

interface MoonDiscProps {
  angle: number;
  illumination: number;
  size: number;
  colors: ColorTokens;
}

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
          backgroundColor: colors.heroSoft,
          borderColor: colors.onHeroMuted,
        },
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.onHero,
          transform: [{ translateX: shift }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  disc: { overflow: 'hidden', borderWidth: 1 },
});
