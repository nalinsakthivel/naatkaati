import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface KuralCardProps {
  title: string;
  numberText: string;
  numberLabel: string;
  adhikaramName: string;
  lines: readonly string[];
  meaning: string;
  meaningNote?: string;
  unverifiedLabel?: string;
  textReviewLabel?: string;
  reportLabel: string;
  onReport: () => void;
  colors: ColorTokens;
}

const BADGE = Layout.minTouchTarget - Spacing.sm;

export function KuralCard({
  title,
  numberText,
  numberLabel,
  adhikaramName,
  lines,
  meaning,
  meaningNote,
  unverifiedLabel,
  textReviewLabel,
  reportLabel,
  onReport,
  colors,
}: KuralCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titles}>
            <Text style={[Typography.heading, { color: colors.primary }]}>{title}</Text>
            <Text style={[Typography.caption, { color: colors.textMuted }]}>{adhikaramName}</Text>
          </View>
          <View
            style={[styles.badge, { backgroundColor: colors.today }]}
            accessible
            accessibilityLabel={numberLabel}
          >
            <Text style={[Typography.bodyStrong, { color: colors.textOnToday }]}>{numberText}</Text>
          </View>
        </View>
        <View style={styles.lines}>
          {lines.map((line) => (
            <Text key={line} style={[Typography.kural, { color: colors.text }]}>
              {line}
            </Text>
          ))}
        </View>
        {textReviewLabel ? (
          <Text style={[Typography.caption, { color: colors.warning }]}>{textReviewLabel}</Text>
        ) : null}
        <Text style={[Typography.body, { color: colors.text }]}>{meaning}</Text>
        {meaningNote ? (
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{meaningNote}</Text>
        ) : null}
        {unverifiedLabel ? (
          <View style={[styles.unverified, { backgroundColor: colors.warningSoft }]}>
            <Text style={[Typography.caption, { color: colors.warning }]}>{unverifiedLabel}</Text>
          </View>
        ) : null}
        {unverifiedLabel || textReviewLabel ? (
          <Pressable
            onPress={onReport}
            accessibilityRole="link"
            style={styles.report}
            hitSlop={Spacing.sm}
          >
            <Text style={[Typography.button, { color: colors.primary }]}>{reportLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.card },
  content: { padding: Spacing.xl, gap: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  badge: {
    minWidth: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  titles: { flex: 1 },
  lines: { paddingVertical: Spacing.md, gap: Spacing.xxs },
  unverified: {
    borderRadius: Radius.banner,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  report: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
});
