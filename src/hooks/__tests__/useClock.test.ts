import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useClock } from '../useClock';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-10-23T18:29:59Z'));
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

it('updates while the screen stays open across Chennai midnight and cleans up', async () => {
  const start = jest.spyOn(globalThis, 'setInterval');
  const clear = jest.spyOn(globalThis, 'clearInterval');
  const hook = await renderHook(() => useClock());
  await act(async () => {
    jest.advanceTimersByTime(60_000);
  });
  expect(hook.result.current.toISOString()).toBe('2026-10-23T18:30:59.000Z');
  await hook.unmount();
  const ownTimer = start.mock.calls.findIndex(([, delay]) => delay === 60_000);
  expect(ownTimer).toBeGreaterThanOrEqual(0);
  expect(clear).toHaveBeenCalledWith(start.mock.results[ownTimer].value);
});

it('immediately catches up after the app returns to the foreground', async () => {
  const listener = jest.spyOn(AppState, 'addEventListener');
  const hook = await renderHook(() => useClock());
  jest.setSystemTime(new Date('2026-10-24T06:00:00Z'));
  await act(async () => {
    for (const [event, callback] of listener.mock.calls) {
      if (event === 'change') callback('active');
    }
  });
  expect(hook.result.current.toISOString()).toBe('2026-10-24T06:00:00.000Z');
  await hook.unmount();
});
