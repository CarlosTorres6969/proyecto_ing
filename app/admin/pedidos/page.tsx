'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Pedido, ApiResponse } from '@/types';
import { apiFetch } from '@/lib/api-fetch';
import { formatLempira } from '@/lib/format';

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
const COLORES: Record<string, string> = {
  pendiente: 'bg-warning/10 text-warning',
  pagado: 'bg-blue-500/10 text-blue-500',
  enviado: 'bg-accent/10 text-accent',
  entregado: 'bg-success/10 text-success',
  cancelado: 'bg-destructive/10 text-destructive',
};

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  const fetchPedidos = async () => {
    const url = filtroEstado ? `/api/pedidos?estado=${filtroEstado}` : '/api/pedidos';
    const res = await apiFetch(url);
    const data: ApiResponse<Pedido[]> = await res.json();
    if (data.success && data.data) setPedidos(data.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchPedidos(); }, [filtroEstado]);

  const handleEstado = async (id: number, estado: string) => {
    await apiFetch('/api/pedidos', {
      method: 'PUT',
      body: JSON.stringify({ id, estado }),
    });
    fetchPedidos();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Pedidos</h1>

      <div className="mt-6 flex gap-2 flex-wrap">
        <button onClick={() => setFiltroEstado('')} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95 ${!filtroEstado ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary'}`}>Todos</button>
        {ESTADOS.map(e => (
          <button key={e} onClick={() => setFiltroEstado(e)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all duration-150 active:scale-95 ${filtroEstado === e ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary'}`}>{e}</button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <div className="animate-pulse p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded bg-muted" />)}</div>
        ) : pedidos.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No hay pedidos</div>
        ) : (
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium sm:table-cell">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {pedidos.map(pedido => (
                <tr key={pedido.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 text-sm font-medium">
                    <Link href={`/pedidos/${pedido.id}`} className="text-accent hover:underline">#{pedido.id}</Link>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {new Date(pedido.creado_en).toLocaleDateString('es-HN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${COLORES[pedido.estado] || ''}`}>{pedido.estado}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{formatLempira(pedido.monto_total)}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={pedido.estado}
                      onChange={e => handleEstado(pedido.id, e.target.value)}
                      className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
                    >
                      {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
