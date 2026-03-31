'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ correo: '', contrasena: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(formData);
    if (result.success && result.redirect) {
      router.push(result.redirect);
    } else {
      setError(result.error || 'Error al iniciar sesion');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block font-serif text-3xl font-bold tracking-tight">
            TecnoWorld
          </Link>
          <h1 className="mt-6 text-2xl font-semibold">Bienvenido de vuelta</h1>
          <p className="mt-2 text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="correo" className="block text-sm font-medium">Correo electronico</label>
            <input
              id="correo"
              type="email"
              required
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium">Contrasena</label>
            <input
              id="contrasena"
              type="password"
              required
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Tu contrasena"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3"
          >
            {isLoading ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          No tienes cuenta?{' '}
          <Link href="/auth/registro" className="font-medium text-accent hover:underline">
            Registrate aqui
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
