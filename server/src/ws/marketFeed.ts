import { WebSocketServer, WebSocket } from 'ws';
import { getCurrentPrices, onTick } from '../services/marketSimulator';
import { Stock } from '../types';

const WS_PORT = parseInt(process.env.WS_PORT || '4001', 10);

export function setupWebSocket(): WebSocketServer {
  const wss = new WebSocketServer({ port: WS_PORT });

  const broadcast = (stocks: Stock[]) => {
    const message = JSON.stringify({ type: 'update', data: stocks });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  onTick(broadcast);

  wss.on('connection', (ws) => {
    const snapshot = getCurrentPrices();
    ws.send(JSON.stringify({ type: 'snapshot', data: snapshot }));

    ws.on('error', (err) => {
      console.error('WebSocket client error:', err.message);
    });
  });

  wss.on('listening', () => {
    console.log(`WebSocket server on port ${WS_PORT}`);
  });

  wss.on('error', (err) => {
    console.error('WebSocket server error:', err);
  });

  return wss;
}
