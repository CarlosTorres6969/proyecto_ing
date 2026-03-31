'use client';

import { useEffect, useState } from 'react';
import type { Usuario, Rol, ApiResponse } from '@/types';
import { apiFetch } from '@/lib/api-fetch';

const ROL_LABEL: Record<number, string> = { 1: 'Admin', 2: 'Cajero', 3: 'Cliente' };
const ROL_COLOR: Record<number, string> = {
  1: 'bg-primary/10 text-primary',
  2: 'bg-accent/10 text-accent',
  3: 'bg-muted text-muted-foreground',
};

const FORM_VACIO = { nombre: '', apellido: '', correo: '', telefono: '', id_rol: '3', contrasena: '' };

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    const res = await apiFetch('/api/usuarios');
    const data: ApiResponse<Usuario[]> = await res.json();
    if (data.success && data.data) setUsuarios(data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
    apiFetch('/api/roles').then(r => r.json()).then((d: ApiResponse<Rol[]>) => {
      if (d.success && d.data) setRoles(d.data);
    });
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(FORM_VACIO);
    setError('');
    setShowModal(true);
  };

  const openEdit = (u: Usuario) => {
    setEditId(u.id);
    setForm({ nombre: u.nombre, apellido: u.apellido, correo: u.correo, telefono: u.telefono || '', id_rol: String(u.id_rol), contrasena: '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = editId
        ? { id: editId, nombre: form.nombre, apellido: form.apellido, telefono: form.telefono || null, id_rol: Number(form.id_rol), ...(form.contrasena ? { contrasena: form.contrasena } : {}) }
        : { nombre: form.nombre, apellido: form.apellido, correo: form.correo, telefono: form.telefono || null, id_rol: Number(form.id_rol), contrasena: form.contrasena };

      const res = await apiFetch('/api/usuarios', {
        method: editId ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      });
      const data: ApiResponse<Usuario> = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchUsuarios();
      } else {
        setError(data.message || 'Error al guardar');
      }
    } catch { setError('Error de conexión'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    await apiFetch(`/api/usuarios?id=${id}`, { method: 'DELETE' });
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Usuarios</h1>
        <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <div className="animate-pulse p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded bg-muted" />)}</div>
        ) : usuarios.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No hay usuarios</div>
        ) : (
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Usuario</th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium sm:table-cell">Correo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Rol</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.nombre} {u.apellido}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{u.correo}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{u.correo}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${ROL_COLOR[u.id_rol] || 'bg-muted text-muted-foreground'}`}>
                      {ROL_LABEL[u.id_rol] || 'Desconocido'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="btn-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="btn-icon text-destructive hover:bg-destructive/10 hover:text-destructive">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">{editId ? 'Editar usuario' : 'Nuevo usuario'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-200">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input required type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input required type="text" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500" />
                </div>
              </div>

              {!editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                  <input required type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                <select value={form.id_rol} onChange={e => setForm({ ...form, id_rol: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500">
                  {roles.length > 0
                    ? roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)
                    : Object.entries(ROL_LABEL).map(([id, nombre]) => <option key={id} value={id}>{nombre}</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editId ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                </label>
                <input type="password" required={!editId} value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 py-2">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="btn-primary flex-1 py-2">
                  {saving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
