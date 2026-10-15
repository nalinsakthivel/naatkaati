import { StyleSheet, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Spacing } from '@/themes/Theme';

interface PerforationProps {
  colors: ColorTokens;
}

const NOTCH = Spacing.xl;

/** Tear line with half-circle notches at both edges. The parent sheet must clip its overflow. */
export function Perforation({ colors }: PerforationProps) {
  return (
    <View style={styles.wrap} importantForAccessibility="no-hide-descendants">
      <View style={styles.clip}>
        <View style={[styles.dashed, { borderColor: colors.border }]} />
      </View>
      <View style={[styles.notch, styles.left, { backgroundColor: colors.background }]} />
      <View style={[styles.notch, styles.right, { backgroundColor: colors.background }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: NOTCH, justifyContent: 'center' },
  // The dashed border only renders on Android when drawn on a taller clipped box.
  clip: { height: 1, overflow: 'hidden', marginHorizontal: NOTCH },
  dashed: { height: Spacing.xs, borderWidth: 1, borderStyle: 'dashed' },
  notch: { position: 'absolute', width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2 },
  left: { left: -NOTCH / 2 },
  right: { right: -NOTCH / 2 },
});
