export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  sector: string;
  marketCap: number;
}

export interface PricePoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  id: number;
  symbol: string;
  added_at: string;
  stock?: Stock;
}

export interface PortfolioHolding {
  id: number;
  symbol: string;
  shares: number;
  avg_cost: number;
  purchased_at: string;
  stock?: Stock;
  currentValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
}

export interface Alert {
  id: number;
  symbol: string;
  target_price: number;
  direction: 'above' | 'below';
  triggered: boolean;
  created_at: string;
}

export interface SectorData {
  sector: string;
  stocks: Stock[];
  totalMarketCap: number;
  avgChange: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  symbols: string[];
}

export interface PortfolioSummaryData {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  gainLossPercent: number;
}
