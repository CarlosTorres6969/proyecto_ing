'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';

export function Header() {
  const { usuario, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight">TiendaPlus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Inicio
          </Link>
          <Link href="/productos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Productos
          </Link>
          <Link href="/categorias" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Categorias
          </Link>
          <Link href="/tiendas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Tiendas
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/carrito" className="relative p-2 text-muted-foreground transition-colors hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {usuario ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <span className="hidden sm:inline">{usuario.nombre}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
              
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-border bg-card p-1 shadow-lg">
                    <Link
                      href="/cuenta"
                      className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mi cuenta
                    </Link>
                    <Link
                      href="/pedidos"
                      className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mis pedidos
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="my-1 border-t border-border" />
                        <Link
                          href="/admin"
                          className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-accent hover:bg-secondary"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Panel Admin
                        </Link>
                      </>
                    )}
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-secondary"
                    >
                      Cerrar sesion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Iniciar sesion
              </Link>
              <Link
                href="/auth/registro"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/productos" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary" onClick={() => setMenuOpen(false)}>
              Productos
            </Link>
            <Link href="/categorias" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary" onClick={() => setMenuOpen(false)}>
              Categorias
            </Link>
            <Link href="/tiendas" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary" onClick={() => setMenuOpen(false)}>
              Tiendas
            </Link>
            {!usuario && (
              <>
                <div className="my-2 border-t border-border" />
                <Link href="/auth/login" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary" onClick={() => setMenuOpen(false)}>
                  Iniciar sesion
                </Link>
                <Link href="/auth/registro" className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground" onClick={() => setMenuOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
