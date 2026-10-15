import { ListItem } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';

interface SettingsLinkRowProps {
  label: string;
  onPress: () => void;
  /** Text shown on the right; defaults to a chevron. */
  trailing?: string;
  /** `action` draws the label in the brand colour, as a button; `navigate` is a plain row. */
  tone?: 'navigate' | 'action';
}

/** A native list item that opens another screen. */
export function SettingsLinkRow({
  label,
  onPress,
  trailing = '›',
  tone = 'navigate',
}: SettingsLinkRowProps) {
  const colors = useAppColors();
  return (
    <ListItem
      onPress={onPress}
      colors={{
        containerColor: colors.surface,
        contentColor: tone === 'action' ? colors.primary : colors.text,
        trailingContentColor: colors.textMuted,
      }}
      trailing={trailing}
    >
      {label}
    </ListItem>
  );
}
