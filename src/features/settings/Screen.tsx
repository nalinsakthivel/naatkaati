import { ScrollView, StyleSheet, Text } from 'react-native';
import { ChoiceSheet } from '@/components/native/ChoiceSheet';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SettingGroup, SettingRow } from '@/components/SettingRow';
import { Layout, Spacing, Typography } from '@/themes/Theme';
import { useSettingsScreen } from './useScreen';

export function SettingsScreen() {
  const s = useSettingsScreen();
  const { colors } = s;
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
    >
      <ScreenHeader kicker={s.kicker} title={s.title} colors={colors} />

      <SettingGroup title={s.labels.displayGroup} colors={colors}>
        <SettingRow
          icon="globe"
          title={s.labels.language}
          subtitle={s.languageValueLabel}
          onPress={s.openPicker('language')}
          colors={colors}
        />
        <SettingRow
          icon="moon"
          title={s.labels.appearance}
          subtitle={s.appearanceValueLabel}
          onPress={s.openPicker('appearance')}
          divided
          colors={colors}
        />
        <SettingRow
          icon="hash"
          title={s.labels.tamilNumerals}
          subtitle={s.labels.tamilNumeralsHint}
          value={s.tamilNumerals}
          onValueChange={s.onTamilNumeralsChange}
          divided
          colors={colors}
        />
      </SettingGroup>

      <SettingGroup title={s.labels.holidays} colors={colors}>
        {s.categoryRows.map((row, index) => (
          <SettingRow
            key={row.category}
            icon="check-square"
            title={row.label}
            value={row.enabled}
            onValueChange={(enabled) => s.onCategoryChange(row.category, enabled)}
            divided={index > 0}
            colors={colors}
          />
        ))}
        <SettingRow
          icon="calendar"
          title={s.labels.newYear}
          subtitle={s.newYearValueLabel}
          onPress={s.openPicker('newYear')}
          divided
          colors={colors}
        />
      </SettingGroup>

      <SettingGroup title={s.labels.widgets} colors={colors}>
        <SettingRow
          icon="grid"
          title={s.labels.widgets}
          subtitle={s.labels.widgetsHint}
          onPress={s.onOpenWidgets}
          colors={colors}
        />
      </SettingGroup>

      <SettingGroup title={s.labels.data} colors={colors}>
        <SettingRow
          icon="wifi"
          title={s.labels.wifiOnly}
          value={s.dataSaver}
          onValueChange={s.onDataSaverChange}
          colors={colors}
        />
        <SettingRow
          icon="download"
          title={s.labels.updateNow}
          trailingText={s.syncStatusLabel}
          onPress={s.onUpdateNow}
          divided
          colors={colors}
        />
      </SettingGroup>

      <SettingGroup title={s.labels.aboutSection} colors={colors}>
        <SettingRow
          icon="info"
          title={s.labels.about}
          subtitle={s.versionLabel}
          onPress={s.onOpenAbout}
          colors={colors}
        />
      </SettingGroup>

      <Text style={[Typography.caption, styles.version, { color: colors.textMuted }]}>
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
    paddingBottom: Layout.dockClearance,
    gap: Spacing.lg,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  version: { textAlign: 'center' },
});
