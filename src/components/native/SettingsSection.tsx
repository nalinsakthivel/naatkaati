import type { ReactNode } from 'react';
import { FieldGroup } from '@expo/ui';

interface SettingsSectionProps {
  title: string;
  footer?: string;
  children: ReactNode;
}

export function SettingsSection({ title, footer, children }: SettingsSectionProps) {
  return (
    <FieldGroup.Section title={title}>
      {children}
      {footer ? <FieldGroup.SectionFooter>{footer}</FieldGroup.SectionFooter> : null}
    </FieldGroup.Section>
  );
}
