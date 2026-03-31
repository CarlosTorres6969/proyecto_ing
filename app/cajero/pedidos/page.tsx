'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Pedido, ApiResponse } from '@/types';
import { formatLempira } from '@/lib/format';

const COLORES: Record<string, string> = {
  pendiente: 'bg-warning/10 text-warning',
  pagado: 'bg-blue-500/10 text-blue-500',
  enviado: 'bg-accent/10 text-accent',
  entregado: 'bg-success/10 text-success',
  cancelado: 'bg-destructive/10 text-destructive',
};

export default function CajeroPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    fetch('/api/pedidos', { headers })
      .then(r => r.json())
      .then((data: ApiResponse<Pedido[]>) => {
        if (data.success && data.data) setPedidos(data.data.slice(0, 20));
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Pedidos recientes</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <div className="animate-pulse p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded bg-muted" />)}</div>
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
              {pedidos.map(p => (
                <tr key={p.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 text-sm font-medium">
                    <Link href={`/pedidos/${p.id}`} className="text-accent hover:underline">#{p.id}</Link>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {new Date(p.creado_en).toLocaleDateString('es-HN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${COLORES[p.estado] || ''}`}>{p.estado}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{formatLempira(p.monto_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
