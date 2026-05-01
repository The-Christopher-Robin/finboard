import { useState, useEffect } from 'react';

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function Settings() {
  const [theme, setTheme] = useState(() => loadSetting('fb_theme', 'dark'));
  const [refreshRate, setRefreshRate] = useState(() => loadSetting('fb_refresh', '1'));
  const [defaultRange, setDefaultRange] = useState(() => loadSetting('fb_range', '30d'));
  const [showMarketHours, setShowMarketHours] = useState(() => loadSetting('fb_marketHours', true));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  const handleSave = () => {
    localStorage.setItem('fb_theme', JSON.stringify(theme));
    localStorage.setItem('fb_refresh', JSON.stringify(refreshRate));
    localStorage.setItem('fb_range', JSON.stringify(defaultRange));
    localStorage.setItem('fb_marketHours', JSON.stringify(showMarketHours));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section aria-label="Settings">
      <h1 className="page-title" style={{ marginBottom: 24 }}>Settings</h1>

      <div className="card">
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="form-group" style={{ maxWidth: 300 }}>
            <label htmlFor="theme-select">Theme</label>
            <select
              id="theme-select"
              className="form-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Data</h2>
          <div className="form-group" style={{ maxWidth: 300, marginBottom: 16 }}>
            <label htmlFor="refresh-select">WebSocket Refresh Rate</label>
            <select
              id="refresh-select"
              className="form-select"
              value={refreshRate}
              onChange={(e) => setRefreshRate(e.target.value)}
            >
              <option value="1">1 second</option>
              <option value="2">2 seconds</option>
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
            </select>
          </div>
          <div className="form-group" style={{ maxWidth: 300 }}>
            <label htmlFor="range-select">Default Chart Range</label>
            <select
              id="range-select"
              className="form-select"
              value={defaultRange}
              onChange={(e) => setDefaultRange(e.target.value)}
            >
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Display</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              id="market-hours"
              type="checkbox"
              checked={showMarketHours}
              onChange={(e) => setShowMarketHours(e.target.checked)}
            />
            <label htmlFor="market-hours" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
              Show market hours indicator in header
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Settings
          </button>
          {saved && (
            <span className="positive" style={{ fontSize: '0.85rem' }}>Settings saved!</span>
          )}
        </div>
      </div>
    </section>
  );
}
