import { ListItem, Switch } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';

interface SettingsSwitchRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SettingsSwitchRow({ label, value, onChange, description }: SettingsSwitchRowProps) {
  const colors = useAppColors();
  return (
    <ListItem
      supportingText={description}
      colors={{ containerColor: colors.surface, contentColor: colors.text }}
      trailing={<Switch value={value} onValueChange={onChange} />}
    >
      {label}
    </ListItem>
  );
}
