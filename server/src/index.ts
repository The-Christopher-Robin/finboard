import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pool from './db/pool';
import { initSimulator, stopSimulator } from './services/marketSimulator';
import { setupWebSocket } from './ws/marketFeed';
import marketRoutes from './routes/market';
import watchlistRoutes from './routes/watchlist';
import portfolioRoutes from './routes/portfolio';
import alertRoutes from './routes/alerts';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api', marketRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

let wss: ReturnType<typeof setupWebSocket> | null = null;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');

    await initSimulator(pool);
    console.log('Market simulator initialized');

    wss = setupWebSocket();

    app.listen(PORT, () => {
      console.log(`FinBoard API server on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

function shutdown() {
  console.log('\nShutting down...');
  stopSimulator();
  wss?.close();
  pool.end().then(() => {
    console.log('Goodbye');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
