import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { HeroDate } from '@/components/HeroDate';
import type { ColorTokens } from '@/themes/Colors';
import { Motion } from '@/themes/Theme';

type HeroProps = Omit<Parameters<typeof HeroDate>[0], 'colors' | 'children'>;

interface TearOffHeroProps {
  /** The civil date shown. Changing it triggers the animation. */
  dateKey: string;
  hero: HeroProps;
  colors: ColorTokens;
  children?: ReactNode;
}

interface Snapshot {
  key: string;
  hero: HeroProps;
  children?: ReactNode;
}

const TEAR_DISTANCE = 420;
const TEAR_ANGLE = '-9deg';
const SETTLE_OFFSET = -28;

/**
 * The date sheet. Moving to a later day tears the old sheet away; moving to an earlier day
 * settles the sheet back into place. This is the app's only decorative motion, and it only
 * runs in response to the user changing the date. It is skipped when reduce-motion is on.
 */
export function TearOffHero({ dateKey, hero, colors, children }: TearOffHeroProps) {
  const [tearing, setTearing] = useState<Snapshot | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(1)).current;
  const last = useRef<Snapshot>({ key: dateKey, hero, children });

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
    last.current = { key: dateKey, hero, children };
  }, [dateKey, hero, children, reduceMotion, progress, settle]);

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
        <HeroDate {...hero} colors={colors}>
          {children}
        </HeroDate>
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
          <HeroDate {...tearing.hero} colors={colors} showStack={false}>
            {tearing.children}
          </HeroDate>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
});
