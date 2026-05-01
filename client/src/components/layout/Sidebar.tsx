import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '◉' },
  { to: '/market', label: 'Market Overview', icon: '▤' },
  { to: '/portfolio', label: 'Portfolio', icon: '◧' },
  { to: '/watchlist', label: 'Watchlist', icon: '★' },
  { to: '/alerts', label: 'Alerts', icon: '⚡' },
  { to: '/sectors', label: 'Sectors', icon: '◔' },
  { to: '/movers', label: 'Top Movers', icon: '↕' },
  { to: '/news', label: 'News', icon: '▧' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-brand">
          <span>Fin</span>Board
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              aria-label={label}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
