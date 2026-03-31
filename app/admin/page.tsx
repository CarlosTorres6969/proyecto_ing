'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ApiResponse, Producto, Pedido, Tienda } from '@/types';
import { formatLempira } from '@/lib/format';
import { apiFetch } from '@/lib/api-fetch';

interface Stats {
  productos: number;
  pedidos: number;
  tiendas: number;
  pedidosPendientes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ productos: 0, pedidos: 0, tiendas: 0, pedidosPendientes: 0 });
  const [recentPedidos, setRecentPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productosRes, pedidosRes, tiendasRes] = await Promise.all([
          apiFetch('/api/productos'),
          apiFetch('/api/pedidos'),
          apiFetch('/api/tiendas'),
        ]);

        const productosData: ApiResponse<Producto[]> = await productosRes.json();
        const pedidosData: ApiResponse<Pedido[]> = await pedidosRes.json();
        const tiendasData: ApiResponse<Tienda[]> = await tiendasRes.json();

        const pedidos = pedidosData.data || [];
        setStats({
          productos: productosData.data?.length || 0,
          pedidos: pedidos.length,
          tiendas: tiendasData.data?.length || 0,
          pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente' || p.estado === 'pagado').length,
        });
        setRecentPedidos(pedidos.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const ESTADO_COLORES: Record<string, string> = {
    pendiente: 'bg-warning/10 text-warning',
    pagado: 'bg-blue-500/10 text-blue-500',
    enviado: 'bg-accent/10 text-accent',
    entregado: 'bg-success/10 text-success',
    cancelado: 'bg-destructive/10 text-destructive',
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Resumen general de tu tienda
      </p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Productos', value: stats.productos, href: '/admin/productos', color: 'text-accent' },
          { label: 'Pedidos totales', value: stats.pedidos, href: '/admin/pedidos', color: 'text-blue-500' },
          { label: 'Pedidos pendientes', value: stats.pedidosPendientes, href: '/admin/pedidos', color: 'text-warning' },
          { label: 'Tiendas', value: stats.tiendas, href: '/admin/tiendas', color: 'text-success' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
              {isLoading ? '-' : stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pedidos recientes</h2>
          <Link href="/admin/pedidos" className="text-sm text-accent hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          {isLoading ? (
            <div className="animate-pulse p-6">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded bg-muted" />
                ))}
              </div>
            </div>
          ) : recentPedidos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No hay pedidos aun
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium sm:table-cell">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {recentPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-secondary/50">
                    <td className="px-4 py-3 text-sm font-medium">
                      <Link href={`/admin/pedidos/${pedido.id}`} className="text-accent hover:underline">
                        #{pedido.id}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                      {new Date(pedido.creado_en).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${ESTADO_COLORES[pedido.estado] || 'bg-muted text-muted-foreground'}`}>
                        {pedido.estado}
                      </span>
                    </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                      {formatLempira(pedido.monto_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Acciones rapidas</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Nuevo producto</p>
              <p className="text-sm text-muted-foreground">Agregar un producto al catalogo</p>
            </div>
          </Link>

          <Link
            href="/admin/categorias"
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Gestionar categorias</p>
              <p className="text-sm text-muted-foreground">Organiza tus productos</p>
            </div>
          </Link>

          <Link
            href="/admin/tiendas"
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Gestionar tiendas</p>
              <p className="text-sm text-muted-foreground">Administra ubicaciones fisicas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
