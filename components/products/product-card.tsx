'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Producto, VarianteProducto, ApiResponse } from '@/types';

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const [variante, setVariante] = useState<VarianteProducto | null>(null);

  useEffect(() => {
    async function fetchVariante() {
      try {
        const res = await fetch(`/api/variantes?id_producto=${producto.id}`);
        const data: ApiResponse<VarianteProducto[]> = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setVariante(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching variante:', error);
      }
    }
    fetchVariante();
  }, [producto.id]);

  const precioActual = variante?.precio_oferta ?? variante?.precio;
  const precioOriginal = variante?.precio_oferta ? variante.precio : null;
  const tieneDescuento = precioOriginal !== null;

  return (
    <Link
      href={`/productos/${producto.id}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
        {/* Placeholder para imagen */}
        <div className="flex h-full items-center justify-center bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-16 w-16 text-muted-foreground/30">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
        
        {tieneDescuento && (
          <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
            Oferta
          </span>
        )}

        <div className="absolute inset-0 bg-foreground/0 transition-colors group-hover:bg-foreground/5" />
      </div>

      <div className="mt-4">
        {producto.nombre_marca && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {producto.nombre_marca}
          </p>
        )}
        <h3 className="mt-1 text-sm font-medium transition-colors group-hover:text-accent">
          {producto.nombre}
        </h3>
        
        {variante && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold">
              ${precioActual?.toFixed(2)}
            </span>
            {precioOriginal && (
              <span className="text-sm text-muted-foreground line-through">
                ${precioOriginal.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
