'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '@/lib/services/userService';

export default function DeleteButton({ id }: Readonly<{ id: string }>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleClick = () => {
    if (confirm('Deseja deletar o usuário?')) {
      mutation.mutate();
    }
  };

  return (
    <button
      className="text-red-600 hover:text-red-800 font-medium transition-colors"
      onClick={handleClick}
    >
      Deletar
    </button>
  );
}
