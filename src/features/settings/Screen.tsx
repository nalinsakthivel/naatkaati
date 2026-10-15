import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SettingsHost } from '@/components/native/SettingsHost';
import { SettingsLinkRow } from '@/components/native/SettingsLinkRow';
import { SettingsPickerRow } from '@/components/native/SettingsPickerRow';
import { SettingsSection } from '@/components/native/SettingsSection';
import { SettingsSwitchRow } from '@/components/native/SettingsSwitchRow';
import { SheetBand } from '@/components/SheetBand';
import { Elevation, Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useSettingsScreen } from './useScreen';

export function SettingsScreen() {
  const s = useSettingsScreen();
  return (
    <ScrollView
      style={{ backgroundColor: s.colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
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
          <SettingsSection title={s.labels.holidays}>
            {s.categoryRows.map((row) => (
              <SettingsSwitchRow
                key={row.category}
                label={row.label}
                value={row.enabled}
                onChange={(enabled) => s.onCategoryChange(row.category, enabled)}
              />
            ))}
            <SettingsPickerRow
              label={s.labels.newYear}
              value={s.newYearLabel}
              options={s.newYearOptions}
              onChange={s.onNewYearChange}
            />
          </SettingsSection>
          <SettingsSection title={s.labels.data}>
            <SettingsSwitchRow
              label={s.labels.wifiOnly}
              value={s.dataSaver}
              onChange={s.onDataSaverChange}
            />
            <SettingsLinkRow
              label={s.labels.updateNow}
              trailing={s.syncStatusLabel}
              onPress={s.onUpdateNow}
            />
          </SettingsSection>
          <SettingsSection title={s.labels.aboutSection}>
            <SettingsLinkRow label={s.labels.about} onPress={s.onOpenAbout} />
          </SettingsSection>
        </SettingsHost>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing.xxxl,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sheet: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden', ...Elevation.floating },
});
