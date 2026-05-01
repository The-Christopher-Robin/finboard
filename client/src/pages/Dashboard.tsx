import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchStockDetail } from '../store/marketSlice';
import MarketTicker from '../components/dashboard/MarketTicker';
import WatchlistWidget from '../components/dashboard/WatchlistWidget';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import PriceChart from '../components/charts/PriceChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { stocks, priceHistory, loading } = useAppSelector((state) => state.market);
  const watchlist = useAppSelector((state) => state.watchlist.items);
  const [chartSymbol, setChartSymbol] = useState<string | null>(null);

  useEffect(() => {
    // Show chart for first watchlist item or first stock
    const sym = watchlist[0]?.symbol ?? stocks[0]?.symbol;
    if (sym && sym !== chartSymbol) {
      setChartSymbol(sym);
      dispatch(fetchStockDetail(sym));
    }
  }, [watchlist, stocks, dispatch, chartSymbol]);

  const featured = stocks.find((s) => s.symbol === chartSymbol);

  if (loading && !stocks.length) return <LoadingSpinner />;

  return (
    <section aria-label="Dashboard">
      <div className="dashboard-grid">
        <div className="full-width">
          <MarketTicker />
        </div>

        <WatchlistWidget />
        <PortfolioSummary />

        <div className="full-width card">
          <div className="card-header">
            <h2 className="card-title">
              {featured ? `${featured.symbol} — ${featured.name}` : 'Market Chart'}
            </h2>
            {featured && (
              <span className={featured.change >= 0 ? 'positive mono' : 'negative mono'}>
                ${featured.price.toFixed(2)} ({featured.change >= 0 ? '+' : ''}
                {featured.changePercent.toFixed(2)}%)
              </span>
            )}
          </div>
          {priceHistory.length > 0 ? (
            <PriceChart data={priceHistory} height={280} />
          ) : (
            <p className="text-muted" style={{ padding: '40px 0', textAlign: 'center' }}>
              No chart data available
            </p>
          )}
        </div>

        <div className="full-width">
          <AlertsWidget />
        </div>
      </div>
    </section>
  );
}
