'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const hideOnAuthPages =
    pathname === '/auth/login' || pathname === '/auth/register';

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/auth/login');
  }

  if (hideOnAuthPages) return null;

  return (
    <button
      onClick={handleLogout}
      type="button"
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
    >
      Logout
    </button>
  );
}
