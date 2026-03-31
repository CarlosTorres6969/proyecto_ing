'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { VarianteProducto, ApiResponse } from '@/types';
import { formatLempira } from '@/lib/format';
interface ItemVenta { variante: VarianteProducto & { nombre_producto: string }; cantidad: number }

export default function CajeroVentaPage() {
  const { usuario } = useAuth();
  const [variantes, setVariantes] = useState<(VarianteProducto & { nombre_producto: string })[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [variantesRecientes, setVariantesRecientes] = useState<(VarianteProducto & { nombre_producto: string })[]>([]);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Solo carga las primeras 9 variantes activas para mostrar en el grid
  useEffect(() => {
    fetch('/api/variantes?activo=true', { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((data: ApiResponse<(VarianteProducto & { nombre_producto: string })[]>) => {
        if (data.success && data.data) {
          const activas = data.data.filter(v => v.activo);
          setVariantesRecientes(activas.slice(0, 9));
          setVariantes(activas);
        }
      });
  }, []);

  // Búsqueda filtrada en cliente (ya tenemos los datos)
  const variantesFiltradas = busqueda.length > 1
    ? variantes.filter(v =>
        v.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.nombre_variante?.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.nombre_producto?.toLowerCase().includes(busqueda.toLowerCase())
      ).slice(0, 8)
    : [];

  const agregarItem = (v: VarianteProducto & { nombre_producto: string }) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.variante.id === v.id);
      if (existe) return prev.map(i => i.variante.id === v.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { variante: v, cantidad: 1 }];
    });
    setBusqueda('');
  };

  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito(prev => prev.map(i => i.variante.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i).filter(i => i.cantidad > 0));
  };

  const eliminarItem = (id: number) => setCarrito(prev => prev.filter(i => i.variante.id !== id));

  const total = carrito.reduce((acc, i) => acc + (i.variante.precio_oferta ?? i.variante.precio) * i.cantidad, 0);

  const procesarVenta = async () => {
    if (!carrito.length || !usuario) return;
    setProcesando(true);
    try {
      const authHeaders = getAuthHeaders();
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          id_usuario: usuario.id,
          items: carrito.map(i => ({ id_variante: i.variante.id, cantidad: i.cantidad })),
        }),
      });
      const data: ApiResponse<{ id: number }> = await res.json();
      if (data.success && data.data) {
        await fetch('/api/pagos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders },
          body: JSON.stringify({ id_pedido: data.data.id, monto: total, metodo_pago: 'efectivo', estado: 'pagado' }),
        });
        setCarrito([]);
        setMensaje(`Venta #${data.data.id} procesada — ${formatLempira(total)}`);
        setTimeout(() => setMensaje(''), 5000);
      }
    } finally { setProcesando(false); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Buscador */}
      <div>
        <h1 className="font-serif text-2xl font-bold">Nueva venta</h1>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Buscar por SKU, nombre o producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
            autoFocus
          />
          {variantesFiltradas.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
              {variantesFiltradas.slice(0, 8).map(v => (
                <button key={v.id} onClick={() => agregarItem(v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-secondary">
                  <div>
                    <p className="font-medium">{v.nombre_producto}</p>
                    <p className="text-xs text-muted-foreground">{v.nombre_variante || v.sku} · SKU: {v.sku}</p>
                  </div>
                  <span className="font-semibold">{formatLempira(v.precio_oferta ?? v.precio)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Productos recientes */}
        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">Productos disponibles</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {variantesRecientes.map(v => (
              <button key={v.id} onClick={() => agregarItem(v)}
                className="rounded-lg border border-border bg-card p-3 text-left text-sm hover:border-accent transition-colors">
                <p className="font-medium truncate">{v.nombre_producto}</p>
                <p className="text-xs text-muted-foreground truncate">{v.nombre_variante || v.sku}</p>
                <p className="mt-1 font-semibold text-accent">{formatLempira(v.precio_oferta ?? v.precio)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carrito / Cobro */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">Resumen de venta</h2>

        {mensaje && (
          <div className="mt-3 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{mensaje}</div>
        )}

        {carrito.length === 0 ? (
          <p className="mt-8 text-center text-muted-foreground">Agrega productos para comenzar</p>
        ) : (
          <>
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
              {carrito.map(item => (
                <div key={item.variante.id} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.variante.nombre_producto}</p>
                    <p className="text-xs text-muted-foreground">{item.variante.nombre_variante || item.variante.sku}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => cambiarCantidad(item.variante.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-150 hover:bg-secondary active:scale-90 cursor-pointer text-xs">-</button>
                    <span className="w-6 text-center text-sm">{item.cantidad}</span>
                    <button onClick={() => cambiarCantidad(item.variante.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-150 hover:bg-secondary active:scale-90 cursor-pointer text-xs">+</button>
                  </div>
                  <span className="text-sm font-semibold w-20 text-right">{formatLempira((item.variante.precio_oferta ?? item.variante.precio) * item.cantidad)}</span>
                  <button onClick={() => eliminarItem(item.variante.id)} className="btn-icon text-destructive hover:bg-destructive/10 hover:text-destructive text-xs">✕</button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatLempira(total)}</span>
              </div>
              <button
                onClick={procesarVenta}
                disabled={procesando}
                className="btn-primary mt-4 w-full py-3"
              >
                {procesando ? 'Procesando...' : `Cobrar ${formatLempira(total)}`}
              </button>
              <button onClick={() => setCarrito([])} className="btn-secondary mt-2 w-full py-2">
                Cancelar venta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
