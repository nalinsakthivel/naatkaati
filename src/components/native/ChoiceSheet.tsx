import { BottomSheet, Column, Host, ListItem, Text } from '@expo/ui';
import { useAppColors, useResolvedScheme } from '@/stores/hooks';
import { Spacing, Typography } from '@/themes/Theme';

export interface ChoiceOption<T extends string> {
  label: string;
  value: T;
}

interface ChoiceSheetProps<T extends string> {
  isPresented: boolean;
  onDismiss: () => void;
  title: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onSelect: (value: T) => void;
}

const CHECK = '✓';

/** Native bottom sheet listing every option at once, with a check on the current one. */
export function ChoiceSheet<T extends string>({
  isPresented,
  onDismiss,
  title,
  options,
  value,
  onSelect,
}: ChoiceSheetProps<T>) {
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
        <Column spacing={Spacing.xs}>
          <Text textStyle={{ fontSize: Typography.heading.fontSize, color: colors.primary }}>
            {title}
          </Text>
          {options.map((option) => (
            <ListItem
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                onDismiss();
              }}
              colors={{
                containerColor: colors.surface,
                contentColor: colors.text,
                trailingContentColor: colors.primary,
              }}
              trailing={option.value === value ? CHECK : undefined}
            >
              {option.label}
            </ListItem>
          ))}
        </Column>
      </Host>
    </BottomSheet>
  );
}
