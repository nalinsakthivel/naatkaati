import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Spacing } from '@/themes/Theme';

interface SheetBandProps {
  children: ReactNode;
  colors: ColorTokens;
}

const HOLE_SIZE = Spacing.lg;
const STRIPE = Spacing.xs;

/** Header strip of a wall-calendar sheet: binder holes, content row, and a Manjal stripe. */
export function SheetBand({ children, colors }: SheetBandProps) {
  return (
    <View
      style={[styles.band, { backgroundColor: colors.primary, borderBottomColor: colors.today }]}
    >
      <View style={styles.holes} importantForAccessibility="no-hide-descendants">
        <View style={[styles.hole, { backgroundColor: colors.background }]} />
        <View style={[styles.hole, { backgroundColor: colors.background }]} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: STRIPE,
    gap: Spacing.sm,
  },
  holes: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xxxl },
  hole: {
    width: HOLE_SIZE,
    height: HOLE_SIZE / 2,
    borderBottomLeftRadius: HOLE_SIZE,
    borderBottomRightRadius: HOLE_SIZE,
  },
});
