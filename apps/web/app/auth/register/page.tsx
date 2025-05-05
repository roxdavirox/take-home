'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/users');
    } else {
      const data = await res.json();
      setError(data.message || 'Erro ao registrar usuário');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <main className="w-full max-w-sm p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Usuário</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome:{' '}
            </label>
            <input
              id="name"
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:{' '}
            </label>
            <input
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              type="email"
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha:{' '}
            </label>
            <input
              id="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Registrar
          </button>
        </form>
      </main>
    </div>
  );
}
