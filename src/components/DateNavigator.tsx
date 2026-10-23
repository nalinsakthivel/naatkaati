import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface DateNavigatorProps {
  previousLabel: string;
  nextLabel: string;
  todayLabel: string;
  isToday: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  colors: ColorTokens;
}

/** Visible alternatives to the optional swipe gesture, with full spoken labels. */
export function DateNavigator({
  previousLabel,
  nextLabel,
  todayLabel,
  isToday,
  onPrevious,
  onNext,
  onToday,
  colors,
}: DateNavigatorProps) {
  const button = [styles.button, { backgroundColor: colors.surface, borderColor: colors.border }];
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={previousLabel}
        onPress={onPrevious}
        style={button}
      >
        <Text style={[Typography.title, { color: colors.primary }]}>‹</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onToday}
        accessibilityState={{ selected: isToday }}
        style={[
          ...button,
          styles.today,
          isToday && { backgroundColor: colors.today, borderColor: colors.today },
        ]}
      >
        <Text style={[Typography.button, { color: isToday ? colors.textOnToday : colors.primary }]}>
          {todayLabel}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        onPress={onNext}
        style={button}
      >
        <Text style={[Typography.title, { color: colors.primary }]}>›</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm },
  button: {
    minHeight: Layout.minTouchTarget,
    minWidth: Layout.minTouchTarget,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderRadius: Radius.cell,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: { flex: 1 },
});
