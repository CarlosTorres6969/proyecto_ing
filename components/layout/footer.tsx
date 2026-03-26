import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
              TiendaPlus
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Tu tienda de confianza para productos de calidad. Compra en linea o visitanos en nuestras tiendas fisicas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Tienda</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/productos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/tiendas" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Nuestras tiendas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Cuenta</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/cuenta" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Mi perfil
                </Link>
              </li>
              <li>
                <Link href="/pedidos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Mis pedidos
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Contacto</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">
                soporte@tiendaplus.com
              </li>
              <li className="text-sm text-muted-foreground">
                +1 (555) 123-4567
              </li>
              <li className="text-sm text-muted-foreground">
                Lunes - Viernes: 9am - 6pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            2024 TiendaPlus. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
