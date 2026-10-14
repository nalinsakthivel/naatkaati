import { StyleSheet, Text, View } from 'react-native';
import { SettingsHost } from '@/components/native/SettingsHost';
import { SettingsPickerRow } from '@/components/native/SettingsPickerRow';
import { SettingsSection } from '@/components/native/SettingsSection';
import { SettingsSwitchRow } from '@/components/native/SettingsSwitchRow';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { useSettingsScreen } from './useScreen';

export function SettingsScreen() {
  const s = useSettingsScreen();
  return (
    <View
      style={[styles.container, { backgroundColor: s.colors.background, paddingTop: s.topInset }]}
    >
      <Text style={[Typography.title, styles.title, { color: s.colors.text }]}>{s.title}</Text>
      <SettingsHost>
        <SettingsSection title={s.labels.display}>
          <SettingsPickerRow
            label={s.labels.appearance}
            value={s.appearance}
            options={s.appearanceOptions}
            onChange={s.onAppearanceChange}
          />
          <SettingsPickerRow
            label={s.labels.language}
            value={s.language}
            options={s.languageOptions}
            onChange={s.onLanguageChange}
          />
          <SettingsSwitchRow
            label={s.labels.tamilNumerals}
            value={s.tamilNumerals}
            onChange={s.onTamilNumeralsChange}
          />
        </SettingsSection>
      </SettingsHost>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { paddingHorizontal: Layout.screenPaddingH, paddingVertical: Spacing.md },
});
