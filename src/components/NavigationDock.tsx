import type { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Icon, type IconName } from '@/components/Icon';
import { useAppColors } from '@/stores/hooks';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import type { ComponentProps } from 'react';

type DockProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const ITEMS: Record<string, { icon: IconName; labelKey: string }> = {
  index: { icon: 'sun', labelKey: 'tabs.today' },
  calendar: { icon: 'calendar', labelKey: 'tabs.calendar' },
  holidays: { icon: 'check-square', labelKey: 'tabs.holidays' },
  settings: { icon: 'settings', labelKey: 'tabs.settings' },
};

const PILL_WIDTH = 44;
const PILL_HEIGHT = 30;
const DOCK_SHADOW = 6;
const LABEL_MIN_SCALE = 0.8;

/** Floating rounded navigation bar. The active destination gets a filled icon pill and a tinted tab. */
export function NavigationDock({ state, navigation }: DockProps) {
  const { t } = useTranslation();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(insets.bottom, Layout.dockMargin),
        },
      ]}
    >
      <View
        accessibilityRole="tablist"
        style={[styles.dock, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {state.routes.map((route, index) => {
          const item = ITEMS[route.name];
          if (!item) return null;
          const focused = state.index === index;
          const label = t(item.labelKey);
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={[
                styles.item,
                { backgroundColor: focused ? colors.commemorationSoft : 'transparent' },
              ]}
            >
              <View style={styles.pill}>
                {/* Drawn once and faded in: changing a rounded View's colour drops its corners on Android */}
                <View
                  style={[
                    styles.pillFill,
                    { backgroundColor: colors.primary, opacity: focused ? 1 : 0 },
                  ]}
                />
                <Icon
                  name={item.icon}
                  size={Spacing.xl - Spacing.xs}
                  color={focused ? colors.textOnPrimary : colors.textMuted}
                />
              </View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={LABEL_MIN_SCALE}
                style={[Typography.caption, { color: focused ? colors.primary : colors.textMuted }]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xs },
  dock: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    minHeight: Layout.dockHeight,
    padding: Spacing.sm - Spacing.xxs,
    gap: Spacing.xxs,
    borderRadius: Radius.sheet,
    borderWidth: 1,
    elevation: DOCK_SHADOW,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
    borderRadius: Radius.card - Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  pill: { width: PILL_WIDTH, height: PILL_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  pillFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: PILL_HEIGHT / 2,
  },
});
