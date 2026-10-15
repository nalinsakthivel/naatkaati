import type { ChoiceOption } from '@/components/native/ChoiceSheet';
import { useAppColors } from '@/stores/hooks';
import { ListItem } from '@expo/ui';

interface OptionListProps<T extends string> {
  options: readonly ChoiceOption<T>[];
  value: T;
  onSelect: (value: T) => void;
}

const CHECK = '✓';

export function OptionList<T extends string>({ options, value, onSelect }: OptionListProps<T>) {
  const colors = useAppColors();
  return (
    <>
      {options.map((option) => (
        <ListItem
          key={option.value}
          onPress={() => onSelect(option.value)}
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
    </>
  );
}
