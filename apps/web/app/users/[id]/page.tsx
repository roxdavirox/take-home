'use client';

import { UserForm } from '../components/UserForm';
import { getUserById } from '@/lib/services/userService';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function EditUserPage() {
  const { id } = useParams();

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  if (isPending) return <p className="text-gray-500 italic">Carregando...</p>;
  if (error) return <p className="text-red-500">Erro ao carregar usuário</p>;
  if (!user) return <p className="text-yellow-600">Usuário não encontrado</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>
        <UserForm initialData={user} />
      </main>
    </div>
  );
}
