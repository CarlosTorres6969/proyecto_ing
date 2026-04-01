'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Categoria, Marca, ApiResponse, Producto } from '@/types';
import { apiFetch } from '@/lib/api-fetch';

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

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, marcasRes] = await Promise.all([
          apiFetch('/api/categorias'),
          apiFetch('/api/marcas'),
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

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.id_categoria || !formData.id_marca) {
      setError('Nombre, categoria y marca son requeridos');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Crear producto
      const prodRes = await apiFetch('/api/productos', {
        method: 'POST',
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          id_categoria: Number(formData.id_categoria),
          id_marca: Number(formData.id_marca),
          activo: formData.activo,
        }),
      });
      const prodData: ApiResponse<Producto> = await prodRes.json();
      if (!prodData.success || !prodData.data) {
        setError(prodData.error || 'Error al crear el producto');
        return;
      }
      const productoId = prodData.data.id;

      // 2. Subir imagen si se seleccionó
      if (imagenFile) {
        const form = new FormData();
        form.append('file', imagenFile);
        form.append('folder', 'productos');
        const token = localStorage.getItem('token');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: form,
        });
        const uploadData: ApiResponse<{ url: string; publicId: string }> = await uploadRes.json();
        if (uploadData.success && uploadData.data) {
          await apiFetch('/api/productos', {
            method: 'PUT',
            body: JSON.stringify({
              id: productoId,
              imagen_url: uploadData.data.url,
              cloudinary_public_id: uploadData.data.publicId,
            }),
          });
        }
      }

      router.push('/admin/productos');
    } catch (err) {
      console.error(err);
      setError('Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-12">
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
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        {/* Info básica */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold">Informacion basica</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium">Nombre del producto *</label>
              <input id="nombre" type="text" required value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                placeholder="Ej: Samsung Galaxy S25" />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium">Descripcion</label>
              <textarea id="descripcion" rows={3} value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                placeholder="Descripcion del producto..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="id_categoria" className="block text-sm font-medium">Categoria *</label>
                <select id="id_categoria" required value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none">
                  <option value="">Seleccionar categoria</option>
                  {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="id_marca" className="block text-sm font-medium">Marca *</label>
                <select id="id_marca" required value={formData.id_marca}
                  onChange={(e) => setFormData({ ...formData, id_marca: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none">
                  <option value="">Seleccionar marca</option>
                  {marcas.map((marca) => <option key={marca.id} value={marca.id}>{marca.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input id="activo" type="checkbox" checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="h-4 w-4 accent-primary" />
              <label htmlFor="activo" className="text-sm">Producto activo (visible en la tienda)</label>
            </div>
          </div>
        </div>

        {/* Imagen */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold">Imagen del producto</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Se sube a Cloudinary automáticamente</p>
          <div className="mt-5 flex items-center gap-5">
            {imagenPreview ? (
              <img src={imagenPreview} alt="Preview"
                className="h-28 w-28 rounded-xl object-contain border border-border bg-white p-2 shadow-sm" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-8 w-8 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
            )}
            <div className="space-y-2">
              <label className="inline-block cursor-pointer rounded-lg border-2 border-gray-900 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 active:scale-95">
                {imagenFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={handleImagenChange} />
              </label>
              {imagenFile && <p className="text-xs text-muted-foreground">{imagenFile.name}</p>}
              <p className="text-xs text-muted-foreground">JPEG, PNG o WebP — máx. 5MB</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/admin/productos"
            className="btn-secondary flex-1 py-3 text-center transition-all duration-150 active:scale-95">
            Cancelar
          </Link>
          <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-3">
            {isLoading ? 'Creando...' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
