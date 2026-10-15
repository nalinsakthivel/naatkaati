import { useAppColors } from '@/stores/hooks';
import { ListItem } from '@expo/ui';

interface SettingsChoiceRowProps {
  label: string;
  valueLabel: string;
  onPress: () => void;
}

export function SettingsChoiceRow({ label, valueLabel, onPress }: SettingsChoiceRowProps) {
  const colors = useAppColors();
  return (
    <ListItem
      onPress={onPress}
      colors={{
        containerColor: colors.surface,
        contentColor: colors.text,
        trailingContentColor: colors.primary,
      }}
      trailing={`${valueLabel}  ›`}
    >
      {label}
    </ListItem>
  );
}
