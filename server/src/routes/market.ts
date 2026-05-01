import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { getCurrentPrices, getStockPrice } from '../services/marketSimulator';

const router = Router();

router.get('/stocks', (_req: Request, res: Response) => {
  const stocks = getCurrentPrices();
  res.json(stocks);
});

router.get('/stocks/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = getStockPrice(symbol.toUpperCase());

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const { rows: history } = await pool.query(
      `SELECT timestamp, open, high, low, close, volume
       FROM price_history
       WHERE symbol = $1
       ORDER BY timestamp ASC`,
      [symbol.toUpperCase()]
    );

    const priceHistory = history.map(row => ({
      timestamp: new Date(row.timestamp).getTime(),
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume, 10),
    }));

    res.json({ stock, history: priceHistory });
  } catch (err) {
    console.error('Error fetching stock:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stocks/:symbol/history', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const range = (req.query.range as string) || '90d';

    let days: number;
    switch (range) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': default: days = 90; break;
    }

    const { rows } = await pool.query(
      `SELECT timestamp, open, high, low, close, volume
       FROM price_history
       WHERE symbol = $1 AND timestamp >= NOW() - INTERVAL '1 day' * $2
       ORDER BY timestamp ASC`,
      [symbol.toUpperCase(), days]
    );

    const history = rows.map(row => ({
      timestamp: new Date(row.timestamp).getTime(),
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume, 10),
    }));

    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/sectors', (_req: Request, res: Response) => {
  const stocks = getCurrentPrices();
  const sectors: Record<string, { stocks: typeof stocks; totalMarketCap: number; avgChange: number }> = {};

  for (const stock of stocks) {
    if (!sectors[stock.sector]) {
      sectors[stock.sector] = { stocks: [], totalMarketCap: 0, avgChange: 0 };
    }
    sectors[stock.sector].stocks.push(stock);
    sectors[stock.sector].totalMarketCap += stock.marketCap;
  }

  const result = Object.entries(sectors).map(([name, data]) => ({
    sector: name,
    stockCount: data.stocks.length,
    totalMarketCap: data.totalMarketCap,
    avgChange: Math.round(
      (data.stocks.reduce((sum, s) => sum + s.changePercent, 0) / data.stocks.length) * 100
    ) / 100,
    stocks: data.stocks,
  }));

  res.json(result);
});

export default router;
