'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';

export function Header() {
  const { usuario, isAdmin, isCajero, logout } = useAuth();
  const { carrito } = useCart();
  const itemCount = carrito?.items?.length ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
          TecnoWorld
        </Link>

        {/* Nav según rol */}
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {isAdmin && (
            <>
              <Link href="/admin" className="font-medium text-primary transition-colors hover:text-primary/80">Panel Admin</Link>
              <Link href="/productos" className="text-muted-foreground transition-colors hover:text-foreground">Tienda</Link>
            </>
          )}
          {isCajero && !isAdmin && (
            <>
              <Link href="/cajero" className="font-medium text-primary transition-colors hover:text-primary/80">Punto de Venta</Link>
              <Link href="/cajero/pedidos" className="text-muted-foreground transition-colors hover:text-foreground">Pedidos</Link>
              <Link href="/cajero/stock" className="text-muted-foreground transition-colors hover:text-foreground">Stock</Link>
            </>
          )}
          {!isAdmin && !isCajero && (
            <>
              <Link href="/productos" className="text-muted-foreground transition-colors hover:text-foreground">Productos</Link>
              <Link href="/categorias" className="text-muted-foreground transition-colors hover:text-foreground">Categorías</Link>
              <Link href="/tiendas" className="text-muted-foreground transition-colors hover:text-foreground">Tiendas</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Carrito para clientes y admin */}
          {!isCajero && (
            <Link href="/carrito" className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {usuario ? (
            <div className="flex items-center gap-2">
              <Link
                href={isAdmin ? '/admin' : isCajero ? '/cajero' : '/cuenta'}
                className="hidden text-sm font-medium sm:block"
              >
                {usuario.nombre}
                {isAdmin && <span className="ml-1 text-xs text-primary">(Admin)</span>}
                {isCajero && <span className="ml-1 text-xs text-accent">(Cajero)</span>}
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
