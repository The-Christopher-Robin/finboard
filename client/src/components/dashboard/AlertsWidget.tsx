import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAlerts } from '../../store/alertsSlice';

export default function AlertsWidget() {
  const dispatch = useAppDispatch();
  const { alerts } = useAppSelector((state) => state.alerts);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const recent = alerts.slice(0, 5);

  return (
    <div className="card" data-testid="alerts-widget">
      <div className="card-header">
        <h2 className="card-title">Alerts</h2>
        <Link to="/alerts" className="btn btn-ghost btn-sm">View All</Link>
      </div>
      {recent.length === 0 ? (
        <p className="text-muted">No alerts configured.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Symbol</th>
              <th>Condition</th>
              <th className="num">Target</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="alert-status">
                    <span className={`alert-dot ${a.triggered ? 'triggered' : 'watching'}`} />
                    <span style={{ fontSize: '0.8rem' }}>
                      {a.triggered ? 'Triggered' : 'Watching'}
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{a.symbol}</td>
                <td className="text-secondary">{a.direction}</td>
                <td className="num">${a.target_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
