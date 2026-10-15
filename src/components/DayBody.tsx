import { StyleSheet, Text, View } from 'react-native';
import { CommemorationCard } from '@/components/CommemorationCard';
import { HeroDate } from '@/components/HeroDate';
import { HolidayChip } from '@/components/HolidayChip';
import { KuralCard } from '@/components/KuralCard';
import { SkyRow, type MoonItem, type SkyItem } from '@/components/SkyRow';
import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';

type HeroProps = Parameters<typeof HeroDate>[0];
type KuralProps = Parameters<typeof KuralCard>[0];

interface DayBodyProps {
  hero: Omit<HeroProps, 'colors' | 'children'> | null;
  outOfRangeLabel: string;
  gregorianOnly: string;
  sunrise: SkyItem;
  sunset: SkyItem;
  moon: MoonItem;
  holidays: readonly { id: string; name: string; categoryLabel: string; appliesTo: string }[];
  commemorations: readonly {
    id: string;
    name: string;
    kindLabel: string;
    description: string;
    designations: readonly string[];
  }[];
  commemorationsTitle: string;
  eclipses: readonly { id: string; label: string }[];
  eclipseNote: string;
  kural: Omit<KuralProps, 'colors' | 'onReport'> | null;
  onReportKural: () => void;
  colors: ColorTokens;
}

/** The full set of day information, shared by the Today and Day Detail screens. */
export function DayBody(props: DayBodyProps) {
  const { colors } = props;
  const sky = (
    <SkyRow sunrise={props.sunrise} sunset={props.sunset} moon={props.moon} colors={colors} />
  );
  return (
    <View style={styles.stack}>
      {props.hero ? (
        <HeroDate {...props.hero} colors={colors}>
          {sky}
        </HeroDate>
      ) : (
        <View style={styles.fallback}>
          <Text style={[Typography.heading, { color: colors.text }]}>{props.gregorianOnly}</Text>
          <Text style={[Typography.body, { color: colors.textMuted }]}>
            {props.outOfRangeLabel}
          </Text>
        </View>
      )}
      {props.holidays.length > 0 ? (
        <View style={styles.block}>
          {props.holidays.map((holiday) => (
            <HolidayChip
              key={holiday.id}
              name={holiday.name}
              categoryLabel={holiday.categoryLabel}
              detail={holiday.appliesTo}
              colors={colors}
            />
          ))}
        </View>
      ) : null}
      {props.commemorations.length > 0 ? (
        <View style={styles.block}>
          <Text style={[Typography.heading, { color: colors.text }]}>
            {props.commemorationsTitle}
          </Text>
          {props.commemorations.map((item) => (
            <CommemorationCard key={item.id} {...item} colors={colors} />
          ))}
        </View>
      ) : null}
      {props.eclipses.map((eclipse) => (
        <View
          key={eclipse.id}
          style={[styles.eclipse, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[Typography.bodyStrong, { color: colors.text }]}>{eclipse.label}</Text>
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{props.eclipseNote}</Text>
        </View>
      ))}
      {props.kural ? (
        <KuralCard {...props.kural} onReport={props.onReportKural} colors={colors} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.lg },
  block: { gap: Spacing.sm },
  fallback: { gap: Spacing.xs, paddingVertical: Spacing.lg },
  eclipse: {
    borderRadius: Radius.banner,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.xxs,
  },
});
