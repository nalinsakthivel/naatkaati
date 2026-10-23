import { act, renderHook } from '@testing-library/react-native';
import { getBundledData as mockGetBundledData } from '@/services/bundledData';
import { useCalendarScreen } from '../useScreen';

const mockPush = jest.fn();
jest.mock('@/stores/hooks', () => ({
  useAppSelector: () => ({
    language: 'en',
    tamilNumerals: false,
    holidayCategories: ['state_govt'],
    newYearLabel: 'thai',
  }),
  useAppColors: () => ({}),
  useActiveData: () => mockGetBundledData(),
}));
jest.mock('@/hooks/useClock', () => ({ useClock: () => new Date('2026-10-23T07:00:00Z') }));
jest.mock('@/features/today/useTimeBanner', () => ({ useTimeBanner: () => null }));
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0 }) }));
beforeEach(() => jest.clearAllMocks());

it('opens a monthly holiday directly from the agenda', async () => {
  const hook = await renderHook(() => useCalendarScreen());
  expect(hook.result.current.monthHolidays.length).toBeGreaterThan(0);
  await act(async () => {
    hook.result.current.monthHolidays[0].onPress();
  });
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/day/[date]',
    params: { date: '2026-10-02' },
  });
});

it('bounds previous/next month navigation and can always return to today', async () => {
  const hook = await renderHook(() => useCalendarScreen());
  await act(async () => {
    hook.result.current.jump.onChange(1901, 1);
  });
  expect(hook.result.current.canGoPrev).toBe(false);
  await act(async () => {
    hook.result.current.onPrev();
  });
  expect(hook.result.current.jump.year).toBe(1901);
  expect(hook.result.current.jump.month).toBe(1);
  await act(async () => {
    hook.result.current.jump.onChange(2099, 12);
  });
  expect(hook.result.current.canGoNext).toBe(false);
  await act(async () => {
    hook.result.current.onNext();
  });
  expect(hook.result.current.jump.year).toBe(2099);
  expect(hook.result.current.jump.month).toBe(12);
  await act(async () => {
    hook.result.current.onToday();
  });
  expect([hook.result.current.jump.year, hook.result.current.jump.month]).toEqual([2026, 10]);
});
