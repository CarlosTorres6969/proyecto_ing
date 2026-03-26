'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Categoria, ApiResponse } from '@/types';

export function CategoriesSection() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch('/api/categorias?solo_raiz=true');
        const data: ApiResponse<Categoria[]> = await res.json();
        if (data.success && data.data) {
          setCategorias(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching categorias:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Explora por categoria
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categorias.length === 0) {
    return null;
  }

  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Explora por categoria
          </h2>
          <p className="mt-2 text-muted-foreground">
            Encuentra exactamente lo que buscas
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/productos?categoria=${categoria.id}`}
              className="group relative flex aspect-square flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-center transition-all hover:border-accent hover:shadow-lg"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-accent/10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
              </div>
              <span className="text-sm font-medium">{categoria.nombre}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/categorias"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            Ver todas las categorias
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
