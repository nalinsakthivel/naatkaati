import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SyncStatus = 'idle' | 'syncing' | 'ok' | 'failed';

export interface DataState {
  /** Bumped whenever downloaded data replaces what screens are showing */
  revision: number;
  syncStatus: SyncStatus;
}

export const initialDataState: DataState = { revision: 0, syncStatus: 'idle' };

const dataSlice = createSlice({
  name: 'data',
  initialState: initialDataState,
  reducers: {
    dataUpdated(state) {
      state.revision += 1;
    },
    syncStatusChanged(state, action: PayloadAction<SyncStatus>) {
      state.syncStatus = action.payload;
    },
  },
});

export const { dataUpdated, syncStatusChanged } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
