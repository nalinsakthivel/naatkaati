import { Switch } from '@expo/ui';

interface SettingsSwitchRowProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SettingsSwitchRow({ label, value, onChange }: SettingsSwitchRowProps) {
  return <Switch label={label} value={value} onValueChange={onChange} />;
}
