'use client';

import { useEffect, useState } from 'react';
import type { Tienda, ApiResponse } from '@/types';
import { apiFetch } from '@/lib/api-fetch';

export default function AdminTiendasPage() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', ciudad: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchTiendas = async () => {
    const res = await apiFetch('/api/tiendas');
    const data: ApiResponse<Tienda[]> = await res.json();
    if (data.success && data.data) setTiendas(data.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchTiendas(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/tiendas', {
        method: editId ? 'PUT' : 'POST',
        body: JSON.stringify(editId ? { id: editId, ...form } : form),
      });
      const data: ApiResponse<Tienda> = await res.json();
      if (data.success) { setForm({ nombre: '', ciudad: '' }); setEditId(null); fetchTiendas(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar tienda?')) return;
    await apiFetch(`/api/tiendas?id=${id}`, { method: 'DELETE' });
    fetchTiendas();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Tiendas</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-medium">{editId ? 'Editar tienda' : 'Nueva tienda'}</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input type="text" placeholder="Nombre *" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
            <input type="text" placeholder="Ciudad" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} className="block w-full rounded-lg border border-input bg-background px-4 py-2 text-sm" />
            <div className="flex gap-2">
              {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', ciudad: '' }); }} className="btn-secondary flex-1 py-2">Cancelar</button>}
              <button type="submit" disabled={saving} className="btn-primary flex-1 py-2">{saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-medium">Lista ({tiendas.length})</h2>
          {isLoading ? <p className="mt-4 text-sm text-muted-foreground">Cargando...</p> : (
            <div className="mt-4 space-y-2">
              {tiendas.map(tienda => (
                <div key={tienda.id} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{tienda.nombre}</p>
                    {tienda.ciudad && <p className="text-xs text-muted-foreground">{tienda.ciudad}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditId(tienda.id); setForm({ nombre: tienda.nombre || '', ciudad: tienda.ciudad || '' }); }} className="btn-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg></button>
                    <button onClick={() => handleDelete(tienda.id)} className="btn-icon text-destructive hover:bg-destructive/10 hover:text-destructive"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
