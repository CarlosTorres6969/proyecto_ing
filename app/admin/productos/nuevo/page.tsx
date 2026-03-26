'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Categoria, Marca, ApiResponse, Producto } from '@/types';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    id_categoria: '',
    id_marca: '',
    activo: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, marcasRes] = await Promise.all([
          fetch('/api/categorias'),
          fetch('/api/marcas'),
        ]);
        const catData: ApiResponse<Categoria[]> = await catRes.json();
        const marcasData: ApiResponse<Marca[]> = await marcasRes.json();
        if (catData.success && catData.data) setCategorias(catData.data);
        if (marcasData.success && marcasData.data) setMarcas(marcasData.data);
      } catch {
        setError('Error al cargar categorias y marcas');
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.id_categoria || !formData.id_marca) {
      setError('Nombre, categoria y marca son requeridos');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          id_categoria: Number(formData.id_categoria),
          id_marca: Number(formData.id_marca),
          activo: formData.activo,
        }),
      });
      const data: ApiResponse<Producto> = await res.json();
      
      if (data.success && data.data) {
        router.push(`/admin/productos/${data.data.id}`);
      } else {
        setError(data.error || 'Error al crear el producto');
      }
    } catch {
      setError('Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/productos" className="rounded-lg p-2 hover:bg-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold">Nuevo producto</h1>
          <p className="mt-1 text-muted-foreground">Crea un nuevo producto en el catalogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-medium">Informacion basica</h2>
          
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium">
                Nombre del producto *
              </label>
              <input
                id="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                placeholder="Ej: Camiseta Premium"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium">
                Descripcion
              </label>
              <textarea
                id="descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                placeholder="Descripcion detallada del producto..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="id_categoria" className="block text-sm font-medium">
                  Categoria *
                </label>
                <select
                  id="id_categoria"
                  required
                  value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="">Seleccionar categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="id_marca" className="block text-sm font-medium">
                  Marca *
                </label>
                <select
                  id="id_marca"
                  required
                  value={formData.id_marca}
                  onChange={(e) => setFormData({ ...formData, id_marca: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="">Seleccionar marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="activo"
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <label htmlFor="activo" className="text-sm">
                Producto activo (visible en la tienda)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/productos"
            className="flex-1 rounded-full border border-border py-3 text-center text-sm font-medium hover:bg-secondary"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? 'Creando...' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
