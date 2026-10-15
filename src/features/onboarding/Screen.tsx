import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppLogo } from '@/components/AppLogo';
import { Icon } from '@/components/Icon';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import type { ColorTokens } from '@/themes/Colors';
import { useOnboardingScreen } from './useScreen';

const SYMBOL = 80;
const RADIO = 20;
const LOGO = 34;

interface OptionCardProps {
  label: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
  colors: ColorTokens;
}

function OptionCard({ label, detail, selected, onPress, colors }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[
        styles.option,
        selected
          ? { borderColor: colors.primary, backgroundColor: colors.commemorationSoft }
          : { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <View style={styles.optionCopy}>
        <Text style={[Typography.bodyStrong, { color: colors.text }]}>{label}</Text>
        {detail ? (
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{detail}</Text>
        ) : null}
      </View>
      <View
        style={[
          styles.radio,
          { borderColor: selected ? colors.primary : colors.border },
          selected && styles.radioOn,
        ]}
      >
        {selected ? <Icon name="check" size={Spacing.md} color={colors.primary} /> : null}
      </View>
    </Pressable>
  );
}

export function OnboardingScreen() {
  const s = useOnboardingScreen();
  const { colors } = s;
  const options = s.step === 0 ? s.languageOptions : s.appearanceOptions;
  const value = s.step === 0 ? s.language : s.appearance;
  const onSelect = (next: string) => {
    if (s.step === 0) s.onLanguageChange(next === 'en' ? 'en' : 'ta');
    else s.onAppearanceChange(next === 'light' || next === 'dark' ? next : 'system');
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: s.topInset + Spacing.lg,
          paddingBottom: s.bottomInset + Spacing.lg,
        },
      ]}
    >
      <View style={styles.top}>
        <View style={styles.brand}>
          <AppLogo size={LOGO} tile={colors.hero} ink={colors.onHero} colors={colors} />
          <Text style={[Typography.bodyStrong, { color: colors.primary }]}>{s.kicker}</Text>
        </View>
        <Pressable onPress={s.onSkip} accessibilityRole="button" style={styles.skip}>
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{s.skipLabel}</Text>
        </Pressable>
      </View>
      <View style={styles.progress}>
        {Array.from({ length: s.stepCount }, (_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              { backgroundColor: index <= s.stepNumber ? colors.primary : colors.border },
            ]}
          />
        ))}
      </View>
      <View style={styles.body}>
        <Text style={[Typography.caption, { color: colors.textMuted }]}>{s.stepLabel}</Text>
        <View
          style={[
            styles.symbol,
            { backgroundColor: colors.commemorationSoft, borderColor: colors.border },
          ]}
        >
          {s.step === 0 ? (
            <Text style={[Typography.title, { color: colors.primary }]}>அ</Text>
          ) : (
            <Icon name="moon" size={Spacing.xl + Spacing.sm} color={colors.primary} />
          )}
        </View>
        <Text style={[Typography.caption, { color: colors.cultural }]}>{s.eyebrow}</Text>
        <Text accessibilityRole="header" style={[Typography.title, { color: colors.text }]}>
          {s.title}
        </Text>
        <Text style={[Typography.body, { color: colors.textMuted }]}>{s.hint}</Text>
        <View style={styles.options} accessibilityRole="radiogroup">
          {options.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              detail={option.detail}
              selected={option.value === value}
              onPress={() => onSelect(option.value)}
              colors={colors}
            />
          ))}
        </View>
      </View>
      <Pressable
        onPress={s.onPrimary}
        accessibilityRole="button"
        style={[styles.primary, { backgroundColor: colors.hero }]}
      >
        <Text style={[Typography.button, { color: colors.onHero }]}>{s.primaryLabel}</Text>
        <Icon name="chevron-right" size={Spacing.xl} color={colors.onHero} />
      </Pressable>
      <Text style={[Typography.caption, styles.privacy, { color: colors.textMuted }]}>
        {s.privacy}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.screenPaddingH + Spacing.xs,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  skip: { minHeight: Layout.minTouchTarget, justifyContent: 'center', paddingLeft: Spacing.lg },
  progress: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.md },
  bar: { flex: 1, height: Spacing.xs - 1, borderRadius: Spacing.xs },
  body: { flex: 1, paddingTop: Spacing.xxl, gap: Spacing.sm },
  symbol: {
    width: SYMBOL,
    height: SYMBOL,
    borderRadius: Radius.card,
    borderWidth: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xl,
  },
  options: { gap: Spacing.sm, marginTop: Spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Layout.minTouchTarget + Spacing.md,
    borderRadius: Radius.banner,
    borderWidth: 2,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  optionCopy: { flex: 1 },
  radio: {
    width: RADIO,
    height: RADIO,
    borderRadius: RADIO / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderWidth: 2 },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Layout.minTouchTarget + Spacing.md,
    borderRadius: Radius.banner,
    paddingHorizontal: Spacing.xl,
  },
  privacy: { textAlign: 'center', marginTop: Spacing.md },
});
