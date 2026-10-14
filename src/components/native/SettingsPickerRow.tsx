import { Picker, Row, Text } from '@expo/ui';

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

export function SettingsPickerRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: SettingsPickerRowProps<T>) {
  return (
    <Row alignment="center">
      <Text>{label}</Text>
      <Picker selectedValue={value} onValueChange={onChange} appearance="menu">
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </Row>
  );
}
