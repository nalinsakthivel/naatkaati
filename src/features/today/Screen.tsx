import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DayBody } from '@/components/DayBody';
import { Icon } from '@/components/Icon';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SwipeView } from '@/components/SwipeView';
import { TimeBanner } from '@/components/TimeBanner';
import { UpcomingList } from '@/components/UpcomingList';
import { Layout, Radius, Spacing, Typography } from '@/themes/Theme';
import { useTodayScreen } from './useScreen';

const PIN_SIZE = Spacing.lg;

export function TodayScreen() {
  const {
    topInset,
    kicker,
    title,
    locationLabel,
    offline,
    timeBanner,
    upcoming,
    isToday,
    jumpLabel,
    onNextDay,
    onPreviousDay,
    onJumpToToday,
    ...day
  } = useTodayScreen();
  const { colors } = day;
  return (
    <SwipeView onSwipeLeft={onNextDay} onSwipeRight={onPreviousDay}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.content, { paddingTop: topInset + Spacing.lg }]}
      >
        <ScreenHeader
          kicker={kicker}
          title={title}
          colors={colors}
          action={
            <View
              accessible
              style={[
                styles.location,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Icon name="map-pin" size={PIN_SIZE} color={colors.primary} />
              <Text style={[Typography.caption, { color: colors.text }]}>{locationLabel}</Text>
            </View>
          }
        />
        {timeBanner ? <TimeBanner {...timeBanner} colors={colors} /> : null}
        {isToday ? null : (
          <Pressable
            onPress={onJumpToToday}
            accessibilityRole="button"
            style={[styles.jump, { backgroundColor: colors.primary }]}
          >
            <Text style={[Typography.button, { color: colors.textOnPrimary }]}>{jumpLabel}</Text>
          </Pressable>
        )}
        <DayBody {...day} />
        <UpcomingList title={upcoming.title} rows={upcoming.rows} colors={colors} />
        <View style={[styles.offline, { backgroundColor: colors.commemorationSoft }]}>
          <View style={[styles.offlineIcon, { backgroundColor: colors.surface }]}>
            <Icon name="download" size={Spacing.xl - Spacing.xs} color={colors.primary} />
          </View>
          <View style={styles.offlineText}>
            <Text style={[Typography.bodyStrong, { color: colors.primary }]}>{offline.title}</Text>
            <Text style={[Typography.caption, { color: colors.textMuted }]}>{offline.body}</Text>
          </View>
        </View>
      </ScrollView>
    </SwipeView>
  );
}

const ICON_CIRCLE = Layout.minTouchTarget - Spacing.sm;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Layout.dockClearance,
    gap: Spacing.md,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.chip,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  jump: {
    alignSelf: 'center',
    minHeight: Layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.chip,
  },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  offlineIcon: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: { flex: 1 },
});
