'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import type { Carrito, ItemCarrito, ApiResponse } from '@/types';

interface CartContextType {
  carrito: Carrito | null;
  isLoading: boolean;
  itemCount: number;
  addToCart: (id_variante: number, cantidad: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (id_item: number, cantidad: number) => Promise<{ success: boolean; error?: string }>;
  removeItem: (id_item: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!usuario) {
      setCarrito(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/carrito?id_usuario=${usuario.id}`);
      const data: ApiResponse<Carrito> = await res.json();
      
      if (data.success && data.data) {
        setCarrito(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (id_variante: number, cantidad: number) => {
    if (!usuario) {
      return { success: false, error: 'Debes iniciar sesion para agregar al carrito' };
    }

    try {
      const res = await fetch('/api/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuario.id, id_variante, cantidad }),
      });
      
      const data: ApiResponse<ItemCarrito> = await res.json();
      
      if (data.success) {
        await refreshCart();
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Error al agregar al carrito' };
    } catch {
      return { success: false, error: 'Error de conexion' };
    }
  };

  const updateQuantity = async (id_item: number, cantidad: number) => {
    try {
      const res = await fetch('/api/carrito', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_item, cantidad }),
      });
      
      const data: ApiResponse<ItemCarrito> = await res.json();
      
      if (data.success) {
        await refreshCart();
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Error al actualizar cantidad' };
    } catch {
      return { success: false, error: 'Error de conexion' };
    }
  };

  const removeItem = async (id_item: number) => {
    try {
      const res = await fetch(`/api/carrito?id_item=${id_item}`, {
        method: 'DELETE',
      });
      
      const data: ApiResponse<{ message: string }> = await res.json();
      
      if (data.success) {
        await refreshCart();
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Error al eliminar item' };
    } catch {
      return { success: false, error: 'Error de conexion' };
    }
  };

  const clearCart = async () => {
    if (!carrito) return { success: false, error: 'No hay carrito' };

    try {
      const res = await fetch(`/api/carrito?id_carrito=${carrito.carrito.id}`, {
        method: 'DELETE',
      });
      
      const data: ApiResponse<{ message: string }> = await res.json();
      
      if (data.success) {
        await refreshCart();
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Error al vaciar carrito' };
    } catch {
      return { success: false, error: 'Error de conexion' };
    }
  };

  const itemCount = carrito?.items.reduce((sum, item) => sum + item.cantidad, 0) || 0;

  return (
    <CartContext.Provider value={{ 
      carrito, 
      isLoading, 
      itemCount, 
      addToCart, 
      updateQuantity, 
      removeItem, 
      clearCart,
      refreshCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
