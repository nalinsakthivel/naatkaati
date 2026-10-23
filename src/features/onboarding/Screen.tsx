import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SettingsHost } from '@/components/native/SettingsHost';
import { OptionList } from '@/components/native/OptionList';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
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
      <View style={styles.intro}>
        <ScreenHeader title={s.welcomeTitle} subtitle={s.welcomeIntro} colors={s.colors} />
        <View style={[styles.step, { backgroundColor: s.colors.commemorationSoft }]}>
          <Text style={[Typography.caption, { color: s.colors.primary }]}>{s.stepLabel}</Text>
        </View>
        <View
          style={[
            styles.sheet,
            { backgroundColor: s.colors.surface, borderColor: s.colors.border },
          ]}
        >
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={[Typography.title, { color: s.colors.text }]}>
              {s.title}
            </Text>
            <Text style={[Typography.body, { color: s.colors.textMuted }]}>{s.hint}</Text>
          </View>
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
        {s.step > 0 ? (
          <Pressable onPress={s.onBack} accessibilityRole="button" style={styles.secondary}>
            <Text style={[Typography.button, { color: s.colors.primary }]}>{s.backLabel}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={s.onSkip} accessibilityRole="button" style={styles.secondary}>
            <Text style={[Typography.button, { color: s.colors.textMuted }]}>{s.skipLabel}</Text>
          </Pressable>
        )}
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
  intro: { gap: Spacing.xl },
  step: {
    alignSelf: 'flex-start',
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  sheet: {
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: Spacing.lg,
  },
  heading: { padding: Spacing.lg, gap: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center', flexWrap: 'wrap' },
  secondary: {
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primary: {
    flexGrow: 1,
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.banner,
  },
});
