import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface RemindersState {
  /** Keys of the reminders the user has turned on */
  keys: string[];
}

export const initialRemindersState: RemindersState = { keys: [] };

/** Parses the stored comma-separated key list, ignoring blanks. */
export function parseReminderKeys(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(',').filter((key) => key.length > 0);
}

const remindersSlice = createSlice({
  name: 'reminders',
  initialState: initialRemindersState,
  reducers: {
    reminderAdded(state, action: PayloadAction<string>) {
      if (!state.keys.includes(action.payload)) state.keys.push(action.payload);
    },
    reminderRemoved(state, action: PayloadAction<string>) {
      state.keys = state.keys.filter((key) => key !== action.payload);
    },
  },
});

export const { reminderAdded, reminderRemoved } = remindersSlice.actions;
export const remindersReducer = remindersSlice.reducer;
