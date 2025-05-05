import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './userService';

global.fetch = jest.fn();

const mockedFetch = fetch as jest.Mock;

describe('userService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUsers should return a user list', async () => {
    const mockData = [{ id: '1', name: 'Davi', email: 'davi@email.com' }];
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const users = await getUsers();
    expect(users).toEqual(mockData);
    expect(mockedFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({ credentials: 'include' })
    );
  });

  it('getUserById should return a user', async () => {
    const mockUser = { id: '1', name: 'Davi', email: 'davi@email.com' };
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const user = await getUserById('1');
    expect(user).toEqual(mockUser);
    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('/users/1'), expect.any(Object));
  });

  it('createUser should create a user', async () => {
    const input = { name: 'Davi', email: 'davi@email.com' };
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', ...input }),
    });

    const response = await createUser(input);
    expect(response).toEqual({ id: '1', ...input });
    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('/users'), expect.objectContaining({
      method: 'POST',
    }));
  });

  it('updateUser should update a user', async () => {
    const input = { id: '1', name: 'Davi Atualizado', email: 'novo@email.com' };
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => input,
    });

    const response = await updateUser(input);
    expect(response).toEqual(input);
    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('/users/1'), expect.objectContaining({
      method: 'PUT',
    }));
  });

  it('deleteUser should delete a user', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const response = await deleteUser('1');
    expect(response).toEqual({ success: true });
    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('/users/1'), expect.objectContaining({
      method: 'DELETE',
    }));
  });

  it('should throw error when fetch returns !ok', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(getUsers()).rejects.toThrow('Erro ao buscar usuários');
  });
});
