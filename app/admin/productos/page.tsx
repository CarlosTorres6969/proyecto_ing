'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { Producto, VarianteProducto, Tienda, ApiResponse } from '@/types';
import { apiFetch } from '@/lib/api-fetch';

interface StockModal {
  producto: Producto;
  variantes: VarianteProducto[];
  tiendas: Tienda[];
}

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [stockModal, setStockModal] = useState<StockModal | null>(null);
  const [stockForm, setStockForm] = useState<Record<string, string>>({});
  const [loadingStock, setLoadingStock] = useState(false);
  const [savingStock, setSavingStock] = useState<string | null>(null);

  const fetchProductos = async () => {
    try {
      const res = await apiFetch('/api/productos');
      const data: ApiResponse<Producto[]> = await res.json();
      if (data.success && data.data) setProductos(data.data);
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProductos(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Estas seguro de eliminar este producto?')) return;
    setDeletingId(id);
    try {
      const res = await apiFetch(`/api/productos?id=${id}`, { method: 'DELETE' });
      const data: ApiResponse<unknown> = await res.json();
      if (data.success) setProductos(productos.filter(p => p.id !== id));
      else alert(data.error || 'Error al eliminar');
    } catch { alert('Error al eliminar el producto'); }
    finally { setDeletingId(null); }
  };

  const handleOpenStock = async (producto: Producto) => {
    setLoadingStock(true);
    try {
      const [varRes, tiendasRes] = await Promise.all([
        apiFetch(`/api/variantes?id_producto=${producto.id}`),
        apiFetch('/api/tiendas'),
      ]);
      const varData: ApiResponse<VarianteProducto[]> = await varRes.json();
      const tiendasData: ApiResponse<Tienda[]> = await tiendasRes.json();
      const variantes = varData.success && varData.data ? varData.data : [];
      const tiendas = tiendasData.success && tiendasData.data ? tiendasData.data : [];

      // Cargar stock actual
      const map: Record<string, string> = {};
      for (const v of variantes) {
        const sRes = await apiFetch(`/api/stock?id_variante=${v.id}`);
        const sData: ApiResponse<{ id_variante: number; id_tienda: number; cantidad: number }[]> = await sRes.json();
        if (sData.success && sData.data) {
          for (const s of sData.data) map[`${s.id_variante}_${s.id_tienda}`] = String(s.cantidad);
        }
      }
      setStockForm(map);
      setStockModal({ producto, variantes, tiendas });
    } catch { alert('Error al cargar stock'); }
    finally { setLoadingStock(false); }
  };

  const handleSaveStock = async (varianteId: number, tiendaId: number) => {
    const key = `${varianteId}_${tiendaId}`;
    setSavingStock(key);
    try {
      await apiFetch('/api/stock', {
        method: 'PUT',
        body: JSON.stringify({ id_variante: varianteId, id_tienda: tiendaId, cantidad: parseInt(stockForm[key] || '0') }),
      });
      // Refrescar stock_total de variantes
      if (stockModal) {
        const varRes = await apiFetch(`/api/variantes?id_producto=${stockModal.producto.id}`);
        const varData: ApiResponse<VarianteProducto[]> = await varRes.json();
        if (varData.success && varData.data) setStockModal({ ...stockModal, variantes: varData.data });
      }
    } catch { alert('Error al guardar stock'); }
    finally { setSavingStock(null); }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Productos</h1>
          <p className="mt-2 text-muted-foreground">Gestiona el catalogo de productos</p>
        </div>
        <Link href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo producto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <div className="animate-pulse p-6">{[1,2,3,4].map(i => <div key={i} className="mb-4 h-16 rounded bg-muted" />)}</div>
        ) : productos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No hay productos</p>
            <Link href="/admin/productos/nuevo" className="mt-4 inline-block text-accent hover:underline">Crear el primer producto</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium md:table-cell">Categoria</th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium sm:table-cell">Marca</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{producto.nombre}</p>
                    <p className="text-sm text-muted-foreground">ID: {producto.id}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{producto.nombre_categoria || '-'}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{producto.nombre_marca || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${producto.activo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Stock */}
                      <button onClick={() => handleOpenStock(producto)} disabled={loadingStock}
                        className="btn-icon transition-all duration-150 active:scale-90" title="Gestionar stock">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                      </button>
                      {/* Editar */}
                      <Link href={`/admin/productos/${producto.id}`} className="btn-icon transition-all duration-150 active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </Link>
                      {/* Eliminar */}
                      <button onClick={() => handleDelete(producto.id)} disabled={deletingId === producto.id}
                        className="btn-icon text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Stock */}
      {stockModal && createPortal(
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setStockModal(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white border border-gray-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white rounded-t-xl">
              <div className="flex items-center gap-3">
                {stockModal.producto.imagen_url && (
                  <img src={stockModal.producto.imagen_url} alt="" className="h-10 w-10 rounded-lg object-contain border border-gray-200 bg-white p-1" />
                )}
                <div>
                  <h2 className="font-semibold text-base text-gray-900">{stockModal.producto.nombre}</h2>
                  <p className="text-xs text-gray-500">{stockModal.variantes.length} variante{stockModal.variantes.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button onClick={() => setStockModal(null)} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto bg-white">
              {stockModal.variantes.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">Sin variantes.</p>
                  <Link href={`/admin/productos/${stockModal.producto.id}`} className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                    Agregar variantes
                  </Link>
                </div>
              ) : stockModal.tiendas.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">No hay tiendas registradas.</p>
              ) : (
                <div className="space-y-4">
                  {stockModal.variantes.map((variante, idx) => (
                    <div key={variante.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      {/* Variante header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                          {variante.imagen_url ? (
                            <img src={variante.imagen_url} alt="" className="h-full w-full object-contain p-0.5" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-5 w-5 text-gray-300">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate text-gray-900">{variante.nombre_variante || variante.sku}</p>
                          <p className="text-xs text-gray-500">SKU: {variante.sku}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${(variante.stock_total ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          Stock: {variante.stock_total ?? 0}
                        </span>
                      </div>

                      {/* Tiendas */}
                      <div className="space-y-2">
                        {stockModal.tiendas.map((tienda) => {
                          const key = `${variante.id}_${tienda.id}`;
                          return (
                            <div key={tienda.id} className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 border border-gray-200">
                              <span className="flex-1 text-sm text-gray-700 truncate">{tienda.nombre}</span>
                              <input
                                type="number" min="0"
                                value={stockForm[key] ?? '0'}
                                onChange={(e) => setStockForm(prev => ({ ...prev, [key]: e.target.value }))}
                                className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-center focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                              />
                              <button
                                onClick={() => handleSaveStock(variante.id, tienda.id)}
                                disabled={savingStock === key}
                                className="shrink-0 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-50"
                              >
                                {savingStock === key ? '...' : 'Guardar'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
