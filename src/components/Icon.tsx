import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Feather>['name'];

const DEFAULT_SIZE = 22;

interface IconProps {
  name: IconName;
  color: string;
  size?: number;
}

/** Decorative stroke icon. It always sits beside a text label, so it is hidden from screen readers. */
export function Icon({ name, color, size = DEFAULT_SIZE }: IconProps) {
  return (
    <Feather
      name={name}
      color={color}
      size={size}
      importantForAccessibility="no-hide-descendants"
    />
  );
}
