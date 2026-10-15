import { useRef, type ReactNode } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

interface SwipeViewProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: ReactNode;
}

const MIN_TRAVEL = 24;
const COMMIT_DISTANCE = 64;
const HORIZONTAL_BIAS = 1.5;

export function SwipeView({ onSwipeLeft, onSwipeRight, children }: SwipeViewProps) {
  const callbacks = useRef({ onSwipeLeft, onSwipeRight });
  callbacks.current = { onSwipeLeft, onSwipeRight };

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_event, gesture) =>
        Math.abs(gesture.dx) > MIN_TRAVEL &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy) * HORIZONTAL_BIAS,
      onPanResponderRelease: (_event, gesture) => {
        if (gesture.dx <= -COMMIT_DISTANCE) callbacks.current.onSwipeLeft();
        else if (gesture.dx >= COMMIT_DISTANCE) callbacks.current.onSwipeRight();
      },
    }),
  ).current;

  return (
    <View style={styles.fill} {...responder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
