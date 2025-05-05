'use client';

import Link from 'next/link';
import { UserList } from './components/UserList';

export default function UsersPage() {
  return (
    <div className="min-h-screen border border-gray-300 bg-gray-50">
      <main className="max-w-4xl mx-auto py-10 px-6">
        <header>
          <h1 className="text-3xl font-bold mb-6">Usuários</h1>
        </header>

        <section aria-labelledby="add-user" className="mb-6">
          <div className="flex items-center justify-between">
            <h2 id="add-user" className="text-xl font-semibold">
              Lista de usuários
            </h2>
            <Link
              href="/users/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Criar usuário
            </Link>
          </div>
        </section>

        <section aria-labelledby="user-list">
          <UserList />
        </section>
      </main>
    </div>
  );
}
