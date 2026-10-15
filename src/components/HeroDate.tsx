import { StyleSheet, Text, View } from 'react-native';
import type { ColorTokens } from '@/themes/Colors';
import { Radius, Spacing, Typography } from '@/themes/Theme';

export interface HeroChip {
  id: string;
  label: string;
  tone: 'holiday' | 'commemoration';
}

interface HeroDateProps {
  day: string;
  weekdayLabel: string;
  monthName: string;
  yearLabel: string;
  gregorianLabel: string;
  /** Sunday or holiday: the numeral is printed in the holiday colour, as on a paper calendar. */
  isRedLetter: boolean;
  chips: readonly HeroChip[];
  colors: ColorTokens;
}

const DATE_SPACING = 1.5;

/** The date as the page's centrepiece: English line, the big Tamil numeral, Tamil month and year. */
export function HeroDate({
  day,
  weekdayLabel,
  monthName,
  yearLabel,
  gregorianLabel,
  isRedLetter,
  chips,
  colors,
}: HeroDateProps) {
  const numeralColor = isRedLetter ? colors.holiday : colors.primary;
  return (
    <View
      style={styles.hero}
      accessible
      accessibilityLabel={`${day} ${monthName}, ${weekdayLabel}, ${yearLabel}, ${gregorianLabel}`}
    >
      <Text style={[Typography.caption, styles.english, { color: colors.textMuted }]}>
        {`${weekdayLabel} · ${gregorianLabel}`}
      </Text>
      <Text style={[Typography.heroDate, { color: numeralColor }]}>{day}</Text>
      <Text style={[Typography.heroCaption, styles.caption, { color: colors.text }]}>
        {`${monthName} · ${yearLabel}`}
      </Text>
      {chips.length > 0 ? (
        <View style={styles.chips}>
          {chips.map((chip) => {
            const holiday = chip.tone === 'holiday';
            return (
              <View
                key={chip.id}
                style={[
                  styles.chip,
                  { backgroundColor: holiday ? colors.holidaySoft : colors.commemorationSoft },
                ]}
              >
                <Text
                  style={[
                    Typography.caption,
                    { color: holiday ? colors.holiday : colors.commemoration },
                  ]}
                >
                  {chip.label}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.xs },
  english: { letterSpacing: DATE_SPACING, textTransform: 'uppercase' },
  caption: { textAlign: 'center' },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
});
