'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    const result = await register({
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      telefono: formData.telefono || undefined,
      contrasena: formData.contrasena,
    });

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Error al registrarse');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block font-serif text-3xl font-bold tracking-tight">
            TecnoWorld
          </Link>
          <h1 className="mt-6 text-2xl font-semibold">Crea tu cuenta</h1>
          <p className="mt-2 text-muted-foreground">
            Unete a nuestra comunidad de compradores
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Juan"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                required
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Perez"
              />
            </div>
          </div>

          <div>
            <label htmlFor="correo" className="block text-sm font-medium">
              Correo electronico
            </label>
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
            <label htmlFor="telefono" className="block text-sm font-medium">
              Telefono <span className="text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="+504 9999-9999"
            />
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium">
              Contrasena
            </label>
            <input
              id="contrasena"
              type="password"
              required
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Minimo 6 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmarContrasena" className="block text-sm font-medium">
              Confirmar contrasena
            </label>
            <input
              id="confirmarContrasena"
              type="password"
              required
              value={formData.confirmarContrasena}
              onChange={(e) => setFormData({ ...formData, confirmarContrasena: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Repite tu contrasena"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="font-medium text-accent hover:underline">
            Inicia sesion
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

