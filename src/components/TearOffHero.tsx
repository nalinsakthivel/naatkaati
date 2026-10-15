import { HeroDate } from '@/components/HeroDate';
import type { ColorTokens } from '@/themes/Colors';
import { Motion } from '@/themes/Theme';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';

type HeroProps = Omit<Parameters<typeof HeroDate>[0], 'colors' | 'children'>;

interface TearOffHeroProps {
  dateKey: string;
  hero: HeroProps;
  colors: ColorTokens;
}

interface Snapshot {
  key: string;
  hero: HeroProps;
}

const TEAR_DISTANCE = 420;
const TEAR_ANGLE = '-9deg';
const SETTLE_OFFSET = -28;

export function TearOffHero({ dateKey, hero, colors }: TearOffHeroProps) {
  const [tearing, setTearing] = useState<Snapshot | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(1)).current;
  const last = useRef<Snapshot>({ key: dateKey, hero });

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  // Layout effect so the old sheet is placed before the new one is painted (no flash).
  useLayoutEffect(() => {
    const previous = last.current;
    if (previous.key !== dateKey && !reduceMotion) {
      if (dateKey > previous.key) {
        setTearing(previous);
        progress.setValue(0);
        Animated.timing(progress, {
          toValue: 1,
          duration: Motion.normal + Motion.fast,
          useNativeDriver: true,
        }).start(() => setTearing(null));
      } else {
        settle.setValue(0);
        Animated.timing(settle, {
          toValue: 1,
          duration: Motion.normal,
          useNativeDriver: true,
        }).start();
      }
    }
    last.current = { key: dateKey, hero };
  }, [dateKey, hero, reduceMotion, progress, settle]);

  return (
    <View>
      <Animated.View
        style={{
          opacity: settle,
          transform: [
            {
              translateY: settle.interpolate({
                inputRange: [0, 1],
                outputRange: [SETTLE_OFFSET, 0],
              }),
            },
          ],
        }}
      >
        <HeroDate {...hero} colors={colors} />
      </Animated.View>
      {tearing ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlay,
            {
              opacity: progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -TEAR_DISTANCE],
                  }),
                },
                {
                  rotate: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', TEAR_ANGLE],
                  }),
                },
              ],
            },
          ]}
        >
          <HeroDate {...tearing.hero} colors={colors} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
});
