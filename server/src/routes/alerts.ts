import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { setAlertChecker } from '../services/marketSimulator';
import { Stock } from '../types';

const router = Router();

// Wire up alert checking on price ticks
setAlertChecker(async (stocks: Stock[]) => {
  try {
    const { rows: alerts } = await pool.query(
      'SELECT id, symbol, target_price, direction FROM alerts WHERE triggered = FALSE'
    );

    for (const alert of alerts) {
      const stock = stocks.find(s => s.symbol === alert.symbol);
      if (!stock) continue;

      const target = parseFloat(alert.target_price);
      const triggered =
        (alert.direction === 'above' && stock.price >= target) ||
        (alert.direction === 'below' && stock.price <= target);

      if (triggered) {
        await pool.query('UPDATE alerts SET triggered = TRUE WHERE id = $1', [alert.id]);
      }
    }
  } catch (err) {
    // Don't crash the tick loop for alert failures
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, symbol, target_price, direction, triggered, created_at FROM alerts ORDER BY created_at DESC'
    );

    const alerts = rows.map(row => ({
      id: row.id,
      symbol: row.symbol,
      target_price: parseFloat(row.target_price),
      direction: row.direction,
      triggered: row.triggered,
      created_at: row.created_at,
    }));

    res.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { symbol, targetPrice, direction } = req.body;

    if (!symbol || targetPrice == null || !direction) {
      return res.status(400).json({ error: 'symbol, targetPrice, and direction are required' });
    }

    if (direction !== 'above' && direction !== 'below') {
      return res.status(400).json({ error: 'direction must be above or below' });
    }

    if (typeof targetPrice !== 'number' || targetPrice <= 0) {
      return res.status(400).json({ error: 'targetPrice must be a positive number' });
    }

    const { rows } = await pool.query(
      `INSERT INTO alerts (symbol, target_price, direction)
       VALUES ($1, $2, $3)
       RETURNING id, symbol, target_price, direction, triggered, created_at`,
      [symbol.toUpperCase(), targetPrice, direction]
    );

    const row = rows[0];
    res.status(201).json({
      id: row.id,
      symbol: row.symbol,
      target_price: parseFloat(row.target_price),
      direction: row.direction,
      triggered: row.triggered,
      created_at: row.created_at,
    });
  } catch (err) {
    console.error('Error creating alert:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM alerts WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted' });
  } catch (err) {
    console.error('Error deleting alert:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
