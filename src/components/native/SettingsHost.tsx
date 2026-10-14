import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { FieldGroup, Host } from '@expo/ui';
import { useAppColors, useResolvedScheme } from '@/stores/hooks';

interface SettingsHostProps {
  children: ReactNode;
}

/** Native settings list: SwiftUI Form on iOS, Compose on Android. Themed with our primary colour. */
export function SettingsHost({ children }: SettingsHostProps) {
  const colors = useAppColors();
  const scheme = useResolvedScheme();
  return (
    <Host style={styles.host} colorScheme={scheme} seedColor={colors.primary}>
      <FieldGroup>{children}</FieldGroup>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1 },
});
