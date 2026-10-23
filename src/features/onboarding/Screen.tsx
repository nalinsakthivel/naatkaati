import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SettingsHost } from '@/components/native/SettingsHost';
import { OptionList } from '@/components/native/OptionList';
import { SheetBand } from '@/components/SheetBand';
import { Elevation, Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useOnboardingScreen } from './useScreen';

export function OnboardingScreen() {
  const s = useOnboardingScreen();
  return (
    <ScrollView
      style={{ backgroundColor: s.colors.background }}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: s.topInset + Spacing.lg,
          paddingBottom: s.bottomInset + Spacing.lg,
        },
      ]}
    >
      <View
        style={[styles.sheet, { backgroundColor: s.colors.surface, borderColor: s.colors.border }]}
      >
        <SheetBand colors={s.colors}>
          <Text style={[Typography.caption, { color: s.colors.textOnPrimary }]}>{s.stepLabel}</Text>
          <Text style={[Typography.title, { color: s.colors.textOnPrimary }]}>{s.title}</Text>
        </SheetBand>
        <View style={styles.body}>
          <Text style={[Typography.body, { color: s.colors.textMuted }]}>{s.hint}</Text>
          <SettingsHost>
            {s.step === 0 ? (
              <OptionList
                options={s.languageOptions}
                value={s.language}
                onSelect={s.onLanguageChange}
              />
            ) : (
              <OptionList
                options={s.appearanceOptions}
                value={s.appearance}
                onSelect={s.onAppearanceChange}
              />
            )}
          </SettingsHost>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={s.onSkip} accessibilityRole="button" style={styles.skip}>
          <Text style={[Typography.button, { color: s.colors.textMuted }]}>{s.skipLabel}</Text>
        </Pressable>
        <Pressable
          onPress={s.onPrimary}
          accessibilityRole="button"
          style={[styles.primary, { backgroundColor: s.colors.primary }]}
        >
          <Text style={[Typography.button, { color: s.colors.textOnPrimary }]}>
            {s.primaryLabel}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.lg,
  },
  sheet: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden', ...Elevation.floating },
  body: { padding: Spacing.lg, gap: Spacing.md },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skip: {
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primary: {
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.chip,
  },
});
