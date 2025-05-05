const API_URL = typeof window === 'undefined'
  ? 'http://backend:3000'
  : process.env.NEXT_PUBLIC_API_URL

type UserData = {
  name: string;
  email: string;
  password: string;
};

type UpdateUserData = UserData & { id: string };

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
}

export async function getUserById(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`, {
     cache: 'no-store',
     credentials: 'include',
  });

  if(!res.ok) throw new Error('Erro ao buscar usuário');
  return res.json();
}

export async function createUser(data: UserData) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if(!res.ok) throw new Error('Erro ao criar usuário');
  return res.json();
}

export async function updateUser(data: UpdateUserData) {
  const res = await fetch(`${API_URL}/users/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ name: data.name, email: data.email }),
    credentials: 'include',
  });

  if(!res.ok) throw new Error('Erro ao atualizar usuário');
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
  });

  if(!res.ok) throw new Error('Erro ao deletar usuário');
  return res.json();
}