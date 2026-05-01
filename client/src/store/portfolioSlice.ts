import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PortfolioHolding, PortfolioSummaryData } from '../types';
import * as api from '../services/api';

interface PortfolioState {
  holdings: PortfolioHolding[];
  summary: PortfolioSummaryData | null;
  loading: boolean;
}

const initialState: PortfolioState = {
  holdings: [],
  summary: null,
  loading: false,
};

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetch',
  async () => api.getPortfolio(),
);

export const fetchPortfolioSummary = createAsyncThunk(
  'portfolio/fetchSummary',
  async () => api.getPortfolioSummary(),
);

export const trade = createAsyncThunk(
  'portfolio/trade',
  async (params: { symbol: string; shares: number; action: 'buy' | 'sell' }) => {
    const result = await api.executeTrade(params.symbol, params.shares, params.action);
    return result;
  },
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.holdings = action.payload;
        state.loading = false;
      })
      .addCase(fetchPortfolio.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchPortfolioSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(trade.fulfilled, (state) => {
        // Refetch portfolio after trade to get accurate holdings
        state.loading = true;
      });
  },
});

export default portfolioSlice.reducer;
