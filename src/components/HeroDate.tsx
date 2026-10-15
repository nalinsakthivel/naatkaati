import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Perforation } from '@/components/Perforation';
import { SheetBand } from '@/components/SheetBand';
import type { ColorTokens } from '@/themes/Colors';
import { Elevation, Radius, Spacing, Typography } from '@/themes/Theme';

interface HeroDateProps {
  day: string;
  weekdayLabel: string;
  monthName: string;
  yearLabel: string;
  gregorianLabel: string;
  /** Sunday or holiday: the numeral is printed in red, as on a paper calendar. */
  isRedLetter: boolean;
  colors: ColorTokens;
  /** Content below the tear line */
  children?: ReactNode;
}

/** Today's Tamil date as a tear-off wall-calendar sheet. */
export function HeroDate({
  day,
  weekdayLabel,
  monthName,
  yearLabel,
  gregorianLabel,
  isRedLetter,
  colors,
  children,
}: HeroDateProps) {
  return (
    <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <SheetBand colors={colors}>
        <View style={styles.bandRow}>
          <Text style={[Typography.heroCaption, { color: colors.textOnPrimary }]}>{monthName}</Text>
          <Text style={[Typography.body, { color: colors.textOnPrimary }]}>{yearLabel}</Text>
        </View>
      </SheetBand>
      <View
        style={styles.body}
        accessible
        accessibilityLabel={`${day} ${monthName}, ${weekdayLabel}, ${yearLabel}, ${gregorianLabel}`}
      >
        <Text style={[Typography.heroDate, { color: isRedLetter ? colors.holiday : colors.text }]}>
          {day}
        </Text>
        <Text style={[Typography.title, { color: isRedLetter ? colors.holiday : colors.text }]}>
          {weekdayLabel}
        </Text>
        <Text style={[Typography.body, { color: colors.textMuted }]}>{gregorianLabel}</Text>
      </View>
      <Perforation colors={colors} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden', ...Elevation.floating },
  bandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  body: { alignItems: 'center', paddingVertical: Spacing.xl },
});
