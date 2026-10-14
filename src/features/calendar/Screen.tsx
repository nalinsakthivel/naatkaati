import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '@/themes/Theme';
import { useCalendarScreen } from './useScreen';

export function CalendarScreen() {
  const { title, colors } = useCalendarScreen();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[Typography.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
});
