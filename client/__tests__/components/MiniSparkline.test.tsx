import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MiniSparkline from '../../src/components/charts/MiniSparkline';

describe('MiniSparkline', () => {
  it('renders with default dimensions', () => {
    const { container } = render(<MiniSparkline data={[10, 12, 11, 14]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: '80px', height: '28px' });
  });

  it('accepts custom dimensions', () => {
    const { container } = render(
      <MiniSparkline data={[10, 12, 11, 14]} width={100} height={40} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: '100px', height: '40px' });
  });

  it('is hidden from accessibility tree', () => {
    const { container } = render(<MiniSparkline data={[10, 12]} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
