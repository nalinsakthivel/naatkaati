import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { WidgetPreview } from '@/components/WidgetPreview';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useWidgetsScreen } from './useScreen';

const ICON_CIRCLE = Layout.minTouchTarget - Spacing.sm;

export function WidgetsScreen() {
  const s = useWidgetsScreen();
  const { colors, labels } = s;
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.intro, { backgroundColor: colors.commemorationSoft }]}>
        <View style={[styles.circle, { backgroundColor: colors.surface }]}>
          <Icon name="grid" size={Spacing.xl - Spacing.xs} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text style={[Typography.bodyStrong, { color: colors.text }]}>{labels.introTitle}</Text>
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{labels.introBody}</Text>
        </View>
      </View>

      <View style={styles.filters}>
        {[
          { label: labels.all, active: !s.onlyFavorites, onPress: s.onShowAll },
          { label: labels.favorites, active: s.onlyFavorites, onPress: s.onShowFavorites },
        ].map((filter) => (
          <Pressable
            key={filter.label}
            onPress={filter.onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: filter.active }}
            style={[
              styles.filter,
              filter.active
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                Typography.caption,
                { color: filter.active ? colors.textOnPrimary : colors.textMuted },
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {s.variants.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="heart" size={Spacing.xl} color={colors.holiday} />
          <Text style={[Typography.bodyStrong, { color: colors.text }]}>{labels.emptyTitle}</Text>
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{labels.emptyBody}</Text>
          <Pressable onPress={s.onShowAll} accessibilityRole="button" style={styles.emptyAction}>
            <Text style={[Typography.button, { color: colors.primary }]}>{labels.emptyAction}</Text>
          </Pressable>
        </View>
      ) : (
        s.variants.map((variant) => (
          <View
            key={variant.id}
            style={[
              styles.option,
              { backgroundColor: colors.surface },
              { borderColor: variant.selected ? colors.primary : colors.border },
              variant.selected && styles.optionSelected,
            ]}
          >
            <View style={styles.optionTop}>
              <View style={styles.flex}>
                <Text style={[Typography.bodyStrong, { color: colors.text }]}>{variant.name}</Text>
                <Text style={[Typography.caption, { color: colors.textMuted }]}>
                  {variant.size}
                </Text>
              </View>
              <Pressable
                onPress={variant.onToggleFavorite}
                accessibilityRole="button"
                accessibilityLabel={labels.favorite}
                accessibilityState={{ selected: variant.favorite }}
                style={[
                  styles.action,
                  { borderColor: variant.favorite ? colors.holidaySoft : colors.border },
                  variant.favorite && { backgroundColor: colors.holidaySoft },
                ]}
              >
                <Icon
                  name="heart"
                  size={Spacing.xl - Spacing.sm}
                  color={variant.favorite ? colors.holiday : colors.textMuted}
                />
              </Pressable>
              <Pressable
                onPress={variant.onShare}
                accessibilityRole="button"
                accessibilityLabel={labels.share}
                style={[styles.action, { borderColor: colors.border }]}
              >
                <Icon name="share-2" size={Spacing.xl - Spacing.sm} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={[styles.stage, { backgroundColor: colors.surfaceMuted }]}>
              {s.model ? (
                <View style={variant.id === 'minimal' ? styles.minimalSlot : styles.fullSlot}>
                  <WidgetPreview
                    variant={variant.id}
                    model={s.model}
                    yearLabel={s.yearLabel}
                    appName={labels.appName}
                    kuralTitle={labels.kuralTitle}
                    eventTitle={labels.eventTitle}
                  />
                </View>
              ) : null}
            </View>
            <View style={styles.optionBottom}>
              <Text style={[Typography.caption, styles.flex, { color: colors.textMuted }]}>
                {variant.description}
              </Text>
              <Pressable
                onPress={variant.onSelect}
                accessibilityRole="button"
                accessibilityState={{ selected: variant.selected }}
                style={[
                  styles.choose,
                  { borderColor: colors.primary },
                  variant.selected && { backgroundColor: colors.primary },
                ]}
              >
                {variant.selected ? (
                  <Icon name="check" size={Spacing.lg} color={colors.textOnPrimary} />
                ) : null}
                <Text
                  style={[
                    Typography.caption,
                    { color: variant.selected ? colors.textOnPrimary : colors.primary },
                  ]}
                >
                  {variant.selected ? labels.chosen : labels.choose}
                </Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
      <Text style={[Typography.caption, styles.note, { color: colors.textMuted }]}>
        {labels.howTo}
      </Text>
      <Text style={[Typography.caption, styles.note, { color: colors.textMuted }]}>
        {labels.note}
      </Text>
    </ScrollView>
  );
}

const MINIMAL_WIDTH = '55%';

const styles = StyleSheet.create({
  content: {
    padding: Layout.screenPaddingH,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  flex: { flex: 1 },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  circle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', gap: Spacing.sm },
  filter: {
    minHeight: Layout.minTouchTarget - Spacing.sm,
    justifyContent: 'center',
    borderRadius: Radius.chip,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
  },
  option: { borderRadius: Radius.card, borderWidth: 1, padding: Spacing.md, gap: Spacing.md },
  optionSelected: { borderWidth: 2 },
  optionTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  action: {
    width: Layout.minTouchTarget - Spacing.sm,
    height: Layout.minTouchTarget - Spacing.sm,
    borderRadius: (Layout.minTouchTarget - Spacing.sm) / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    borderRadius: Radius.banner,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullSlot: { width: '100%' },
  minimalSlot: { width: MINIMAL_WIDTH },
  optionBottom: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  choose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: Layout.minTouchTarget - Spacing.sm,
    borderRadius: Radius.chip,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
  },
  empty: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xxl },
  emptyAction: { minHeight: Layout.minTouchTarget, justifyContent: 'center' },
  note: { textAlign: 'center' },
});
