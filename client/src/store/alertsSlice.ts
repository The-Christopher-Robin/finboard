import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Alert } from '../types';
import * as api from '../services/api';

interface AlertsState {
  alerts: Alert[];
  loading: boolean;
}

const initialState: AlertsState = {
  alerts: [],
  loading: false,
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetch',
  async () => api.getAlerts(),
);

export const addAlert = createAsyncThunk(
  'alerts/add',
  async (params: { symbol: string; targetPrice: number; direction: string }) => {
    return api.createAlert(params.symbol, params.targetPrice, params.direction);
  },
);

export const removeAlert = createAsyncThunk(
  'alerts/remove',
  async (id: number) => {
    await api.deleteAlert(id);
    return id;
  },
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlerts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addAlert.fulfilled, (state, action) => {
        state.alerts.push(action.payload);
      })
      .addCase(removeAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter((a) => a.id !== action.payload);
      });
  },
});

export default alertsSlice.reducer;
