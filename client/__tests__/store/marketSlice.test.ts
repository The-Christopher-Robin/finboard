import { describe, it, expect } from 'vitest';
import reducer, {
  setStocks,
  updateStocks,
  setSelectedStock,
  setPriceHistory,
} from '../../src/store/marketSlice';
import type { Stock, PricePoint } from '../../src/types';

const mockStock: Stock = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 178.5,
  change: 2.3,
  changePercent: 1.3,
  volume: 15000000,
  high: 180,
  low: 175,
  open: 176.2,
  previousClose: 176.2,
  sector: 'Technology',
  marketCap: 2890000000000,
};

const mockStock2: Stock = {
  ...mockStock,
  symbol: 'MSFT',
  name: 'Microsoft Corporation',
  price: 370,
};

describe('marketSlice', () => {
  const initialState = {
    stocks: [],
    selectedStock: null,
    priceHistory: [],
    loading: false,
    error: null,
  };

  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles setStocks', () => {
    const stocks = [mockStock, mockStock2];
    const state = reducer(initialState, setStocks(stocks));
    expect(state.stocks).toHaveLength(2);
    expect(state.stocks[0].symbol).toBe('AAPL');
  });

  it('handles updateStocks – replaces matching stocks', () => {
    const state = { ...initialState, stocks: [mockStock, mockStock2] };
    const updated = { ...mockStock, price: 180, change: 3.8 };
    const next = reducer(state, updateStocks([updated]));
    expect(next.stocks[0].price).toBe(180);
    expect(next.stocks[0].change).toBe(3.8);
    expect(next.stocks[1].price).toBe(370);
  });

  it('updateStocks also patches selectedStock', () => {
    const state = {
      ...initialState,
      stocks: [mockStock],
      selectedStock: mockStock,
    };
    const updated = { ...mockStock, price: 190 };
    const next = reducer(state, updateStocks([updated]));
    expect(next.selectedStock?.price).toBe(190);
  });

  it('handles setSelectedStock', () => {
    const state = reducer(initialState, setSelectedStock(mockStock));
    expect(state.selectedStock?.symbol).toBe('AAPL');
  });

  it('handles setPriceHistory', () => {
    const history: PricePoint[] = [
      { timestamp: Date.now(), open: 170, high: 180, low: 168, close: 178, volume: 10000 },
    ];
    const state = reducer(initialState, setPriceHistory(history));
    expect(state.priceHistory).toHaveLength(1);
    expect(state.priceHistory[0].close).toBe(178);
  });
});
