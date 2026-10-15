import { ListItem, Picker } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';

export interface PickerOption<T extends string> {
  label: string;
  value: T;
}

interface SettingsPickerRowProps<T extends string> {
  label: string;
  value: T;
  options: readonly PickerOption<T>[];
  onChange: (value: T) => void;
}

/** Label on the left, menu on the right: a native list item with a trailing picker. */
export function SettingsPickerRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: SettingsPickerRowProps<T>) {
  const colors = useAppColors();
  return (
    <ListItem
      colors={{ containerColor: colors.surface, contentColor: colors.text }}
      trailing={
        <Picker selectedValue={value} onValueChange={onChange} appearance="menu">
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      }
    >
      {label}
    </ListItem>
  );
}
