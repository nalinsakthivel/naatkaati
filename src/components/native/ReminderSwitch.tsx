import { Host, Switch } from '@expo/ui';
import { useAppColors, useResolvedScheme } from '@/stores/hooks';

interface ReminderSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

/** A native switch that sits inside our own brand cards. */
export function ReminderSwitch({ label, value, onChange }: ReminderSwitchProps) {
  const colors = useAppColors();
  const scheme = useResolvedScheme();
  return (
    <Host matchContents colorScheme={scheme} seedColor={colors.primary}>
      <Switch label={label} value={value} onValueChange={onChange} />
    </Host>
  );
}
