import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CommemorationCard } from '@/components/CommemorationCard';
import type { HeroDate } from '@/components/HeroDate';
import { TearOffHero } from '@/components/TearOffHero';
import { HolidayChip } from '@/components/HolidayChip';
import { KuralCard } from '@/components/KuralCard';
import { ReminderSwitch } from '@/components/native/ReminderSwitch';
import { SkyRow, type MoonItem, type SkyItem } from '@/components/SkyRow';
import type { ColorTokens } from '@/themes/Colors';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';

type HeroProps = Parameters<typeof HeroDate>[0];
type KuralProps = Parameters<typeof KuralCard>[0];

interface DayBodyProps {
  /** The civil date shown; a change tears the sheet off. */
  dateKey: string;
  hero: Omit<HeroProps, 'colors' | 'children'> | null;
  outOfRangeLabel: string;
  gregorianOnly: string;
  sunrise: SkyItem;
  sunset: SkyItem;
  moon: MoonItem;
  holidays: readonly {
    id: string;
    name: string;
    categoryLabel: string;
    appliesTo: string;
    reminderOn: boolean;
    onToggleReminder?: (enabled: boolean) => void;
  }[];
  commemorations: readonly {
    id: string;
    name: string;
    kindLabel: string;
    description: string;
    designations: readonly string[];
    reminderOn: boolean;
    onToggleReminder: (enabled: boolean) => void;
  }[];
  commemorationsTitle: string;
  eclipses: readonly { id: string; label: string }[];
  eclipseNote: string;
  kural: Omit<KuralProps, 'colors' | 'onReport'> | null;
  onReportKural: () => void;
  reminderUi: {
    switchLabel: string;
    message: string | null;
    openSettingsLabel: string | null;
    onOpenSettings: () => void;
  };
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
        <TearOffHero dateKey={props.dateKey} hero={props.hero} colors={colors}>
          {sky}
        </TearOffHero>
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
            <View key={holiday.id} style={styles.item}>
              <HolidayChip
                name={holiday.name}
                categoryLabel={holiday.categoryLabel}
                detail={holiday.appliesTo}
                colors={colors}
              />
              {holiday.onToggleReminder ? (
                <ReminderSwitch
                  label={props.reminderUi.switchLabel}
                  value={holiday.reminderOn}
                  onChange={holiday.onToggleReminder}
                />
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
      {props.commemorations.length > 0 ? (
        <View style={styles.block}>
          <Text style={[Typography.heading, { color: colors.text }]}>
            {props.commemorationsTitle}
          </Text>
          {props.commemorations.map((item) => (
            <View key={item.id} style={styles.item}>
              <CommemorationCard
                name={item.name}
                kindLabel={item.kindLabel}
                description={item.description}
                designations={item.designations}
                colors={colors}
              />
              <ReminderSwitch
                label={props.reminderUi.switchLabel}
                value={item.reminderOn}
                onChange={item.onToggleReminder}
              />
            </View>
          ))}
        </View>
      ) : null}
      {props.reminderUi.message ? (
        <View style={[styles.notice, { backgroundColor: colors.warningSoft }]}>
          <Text style={[Typography.body, { color: colors.warning }]}>
            {props.reminderUi.message}
          </Text>
          {props.reminderUi.openSettingsLabel ? (
            <Pressable
              onPress={props.reminderUi.onOpenSettings}
              accessibilityRole="button"
              style={styles.noticeAction}
            >
              <Text style={[Typography.button, { color: colors.primary }]}>
                {props.reminderUi.openSettingsLabel}
              </Text>
            </Pressable>
          ) : null}
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
  item: { gap: Spacing.xs },
  notice: { borderRadius: Radius.banner, padding: Spacing.lg, gap: Spacing.sm },
  noticeAction: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
  fallback: { gap: Spacing.xs, paddingVertical: Spacing.lg },
  eclipse: {
    borderRadius: Radius.banner,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.xxs,
  },
});
