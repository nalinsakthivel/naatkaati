import type { ReactNode } from 'react';
import { Column, Host } from '@expo/ui';
import { useAppColors, useResolvedScheme } from '@/stores/hooks';
import { Spacing } from '@/themes/Theme';

interface SettingsHostProps {
  children: ReactNode;
}

/** Native settings rows (Compose on Android, SwiftUI on iOS), sized to their content. */
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
