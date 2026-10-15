import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppLogo } from '@/components/AppLogo';
import { AppConstants } from '@/constants/AppConstants';
import { useAppColors } from '@/stores/hooks';
import { Spacing, Typography } from '@/themes/Theme';

const LOGO_SIZE = 104;
const LINE_WIDTH = 26;
const LINE_HEIGHT = 2;

interface SplashProps {
  onComplete: () => void;
}

/** Brand splash shown after the native one: logo, name, tagline. Tap to skip. */
export function Splash({ onComplete }: SplashProps) {
  const { t } = useTranslation();
  const colors = useAppColors();
  useEffect(() => {
    const timer = setTimeout(onComplete, AppConstants.splashMs);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <Pressable
      onPress={onComplete}
      accessibilityRole="button"
      accessibilityLabel={t('splash.skip')}
      style={[styles.root, { backgroundColor: colors.splash }]}
    >
      <View style={styles.brand}>
        <AppLogo size={LOGO_SIZE} tile={colors.splashTile} ink={colors.splashInk} colors={colors} />
        <Text style={[Typography.title, styles.name, { color: colors.onHero }]}>
          {t('splash.name')}
        </Text>
        <Text style={[Typography.caption, styles.latin, { color: colors.onHeroMuted }]}>
          {t('splash.nameLatin')}
        </Text>
        <View style={[styles.line, { backgroundColor: colors.heroAccent }]} />
        <Text style={[Typography.body, { color: colors.onHero }]}>{t('splash.tagline')}</Text>
        <Text style={[Typography.caption, { color: colors.onHeroMuted }]}>
          {t('splash.taglineEn')}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={[Typography.caption, { color: colors.onHeroMuted }]}>
          {t('splash.offline')}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brand: { alignItems: 'center', gap: Spacing.xs },
  name: { marginTop: Spacing.xl },
  latin: { letterSpacing: 4 },
  line: { width: LINE_WIDTH, height: LINE_HEIGHT, marginVertical: Spacing.lg },
  footer: { position: 'absolute', bottom: Spacing.xxxl, alignItems: 'center' },
});
