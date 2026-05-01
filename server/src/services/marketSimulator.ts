import { EventEmitter } from 'events';
import { Pool } from 'pg';
import { Stock } from '../types';

const emitter = new EventEmitter();
let stockMap: Map<string, Stock> = new Map();
let tickInterval: NodeJS.Timeout | null = null;

export async function initSimulator(pool: Pool): Promise<void> {
  const { rows } = await pool.query(`
    SELECT s.symbol, s.name, s.sector, s.market_cap,
           ph.close as last_close, ph.open as day_open
    FROM stocks s
    LEFT JOIN LATERAL (
      SELECT close, open FROM price_history
      WHERE symbol = s.symbol
      ORDER BY timestamp DESC LIMIT 1
    ) ph ON true
  `);

  for (const row of rows) {
    const price = parseFloat(row.last_close) || 100;
    const dayOpen = parseFloat(row.day_open) || price;
    const change = price - dayOpen;
    const changePercent = dayOpen > 0 ? (change / dayOpen) * 100 : 0;

    stockMap.set(row.symbol, {
      symbol: row.symbol,
      name: row.name,
      sector: row.sector,
      marketCap: parseInt(row.market_cap, 10),
      price,
      open: dayOpen,
      previousClose: dayOpen,
      high: price,
      low: price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 20000000) + 1000000,
    });
  }

  startTicking();
}

function startTicking() {
  const tick = () => {
    const updated: Stock[] = [];

    for (const [symbol, stock] of stockMap) {
      const pctMove = (Math.random() - 0.48) * 0.004; // slight upward bias
      const newPrice = Math.round(stock.price * (1 + pctMove) * 100) / 100;
      const high = Math.max(stock.high, newPrice);
      const low = Math.min(stock.low, newPrice);
      const change = Math.round((newPrice - stock.open) * 100) / 100;
      const changePercent = stock.open > 0
        ? Math.round((change / stock.open) * 10000) / 100
        : 0;

      stock.price = newPrice;
      stock.high = high;
      stock.low = low;
      stock.change = change;
      stock.changePercent = changePercent;
      stock.volume += Math.floor(Math.random() * 50000);

      updated.push({ ...stock });
    }

    emitter.emit('tick', updated);
    checkAlerts(updated);

    const nextDelay = 1000 + Math.random() * 1000;
    tickInterval = setTimeout(tick, nextDelay);
  };

  tick();
}

// Alert checking - kept simple
type AlertChecker = (stocks: Stock[]) => void;
let alertChecker: AlertChecker | null = null;

export function setAlertChecker(fn: AlertChecker) {
  alertChecker = fn;
}

function checkAlerts(stocks: Stock[]) {
  if (alertChecker) alertChecker(stocks);
}

export function getCurrentPrices(): Stock[] {
  return Array.from(stockMap.values()).map(s => ({ ...s }));
}

export function getStockPrice(symbol: string): Stock | undefined {
  const s = stockMap.get(symbol);
  return s ? { ...s } : undefined;
}

export function onTick(listener: (stocks: Stock[]) => void) {
  emitter.on('tick', listener);
}

export function offTick(listener: (stocks: Stock[]) => void) {
  emitter.off('tick', listener);
}

export function stopSimulator() {
  if (tickInterval) {
    clearTimeout(tickInterval);
    tickInterval = null;
  }
  emitter.removeAllListeners();
}
