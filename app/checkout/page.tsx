'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import type { ApiResponse, Pedido } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { carrito, refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const items = carrito?.items || [];
  const total = carrito?.total || 0;

  const handleCheckout = async () => {
    if (!usuario || items.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      // Crear pedido
      const pedidoRes = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario.id,
          items: items.map((item) => ({
            id_variante: item.id_variante,
            cantidad: item.cantidad,
          })),
        }),
      });

      const pedidoData: ApiResponse<Pedido> = await pedidoRes.json();

      if (!pedidoData.success || !pedidoData.data) {
        throw new Error(pedidoData.error || 'Error al crear el pedido');
      }

      // Registrar pago (simulado)
      await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pedido: pedidoData.data.id,
          monto: total,
          metodo_pago: 'tarjeta',
          estado: 'completado',
        }),
      });

      // Actualizar estado del pedido a pagado
      await fetch('/api/pedidos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pedidoData.data.id,
          estado: 'pagado',
        }),
      });

      // Refrescar carrito (deberia estar vacio)
      await refreshCart();

      // Redirigir a confirmacion
      router.push(`/pedidos/${pedidoData.data.id}?nuevo=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!usuario) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Inicia sesion para continuar</h1>
            <p className="mt-2 text-muted-foreground">
              Necesitas una cuenta para realizar tu compra
            </p>
            <Link href="/auth/login" className="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground">
              Iniciar sesion
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Tu carrito esta vacio</h1>
            <p className="mt-2 text-muted-foreground">
              Agrega productos para continuar con el checkout
            </p>
            <Link href="/productos" className="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground">
              Ver productos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold">Checkout</h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold">Resumen del pedido</h2>
                
                <div className="mt-6 divide-y divide-border">
                  {items.map((item) => {
                    const precio = item.precio_oferta ?? item.precio ?? 0;
                    return (
                      <div key={item.id} className="flex gap-4 py-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 text-muted-foreground/30">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.nombre_producto}</h3>
                          {item.nombre_variante && (
                            <p className="text-sm text-muted-foreground">{item.nombre_variante}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="font-semibold">${(precio * item.cantidad).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-3 border-t border-border pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envio</span>
                    <span className="text-success">Gratis</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="order-1 lg:order-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold">Informacion de pago</h2>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Numero de tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Expiracion</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Nombre en la tarjeta</label>
                    <input
                      type="text"
                      placeholder="Juan Perez"
                      defaultValue={`${usuario.nombre} ${usuario.apellido}`}
                      className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="font-medium">Direccion de envio</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Direccion</label>
                      <input
                        type="text"
                        placeholder="Calle Principal 123"
                        className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">Ciudad</label>
                        <input
                          type="text"
                          placeholder="Ciudad"
                          className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Codigo postal</label>
                        <input
                          type="text"
                          placeholder="12345"
                          className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isProcessing ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
                </button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Al completar la compra aceptas nuestros terminos y condiciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
