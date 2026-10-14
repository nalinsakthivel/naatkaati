import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '@/themes/Theme';
import { useTodayScreen } from './useScreen';

export function TodayScreen() {
  const { title, colors } = useTodayScreen();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[Typography.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
});
