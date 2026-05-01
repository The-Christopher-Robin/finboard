import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { getStockPrice } from '../services/marketSimulator';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, symbol, added_at FROM watchlist ORDER BY added_at DESC'
    );

    const items = rows.map(row => {
      const price = getStockPrice(row.symbol);
      return {
        ...row,
        currentPrice: price?.price ?? null,
        change: price?.change ?? null,
        changePercent: price?.changePercent ?? null,
      };
    });

    res.json(items);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const upper = symbol.toUpperCase();
    const stock = getStockPrice(upper);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    // Check for duplicates
    const existing = await pool.query(
      'SELECT id FROM watchlist WHERE symbol = $1',
      [upper]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already in watchlist' });
    }

    const { rows } = await pool.query(
      'INSERT INTO watchlist (symbol) VALUES ($1) RETURNING id, symbol, added_at',
      [upper]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM watchlist WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    console.error('Error removing from watchlist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
