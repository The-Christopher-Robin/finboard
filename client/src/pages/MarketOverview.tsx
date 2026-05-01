import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Stock } from '../types';

type SortKey = keyof Pick<Stock, 'symbol' | 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap'>;
type SortDir = 'asc' | 'desc';

function fmtVol(v: number) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toString();
}

function fmtCap(v: number) {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
  return `$${v.toLocaleString()}`;
}

export default function MarketOverview() {
  const navigate = useNavigate();
  const { stocks, loading } = useAppSelector((state) => state.market);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'symbol' || key === 'name' ? 'asc' : 'desc');
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = stocks.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    );
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [stocks, search, sortKey, sortDir]);

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  if (loading && !stocks.length) return <LoadingSpinner />;

  return (
    <section aria-label="Market overview">
      <div className="page-header">
        <h1 className="page-title">Market Overview</h1>
        <input
          type="text"
          className="form-input"
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search stocks"
          style={{ width: 260 }}
        />
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {([
                ['symbol', 'Symbol'],
                ['name', 'Name'],
                ['price', 'Price'],
                ['change', 'Change'],
                ['changePercent', 'Change %'],
                ['volume', 'Volume'],
                ['marketCap', 'Market Cap'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  className={`sortable ${key !== 'symbol' && key !== 'name' ? 'num' : ''}`}
                  onClick={() => handleSort(key)}
                  aria-sort={sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  {label}{sortIndicator(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const isUp = s.change >= 0;
              return (
                <tr
                  key={s.symbol}
                  className="clickable"
                  onClick={() => navigate(`/stock/${s.symbol}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/stock/${s.symbol}`)}
                >
                  <td style={{ fontWeight: 700 }}>{s.symbol}</td>
                  <td>{s.name}</td>
                  <td className="num">${s.price.toFixed(2)}</td>
                  <td className={`num ${isUp ? 'positive' : 'negative'}`}>
                    {isUp ? '+' : ''}{s.change.toFixed(2)}
                  </td>
                  <td className={`num ${isUp ? 'positive' : 'negative'}`}>
                    {isUp ? '+' : ''}{s.changePercent.toFixed(2)}%
                  </td>
                  <td className="num">{fmtVol(s.volume)}</td>
                  <td className="num">{fmtCap(s.marketCap)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-muted" style={{ padding: 24, textAlign: 'center' }}>
            No stocks match your search.
          </p>
        )}
      </div>
    </section>
  );
}
