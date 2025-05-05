import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('LoginPage', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it('should call login API and redirect on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' }),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@email.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@email.com', password: '123456' }),
      }));

      expect(push).toHaveBeenCalledWith('/users');
    });
  });

  it('should show error message on login failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Credenciais inválidas' }),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@email.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
