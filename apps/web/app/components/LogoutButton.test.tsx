import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { useRouter, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

global.fetch = jest.fn();

describe('LogoutButton', () => {
  const replace = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue({ push });
    (useRouter as jest.Mock).mockReturnValue({ replace });
  });

  it('should call the logout API and redirect to /auth/login', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
      });
      expect(replace).toHaveBeenCalledWith('/auth/login');
    });
  });
});
