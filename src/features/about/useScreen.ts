import { useState } from 'react';
import { Linking } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { ApiConstants } from '@/services/constants/ApiConstants';
import { useAppColors } from '@/stores/hooks';

export function useAboutScreen() {
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const colors = useAppColors();
  const version = Constants.expoConfig?.version ?? '';
  return {
    colors,
    title: t('app.name'),
    message,
    versionLabel: t('about.version', { version }),
    tagline: t('about.tagline'),
    method: { title: t('about.methodTitle'), body: t('about.method') },
    licenses: {
      title: t('about.licensesTitle'),
      lines: [t('about.licenseCode'), t('about.licenseData'), t('about.licenseKural')],
    },
    report: { title: t('about.reportTitle'), action: t('about.reportAction') },
    onReport: async () => {
      setMessage(null);
      try {
        await Linking.openURL(`${ApiConstants.repoUrl}/issues/new`);
      } catch {
        setMessage(t('common.openLinkFailed'));
      }
    },
  };
}
