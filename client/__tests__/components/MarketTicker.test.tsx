import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketReducer, { setStocks } from '../../src/store/marketSlice';
import watchlistReducer from '../../src/store/watchlistSlice';
import portfolioReducer from '../../src/store/portfolioSlice';
import alertsReducer from '../../src/store/alertsSlice';
import MarketTicker from '../../src/components/dashboard/MarketTicker';
import type { Stock } from '../../src/types';

function createStore(stocks: Stock[] = []) {
  const store = configureStore({
    reducer: {
      market: marketReducer,
      watchlist: watchlistReducer,
      portfolio: portfolioReducer,
      alerts: alertsReducer,
    },
  });
  if (stocks.length) store.dispatch(setStocks(stocks));
  return store;
}

const makeStock = (symbol: string, price: number, change: number): Stock => ({
  symbol,
  name: `${symbol} Inc.`,
  price,
  change,
  changePercent: (change / price) * 100,
  volume: 10000000,
  high: price + 2,
  low: price - 2,
  open: price - change,
  previousClose: price - change,
  sector: 'Technology',
  marketCap: 1000000000,
});

describe('MarketTicker', () => {
  it('renders nothing when no stocks', () => {
    const store = createStore();
    const { container } = render(
      <Provider store={store}>
        <MarketTicker />
      </Provider>,
    );
    expect(container.querySelector('.market-ticker')).toBeNull();
  });

  it('renders ticker items for stocks', () => {
    const stocks = [makeStock('AAPL', 178, 2.3), makeStock('MSFT', 370, -1.5)];
    const store = createStore(stocks);
    render(
      <Provider store={store}>
        <MarketTicker />
      </Provider>,
    );
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();
  });

  it('colors positive changes green and negative red', () => {
    const stocks = [makeStock('UP', 100, 5), makeStock('DOWN', 100, -5)];
    const store = createStore(stocks);
    render(
      <Provider store={store}>
        <MarketTicker />
      </Provider>,
    );
    const items = screen.getAllByTestId('ticker-item');
    const upChange = items[0].querySelector('.change');
    const downChange = items[1].querySelector('.change');
    expect(upChange?.classList.contains('positive')).toBe(true);
    expect(downChange?.classList.contains('negative')).toBe(true);
  });
});
