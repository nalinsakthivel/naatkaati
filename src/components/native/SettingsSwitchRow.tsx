import { ListItem, Switch } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';

interface SettingsSwitchRowProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SettingsSwitchRow({ label, value, onChange }: SettingsSwitchRowProps) {
  const colors = useAppColors();
  return (
    <ListItem
      colors={{ containerColor: colors.surface, contentColor: colors.text }}
      trailing={<Switch value={value} onValueChange={onChange} />}
    >
      {label}
    </ListItem>
  );
}
