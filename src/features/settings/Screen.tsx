import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChoiceSheet } from '@/components/native/ChoiceSheet';
import { SettingsChoiceRow } from '@/components/native/SettingsChoiceRow';
import { SettingsHost } from '@/components/native/SettingsHost';
import { SettingsLinkRow } from '@/components/native/SettingsLinkRow';
import { SettingsSection } from '@/components/native/SettingsSection';
import { SettingsSwitchRow } from '@/components/native/SettingsSwitchRow';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useSettingsScreen } from './useScreen';

export function SettingsScreen() {
  const s = useSettingsScreen();
  return (
    <ScrollView
      style={{ backgroundColor: s.colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
    >
      <Text style={[Typography.title, styles.title, { color: s.colors.text }]}>{s.title}</Text>
      <View style={[styles.sheet, { backgroundColor: s.colors.surface }]}>
        <SettingsHost>
          <SettingsSection title={s.labels.display}>
            <SettingsChoiceRow
              label={s.labels.appearance}
              valueLabel={s.appearanceValueLabel}
              onPress={s.openPicker('appearance')}
            />
            <SettingsChoiceRow
              label={s.labels.language}
              valueLabel={s.languageValueLabel}
              onPress={s.openPicker('language')}
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
            <SettingsChoiceRow
              label={s.labels.newYear}
              valueLabel={s.newYearValueLabel}
              onPress={s.openPicker('newYear')}
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
              tone="action"
              onPress={s.onUpdateNow}
            />
          </SettingsSection>
          <SettingsSection title={s.labels.aboutSection}>
            <SettingsLinkRow label={s.labels.about} onPress={s.onOpenAbout} />
          </SettingsSection>
        </SettingsHost>
      </View>
      <Text style={[Typography.caption, styles.version, { color: s.colors.textMuted }]}>
        {s.versionLabel}
      </Text>

      <ChoiceSheet
        isPresented={s.picker === 'appearance'}
        onDismiss={s.closePicker}
        title={s.labels.appearance}
        options={s.appearanceOptions}
        value={s.appearance}
        onSelect={s.onAppearanceChange}
      />
      <ChoiceSheet
        isPresented={s.picker === 'language'}
        onDismiss={s.closePicker}
        title={s.labels.language}
        options={s.languageOptions}
        value={s.language}
        onSelect={s.onLanguageChange}
      />
      <ChoiceSheet
        isPresented={s.picker === 'newYear'}
        onDismiss={s.closePicker}
        title={s.labels.newYear}
        options={s.newYearOptions}
        value={s.newYearLabel}
        onSelect={s.onNewYearChange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: { paddingHorizontal: Spacing.xs },
  sheet: { borderRadius: Radius.card, overflow: 'hidden' },
  version: { textAlign: 'center' },
});
