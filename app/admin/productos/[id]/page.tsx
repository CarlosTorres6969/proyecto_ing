'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Producto, Categoria, Marca, VarianteProducto, Tienda, ApiResponse } from '@/types';
import { apiFetch } from '@/lib/api-fetch';
import { formatLempira } from '@/lib/format';

export default function EditProductoPage() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [producto, setProducto] = useState<Producto | null>(null);
  const [variantes, setVariantes] = useState<VarianteProducto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', id_categoria: '', id_marca: '', activo: true,
  });
  const [nuevaVariante, setNuevaVariante] = useState({
    sku: '', nombre_variante: '', precio: '', precio_oferta: '',
  });
  const [stockForm, setStockForm] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, varRes, catRes, marcasRes, tiendasRes] = await Promise.all([
          apiFetch(`/api/productos?id=${productId}`),
          apiFetch(`/api/variantes?id_producto=${productId}`),
          apiFetch('/api/categorias'),
          apiFetch('/api/marcas'),
          apiFetch('/api/tiendas'),
        ]);
        const prodData: ApiResponse<Producto> = await prodRes.json();
        const varData: ApiResponse<VarianteProducto[]> = await varRes.json();
        const catData: ApiResponse<Categoria[]> = await catRes.json();
        const marcasData: ApiResponse<Marca[]> = await marcasRes.json();
        const tiendasData: ApiResponse<Tienda[]> = await tiendasRes.json();

        if (prodData.success && prodData.data) {
          setProducto(prodData.data);
          setFormData({
            nombre: prodData.data.nombre,
            descripcion: prodData.data.descripcion || '',
            id_categoria: String(prodData.data.id_categoria),
            id_marca: String(prodData.data.id_marca),
            activo: prodData.data.activo,
          });
        }
        if (varData.success && varData.data) setVariantes(varData.data);
        if (catData.success && catData.data) setCategorias(catData.data);
        if (marcasData.success && marcasData.data) setMarcas(marcasData.data);
        if (tiendasData.success && tiendasData.data) {
          setTiendas(tiendasData.data);
          if (varData.success && varData.data && tiendasData.data.length > 0) {
            const stockMap: Record<string, string> = {};
            for (const v of varData.data) {
              const sRes = await apiFetch(`/api/stock?id_variante=${v.id}`);
              const sData: ApiResponse<{ id_variante: number; id_tienda: number; cantidad: number }[]> = await sRes.json();
              if (sData.success && sData.data) {
                for (const s of sData.data) {
                  stockMap[`${s.id_variante}_${s.id_tienda}`] = String(s.cantidad);
                }
              }
            }
            setStockForm(stockMap);
          }
        }
      } catch {
        setError('Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  const handleUploadImagen = async (file: File) => {
    setUploadingId(-1);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'productos');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form });
      const uploadData: ApiResponse<{ url: string; publicId: string }> = await uploadRes.json();
      if (!uploadData.success || !uploadData.data) { alert('Error al subir la imagen'); return; }
      const res = await apiFetch('/api/productos', {
        method: 'PUT',
        body: JSON.stringify({ id: Number(productId), imagen_url: uploadData.data.url, cloudinary_public_id: uploadData.data.publicId }),
      });
      const data: ApiResponse<Producto> = await res.json();
      if (data.success && data.data) { setProducto(data.data); setMessage('Imagen subida'); setTimeout(() => setMessage(''), 3000); }
    } catch { alert('Error al subir la imagen'); }
    finally { setUploadingId(null); }
  };

  const handleSave = async () => {
    setError(''); setMessage(''); setIsSaving(true);
    try {
      const res = await apiFetch('/api/productos', {
        method: 'PUT',
        body: JSON.stringify({
          id: Number(productId),
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          id_categoria: Number(formData.id_categoria),
          id_marca: Number(formData.id_marca),
          activo: formData.activo,
        }),
      });
      const data: ApiResponse<Producto> = await res.json();
      if (data.success) { setMessage('Producto actualizado'); setTimeout(() => setMessage(''), 3000); }
      else setError(data.error || 'Error al actualizar');
    } catch { setError('Error al actualizar el producto'); }
    finally { setIsSaving(false); }
  };

  const handleSaveStock = async (varianteId: number, tiendaId: number) => {
    const key = `${varianteId}_${tiendaId}`;
    const cantidad = parseInt(stockForm[key] || '0');
    await apiFetch('/api/stock', {
      method: 'PUT',
      body: JSON.stringify({ id_variante: varianteId, id_tienda: tiendaId, cantidad }),
    });
    setMessage('Stock actualizado');
    setTimeout(() => setMessage(''), 2000);
    const varRes = await apiFetch(`/api/variantes?id_producto=${productId}`);
    const varData: ApiResponse<VarianteProducto[]> = await varRes.json();
    if (varData.success && varData.data) setVariantes(varData.data);
  };

  const handleAddVariante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaVariante.sku || !nuevaVariante.precio) return;
    try {
      const res = await apiFetch('/api/variantes', {
        method: 'POST',
        body: JSON.stringify({
          id_producto: Number(productId),
          sku: nuevaVariante.sku,
          nombre_variante: nuevaVariante.nombre_variante || null,
          precio: Number(nuevaVariante.precio),
          precio_oferta: nuevaVariante.precio_oferta ? Number(nuevaVariante.precio_oferta) : null,
        }),
      });
      const data: ApiResponse<VarianteProducto> = await res.json();
      if (data.success && data.data) {
        setVariantes([...variantes, data.data]);
        setNuevaVariante({ sku: '', nombre_variante: '', precio: '', precio_oferta: '' });
      } else alert(data.error || 'Error al crear variante');
    } catch { alert('Error al crear variante'); }
  };

  const handleDeleteVariante = async (id: number) => {
    if (!confirm('Eliminar esta variante?')) return;
    try {
      const res = await apiFetch(`/api/variantes?id=${id}`, { method: 'DELETE' });
      const data: ApiResponse<unknown> = await res.json();
      if (data.success) setVariantes(variantes.filter(v => v.id !== id));
    } catch { alert('Error al eliminar variante'); }
  };

  const handleUploadVarianteImagen = async (varianteId: number, file: File) => {
    setUploadingId(varianteId);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'variantes');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form });
      const uploadData: ApiResponse<{ url: string; publicId: string }> = await uploadRes.json();
      if (!uploadData.success || !uploadData.data) { alert('Error al subir la imagen'); return; }
      const res = await apiFetch('/api/variantes', {
        method: 'PUT',
        body: JSON.stringify({ id: varianteId, imagen_url: uploadData.data.url, cloudinary_public_id: uploadData.data.publicId }),
      });
      const data: ApiResponse<VarianteProducto> = await res.json();
      if (data.success && data.data) {
        setVariantes(variantes.map(v => v.id === varianteId ? { ...v, imagen_url: data.data!.imagen_url } : v));
        setMessage('Imagen de variante subida');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch { alert('Error al subir la imagen'); }
    finally { setUploadingId(null); }
  };

  if (isLoading) return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="mt-8 h-96 rounded-lg bg-muted" />
    </div>
  );

  if (!producto) return (
    <div className="text-center">
      <p className="text-muted-foreground">Producto no encontrado</p>
      <Link href="/admin/productos" className="mt-4 inline-block text-accent hover:underline">Volver</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/productos" className="rounded-lg p-2 hover:bg-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold">Editar producto</h1>
          <p className="mt-1 text-muted-foreground">ID: {producto.id}</p>
        </div>
        <Link href={`/productos/${producto.id}`} target="_blank" className="text-sm text-accent hover:underline">Ver en tienda</Link>
      </div>

      {error && <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      {message && <div className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{message}</div>}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-medium">Informacion del producto</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input type="text" value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Descripcion</label>
              <textarea rows={3} value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Categoria</label>
                <select value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm">
                  {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Marca</label>
                <select value={formData.id_marca}
                  onChange={(e) => setFormData({ ...formData, id_marca: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm">
                  {marcas.map((marca) => <option key={marca.id} value={marca.id}>{marca.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="activo" checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="h-4 w-4 accent-primary" />
              <label htmlFor="activo" className="text-sm">Producto activo</label>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="btn-primary w-full py-2">
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <div className="border-t border-border pt-4">
              <label className="block text-sm font-medium mb-2">Imagen del producto</label>
              <div className="flex items-center gap-3">
                {producto.imagen_url ? (
                  <img src={producto.imagen_url} alt={producto.nombre}
                    className="h-20 w-20 rounded-lg object-contain border border-border bg-white p-1" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                )}
                <label className={`cursor-pointer rounded-lg border border-gray-900 bg-white px-3 py-1.5 text-xs font-medium transition-all hover:bg-gray-50 active:scale-95 ${uploadingId === -1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploadingId === -1 ? 'Subiendo...' : producto.imagen_url ? 'Cambiar imagen' : 'Subir imagen'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                    disabled={uploadingId === -1}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadImagen(f); e.target.value = ''; }} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-medium">Variantes ({variantes.length})</h2>
          <div className="mt-4 space-y-4">
            {variantes.map((variante) => (
              <div key={variante.id} className="rounded-lg bg-secondary p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Miniatura variante */}
                    <label className="relative cursor-pointer">
                      <div className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-white flex items-center justify-center ${uploadingId === variante.id ? 'opacity-50' : 'hover:opacity-80'}`}>
                        {variante.imagen_url ? (
                          <img src={variante.imagen_url} alt={variante.nombre_variante || variante.sku}
                            className="h-full w-full object-contain p-0.5" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-5 w-5 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        )}
                      </div>
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                        disabled={uploadingId === variante.id}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadVarianteImagen(variante.id, f); e.target.value = ''; }} />
                    </label>
                    <div>
                      <p className="font-medium text-sm">{variante.nombre_variante || variante.sku}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {variante.sku} | {formatLempira(variante.precio)}
                        {variante.precio_oferta && ` (Oferta: ${formatLempira(variante.precio_oferta)})`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Stock total: <span className={`font-medium ${(variante.stock_total ?? 0) > 0 ? 'text-success' : 'text-destructive'}`}>{variante.stock_total ?? 0}</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteVariante(variante.id)}
                    className="btn-icon text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
                {tiendas.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                    <p className="text-xs font-medium text-muted-foreground">Stock por tienda</p>
                    {tiendas.map((tienda) => {
                      const key = `${variante.id}_${tienda.id}`;
                      return (
                        <div key={tienda.id} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-28 truncate">{tienda.nombre}</span>
                          <input type="number" min="0" value={stockForm[key] ?? '0'}
                            onChange={(e) => setStockForm(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-16 rounded border border-input bg-background px-2 py-1 text-xs text-center" />
                          <button onClick={() => handleSaveStock(variante.id, tienda.id)}
                            className="rounded border border-gray-900 bg-white px-2 py-1 text-xs font-medium hover:bg-gray-50 active:scale-95 transition-all">
                            Guardar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleAddVariante} className="mt-6 border-t border-border pt-6">
            <h3 className="text-sm font-medium">Agregar variante</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input type="text" placeholder="SKU *" value={nuevaVariante.sku}
                onChange={(e) => setNuevaVariante({ ...nuevaVariante, sku: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              <input type="text" placeholder="Nombre variante" value={nuevaVariante.nombre_variante}
                onChange={(e) => setNuevaVariante({ ...nuevaVariante, nombre_variante: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              <input type="number" step="0.01" placeholder="Precio *" value={nuevaVariante.precio}
                onChange={(e) => setNuevaVariante({ ...nuevaVariante, precio: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              <input type="number" step="0.01" placeholder="Precio oferta" value={nuevaVariante.precio_oferta}
                onChange={(e) => setNuevaVariante({ ...nuevaVariante, precio_oferta: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="btn-secondary mt-3 w-full py-2">Agregar variante</button>
          </form>
        </div>
      </div>
    </div>
  );
}
