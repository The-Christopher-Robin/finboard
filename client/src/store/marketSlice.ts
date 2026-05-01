import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Stock, PricePoint } from '../types';
import * as api from '../services/api';

interface MarketState {
  stocks: Stock[];
  selectedStock: Stock | null;
  priceHistory: PricePoint[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  stocks: [],
  selectedStock: null,
  priceHistory: [],
  loading: false,
  error: null,
};

export const fetchStocks = createAsyncThunk('market/fetchStocks', async () => {
  return api.getStocks();
});

export const fetchStockDetail = createAsyncThunk(
  'market/fetchStockDetail',
  async (symbol: string) => {
    return api.getStock(symbol);
  },
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setStocks(state, action: PayloadAction<Stock[]>) {
      state.stocks = action.payload;
    },
    updateStocks(state, action: PayloadAction<Stock[]>) {
      const updates = action.payload;
      for (const update of updates) {
        const idx = state.stocks.findIndex((s) => s.symbol === update.symbol);
        if (idx !== -1) {
          state.stocks[idx] = update;
        }
        if (state.selectedStock?.symbol === update.symbol) {
          state.selectedStock = update;
        }
      }
    },
    setSelectedStock(state, action: PayloadAction<Stock | null>) {
      state.selectedStock = action.payload;
    },
    setPriceHistory(state, action: PayloadAction<PricePoint[]>) {
      state.priceHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
        state.loading = false;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch stocks';
      })
      .addCase(fetchStockDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockDetail.fulfilled, (state, action) => {
        state.selectedStock = action.payload.stock;
        state.priceHistory = action.payload.history;
        state.loading = false;
      })
      .addCase(fetchStockDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch stock detail';
      });
  },
});

export const { setStocks, updateStocks, setSelectedStock, setPriceHistory } =
  marketSlice.actions;
export default marketSlice.reducer;
