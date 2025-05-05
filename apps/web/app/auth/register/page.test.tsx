import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

const renderPage = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RegisterPage />
    </QueryClientProvider>
  );

describe('RegisterPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call register API and redirect', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderPage();

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
