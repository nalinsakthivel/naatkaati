import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';
import { useAppColors } from '@/stores/hooks';
import { FontFamily } from '@/themes/Theme';

/** OS-native bottom tabs: Material 3 navigation bar on Android, UITabBar on iOS. */
export function AppTabs() {
  const { t } = useTranslation();
  const colors = useAppColors();
  return (
    <NativeTabs
      tintColor={colors.primary}
      backgroundColor={colors.surface}
      indicatorColor={colors.commemorationSoft}
      labelStyle={{ color: colors.text, fontFamily: FontFamily.bodyRegular }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('tabs.today')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sun.max" md="today" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>{t('tabs.calendar')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>{t('tabs.settings')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
