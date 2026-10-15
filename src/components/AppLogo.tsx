import { StyleSheet, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';

// All measurements are ratios of the tile size, so the mark scales from a 34 dp chip to a splash tile.
const TILE_RADIUS = 0.29;
const FRAME_WIDTH = 0.6;
const FRAME_HEIGHT = 0.56;
const FRAME_RADIUS = 0.15;
const STROKE = 0.05;
const BAR_TOP = 0.09;
const SQUARE = 0.1;
const SQUARE_GAP = 0.05;
const GRID_TOP = 0.07;
const SOFT = 0.55;

interface AppLogoProps {
  size: number;
  /** Tile fill */
  tile: string;
  /** Calendar frame and squares */
  ink: string;
  colors: ColorTokens;
}

/** The brand mark: a calendar whose last square is the Manjal "today". Drawn from Views, no image. */
export function AppLogo({ size, tile, ink, colors }: AppLogoProps) {
  const stroke = Math.max(2, size * STROKE);
  const square = {
    width: size * SQUARE,
    height: size * SQUARE,
    borderRadius: size * SQUARE * 0.25,
  };
  const soft = { ...square, backgroundColor: ink, opacity: SOFT };
  return (
    <View
      accessibilityRole="image"
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * TILE_RADIUS, backgroundColor: tile },
      ]}
    >
      <View
        style={{
          width: size * FRAME_WIDTH,
          height: size * FRAME_HEIGHT,
          borderRadius: size * FRAME_RADIUS,
          borderWidth: stroke,
          borderColor: ink,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            alignSelf: 'stretch',
            height: stroke,
            marginTop: size * BAR_TOP,
            backgroundColor: ink,
          }}
        />
        <View
          style={[
            styles.grid,
            {
              gap: size * SQUARE_GAP,
              marginTop: size * GRID_TOP,
              width: size * (SQUARE * 2 + SQUARE_GAP),
            },
          ]}
        >
          <View style={soft} />
          <View style={soft} />
          <View style={soft} />
          <View style={[square, { backgroundColor: colors.today }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
