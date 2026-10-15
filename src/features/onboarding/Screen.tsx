import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SettingsHost } from '@/components/native/SettingsHost';
import { OptionList } from '@/components/native/OptionList';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useOnboardingScreen } from './useScreen';

export function OnboardingScreen() {
  const s = useOnboardingScreen();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: s.colors.background,
          paddingTop: s.topInset + Spacing.lg,
          paddingBottom: s.bottomInset + Spacing.lg,
        },
      ]}
    >
      <View style={[styles.sheet, { backgroundColor: s.colors.surface }]}>
        <View style={[styles.band, { backgroundColor: s.colors.hero }]}>
          <Text style={[Typography.caption, { color: s.colors.heroAccent }]}>{s.stepLabel}</Text>
          <Text style={[Typography.title, { color: s.colors.onHero }]}>{s.title}</Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sheet: { borderRadius: Radius.hero, overflow: 'hidden' },
  band: { padding: Spacing.xl, gap: Spacing.xs },
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
