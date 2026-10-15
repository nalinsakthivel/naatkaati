import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { DayBody } from '@/components/DayBody';
import { SwipeView } from '@/components/SwipeView';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useDayDetailScreen } from './useScreen';

export function DayDetailScreen() {
  const { invalidDateLabel, isToday, jumpLabel, onNextDay, onPreviousDay, onJumpToToday, ...day } =
    useDayDetailScreen();
  return (
    <SwipeView onSwipeLeft={onNextDay} onSwipeRight={onPreviousDay}>
      <ScrollView
        style={{ backgroundColor: day.colors.background }}
        contentContainerStyle={styles.content}
      >
        {invalidDateLabel ? (
          <Text style={[Typography.body, { color: day.colors.holiday }]}>{invalidDateLabel}</Text>
        ) : null}
        {isToday ? null : (
          <Pressable
            onPress={onJumpToToday}
            accessibilityRole="button"
            style={[styles.jump, { backgroundColor: day.colors.primary }]}
          >
            <Text style={[Typography.button, { color: day.colors.textOnPrimary }]}>
              {jumpLabel}
            </Text>
          </Pressable>
        )}
        <DayBody {...day} />
      </ScrollView>
    </SwipeView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Layout.screenPaddingH,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  jump: {
    alignSelf: 'center',
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.chip,
  },
});
