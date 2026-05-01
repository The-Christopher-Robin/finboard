import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPortfolio, fetchPortfolioSummary } from '../../store/portfolioSlice';

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PortfolioSummary() {
  const dispatch = useAppDispatch();
  const { holdings, summary } = useAppSelector((state) => state.portfolio);
  const stocks = useAppSelector((state) => state.market.stocks);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchPortfolioSummary());
  }, [dispatch]);

  const topHoldings = holdings.slice(0, 4).map((h) => {
    const stock = stocks.find((s) => s.symbol === h.symbol);
    const value = stock ? stock.price * h.shares : 0;
    return { ...h, value, stock };
  });

  const isUp = summary ? summary.totalGainLoss >= 0 : true;

  return (
    <div className="card" data-testid="portfolio-summary">
      <div className="card-header">
        <h2 className="card-title">Portfolio</h2>
        <Link to="/portfolio" className="btn btn-ghost btn-sm">View All</Link>
      </div>

      {summary && (
        <div className="summary-row" style={{ marginBottom: 16 }}>
          <div className="summary-stat">
            <span className="label">Total Value</span>
            <span className="value">${fmt(summary.totalValue)}</span>
          </div>
          <div className="summary-stat">
            <span className="label">Gain / Loss</span>
            <span className={`value ${isUp ? 'positive' : 'negative'}`}>
              {isUp ? '+' : ''}${fmt(summary.totalGainLoss)}
            </span>
          </div>
          <div className="summary-stat">
            <span className="label">Return</span>
            <span className={`value ${isUp ? 'positive' : 'negative'}`}>
              {isUp ? '+' : ''}{summary.gainLossPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {topHoldings.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="num">Shares</th>
              <th className="num">Value</th>
            </tr>
          </thead>
          <tbody>
            {topHoldings.map((h) => (
              <tr key={h.id}>
                <td style={{ fontWeight: 600 }}>{h.symbol}</td>
                <td className="num">{h.shares}</td>
                <td className="num">${fmt(h.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!summary && holdings.length === 0 && (
        <p className="text-muted">No holdings yet. Start trading!</p>
      )}
    </div>
  );
}
