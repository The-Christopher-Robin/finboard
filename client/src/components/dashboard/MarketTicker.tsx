import { useAppSelector } from '../../store';

export default function MarketTicker() {
  const stocks = useAppSelector((state) => state.market.stocks);

  // Show top 15 by volume for the ticker
  const top = [...stocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 15);

  if (!top.length) return null;

  return (
    <div className="market-ticker" role="marquee" aria-label="Market ticker" data-testid="market-ticker">
      {top.map((s) => {
        const isUp = s.change >= 0;
        return (
          <div className="ticker-item" key={s.symbol} data-testid="ticker-item">
            <span className="symbol">{s.symbol}</span>
            <span className="price mono">${s.price.toFixed(2)}</span>
            <span className={`change ${isUp ? 'positive' : 'negative'}`}>
              {isUp ? '+' : ''}{s.changePercent.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
