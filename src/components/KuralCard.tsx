import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface KuralCardProps {
  title: string;
  /** Plain kural number, e.g. "475", shown in the badge */
  numberText: string;
  numberLabel: string;
  adhikaramName: string;
  lines: readonly string[];
  meaning: string;
  meaningNote?: string;
  /** Shown directly beneath the meaning whenever the meaning is not human-reviewed. */
  unverifiedLabel?: string;
  textReviewLabel?: string;
  reportLabel: string;
  onReport: () => void;
  colors: ColorTokens;
}

const BADGE = Layout.minTouchTarget + Spacing.sm;
const RULE = Spacing.xs;

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
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.rule, { backgroundColor: colors.today }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[styles.badge, { borderColor: colors.primary }]}
            accessible
            accessibilityLabel={numberLabel}
          >
            <Text style={[Typography.heading, { color: colors.primary }]}>{numberText}</Text>
          </View>
          <View style={styles.titles}>
            <Text style={[Typography.heading, { color: colors.primary }]}>{title}</Text>
            <Text style={[Typography.caption, { color: colors.textMuted }]}>{adhikaramName}</Text>
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
  card: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  rule: { height: RULE },
  content: { padding: Spacing.xl, gap: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  badge: {
    minWidth: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  titles: { flex: 1 },
  lines: { paddingVertical: Spacing.sm },
  unverified: {
    borderRadius: Radius.banner,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  report: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
});
