import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DeleteButton from './UserDeleteButton';
import * as userService from '@/lib/services/userService';

jest.mock('@/lib/services/userService', () => ({
  deleteUser: jest.fn(),
}));

describe('UserDeleteButton', () => {
  const queryClient = new QueryClient();

  const renderButton = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteButton id="1" />
      </QueryClientProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('call deleteUser when confirmed', async () => {
    const deleteUserMock = userService.deleteUser as jest.Mock;
    deleteUserMock.mockResolvedValue({});

    renderButton();
    fireEvent.click(screen.getByText('Deletar'));

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith('1');
    });
  });

  it('dont call deleteUser when canceled', () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => false);
    const deleteUserMock = userService.deleteUser as jest.Mock;

    renderButton();
    fireEvent.click(screen.getByText('Deletar'));

    expect(deleteUserMock).not.toHaveBeenCalled();
  });
});
