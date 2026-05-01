import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchStocks } from '../store/marketSlice';
import { useWebSocket } from './useWebSocket';

export function useMarketData() {
  const dispatch = useAppDispatch();
  const { stocks, loading } = useAppSelector((state) => state.market);
  const { connected } = useWebSocket();

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  return { stocks, loading, connected };
}
