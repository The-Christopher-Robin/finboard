import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('accepts a custom size', () => {
    render(<LoadingSpinner size={48} />);
    const spinner = screen.getByRole('status').querySelector('.spinner');
    expect(spinner).toHaveStyle({ width: '48px', height: '48px' });
  });
});
