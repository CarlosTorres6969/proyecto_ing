import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-balance">Calidad excepcional</span>
            <span className="mt-2 block text-balance">para tu estilo de vida</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            Descubre nuestra coleccion de productos cuidadosamente seleccionados. 
            Compra en linea con envio a todo el pais o visitanos en nuestras tiendas fisicas.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/productos"
              className="w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Ver productos
            </Link>
            <Link
              href="/tiendas"
              className="w-full rounded-full border border-border bg-card px-8 py-3 text-sm font-medium transition-colors hover:bg-secondary sm:w-auto"
            >
              Encontrar tienda
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
