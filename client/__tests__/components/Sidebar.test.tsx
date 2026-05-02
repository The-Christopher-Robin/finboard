import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../../src/components/layout/Sidebar';

function renderSidebar(open = false) {
  const onClose = vi.fn();
  const result = render(
    <BrowserRouter>
      <Sidebar open={open} onClose={onClose} />
    </BrowserRouter>,
  );
  return { ...result, onClose };
}

describe('Sidebar', () => {
  it('renders the brand name', () => {
    renderSidebar();
    expect(screen.getByText('Board')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderSidebar();
    const links = [
      'Dashboard',
      'Market Overview',
      'Portfolio',
      'Watchlist',
      'Alerts',
      'Sectors',
      'Top Movers',
      'News',
      'Settings',
    ];
    links.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('applies "open" class when open prop is true', () => {
    renderSidebar(true);
    const sidebar = screen.getByLabelText('Main navigation');
    expect(sidebar.classList.contains('open')).toBe(true);
  });

  it('calls onClose when overlay is clicked', () => {
    const { onClose } = renderSidebar(true);
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });
});
