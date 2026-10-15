import { useAppColors, useResolvedScheme } from '@/stores/hooks';
import { Spacing } from '@/themes/Theme';
import { Column, Host } from '@expo/ui';
import type { ReactNode } from 'react';

interface SettingsHostProps {
  children: ReactNode;
}

export function SettingsHost({ children }: SettingsHostProps) {
  const colors = useAppColors();
  const scheme = useResolvedScheme();
  return (
    <Host matchContents={{ vertical: true }} colorScheme={scheme} seedColor={colors.primary}>
      <Column spacing={Spacing.xs} style={{ backgroundColor: colors.surface }}>
        {children}
      </Column>
    </Host>
  );
}
