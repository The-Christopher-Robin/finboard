import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { getStockPrice } from '../services/marketSimulator';
import { TradeRequest } from '../types';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, symbol, shares, avg_cost, purchased_at FROM portfolio ORDER BY purchased_at DESC'
    );

    const holdings = rows.map(row => {
      const price = getStockPrice(row.symbol);
      const shares = parseFloat(row.shares);
      const avgCost = parseFloat(row.avg_cost);
      const currentPrice = price?.price ?? avgCost;
      const marketValue = shares * currentPrice;
      const totalCost = shares * avgCost;
      const gainLoss = marketValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

      return {
        id: row.id,
        symbol: row.symbol,
        shares,
        avg_cost: avgCost,
        currentPrice,
        marketValue: Math.round(marketValue * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        gainLoss: Math.round(gainLoss * 100) / 100,
        gainLossPercent: Math.round(gainLossPercent * 100) / 100,
        purchased_at: row.purchased_at,
      };
    });

    res.json(holdings);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/trade', async (req: Request, res: Response) => {
  try {
    const { symbol, shares, action } = req.body as TradeRequest;

    if (!symbol || !shares || !action) {
      return res.status(400).json({ error: 'symbol, shares, and action are required' });
    }

    if (shares <= 0) {
      return res.status(400).json({ error: 'Shares must be positive' });
    }

    const upper = symbol.toUpperCase();
    const stock = getStockPrice(upper);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    if (action === 'buy') {
      const existing = await pool.query(
        'SELECT id, shares, avg_cost FROM portfolio WHERE symbol = $1',
        [upper]
      );

      if (existing.rows.length > 0) {
        const current = existing.rows[0];
        const oldShares = parseFloat(current.shares);
        const oldCost = parseFloat(current.avg_cost);
        const newShares = oldShares + shares;
        const newAvgCost = ((oldShares * oldCost) + (shares * stock.price)) / newShares;

        await pool.query(
          'UPDATE portfolio SET shares = $1, avg_cost = $2 WHERE id = $3',
          [newShares, Math.round(newAvgCost * 100) / 100, current.id]
        );
      } else {
        await pool.query(
          'INSERT INTO portfolio (symbol, shares, avg_cost) VALUES ($1, $2, $3)',
          [upper, shares, stock.price]
        );
      }

      res.status(201).json({ message: 'Buy executed', symbol: upper, shares, price: stock.price });
    } else if (action === 'sell') {
      const existing = await pool.query(
        'SELECT id, shares FROM portfolio WHERE symbol = $1',
        [upper]
      );

      if (existing.rows.length === 0) {
        return res.status(400).json({ error: 'No holdings for this stock' });
      }

      const current = existing.rows[0];
      const currentShares = parseFloat(current.shares);

      if (shares > currentShares) {
        return res.status(400).json({ error: 'Insufficient shares' });
      }

      const remaining = currentShares - shares;
      if (remaining === 0) {
        await pool.query('DELETE FROM portfolio WHERE id = $1', [current.id]);
      } else {
        await pool.query('UPDATE portfolio SET shares = $1 WHERE id = $2', [remaining, current.id]);
      }

      res.json({ message: 'Sell executed', symbol: upper, shares, price: stock.price });
    } else {
      res.status(400).json({ error: 'Action must be buy or sell' });
    }
  } catch (err) {
    console.error('Error executing trade:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT symbol, shares, avg_cost FROM portfolio');

    let totalValue = 0;
    let totalCost = 0;

    for (const row of rows) {
      const shares = parseFloat(row.shares);
      const avgCost = parseFloat(row.avg_cost);
      const price = getStockPrice(row.symbol);
      const currentPrice = price?.price ?? avgCost;

      totalValue += shares * currentPrice;
      totalCost += shares * avgCost;
    }

    const totalGainLoss = totalValue - totalCost;
    const gainPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    res.json({
      totalValue: Math.round(totalValue * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      totalGainLoss: Math.round(totalGainLoss * 100) / 100,
      gainLossPercent: Math.round(gainPercent * 100) / 100,
      holdingsCount: rows.length,
    });
  } catch (err) {
    console.error('Error fetching portfolio summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
