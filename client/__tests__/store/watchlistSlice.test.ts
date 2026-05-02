import { describe, it, expect } from 'vitest';
import reducer from '../../src/store/watchlistSlice';
import { removeWatchlistItem } from '../../src/store/watchlistSlice';

describe('watchlistSlice', () => {
  const initialState = {
    items: [],
    loading: false,
  };

  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('removes an item by id on removeWatchlistItem.fulfilled', () => {
    const state = {
      items: [
        { id: 1, symbol: 'AAPL', added_at: '2026-01-01' },
        { id: 2, symbol: 'MSFT', added_at: '2026-01-02' },
        { id: 3, symbol: 'GOOGL', added_at: '2026-01-03' },
      ],
      loading: false,
    };

    const action = removeWatchlistItem.fulfilled(2, 'req-id', 2);
    const next = reducer(state, action);
    expect(next.items).toHaveLength(2);
    expect(next.items.find((i) => i.id === 2)).toBeUndefined();
  });
});
