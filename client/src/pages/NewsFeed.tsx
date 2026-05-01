import type { NewsItem } from '../types';

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Fed Holds Rates Steady Amid Mixed Economic Signals',
    summary: 'The Federal Reserve left interest rates unchanged at its latest meeting, citing persistent inflation concerns alongside a resilient labor market. Markets reacted with cautious optimism.',
    source: 'Reuters',
    publishedAt: '2026-04-30T18:30:00Z',
    symbols: ['SPY', 'QQQ'],
  },
  {
    id: '2',
    title: 'Apple Reports Record Q2 Revenue on Strong Services Growth',
    summary: 'Apple exceeded analyst expectations with $98.2B in quarterly revenue, driven by a 24% increase in services revenue. The company also announced an expanded share buyback program.',
    source: 'Bloomberg',
    publishedAt: '2026-04-30T16:15:00Z',
    symbols: ['AAPL'],
  },
  {
    id: '3',
    title: 'Tesla Deliveries Surge 18% in Q1 as Model Y Refresh Gains Traction',
    summary: 'Tesla reported stronger-than-expected deliveries for the first quarter, with the refreshed Model Y accounting for a significant portion of the increase across global markets.',
    source: 'CNBC',
    publishedAt: '2026-04-30T14:00:00Z',
    symbols: ['TSLA'],
  },
  {
    id: '4',
    title: 'Oil Prices Climb as OPEC+ Signals Extended Production Cuts',
    summary: 'Crude oil futures rose 3.2% after OPEC+ members indicated willingness to extend voluntary production cuts through the third quarter, tightening global supply outlook.',
    source: 'Financial Times',
    publishedAt: '2026-04-30T11:45:00Z',
    symbols: ['XOM', 'CVX'],
  },
  {
    id: '5',
    title: 'Microsoft Azure Revenue Grows 32% Year-over-Year',
    summary: 'Microsoft\'s cloud division posted robust growth as enterprise AI adoption accelerated. Azure revenue beat consensus estimates, sending shares up 4% in after-hours trading.',
    source: 'Wall Street Journal',
    publishedAt: '2026-04-29T21:00:00Z',
    symbols: ['MSFT'],
  },
  {
    id: '6',
    title: 'Semiconductor Stocks Rally on Strong TSMC Earnings Guidance',
    summary: 'TSMC raised its full-year revenue guidance citing unprecedented demand for advanced chips, lifting the entire semiconductor sector. NVIDIA and AMD both gained over 3%.',
    source: 'MarketWatch',
    publishedAt: '2026-04-29T15:30:00Z',
    symbols: ['NVDA', 'AMD', 'TSM'],
  },
  {
    id: '7',
    title: 'JPMorgan Upgrades Healthcare Sector to Overweight',
    summary: 'Analysts at JPMorgan Chase shifted their healthcare sector rating to overweight, pointing to attractive valuations and defensive positioning ahead of potential market volatility.',
    source: 'Barron\'s',
    publishedAt: '2026-04-29T12:00:00Z',
    symbols: ['JNJ', 'UNH', 'PFE'],
  },
  {
    id: '8',
    title: 'Amazon Expands Same-Day Delivery Network to 15 New Cities',
    summary: 'Amazon announced a major logistics expansion targeting same-day delivery coverage for over 90% of the US population by year-end, investing $4.2B in new fulfillment centers.',
    source: 'Reuters',
    publishedAt: '2026-04-28T18:00:00Z',
    symbols: ['AMZN'],
  },
  {
    id: '9',
    title: 'Bitcoin Breaks $72,000 as Institutional Flows Accelerate',
    summary: 'Bitcoin surged past the $72,000 mark as spot Bitcoin ETFs saw record weekly inflows. Institutional adoption continues to broaden with several pension funds adding crypto allocations.',
    source: 'CoinDesk',
    publishedAt: '2026-04-28T14:20:00Z',
    symbols: ['COIN', 'MARA'],
  },
  {
    id: '10',
    title: 'US Housing Starts Fall 5% as Mortgage Rates Remain Elevated',
    summary: 'New residential construction declined for the second consecutive month as 30-year fixed mortgage rates hovered near 6.8%, dampening buyer demand and builder confidence.',
    source: 'CNBC',
    publishedAt: '2026-04-28T10:00:00Z',
    symbols: ['HD', 'LOW'],
  },
  {
    id: '11',
    title: 'Alphabet Boosts Dividend by 20%, Announces $50B Buyback',
    summary: 'Google parent Alphabet surprised investors with a substantial dividend increase and expanded share repurchase authorization, signaling confidence in sustained free cash flow generation.',
    source: 'Bloomberg',
    publishedAt: '2026-04-27T20:30:00Z',
    symbols: ['GOOGL'],
  },
  {
    id: '12',
    title: 'European Markets Close Higher as ECB Signals Rate Cut Path',
    summary: 'European equities rallied broadly after ECB President hinted at multiple rate cuts in the second half of 2026, with the DAX and FTSE both posting gains above 1%.',
    source: 'Financial Times',
    publishedAt: '2026-04-27T16:00:00Z',
    symbols: ['EFA', 'VGK'],
  },
  {
    id: '13',
    title: 'Walmart Beats Estimates on Grocery Strength and E-Commerce Growth',
    summary: 'Walmart reported quarterly earnings above Wall Street expectations, citing market share gains in grocery and a 22% increase in US e-commerce sales.',
    source: 'Wall Street Journal',
    publishedAt: '2026-04-27T13:15:00Z',
    symbols: ['WMT'],
  },
  {
    id: '14',
    title: 'Cybersecurity Spending Expected to Hit $215B in 2026',
    summary: 'A new industry report projects global cybersecurity spending will reach $215 billion this year, up 14% from 2025. CrowdStrike and Palo Alto Networks seen as key beneficiaries.',
    source: 'TechCrunch',
    publishedAt: '2026-04-26T11:00:00Z',
    symbols: ['CRWD', 'PANW'],
  },
  {
    id: '15',
    title: 'Boeing Secures $22B Order from Middle Eastern Carriers',
    summary: 'Boeing announced a landmark order for 125 aircraft from a consortium of Middle Eastern airlines, marking the company\'s largest deal in two years and boosting production forecasts.',
    source: 'Reuters',
    publishedAt: '2026-04-26T09:30:00Z',
    symbols: ['BA'],
  },
  {
    id: '16',
    title: 'Goldman Sachs Warns of Elevated Volatility Heading Into Summer',
    summary: 'Goldman Sachs strategists cautioned that the VIX could spike in coming months as election uncertainty, trade policy, and valuation concerns converge to pressure equity markets.',
    source: 'MarketWatch',
    publishedAt: '2026-04-25T14:45:00Z',
    symbols: ['GS', 'VIX'],
  },
  {
    id: '17',
    title: 'Meta Platforms Unveils Next-Generation AR Glasses',
    summary: 'Meta demonstrated its latest augmented reality hardware at a developer event, targeting enterprise and consumer markets. The devices ship in Q3 starting at $499.',
    source: 'The Verge',
    publishedAt: '2026-04-25T10:00:00Z',
    symbols: ['META'],
  },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsFeed() {
  return (
    <section aria-label="Financial news">
      <h1 className="page-title" style={{ marginBottom: 24 }}>News</h1>
      <div className="news-list">
        {MOCK_NEWS.map((item) => (
          <article className="card news-card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="news-meta">
              <span>{item.source}</span>
              <time dateTime={item.publishedAt}>{timeAgo(item.publishedAt)}</time>
            </div>
            <div className="news-symbols">
              {item.symbols.map((sym) => (
                <span className="badge badge-blue" key={sym}>{sym}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
