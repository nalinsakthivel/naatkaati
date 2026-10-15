import { BottomSheet, Column, Host, Picker, Row, Text } from '@expo/ui';
import { useAppColors, useResolvedScheme } from '@/stores/hooks';
import { Spacing, Typography } from '@/themes/Theme';

interface MonthJumpSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
  title: string;
  monthLabel: string;
  yearLabel: string;
  monthNames: readonly string[];
  years: readonly number[];
  month: number;
  year: number;
  onChange: (year: number, month: number) => void;
}

/** Native bottom sheet with month and year pickers, for jumping anywhere in the calendar. */
export function MonthJumpSheet({
  isPresented,
  onDismiss,
  title,
  monthLabel,
  yearLabel,
  monthNames,
  years,
  month,
  year,
  onChange,
}: MonthJumpSheetProps) {
  const colors = useAppColors();
  const scheme = useResolvedScheme();
  return (
    <BottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      containerColor={colors.surface}
      contentColor={colors.text}
    >
      <Host matchContents colorScheme={scheme} seedColor={colors.primary}>
        <Column spacing={Spacing.md}>
          <Text textStyle={{ fontSize: Typography.heading.fontSize, color: colors.primary }}>
            {title}
          </Text>
          <Row alignment="center" spacing={Spacing.md}>
            <Text>{monthLabel}</Text>
            <Picker
              selectedValue={month}
              onValueChange={(value) => onChange(year, value)}
              appearance="menu"
            >
              {monthNames.map((name, index) => (
                <Picker.Item key={name} label={name} value={index + 1} />
              ))}
            </Picker>
          </Row>
          <Row alignment="center" spacing={Spacing.md}>
            <Text>{yearLabel}</Text>
            <Picker
              selectedValue={year}
              onValueChange={(value) => onChange(value, month)}
              appearance="menu"
            >
              {years.map((value) => (
                <Picker.Item key={value} label={String(value)} value={value} />
              ))}
            </Picker>
          </Row>
        </Column>
      </Host>
    </BottomSheet>
  );
}
