import type { ReactNode } from 'react';
import { Column, Text } from '@expo/ui';
import { useAppColors } from '@/stores/hooks';
import { Spacing, Typography } from '@/themes/Theme';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const colors = useAppColors();
  return (
    <Column style={{ paddingTop: Spacing.md }}>
      <Text
        style={{ paddingHorizontal: Spacing.lg }}
        textStyle={{ fontSize: Typography.heading.fontSize, color: colors.primary }}
      >
        {title}
      </Text>
      {children}
    </Column>
  );
}
