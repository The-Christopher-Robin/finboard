import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSectors } from '../services/api';
import SectorPieChart from '../components/charts/SectorPieChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { SectorData } from '../types';

export default function Sectors() {
  const navigate = useNavigate();
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getSectors()
      .then(setSectors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section aria-label="Sector analysis">
      <h1 className="page-title" style={{ marginBottom: 24 }}>Sectors</h1>

      {sectors.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="card-title" style={{ marginBottom: 8 }}>Market Cap by Sector</h2>
          <SectorPieChart data={sectors} />
        </div>
      )}

      <div className="sector-cards">
        {sectors.map((sec) => {
          const isOpen = expanded === sec.sector;
          const isUp = sec.avgChange >= 0;
          return (
            <div className="card" key={sec.sector}>
              <div
                className="sector-card-header"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : sec.sector)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => e.key === 'Enter' && setExpanded(isOpen ? null : sec.sector)}
              >
                <span className="sector-name">{sec.sector}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`mono ${isUp ? 'positive' : 'negative'}`} style={{ fontSize: '0.85rem' }}>
                    {isUp ? '+' : ''}{sec.avgChange.toFixed(2)}%
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {sec.stocks.length} stocks
                  </span>
                  <span style={{ fontSize: '0.8rem' }}>{isOpen ? '▾' : '▸'}</span>
                </div>
              </div>
              {isOpen && (
                <table className="data-table" style={{ marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Name</th>
                      <th className="num">Price</th>
                      <th className="num">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sec.stocks.map((s) => {
                      const up = s.changePercent >= 0;
                      return (
                        <tr
                          key={s.symbol}
                          className="clickable"
                          onClick={() => navigate(`/stock/${s.symbol}`)}
                        >
                          <td style={{ fontWeight: 700 }}>{s.symbol}</td>
                          <td>{s.name}</td>
                          <td className="num">${s.price.toFixed(2)}</td>
                          <td className={`num ${up ? 'positive' : 'negative'}`}>
                            {up ? '+' : ''}{s.changePercent.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      {sectors.length === 0 && (
        <p className="text-muted" style={{ textAlign: 'center', padding: 48 }}>
          No sector data available.
        </p>
      )}
    </section>
  );
}
