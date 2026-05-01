import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import marketReducer from './marketSlice';
import watchlistReducer from './watchlistSlice';
import portfolioReducer from './portfolioSlice';
import alertsReducer from './alertsSlice';

export const store = configureStore({
  reducer: {
    market: marketReducer,
    watchlist: watchlistReducer,
    portfolio: portfolioReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
