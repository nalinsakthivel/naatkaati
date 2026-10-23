import { act, renderHook } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { getBundledData as mockGetBundledData } from '@/services/bundledData';
import { useDayView } from '../useDayView';

jest.mock('@/stores/hooks', () => ({
  useAppColors: () => ({}),
  useAppSelector: () => ({
    language: 'ta',
    tamilNumerals: false,
    holidayCategories: [],
    newYearLabel: 'thai',
  }),
  useActiveData: () => mockGetBundledData(),
}));
jest.mock('../useReminders', () => ({
  useReminders: () => ({ isOn: () => false, toggle: jest.fn() }),
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

it('keeps the kural readable and shows feedback when a report link cannot open', async () => {
  jest.spyOn(Linking, 'openURL').mockImplementation(() => {
    throw new Error('No browser');
  });
  const hook = await renderHook(() => useDayView('2026-10-23'));
  await act(async () => {
    await hook.result.current.onReportKural();
  });
  expect(hook.result.current.reportError).toBe('common.openLinkFailed');
  expect(hook.result.current.kural?.unverifiedLabel).toBeTruthy();
  jest.restoreAllMocks();
});
