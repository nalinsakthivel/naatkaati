import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useHolidaysScreen } from './useScreen';

export function HolidaysScreen() {
  const s = useHolidaysScreen();
  const { colors } = s;
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: s.topInset + Spacing.lg }]}
    >
      <ScreenHeader kicker={s.kicker} title={s.title} subtitle={s.subtitle} colors={colors} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {s.filters.map((filter) => (
          <Pressable
            key={filter.value}
            onPress={filter.onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: filter.selected }}
            style={[
              styles.filter,
              filter.selected
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                Typography.caption,
                { color: filter.selected ? colors.textOnPrimary : colors.textMuted },
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {s.groups.length === 0 ? (
        <Text style={[Typography.body, { color: colors.textMuted }]}>{s.emptyLabel}</Text>
      ) : (
        s.groups.map((group) => (
          <View key={group.key} style={styles.group}>
            <Text style={[Typography.bodyStrong, { color: colors.text }]}>{group.title}</Text>
            <View
              style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              {group.items.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={item.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.day}, ${item.weekday}, ${item.name}, ${item.tags.join(', ')}`}
                  style={[
                    styles.row,
                    index > 0 && {
                      borderTopColor: colors.border,
                      borderTopWidth: StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View style={styles.date}>
                    <Text style={[Typography.title, { color: colors.holiday }]}>{item.day}</Text>
                    <Text style={[Typography.caption, { color: colors.textMuted }]}>
                      {item.weekday}
                    </Text>
                  </View>
                  <View style={styles.copy}>
                    <Text style={[Typography.bodyStrong, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[Typography.caption, { color: colors.textMuted }]}>
                      {item.secondary}
                    </Text>
                    <View style={styles.tags}>
                      {item.tags.map((tag) => (
                        <View
                          key={tag}
                          style={[styles.tag, { backgroundColor: colors.holidaySoft }]}
                        >
                          <Text style={[Typography.caption, { color: colors.holiday }]}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))
      )}
      <View style={[styles.note, { backgroundColor: colors.commemorationSoft }]}>
        <View style={[styles.noteIcon, { backgroundColor: colors.surface }]}>
          <Icon name="download" size={Spacing.xl - Spacing.xs} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={[Typography.bodyStrong, { color: colors.primary }]}>{s.note.title}</Text>
          <Text style={[Typography.caption, { color: colors.textMuted }]}>{s.note.body}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const ICON_CIRCLE = Layout.minTouchTarget - Spacing.sm;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Layout.dockClearance,
    gap: Spacing.lg,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  filters: { gap: Spacing.sm },
  filter: {
    minHeight: Layout.minTouchTarget - Spacing.sm,
    justifyContent: 'center',
    borderRadius: Radius.chip,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
  },
  group: { gap: Spacing.sm },
  list: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: Spacing.lg, padding: Spacing.lg },
  date: { width: Layout.minTouchTarget + Spacing.sm, alignItems: 'center' },
  copy: { flex: 1, gap: Spacing.xxs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.xs },
  tag: { borderRadius: Radius.chip, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xxs },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  noteIcon: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
