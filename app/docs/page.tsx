import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Volver a la tienda
          </Link>
          <h1 className="mt-4 text-4xl font-bold">Documentacion</h1>
          <p className="mt-2 text-gray-400">
            TecnoWorld - Sistema de E-commerce Multi-tienda
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Manual Tecnico */}
          <Link
            href="/docs/manual-tecnico"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-900 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Manual Tecnico</h2>
            <p className="mt-2 text-sm text-gray-600">
              Requerimientos tecnicos, arquitectura del sistema, base de datos, API endpoints, 
              seguridad e instrucciones de instalacion.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
              Ver manual
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Manual de Usuario */}
          <Link
            href="/docs/manual-usuario"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-900 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Manual de Usuario</h2>
            <p className="mt-2 text-sm text-gray-600">
              Guia completa para usuarios: registro, navegacion, carrito, checkout, 
              pedidos, panel admin y sistema de cajero.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-green-600 group-hover:text-green-700">
              Ver manual
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Trifolio */}
          <Link
            href="/docs/trifolio"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-900 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Trifolio Digital</h2>
            <p className="mt-2 text-sm text-gray-600">
              Trifolio imprimible con informacion del proyecto, equipo de desarrollo, 
              tecnologias y enlace al video de presentacion.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
              Ver trifolio
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-12 rounded-xl bg-gray-900 p-8 text-white">
          <h2 className="text-2xl font-bold">Sobre el Proyecto</h2>
          <p className="mt-4 text-gray-300">
            TecnoWorld es un sistema de comercio electronico multi-tienda desarrollado como proyecto 
            de Ingenieria de Software. El sistema permite gestionar ventas en linea y en puntos de 
            venta fisicos, con control de inventario centralizado.
          </p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-2xl font-bold text-blue-400">Next.js 16</p>
              <p className="text-sm text-gray-400">Framework principal</p>
            </div>
            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-2xl font-bold text-green-400">SQL Server</p>
              <p className="text-sm text-gray-400">Base de datos</p>
            </div>
            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-2xl font-bold text-purple-400">TypeScript</p>
              <p className="text-sm text-gray-400">Lenguaje tipado</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="https://github.com/CarlosTorres6969/proyecto_ing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Ver en GitHub
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Enlaces Rapidos</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Tienda Online
            </Link>
            <Link href="/admin" className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Panel Admin
            </Link>
            <Link href="/cajero" className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Sistema Cajero
            </Link>
            <Link href="/auth/login" className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Iniciar Sesion
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
          <p>TecnoWorld - Proyecto de Ingenieria de Software 2024</p>
        </div>
      </footer>
    </div>
  );
}
