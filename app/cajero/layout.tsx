'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/cajero',         label: 'Venta' },
  { href: '/cajero/pedidos', label: 'Pedidos' },
  { href: '/cajero/stock',   label: 'Stock' },
];

export default function CajeroLayout({ children }: { children: React.ReactNode }) {
  const { usuario, isCajero, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !usuario) router.push('/auth/login');
    if (!isLoading && usuario && !isCajero && !isAdmin) router.push('/');
  }, [usuario, isCajero, isAdmin, isLoading, router]);

  if (isLoading || !usuario) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-secondary">
      <header className="sticky top-0 z-40 border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-serif text-xl font-bold">TecnoWorld</span>
          <span className="text-sm text-muted-foreground">Punto de Venta</span>
          <nav className="hidden sm:flex gap-1">
            {NAV.map(item => (
              <Link key={item.href} href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{usuario.nombre}</span>
          <button onClick={logout} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">Salir</button>
        </div>
      </header>
      <main className="flex-1 p-4 lg:p-6">{children}</main>
    </div>
  );
}
