import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { WatchlistItem } from '../types';
import * as api from '../services/api';

interface WatchlistState {
  items: WatchlistItem[];
  loading: boolean;
}

const initialState: WatchlistState = {
  items: [],
  loading: false,
};

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async () => api.getWatchlist(),
);

export const addWatchlistItem = createAsyncThunk(
  'watchlist/add',
  async (symbol: string) => api.addToWatchlist(symbol),
);

export const removeWatchlistItem = createAsyncThunk(
  'watchlist/remove',
  async (id: number) => {
    await api.removeFromWatchlist(id);
    return id;
  },
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWatchlist.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addWatchlistItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeWatchlistItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default watchlistSlice.reducer;
