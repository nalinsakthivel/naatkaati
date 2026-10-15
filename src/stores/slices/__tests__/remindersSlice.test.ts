import {
  initialRemindersState,
  parseReminderKeys,
  reminderAdded,
  reminderRemoved,
  remindersReducer,
} from '../remindersSlice';

describe('remindersSlice', () => {
  it('starts empty', () => {
    expect(initialRemindersState.keys).toEqual([]);
  });

  it('adds a key once', () => {
    const once = remindersReducer(initialRemindersState, reminderAdded('h:a'));
    expect(remindersReducer(once, reminderAdded('h:a')).keys).toEqual(['h:a']);
  });

  it('removes a key', () => {
    const state = { keys: ['h:a', 'c:b'] };
    expect(remindersReducer(state, reminderRemoved('h:a')).keys).toEqual(['c:b']);
  });

  it('parses the stored list, ignoring blanks', () => {
    expect(parseReminderKeys(undefined)).toEqual([]);
    expect(parseReminderKeys('')).toEqual([]);
    expect(parseReminderKeys('h:a,,c:b')).toEqual(['h:a', 'c:b']);
  });
});
