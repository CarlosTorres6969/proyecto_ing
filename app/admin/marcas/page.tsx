'use client';

import { useEffect, useState } from 'react';
import type { Marca, ApiResponse } from '@/types';
import { apiFetch } from '@/lib/api-fetch';

export default function AdminMarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMarcas = async () => {
    const res = await apiFetch('/api/marcas');
    const data: ApiResponse<Marca[]> = await res.json();
    if (data.success && data.data) setMarcas(data.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchMarcas(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    try {
      const res = await apiFetch('/api/marcas', {
        method: editId ? 'PUT' : 'POST',
        body: JSON.stringify(editId ? { id: editId, nombre } : { nombre }),
      });
      const data: ApiResponse<Marca> = await res.json();
      if (data.success) { setNombre(''); setEditId(null); fetchMarcas(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar marca?')) return;
    await apiFetch(`/api/marcas?id=${id}`, { method: 'DELETE' });
    fetchMarcas();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Marcas</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-medium">{editId ? 'Editar marca' : 'Nueva marca'}</h2>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input type="text" placeholder="Nombre de la marca *" required value={nombre} onChange={e => setNombre(e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm" />
            {editId && <button type="button" onClick={() => { setEditId(null); setNombre(''); }} className="btn-secondary px-4 py-2">Cancelar</button>}
            <button type="submit" disabled={saving} className="btn-primary px-4 py-2">{saving ? '...' : editId ? 'Actualizar' : 'Crear'}</button>
          </form>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-medium">Lista ({marcas.length})</h2>
          {isLoading ? <p className="mt-4 text-sm text-muted-foreground">Cargando...</p> : (
            <div className="mt-4 space-y-2">
              {marcas.map(marca => (
                <div key={marca.id} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                  <p className="text-sm font-medium">{marca.nombre}</p>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditId(marca.id); setNombre(marca.nombre); }} className="btn-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg></button>
                    <button onClick={() => handleDelete(marca.id)} className="btn-icon text-destructive hover:bg-destructive/10 hover:text-destructive"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
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
