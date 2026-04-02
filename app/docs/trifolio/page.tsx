'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TrifolioPage() {
  const [videoLink, setVideoLink] = useState('https://www.youtube.com/watch?v=TU_VIDEO_ID');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Styles Notice */}
      <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm print:hidden">
        Este trifolio esta disenado para impresion. Usa Ctrl+P o Cmd+P para imprimir.
        <Link href="/docs" className="ml-4 underline hover:no-underline">
          Volver a Documentacion
        </Link>
      </div>

      {/* Trifolio Container - Landscape A4 simulated */}
      <div className="mx-auto my-8 bg-white shadow-2xl print:my-0 print:shadow-none" style={{ width: '297mm', maxWidth: '100%' }}>
        
        {/* ==================== CARA FRONTAL ==================== */}
        <div className="grid grid-cols-3 print:break-after-page" style={{ minHeight: '210mm' }}>
          
          {/* Panel 1 - Portada (estara a la derecha cuando se doble) */}
          <div className="flex flex-col items-center justify-center bg-gray-900 p-8 text-white">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white">
                <span className="text-3xl font-bold text-gray-900">TW</span>
              </div>
              <h1 className="text-3xl font-bold">TecnoWorld</h1>
              <p className="mt-2 text-gray-400">Sistema E-commerce Multi-tienda</p>
              
              <div className="mt-8 rounded-xl bg-gray-800 p-4">
                <p className="text-sm text-gray-300">Proyecto de</p>
                <p className="mt-1 text-lg font-semibold">Ingenieria de Software</p>
                <p className="mt-2 text-sm text-gray-400">2024</p>
              </div>

              <div className="mt-8 space-y-1 text-xs text-gray-500">
                <p>Universidad Nacional</p>
                <p>Facultad de Ingenieria</p>
              </div>
            </div>
          </div>

          {/* Panel 2 - Contraportada (panel central exterior) */}
          <div className="flex flex-col justify-between bg-gray-50 p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Contacto y Enlaces</h2>
              
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700">Repositorio GitHub</h3>
                  <p className="mt-1 break-all text-xs text-blue-600">
                    github.com/CarlosTorres6969/proyecto_ing
                  </p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700">Demo en Vivo</h3>
                  <p className="mt-1 text-xs text-blue-600">
                    tecnoworld.vercel.app
                  </p>
                </div>

                <div className="rounded-lg bg-red-50 p-4 shadow-sm border border-red-200">
                  <h3 className="text-sm font-semibold text-red-700">Video de Presentacion</h3>
                  <p className="mt-1 break-all text-xs text-red-600">
                    {videoLink}
                  </p>
                  <div className="mt-2 rounded bg-red-100 p-2">
                    <p className="text-xs text-red-700">
                      Escanea el QR o visita el enlace
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-gray-900 p-4 text-center text-white">
              <p className="text-xs">Codigo QR del Video</p>
              <div className="mx-auto mt-2 flex h-24 w-24 items-center justify-center rounded bg-white">
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 w-4 ${
                        [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24].includes(i)
                          ? 'bg-gray-900'
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">(Reemplazar con QR real)</p>
            </div>
          </div>

          {/* Panel 3 - Interior izquierdo cuando abierto */}
          <div className="flex flex-col justify-between bg-white p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Equipo de Desarrollo</h2>
              
              <div className="mt-6 space-y-3">
                {[
                  { nombre: 'Carlos Torres', rol: 'Lider de Proyecto' },
                  { nombre: 'Miembro 2', rol: 'Desarrollador Frontend' },
                  { nombre: 'Miembro 3', rol: 'Desarrollador Backend' },
                  { nombre: 'Miembro 4', rol: 'Base de Datos' },
                ].map((m, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3">
                    <p className="font-medium text-gray-900">{m.nombre}</p>
                    <p className="text-xs text-gray-500">{m.rol}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700">Docente</h3>
              <div className="mt-2 rounded-lg bg-blue-50 p-3">
                <p className="font-medium text-blue-900">Nombre del Catedratico</p>
                <p className="text-xs text-blue-600">Ingenieria de Software</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== CARA INTERIOR ==================== */}
        <div className="grid grid-cols-3 border-t-4 border-dashed border-gray-300" style={{ minHeight: '210mm' }}>
          
          {/* Panel 4 - Descripcion del Proyecto */}
          <div className="bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Descripcion</h2>
            
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              <strong>TecnoWorld</strong> es una plataforma de comercio electronico 
              multi-tienda desarrollada para gestionar ventas tanto en linea como en 
              puntos de venta fisicos.
            </p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800">Problema que Resuelve</h3>
              <ul className="mt-2 space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  Falta de integracion entre ventas online y presenciales
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  Dificultad en el control de inventario multi-sucursal
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  Procesos manuales propensos a errores
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800">Solucion Propuesta</h3>
              <ul className="mt-2 space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></span>
                  Sistema unificado de ventas omnicanal
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></span>
                  Control de inventario en tiempo real
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></span>
                  Automatizacion de procesos comerciales
                </li>
              </ul>
            </div>
          </div>

          {/* Panel 5 - Caracteristicas */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">Caracteristicas</h2>
            
            <div className="mt-4 space-y-3">
              {[
                { titulo: 'Tienda Online', desc: 'Catalogo de productos, carrito y checkout', icon: 'cart' },
                { titulo: 'Panel Admin', desc: 'Gestion completa de productos y pedidos', icon: 'admin' },
                { titulo: 'Sistema POS', desc: 'Punto de venta para tiendas fisicas', icon: 'pos' },
                { titulo: 'Multi-tienda', desc: 'Control de inventario por sucursal', icon: 'store' },
                { titulo: 'Pagos Online', desc: 'Integracion con PayPal', icon: 'pay' },
                { titulo: 'Cupones', desc: 'Sistema de descuentos y promociones', icon: 'coupon' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{f.titulo}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 6 - Tecnologias */}
          <div className="bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Tecnologias</h2>
            
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Frontend</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS'].map((t) => (
                    <span key={t} className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Backend</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['API REST', 'JWT Auth', 'bcrypt'].map((t) => (
                    <span key={t} className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Base de Datos</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['SQL Server', 'mssql'].map((t) => (
                    <span key={t} className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Servicios</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Cloudinary', 'PayPal', 'Vercel'].map((t) => (
                    <span key={t} className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-gray-900 p-4">
              <h3 className="text-sm font-semibold text-white">Arquitectura</h3>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-300">
                <span className="rounded bg-blue-600 px-2 py-1">Cliente</span>
                <span>→</span>
                <span className="rounded bg-green-600 px-2 py-1">API</span>
                <span>→</span>
                <span className="rounded bg-purple-600 px-2 py-1">DB</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-500">Documentacion completa en:</p>
              <p className="mt-1 text-sm font-medium text-blue-600">/docs/manual-tecnico</p>
              <p className="mt-1 text-sm font-medium text-blue-600">/docs/manual-usuario</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions for editing (only visible on screen) */}
      <div className="mx-auto max-w-4xl px-4 py-8 print:hidden">
        <div className="rounded-xl bg-yellow-50 p-6">
          <h2 className="text-lg font-bold text-yellow-900">Instrucciones para Editar</h2>
          <ul className="mt-3 space-y-2 text-sm text-yellow-800">
            <li>1. Reemplaza el link del video en el codigo con tu URL real de YouTube</li>
            <li>2. Actualiza los nombres del equipo de desarrollo</li>
            <li>3. Actualiza el nombre del docente</li>
            <li>4. Genera un codigo QR real con el link de tu video y reemplaza el placeholder</li>
            <li>5. Imprime en formato horizontal (landscape) A4</li>
          </ul>

          <div className="mt-4 rounded-lg bg-white p-4">
            <label className="block text-sm font-medium text-gray-700">Link del Video</label>
            <input
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-gray-900 px-8 py-3 text-white hover:bg-gray-800"
          >
            Imprimir Trifolio
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
