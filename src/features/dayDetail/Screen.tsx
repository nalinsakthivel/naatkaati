import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '@/themes/Theme';
import { useDayDetailScreen } from './useScreen';

export function DayDetailScreen() {
  const { date, title, colors } = useDayDetailScreen();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[Typography.title, { color: colors.text }]}>{title}</Text>
      <Text style={[Typography.body, { color: colors.textMuted }]}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
});
