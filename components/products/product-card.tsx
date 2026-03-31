'use client';

import Link from 'next/link';
import type { Producto } from '@/types';

export function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Link
      href={`/productos/${producto.id}`}
      className="group block rounded-xl border border-border bg-card p-3 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:border-gray-400 active:scale-95 active:shadow-sm cursor-pointer"
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-secondary transition-colors duration-200 group-hover:bg-muted">
        <div className="flex h-full items-center justify-center">
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="h-16 w-16 text-muted-foreground/30 transition-transform duration-200 group-hover:scale-110">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          )}
        </div>
      </div>
      <div className="mt-3 px-1">
        {producto.nombre_marca && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{producto.nombre_marca}</p>
        )}
        <h3 className="mt-1 font-medium transition-colors duration-200 group-hover:text-accent">{producto.nombre}</h3>
        {producto.nombre_categoria && (
          <p className="text-sm text-muted-foreground">{producto.nombre_categoria}</p>
        )}
      </div>
    </Link>
  );
}
