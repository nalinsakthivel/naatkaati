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
  /** Draw the pad of pages behind the sheet. Off for the sheet being torn away. */
  showStack?: boolean;
  /** Content below the tear line */
  children?: ReactNode;
}

/** Today's Tamil date as the top sheet of a tear-off wall calendar pad. */
export function HeroDate({
  day,
  weekdayLabel,
  monthName,
  yearLabel,
  gregorianLabel,
  isRedLetter,
  colors,
  showStack = true,
  children,
}: HeroDateProps) {
  const paper = { backgroundColor: colors.surface, borderColor: colors.border };
  const numeralColor = isRedLetter ? colors.holiday : colors.text;
  return (
    <View style={showStack ? styles.stack : undefined}>
      {showStack ? (
        <>
          <View style={[styles.page, styles.pageBack, paper]} />
          <View style={[styles.page, styles.pageMiddle, paper]} />
        </>
      ) : null}
      <View style={[styles.sheet, paper]}>
        <SheetBand colors={colors}>
          <View style={styles.bandRow}>
            <Text style={[Typography.heroCaption, { color: colors.textOnPrimary }]}>
              {monthName}
            </Text>
            <Text style={[Typography.body, { color: colors.textOnPrimary }]}>{yearLabel}</Text>
          </View>
        </SheetBand>
        <View
          style={styles.body}
          accessible
          accessibilityLabel={`${day} ${monthName}, ${weekdayLabel}, ${yearLabel}, ${gregorianLabel}`}
        >
          <Text style={[Typography.heroDate, { color: numeralColor }]}>{day}</Text>
          <Text style={[Typography.title, { color: numeralColor }]}>{weekdayLabel}</Text>
          <Text style={[Typography.body, { color: colors.textMuted }]}>{gregorianLabel}</Text>
        </View>
        <Perforation colors={colors} />
        {children}
      </View>
    </View>
  );
}

const PAGE_STEP = Spacing.xs + Spacing.xxs;

const styles = StyleSheet.create({
  stack: { paddingBottom: PAGE_STEP * 2 },
  page: { position: 'absolute', top: Spacing.xl, borderRadius: Radius.card, borderWidth: 1 },
  pageMiddle: { left: Spacing.sm, right: Spacing.sm, bottom: PAGE_STEP },
  pageBack: { left: Spacing.lg, right: Spacing.lg, bottom: 0 },
  sheet: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden', ...Elevation.floating },
  bandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  body: { alignItems: 'center', paddingVertical: Spacing.xl },
});
