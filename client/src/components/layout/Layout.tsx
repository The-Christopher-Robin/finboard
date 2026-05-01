import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useMarketData } from '../../hooks/useMarketData';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { connected } = useMarketData();

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <Header
          connected={connected}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
