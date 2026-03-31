'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Tienda, ApiResponse } from '@/types';

export function StoresSection() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTiendas() {
      try {
        const res = await fetch('/api/tiendas');
        const data: ApiResponse<Tienda[]> = await res.json();
        if (data.success && data.data) {
          setTiendas(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching tiendas:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTiendas();
  }, []);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Visitanos en nuestras tiendas
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Prefiere la experiencia en persona? Visitanos en cualquiera de nuestras ubicaciones 
              para recibir atencion personalizada y ver nuestros productos de cerca.
            </p>
            <Link
              href="/tiendas"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ver todas las tiendas
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-6">
                  <div className="h-5 w-1/3 rounded bg-muted" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                </div>
              ))
            ) : tiendas.length > 0 ? (
              tiendas.map((tienda) => (
                <div
                  key={tienda.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent"
                >
                  <div>
                    <h3 className="font-medium">{tienda.nombre}</h3>
                    {tienda.ciudad && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {tienda.ciudad}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/tiendas/${tienda.id}`}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    Ver tienda
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">No hay tiendas disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
