import { useAppColors } from '@/stores/hooks';
import { ListItem } from '@expo/ui';

interface SettingsLinkRowProps {
  label: string;
  onPress: () => void;
  trailing?: string;
  tone?: 'navigate' | 'action';
}

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
