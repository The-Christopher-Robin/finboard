import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceChart from '../../src/components/charts/PriceChart';
import type { PricePoint } from '../../src/types';

const mockData: PricePoint[] = [
  { timestamp: 1704067200000, open: 170, high: 175, low: 168, close: 172, volume: 5000000 },
  { timestamp: 1704153600000, open: 172, high: 178, low: 170, close: 176, volume: 6000000 },
  { timestamp: 1704240000000, open: 176, high: 182, low: 174, close: 180, volume: 7000000 },
];

describe('PriceChart', () => {
  it('renders nothing when data is empty', () => {
    const { container } = render(<PriceChart data={[]} />);
    expect(container.querySelector('.chart-container')).toBeNull();
  });

  it('renders chart container with data', () => {
    render(<PriceChart data={mockData} />);
    expect(screen.getByLabelText('Price chart')).toBeInTheDocument();
  });

  it('renders ResponsiveContainer inside chart container', () => {
    const { container } = render(<PriceChart data={mockData} height={200} />);
    const chartWrapper = container.querySelector('.chart-container');
    expect(chartWrapper).toBeInTheDocument();
    expect(chartWrapper?.children.length).toBeGreaterThan(0);
  });
});
