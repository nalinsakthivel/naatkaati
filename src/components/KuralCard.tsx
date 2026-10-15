import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

interface KuralCardProps {
  title: string;
  /** Plain kural number, e.g. "475" */
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

const KURAL_MIN_SCALE = 0.75;

/** The kural of the day on an indigo card: couplet, then a plain-language meaning. */
export function KuralCard({
  title,
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
    <View style={[styles.card, { backgroundColor: colors.hero }]}>
      <View style={styles.eyebrow}>
        <Text
          numberOfLines={1}
          style={[Typography.caption, styles.eyebrowTitle, { color: colors.onHeroMuted }]}
        >
          {title}
        </Text>
        <Text style={[Typography.caption, { color: colors.onHeroMuted }]}>{numberLabel}</Text>
      </View>
      <View style={styles.lines}>
        {lines.map((line) => (
          <Text
            key={line}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={KURAL_MIN_SCALE}
            style={[Typography.kural, { color: colors.onHero }]}
          >
            {line}
          </Text>
        ))}
      </View>
      {adhikaramName ? (
        <Text style={[Typography.caption, { color: colors.onHeroMuted }]}>{adhikaramName}</Text>
      ) : null}
      {textReviewLabel ? (
        <Text style={[Typography.caption, { color: colors.onHeroMuted }]}>{textReviewLabel}</Text>
      ) : null}
      <View style={[styles.rule, { backgroundColor: colors.heroSoft }]} />
      <Text style={[Typography.body, { color: colors.onHero }]}>{meaning}</Text>
      {meaningNote ? (
        <Text style={[Typography.caption, { color: colors.onHeroMuted }]}>{meaningNote}</Text>
      ) : null}
      {unverifiedLabel || textReviewLabel ? (
        <View style={styles.review}>
          {unverifiedLabel ? (
            <Text style={[Typography.caption, styles.reviewText, { color: colors.onHeroMuted }]}>
              {unverifiedLabel}
            </Text>
          ) : (
            <View style={styles.reviewText} />
          )}
          <Pressable
            onPress={onReport}
            accessibilityRole="link"
            style={styles.report}
            hitSlop={Spacing.sm}
          >
            <Text style={[Typography.caption, styles.reportText, { color: colors.onHero }]}>
              {reportLabel}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.card, padding: Spacing.lg, gap: Spacing.sm },
  eyebrow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  eyebrowTitle: { flex: 1 },
  lines: { paddingVertical: Spacing.md, gap: Spacing.xxs },
  rule: { height: 1 },
  review: { gap: Spacing.xs },
  reviewText: {},
  report: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
  reportText: { textDecorationLine: 'underline' },
});
