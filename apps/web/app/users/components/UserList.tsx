'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/services/userService';
import Link from 'next/link';
import UserDeleteButton from './UserDeleteButton';

type User = {
  id: string;
  name: string;
  email: string;
};

export function UserList() {
  const { data, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  if (isPending) return <p>Carregando...</p>;

  return (
    <ul id="user-list" className="space-y-4">
      {data.map((user: User) => (
        <li key={user.id} className="bg-white border rounded p-4 shadow-sm">
          <div className="flex justify-between items-center">
            {' '}
            <span className="text-gray-800 font-medium">{user.name}</span>
            <div className="flex gap-3">
              <Link
                href={`/users/${user.id}`}
                className="text-blue-600 hover:underline"
              >
                Editar
              </Link>
              <UserDeleteButton id={user.id} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
