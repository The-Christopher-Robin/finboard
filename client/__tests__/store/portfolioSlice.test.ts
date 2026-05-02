import { describe, it, expect } from 'vitest';
import reducer from '../../src/store/portfolioSlice';

describe('portfolioSlice', () => {
  it('returns initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.holdings).toEqual([]);
    expect(state.summary).toBeNull();
    expect(state.loading).toBe(false);
  });
});
