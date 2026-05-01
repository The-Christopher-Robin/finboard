import pool from './pool';

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', marketCap: 2890000000000, basePrice: 178 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', marketCap: 2750000000000, basePrice: 370 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', marketCap: 1720000000000, basePrice: 138 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Technology', marketCap: 1550000000000, basePrice: 155 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Technology', marketCap: 780000000000, basePrice: 245 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', marketCap: 1200000000000, basePrice: 480 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', marketCap: 870000000000, basePrice: 330 },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', marketCap: 220000000000, basePrice: 215 },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', marketCap: 150000000000, basePrice: 35 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', marketCap: 180000000000, basePrice: 110 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance', marketCap: 480000000000, basePrice: 155 },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Finance', marketCap: 260000000000, basePrice: 32 },
  { symbol: 'GS', name: 'Goldman Sachs Group', sector: 'Finance', marketCap: 120000000000, basePrice: 345 },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Finance', marketCap: 510000000000, basePrice: 255 },
  { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Finance', marketCap: 380000000000, basePrice: 405 },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Finance', marketCap: 70000000000, basePrice: 62 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: 420000000000, basePrice: 160 },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', marketCap: 160000000000, basePrice: 28 },
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', marketCap: 490000000000, basePrice: 525 },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', marketCap: 450000000000, basePrice: 108 },
  { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', marketCap: 300000000000, basePrice: 155 },
  { symbol: 'SQ', name: 'Block Inc.', sector: 'Technology', marketCap: 40000000000, basePrice: 65 },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', marketCap: 420000000000, basePrice: 160 },
  { symbol: 'COST', name: 'Costco Wholesale', sector: 'Consumer', marketCap: 250000000000, basePrice: 565 },
  { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer', marketCap: 350000000000, basePrice: 152 },
  { symbol: 'DIS', name: 'Walt Disney Company', sector: 'Consumer', marketCap: 170000000000, basePrice: 90 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Consumer', marketCap: 195000000000, basePrice: 445 },
  { symbol: 'BA', name: 'Boeing Company', sector: 'Industrial', marketCap: 130000000000, basePrice: 210 },
  { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrial', marketCap: 140000000000, basePrice: 265 },
  { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Industrial', marketCap: 320000000000, basePrice: 315 },
];

function randomWalk(basePrice: number, days: number): Array<{ open: number; high: number; low: number; close: number; volume: number }> {
  const history: Array<{ open: number; high: number; low: number; close: number; volume: number }> = [];
  let price = basePrice * (0.9 + Math.random() * 0.2); // start near base

  for (let i = 0; i < days; i++) {
    const volatility = 0.02;
    const drift = (Math.random() - 0.495) * volatility;
    const open = price;
    const close = open * (1 + drift);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(5000000 + Math.random() * 50000000);

    history.push({
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });

    price = close;
  }

  return history;
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM price_history');
    await client.query('DELETE FROM alerts');
    await client.query('DELETE FROM portfolio');
    await client.query('DELETE FROM watchlist');
    await client.query('DELETE FROM stocks');

    // Insert stocks
    for (const stock of STOCKS) {
      await client.query(
        'INSERT INTO stocks (symbol, name, sector, market_cap) VALUES ($1, $2, $3, $4)',
        [stock.symbol, stock.name, stock.sector, stock.marketCap]
      );
    }

    // Insert price history (90 days)
    const now = new Date();
    for (const stock of STOCKS) {
      const history = randomWalk(stock.basePrice, 90);
      for (let i = 0; i < history.length; i++) {
        const day = new Date(now);
        day.setDate(day.getDate() - (90 - i));
        const point = history[i];
        await client.query(
          `INSERT INTO price_history (symbol, timestamp, open, high, low, close, volume)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [stock.symbol, day.toISOString(), point.open, point.high, point.low, point.close, point.volume]
        );
      }
    }

    // Watchlist
    const watchlistSymbols = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL', 'JPM'];
    for (const symbol of watchlistSymbols) {
      await client.query('INSERT INTO watchlist (symbol) VALUES ($1)', [symbol]);
    }

    // Portfolio holdings
    const holdings = [
      { symbol: 'AAPL', shares: 50, avgCost: 145.30 },
      { symbol: 'MSFT', shares: 25, avgCost: 310.50 },
      { symbol: 'NVDA', shares: 30, avgCost: 420.00 },
      { symbol: 'JPM', shares: 40, avgCost: 138.75 },
      { symbol: 'GOOGL', shares: 60, avgCost: 122.40 },
    ];
    for (const h of holdings) {
      await client.query(
        'INSERT INTO portfolio (symbol, shares, avg_cost) VALUES ($1, $2, $3)',
        [h.symbol, h.shares, h.avgCost]
      );
    }

    await client.query('COMMIT');
    console.log('Seed complete: inserted %d stocks, price history, watchlist, and portfolio.', STOCKS.length);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
