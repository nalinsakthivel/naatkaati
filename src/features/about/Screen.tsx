import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { useAboutScreen } from './useScreen';

export function AboutScreen() {
  const s = useAboutScreen();
  return (
    <ScrollView
      style={{ backgroundColor: s.colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[Typography.body, { color: s.colors.textMuted }]}>{s.versionLabel}</Text>
      <Text style={[Typography.body, { color: s.colors.text }]}>{s.tagline}</Text>

      <View style={styles.section}>
        <Text style={[Typography.heading, { color: s.colors.primary }]}>{s.method.title}</Text>
        <Text style={[Typography.body, { color: s.colors.text }]}>{s.method.body}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[Typography.heading, { color: s.colors.primary }]}>{s.licenses.title}</Text>
        {s.licenses.lines.map((line) => (
          <Text key={line} style={[Typography.body, { color: s.colors.text }]}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[Typography.heading, { color: s.colors.primary }]}>{s.report.title}</Text>
        <Pressable onPress={s.onReport} accessibilityRole="link" style={styles.link}>
          <Text style={[Typography.button, { color: s.colors.primary }]}>{s.report.action}</Text>
        </Pressable>
      </View>
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
  section: { gap: Spacing.sm },
  link: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
});
