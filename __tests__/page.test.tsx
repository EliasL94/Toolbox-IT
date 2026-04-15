import { render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Page />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/suite intelligente/i);
  });
});
