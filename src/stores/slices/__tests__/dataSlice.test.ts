import { dataReducer, dataUpdated, initialDataState, syncStatusChanged } from '../dataSlice';

describe('dataSlice', () => {
  it('starts idle at revision 0', () => {
    expect(initialDataState).toEqual({ revision: 0, syncStatus: 'idle' });
  });

  it('bumps the revision on each update', () => {
    const once = dataReducer(initialDataState, dataUpdated());
    expect(dataReducer(once, dataUpdated()).revision).toBe(2);
  });

  it('tracks sync status', () => {
    expect(dataReducer(initialDataState, syncStatusChanged('syncing')).syncStatus).toBe('syncing');
  });
});
