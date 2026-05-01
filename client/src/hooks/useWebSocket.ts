import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch } from '../store';
import { setStocks, updateStocks } from '../store/marketSlice';

const WS_URL = 'ws://localhost:4001';
const MAX_BACKOFF = 30_000;

export function useWebSocket() {
  const dispatch = useAppDispatch();
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const backoffRef = useRef(2000);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      backoffRef.current = 2000;
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'snapshot') {
          dispatch(setStocks(msg.data));
        } else if (msg.type === 'update') {
          dispatch(updateStocks(msg.data));
        }
        setLastUpdate(new Date());
      } catch {
        // malformed message, skip
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (!mountedRef.current) return;
      const delay = backoffRef.current;
      backoffRef.current = Math.min(delay * 2, MAX_BACKOFF);
      setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [dispatch]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      wsRef.current?.close();
    };
  }, [connect]);

  return { connected, lastUpdate };
}
