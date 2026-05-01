import type {
  Stock,
  PricePoint,
  SectorData,
  WatchlistItem,
  PortfolioHolding,
  PortfolioSummaryData,
  Alert,
} from '../types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Market data
export const getStocks = () => request<Stock[]>('/api/stocks');

export const getStock = (symbol: string) =>
  request<{ stock: Stock; history: PricePoint[] }>(`/api/stocks/${symbol}`);

export const getStockHistory = (symbol: string, range: string) =>
  request<PricePoint[]>(`/api/stocks/${symbol}/history?range=${range}`);

export const getSectors = () => request<SectorData[]>('/api/sectors');

// Watchlist
export const getWatchlist = () => request<WatchlistItem[]>('/api/watchlist');

export const addToWatchlist = (symbol: string) =>
  request<WatchlistItem>('/api/watchlist', {
    method: 'POST',
    body: JSON.stringify({ symbol }),
  });

export const removeFromWatchlist = (id: number) =>
  request<void>(`/api/watchlist/${id}`, { method: 'DELETE' });

// Portfolio
export const getPortfolio = () =>
  request<PortfolioHolding[]>('/api/portfolio');

export const getPortfolioSummary = () =>
  request<PortfolioSummaryData>('/api/portfolio/summary');

export const executeTrade = (
  symbol: string,
  shares: number,
  action: 'buy' | 'sell',
) =>
  request<{ holding: PortfolioHolding }>('/api/portfolio/trade', {
    method: 'POST',
    body: JSON.stringify({ symbol, shares, action }),
  });

// Alerts
export const getAlerts = () => request<Alert[]>('/api/alerts');

export const createAlert = (
  symbol: string,
  targetPrice: number,
  direction: string,
) =>
  request<Alert>('/api/alerts', {
    method: 'POST',
    body: JSON.stringify({ symbol, targetPrice, direction }),
  });

export const deleteAlert = (id: number) =>
  request<void>(`/api/alerts/${id}`, { method: 'DELETE' });
