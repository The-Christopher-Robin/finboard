import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VolumeChart from '../../src/components/charts/VolumeChart';
import type { PricePoint } from '../../src/types';

const data: PricePoint[] = [
  { timestamp: 1704067200000, open: 170, high: 175, low: 168, close: 172, volume: 5000000 },
  { timestamp: 1704153600000, open: 172, high: 178, low: 170, close: 176, volume: 6000000 },
];

describe('VolumeChart', () => {
  it('renders nothing when data is empty', () => {
    const { container } = render(<VolumeChart data={[]} />);
    expect(container.querySelector('.chart-container')).toBeNull();
  });

  it('renders chart when data is provided', () => {
    render(<VolumeChart data={data} />);
    expect(screen.getByLabelText('Volume chart')).toBeInTheDocument();
  });
});
