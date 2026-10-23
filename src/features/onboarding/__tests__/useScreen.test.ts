import { act, renderHook } from '@testing-library/react-native';
import { useOnboardingScreen } from '../useScreen';

const mockDispatch = jest.fn();
const mockReplace = jest.fn();
jest.mock('@/stores/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({ appearance: 'system', language: 'ta' }),
  useAppColors: () => ({}),
}));
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

it('lets the user revisit language before finishing onboarding', async () => {
  const hook = await renderHook(() => useOnboardingScreen());
  await act(async () => {
    hook.result.current.onPrimary();
  });
  expect(hook.result.current.step).toBe(1);
  expect(hook.result.current.onBack).toEqual(expect.any(Function));
  await act(async () => {
    hook.result.current.onBack();
  });
  expect(hook.result.current.step).toBe(0);
  expect(mockReplace).not.toHaveBeenCalled();
});
