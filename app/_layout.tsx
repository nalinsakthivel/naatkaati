import { RootProviders } from '@/components/RootProviders';
import { RootStack } from '@/components/RootStack';

export default function RootLayout() {
  return (
    <RootProviders>
      <RootStack />
    </RootProviders>
  );
}
