import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useAboutScreen } from './useScreen';

export function AboutScreen() {
  const s = useAboutScreen();
  const card = [
    styles.section,
    { backgroundColor: s.colors.surface, borderColor: s.colors.border },
  ];
  return (
    <ScrollView
      style={{ backgroundColor: s.colors.background }}
      contentContainerStyle={styles.content}
    >
      <ScreenHeader title={s.title} subtitle={s.versionLabel} colors={s.colors} />
      <Text style={[Typography.body, { color: s.colors.textMuted }]}>{s.tagline}</Text>
      <View style={card}>
        <Text accessibilityRole="header" style={[Typography.heading, { color: s.colors.text }]}>
          {s.method.title}
        </Text>
        <Text style={[Typography.body, { color: s.colors.textMuted }]}>{s.method.body}</Text>
      </View>
      <View style={card}>
        <Text accessibilityRole="header" style={[Typography.heading, { color: s.colors.text }]}>
          {s.licenses.title}
        </Text>
        {s.licenses.lines.map((line) => (
          <Text key={line} style={[Typography.body, { color: s.colors.textMuted }]}>
            {line}
          </Text>
        ))}
      </View>
      <View style={card}>
        <Text accessibilityRole="header" style={[Typography.heading, { color: s.colors.text }]}>
          {s.report.title}
        </Text>
        <Pressable
          onPress={s.onReport}
          accessibilityRole="link"
          style={[styles.link, { backgroundColor: s.colors.commemorationSoft }]}
        >
          <Text style={[Typography.button, { color: s.colors.primary }]}>{s.report.action}</Text>
        </Pressable>
        {s.message ? (
          <Text accessibilityRole="alert" style={[Typography.body, { color: s.colors.warning }]}>
            {s.message}
          </Text>
        ) : null}
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
  section: { borderWidth: 1, borderRadius: Radius.card, padding: Spacing.lg, gap: Spacing.md },
  link: {
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    borderRadius: Radius.cell,
    padding: Spacing.md,
  },
});
