import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectorPieChart from '../../src/components/charts/SectorPieChart';
import type { SectorData } from '../../src/types';

const mockSectors: SectorData[] = [
  { sector: 'Technology', stocks: [], totalMarketCap: 5000000000000, avgChange: 1.2 },
  { sector: 'Finance', stocks: [], totalMarketCap: 2000000000000, avgChange: -0.5 },
  { sector: 'Healthcare', stocks: [], totalMarketCap: 1000000000000, avgChange: 0.3 },
];

describe('SectorPieChart', () => {
  it('renders the chart container', () => {
    render(<SectorPieChart data={mockSectors} />);
    expect(screen.getByLabelText('Sector distribution chart')).toBeInTheDocument();
  });
});
