import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import marketReducer from '../../src/store/marketSlice';
import watchlistReducer from '../../src/store/watchlistSlice';
import portfolioReducer from '../../src/store/portfolioSlice';
import alertsReducer from '../../src/store/alertsSlice';
import Header from '../../src/components/layout/Header';

function createTestStore() {
  return configureStore({
    reducer: {
      market: marketReducer,
      watchlist: watchlistReducer,
      portfolio: portfolioReducer,
      alerts: alertsReducer,
    },
  });
}

describe('Header', () => {
  it('shows connection status as Live when connected', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <Header connected={true} onToggleSidebar={vi.fn()} />
      </Provider>,
    );
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('shows Offline when disconnected', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <Header connected={false} onToggleSidebar={vi.fn()} />
      </Provider>,
    );
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('renders the current time', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <Header connected={true} onToggleSidebar={vi.fn()} />
      </Provider>,
    );
    const timeEl = screen.getByRole('banner').querySelector('time');
    expect(timeEl).toBeInTheDocument();
  });

  it('shows stock count', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <Header connected={true} onToggleSidebar={vi.fn()} />
      </Provider>,
    );
    expect(screen.getByText('0 stocks tracked')).toBeInTheDocument();
  });
});
