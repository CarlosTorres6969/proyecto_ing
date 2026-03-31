import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="font-serif text-xl font-bold">TecnoWorld</Link>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/productos" className="hover:text-foreground">Productos</Link>
            <Link href="/categorias" className="hover:text-foreground">Categorías</Link>
            <Link href="/tiendas" className="hover:text-foreground">Tiendas</Link>
            <Link href="/pedidos" className="hover:text-foreground">Mis pedidos</Link>
          </nav>
          <p className="text-sm text-muted-foreground">© 2026 TecnoWorld Honduras</p>
        </div>
      </div>
    </footer>
  );
}

