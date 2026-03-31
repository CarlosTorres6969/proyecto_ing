'use client';

import { useEffect, useState } from 'react';
import type { NivelStock, Tienda, ApiResponse } from '@/types';

export default function CajeroStockPage() {
  const [stock, setStock] = useState<NivelStock[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [tiendaId, setTiendaId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/tiendas')
      .then(r => r.json())
      .then((data: ApiResponse<Tienda[]>) => {
        if (data.success && data.data) {
          setTiendas(data.data);
          if (data.data.length > 0) setTiendaId(String(data.data[0].id));
        }
      });
  }, []);

  useEffect(() => {
    if (!tiendaId) return;
    setIsLoading(true);
    fetch(`/api/stock?id_tienda=${tiendaId}`)
      .then(r => r.json())
      .then((data: ApiResponse<NivelStock[]>) => {
        if (data.success && data.data) setStock(data.data);
        setIsLoading(false);
      });
  }, [tiendaId]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold">Stock en tienda</h1>
        <select value={tiendaId} onChange={e => setTiendaId(e.target.value)} className="rounded-lg border border-input bg-card px-4 py-2 text-sm">
          {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <div className="animate-pulse p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-10 rounded bg-muted" />)}</div>
        ) : stock.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Sin datos de stock para esta tienda</div>
        ) : (
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium sm:table-cell">SKU</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {stock.map((item, i) => (
                <tr key={i} className="hover:bg-secondary/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{item.nombre_producto}</p>
                    <p className="text-xs text-muted-foreground">{item.nombre_variante}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{item.sku}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.cantidad > 10 ? 'bg-success/10 text-success' : item.cantidad > 0 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                      {item.cantidad} uds
                    </span>
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
