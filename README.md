# FinBoard

Real-time financial data dashboard with live market feeds, portfolio tracking, and price alerts.

## Tech Stack

- **Frontend:** React 18, TypeScript, Redux Toolkit, Recharts, React Router
- **Backend:** Node.js, Express, WebSocket (ws), PostgreSQL
- **Testing:** Vitest, React Testing Library, Cypress
- **Infra:** Docker, GitHub Actions CI

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)

### Quick Start (Docker)

```bash
docker compose up -d
cd server && npm run migrate && npm run seed
```

### Manual Setup

1. **Database** — Create a PostgreSQL database named `finboard` and set `DATABASE_URL` in `server/.env`:

```
DATABASE_URL=postgresql://finboard:finboard@localhost:5432/finboard
```

2. **Server**

```bash
cd server
npm install
cp .env.example .env   # adjust if needed
npm run migrate        # creates tables
npx tsx src/db/seed.ts # seed stock data
npm run dev
```

3. **Client**

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
client/          React SPA (Vite dev server on :3000)
  └─ /api/*      proxied to server:4000
server/          Express REST API on :4000, WebSocket on :4001
  └─ PostgreSQL  stocks, watchlist, portfolio, alerts, price history
```

The server runs a market simulator that randomly perturbs stock prices every 1-2 seconds and broadcasts updates to all connected WebSocket clients. The frontend subscribes to the WebSocket feed for live price updates and falls back to REST polling on initial load.

## Testing

```bash
cd client
npm test              # unit tests (Vitest)
npm run test:coverage # with coverage
npm run cy:run        # Cypress E2E (requires server running)
```

## Project Structure

```
server/
  src/
    routes/       REST endpoints (market, watchlist, portfolio, alerts)
    ws/           WebSocket server for live price feed
    services/     Market data simulator
    db/           Connection pool, migrations, seed script
client/
  src/
    pages/        10 page components (Dashboard, Market, Stock Detail, etc.)
    components/   Reusable UI (charts, layout, dashboard widgets)
    store/        Redux Toolkit slices
    hooks/        Custom hooks (WebSocket, market data)
    services/     API client
  __tests__/      Unit tests
cypress/          E2E tests
```
