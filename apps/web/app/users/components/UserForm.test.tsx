import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserForm } from './UserForm';
import * as userService from '@/lib/services/userService';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('@/lib/services/userService');

describe('UserForm', () => {
  const createUserMock = userService.createUser as jest.Mock;
  const updateUserMock = userService.updateUser as jest.Mock;

  const renderForm = (props = {}) =>
    render(
      <QueryClientProvider client={new QueryClient()}>
        <UserForm {...props} />
      </QueryClientProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit correctly to create a new user', async () => {
    createUserMock.mockResolvedValue({});

    renderForm();

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Novo Usuário' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'novo@email.com' },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalledWith({
        name: 'Novo Usuário',
        email: 'novo@email.com',
        password: '123456',
      });
      expect(pushMock).toHaveBeenCalledWith('/users');
    });
  });

  it('should submit correctly to update a user', async () => {
    updateUserMock.mockResolvedValue({});
    const initialData = { id: '1', name: 'Antigo', email: 'antigo@email.com' };

    renderForm({ initialData });

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Editado' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'editado@email.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /atualizar/i }));

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({
        id: '1',
        name: 'Editado',
        email: 'editado@email.com',
      });
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it('should show loading and success', async () => {
    createUserMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 50))
    );

    renderForm();

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Usuário' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@email.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    expect(await screen.findByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/usuário salvo com sucesso/i)).toBeInTheDocument();
    });
  });
});
