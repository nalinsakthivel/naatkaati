import { ListItem } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';

interface SettingsLinkRowProps {
  label: string;
  onPress: () => void;
  /** Text shown on the right; defaults to a chevron. */
  trailing?: string;
}

/** A native list item that opens another screen. */
export function SettingsLinkRow({ label, onPress, trailing = '›' }: SettingsLinkRowProps) {
  const colors = useAppColors();
  return (
    <ListItem
      onPress={onPress}
      colors={{ containerColor: colors.surface, contentColor: colors.text }}
      trailing={trailing}
    >
      {label}
    </ListItem>
  );
}
