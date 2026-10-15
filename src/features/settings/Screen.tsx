import { StyleSheet, Text, View } from 'react-native';
import { SettingsHost } from '@/components/native/SettingsHost';
import { SettingsPickerRow } from '@/components/native/SettingsPickerRow';
import { SettingsSection } from '@/components/native/SettingsSection';
import { SettingsSwitchRow } from '@/components/native/SettingsSwitchRow';
import { SheetBand } from '@/components/SheetBand';
import { Elevation, Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useSettingsScreen } from './useScreen';

export function SettingsScreen() {
  const s = useSettingsScreen();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: s.colors.background, paddingTop: s.topInset + Spacing.lg },
      ]}
    >
      <View
        style={[styles.sheet, { backgroundColor: s.colors.surface, borderColor: s.colors.border }]}
      >
        <SheetBand colors={s.colors}>
          <Text style={[Typography.title, { color: s.colors.textOnPrimary }]}>{s.title}</Text>
        </SheetBand>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Layout.screenPaddingH, paddingBottom: Spacing.lg },
  sheet: {
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    ...Elevation.floating,
  },
});
