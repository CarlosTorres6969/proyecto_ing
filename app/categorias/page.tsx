'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import type { Categoria, ApiResponse } from '@/types';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch('/api/categorias');
        const data: ApiResponse<Categoria[]> = await res.json();
        if (data.success && data.data) {
          setCategorias(data.data);
        }
      } catch (error) {
        console.error('Error fetching categorias:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  // Agrupar categorias por padre
  const categoriasRaiz = categorias.filter((c) => !c.id_categoria_padre);
  const getSubcategorias = (padreId: number) => 
    categorias.filter((c) => c.id_categoria_padre === padreId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold sm:text-4xl">Categorias</h1>
            <p className="mt-2 text-muted-foreground">
              Explora nuestras categorias de productos
            </p>
          </div>

          {isLoading ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse rounded-lg border border-border p-6">
                  <div className="h-6 w-1/2 rounded bg-muted" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : categorias.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-muted-foreground">No hay categorias disponibles</p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {categoriasRaiz.map((categoria) => {
                const subcategorias = getSubcategorias(categoria.id);
                
                return (
                  <div
                    key={categoria.id}
                    className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent"
                  >
                    <Link
                      href={`/productos?categoria=${categoria.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-accent">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold">{categoria.nombre}</h2>
                    </Link>

                    {subcategorias.length > 0 && (
                      <div className="mt-4 border-t border-border pt-4">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Subcategorias
                        </p>
                        <ul className="space-y-1">
                          {subcategorias.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/productos?categoria=${sub.id}`}
                                className="text-sm text-muted-foreground transition-colors hover:text-accent"
                              >
                                {sub.nombre}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      href={`/productos?categoria=${categoria.id}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
                    >
                      Ver productos
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
