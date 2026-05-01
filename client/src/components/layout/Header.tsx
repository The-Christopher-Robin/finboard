import { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';

interface Props {
  connected: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ connected, onToggleSidebar }: Props) {
  const stocks = useAppSelector((state) => state.market.stocks);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const avgChange = stocks.length
    ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
    : 0;

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <button
          className="hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
          {stocks.length} stocks tracked
        </span>
        {stocks.length > 0 && (
          <span className={avgChange >= 0 ? 'positive' : 'negative'} style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            Avg: {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
          </span>
        )}
      </div>
      <div className="header-right">
        <div className="alert-status" aria-label={connected ? 'Connected to live feed' : 'Disconnected from live feed'}>
          <span className={`connection-dot ${connected ? 'connected' : 'disconnected'}`} />
          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
        <time className="text-secondary mono" style={{ fontSize: '0.85rem' }} dateTime={time.toISOString()}>
          {time.toLocaleTimeString()}
        </time>
      </div>
    </header>
  );
}
