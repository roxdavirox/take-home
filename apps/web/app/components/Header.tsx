'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) return null;

  return (
    <header className="flex justify-between mb-6">
      <Link
        href="/users"
        className="text-blue-600 font-semibold hover:underline"
      >
        Início
      </Link>
      <LogoutButton />
    </header>
  );
}
