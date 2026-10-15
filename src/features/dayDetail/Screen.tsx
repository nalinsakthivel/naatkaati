import { ScrollView, StyleSheet, Text } from 'react-native';
import { DayBody } from '@/components/DayBody';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { useDayDetailScreen } from './useScreen';

export function DayDetailScreen() {
  const { invalidDateLabel, ...day } = useDayDetailScreen();
  return (
    <ScrollView
      style={{ backgroundColor: day.colors.background }}
      contentContainerStyle={styles.content}
    >
      {invalidDateLabel ? (
        <Text style={[Typography.body, { color: day.colors.holiday }]}>{invalidDateLabel}</Text>
      ) : null}
      <DayBody {...day} />
    </ScrollView>
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
});
