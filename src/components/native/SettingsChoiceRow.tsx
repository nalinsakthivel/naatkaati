import { ListItem } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';

interface SettingsChoiceRowProps {
  label: string;
  /** The current choice, shown on the right so it is clear the row opens a list. */
  valueLabel: string;
  onPress: () => void;
}

/** A row that shows its current value and opens a choice sheet when tapped. */
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
