import { ListItem } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';

interface SettingsLinkRowProps {
  label: string;
  onPress: () => void;
}

/** A native list item that opens another screen. */
export function SettingsLinkRow({ label, onPress }: SettingsLinkRowProps) {
  const colors = useAppColors();
  return (
    <ListItem
      onPress={onPress}
      colors={{ containerColor: colors.surface, contentColor: colors.text }}
      trailing="›"
    >
      {label}
    </ListItem>
  );
}
