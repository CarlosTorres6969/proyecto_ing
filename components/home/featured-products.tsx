'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Producto, ApiResponse } from '@/types';
import { ProductCard } from '@/components/products/product-card';

export function FeaturedProducts() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch('/api/productos?activo=true');
        const data: ApiResponse<Producto[]> = await res.json();
        if (data.success && data.data) {
          setProductos(data.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductos();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Productos destacados
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-muted" />
                <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Productos destacados
            </h2>
            <p className="mt-2 text-muted-foreground">
              Lo mejor de nuestra coleccion
            </p>
          </div>
          <Link
            href="/productos"
            className="hidden items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80 sm:flex"
          >
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent"
          >
            Ver todos los productos
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
