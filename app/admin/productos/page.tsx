'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Producto, ApiResponse } from '@/types';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/productos');
      const data: ApiResponse<Producto[]> = await res.json();
      if (data.success && data.data) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Estas seguro de eliminar este producto?')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/productos?id=${id}`, { method: 'DELETE' });
      const data: ApiResponse<unknown> = await res.json();
      if (data.success) {
        setProductos(productos.filter(p => p.id !== id));
      } else {
        alert(data.error || 'Error al eliminar');
      }
    } catch {
      alert('Error al eliminar el producto');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Productos</h1>
          <p className="mt-2 text-muted-foreground">
            Gestiona el catalogo de productos
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo producto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <div className="animate-pulse p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-4 h-16 rounded bg-muted" />
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No hay productos</p>
            <Link href="/admin/productos/nuevo" className="mt-4 inline-block text-accent hover:underline">
              Crear el primer producto
            </Link>
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
                    <div>
                      <p className="font-medium">{producto.nombre}</p>
                      <p className="text-sm text-muted-foreground">ID: {producto.id}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {producto.nombre_categoria || '-'}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {producto.nombre_marca || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${producto.activo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/productos/${producto.id}`}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        disabled={deletingId === producto.id}
                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
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
    </div>
  );
}
