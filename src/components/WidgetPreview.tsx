import { format } from 'date-fns';
import { StyleSheet, Text, View } from 'react-native';
import type { WidgetModel } from '@/calendar/widgetModel';
import type { WidgetVariant } from '@/calendar/widgetVariants';
import { DarkColors, LightColors } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';

interface WidgetPreviewProps {
  variant: WidgetVariant;
  model: WidgetModel;
  yearLabel: string;
  /** Kept for callers; the header now shows the time instead of the app name */
  appName: string;
  kuralTitle: string;
  eventTitle: string;
}

// The home-screen widget is always drawn in the light palette, so its preview is too.
const L = LightColors;
const MINIMAL_RATIO = 1;
const NUMERAL = 44;
const NUMERAL_BIG = 52;
const TILE = 46;
const DOT = Spacing.sm - 2;
const DATE_COLUMN = 96;

/** In-app preview of a home-screen widget layout, drawn from the same model the widget renders. */
export function WidgetPreview({
  variant,
  model,
  yearLabel,
  appName,
  kuralTitle,
  eventTitle,
}: WidgetPreviewProps) {
  // The real widget shows a live system clock; the preview shows the time it was drawn.
  const time = format(new Date(), 'HH:mm');
  if (variant === 'minimal') {
    return (
      <View
        style={[
          styles.card,
          styles.center,
          {
            backgroundColor: L.surface,
            borderColor: L.border,
            borderWidth: 1,
            aspectRatio: MINIMAL_RATIO,
          },
        ]}
      >
        <Text style={[Typography.caption, { color: L.textMuted }]}>{model.weekday}</Text>
        <Text style={[styles.numeralBig, { color: L.primary }]}>{model.day}</Text>
        <Text style={[Typography.body, { color: L.text }]}>{model.monthName}</Text>
        <Text style={[Typography.bodyStrong, { color: L.text }]}>{time}</Text>
      </View>
    );
  }
  if (variant === 'kural') {
    return (
      <View style={[styles.card, { backgroundColor: L.cultural, gap: Spacing.md }]}>
        <View style={styles.spread}>
          <Text style={[Typography.caption, { color: L.textOnPrimary }]}>{kuralTitle}</Text>
          <Text style={[Typography.caption, { color: L.textOnPrimary }]}>{model.kuralNumber}</Text>
        </View>
        <View>
          {model.kuralLines.map((line) => (
            <Text key={line} style={[Typography.kural, { color: L.textOnPrimary }]}>
              {line}
            </Text>
          ))}
        </View>
        <View style={styles.spread}>
          <Text style={[Typography.caption, { color: L.textOnPrimary }]}>
            {`${model.day} · ${model.weekday}`}
          </Text>
          <Text style={[Typography.bodyStrong, { color: L.textOnPrimary }]}>{time}</Text>
        </View>
      </View>
    );
  }
  if (variant === 'culture') {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: L.surface, borderColor: L.border, borderWidth: 1, gap: Spacing.md },
        ]}
      >
        <View style={styles.row}>
          <View style={[styles.tile, { backgroundColor: L.today }]}>
            <Text style={[Typography.heading, { color: L.textOnToday }]}>{model.day}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={[Typography.bodyStrong, { color: L.text }]}>{model.monthName}</Text>
            <Text style={[Typography.caption, { color: L.textMuted }]}>
              {`${model.weekday} · ${model.monthYear}`}
            </Text>
          </View>
          <Text style={[Typography.heading, { color: L.text }]}>{time}</Text>
        </View>
        <View style={[styles.event, { backgroundColor: L.culturalSoft }]}>
          <View style={[styles.dot, { backgroundColor: L.cultural }]} />
          <View style={styles.flex}>
            <Text style={[Typography.caption, { color: L.cultural }]}>{eventTitle}</Text>
            <Text style={[Typography.bodyStrong, { color: L.text }]}>{model.eventName ?? '—'}</Text>
          </View>
        </View>
        <Text style={[Typography.caption, { color: L.textMuted }]}>
          {`↑ ${model.sunrise}    ↓ ${model.sunset}`}
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.card, { backgroundColor: L.hero, gap: Spacing.md }]}>
      <View style={styles.spread}>
        <Text style={[Typography.caption, { color: L.onHeroMuted }]}>
          {`${model.weekday} · ${model.gregorianLabel}`}
        </Text>
        <Text style={[Typography.bodyStrong, { color: L.onHero }]}>{time}</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.dateColumn}>
          <Text style={[styles.numeral, { color: L.onHero }]}>{model.day}</Text>
          <Text style={[Typography.caption, { color: L.onHero }]}>{model.monthName}</Text>
          <Text style={[Typography.caption, styles.centered, { color: L.onHeroMuted }]}>
            {yearLabel}
          </Text>
        </View>
        <View style={[styles.rule, { backgroundColor: L.onHeroMuted }]} />
        <View style={styles.flex}>
          {model.kuralLines.map((line) => (
            <Text key={line} style={[Typography.caption, { color: L.onHero }]}>
              {line}
            </Text>
          ))}
        </View>
      </View>
      {model.eventName ? (
        <Text
          style={[Typography.caption, { color: DarkColors.cultural }]}
        >{`● ${model.eventName}`}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.card, padding: Spacing.lg, width: '100%' },
  center: { alignItems: 'center', justifyContent: 'center' },
  spread: { flexDirection: 'row', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  flex: { flex: 1 },
  numeral: {
    fontFamily: Typography.heroDate.fontFamily,
    fontSize: NUMERAL,
    lineHeight: NUMERAL + Spacing.sm,
  },
  numeralBig: {
    fontFamily: Typography.heroDate.fontFamily,
    fontSize: NUMERAL_BIG,
    lineHeight: NUMERAL_BIG + Spacing.sm,
  },
  dateColumn: { alignItems: 'center', width: DATE_COLUMN },
  centered: { textAlign: 'center' },
  rule: { width: 1, alignSelf: 'stretch' },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.banner - Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.banner - Spacing.xs,
    padding: Spacing.sm,
  },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
});
