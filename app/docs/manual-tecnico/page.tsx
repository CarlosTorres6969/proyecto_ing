'use client';

import Link from 'next/link';
import { useState } from 'react';

const secciones = [
  { id: 'introduccion', titulo: 'Introduccion' },
  { id: 'arquitectura', titulo: 'Arquitectura del Sistema' },
  { id: 'tecnologias', titulo: 'Stack Tecnologico' },
  { id: 'bd', titulo: 'Base de Datos' },
  { id: 'api', titulo: 'API Endpoints' },
  { id: 'seguridad', titulo: 'Seguridad' },
  { id: 'requisitos', titulo: 'Requisitos del Sistema' },
  { id: 'instalacion', titulo: 'Instalacion' },
];

export default function ManualTecnicoPage() {
  const [seccionActiva, setSeccionActiva] = useState('introduccion');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manual de Requerimientos Tecnicos</h1>
              <p className="mt-1 text-gray-400">Sistema TecnoWorld - E-commerce Multi-tienda</p>
            </div>
            <Link href="/docs" className="rounded-lg bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700">
              Volver a Documentacion
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-xl bg-white p-6 shadow-sm lg:sticky lg:top-8 lg:h-fit">
            <h2 className="mb-4 font-semibold text-gray-900">Contenido</h2>
            <nav className="space-y-1">
              {secciones.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setSeccionActiva(s.id)}
                  className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                    seccionActiva === s.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s.titulo}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="space-y-8">
            {/* Introduccion */}
            <section id="introduccion" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">1. Introduccion</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>
                  <strong>TecnoWorld</strong> es un sistema de comercio electronico multi-tienda desarrollado 
                  para gestionar ventas tanto en linea como en puntos de venta fisicos. El sistema permite 
                  administrar productos, inventario, pedidos, usuarios y multiples tiendas desde una 
                  plataforma centralizada.
                </p>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900">Alcance del Sistema</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Gestion de catalogo de productos con variantes</li>
                    <li>Control de inventario multi-tienda</li>
                    <li>Procesamiento de pedidos en linea</li>
                    <li>Sistema de punto de venta (POS) para cajeros</li>
                    <li>Panel administrativo completo</li>
                    <li>Sistema de cupones y descuentos</li>
                    <li>Gestion de devoluciones</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Arquitectura */}
            <section id="arquitectura" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">2. Arquitectura del Sistema</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                <p>
                  El sistema utiliza una arquitectura monolitica basada en Next.js con el patron 
                  App Router, combinando renderizado del lado del servidor (SSR) y componentes 
                  del lado del cliente.
                </p>
                
                <div className="rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900">Diagrama de Arquitectura</h4>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="font-semibold text-blue-900">Frontend</div>
                      <div className="mt-2 text-blue-700">React 19 + Next.js 16</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="font-semibold text-green-900">API Layer</div>
                      <div className="mt-2 text-green-700">Next.js Route Handlers</div>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <div className="font-semibold text-purple-900">Database</div>
                      <div className="mt-2 text-purple-700">SQL Server (MSSQL)</div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="rounded-lg bg-orange-50 p-4 text-center">
                      <div className="font-semibold text-orange-900">Storage</div>
                      <div className="mt-2 text-orange-700">Cloudinary (Imagenes)</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-900">Modulos Principales</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        Tienda Publica (Cliente)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Panel Administrativo
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        Sistema de Cajero (POS)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        API REST
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-900">Roles de Usuario</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        Administrador
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        Cajero
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                        Cliente
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Stack Tecnologico */}
            <section id="tecnologias" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">3. Stack Tecnologico</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">Frontend</h4>
                  <table className="mt-3 w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="py-2 text-gray-600">Framework</td><td className="py-2 font-medium">Next.js 16.2.1</td></tr>
                      <tr><td className="py-2 text-gray-600">UI Library</td><td className="py-2 font-medium">React 19.2.4</td></tr>
                      <tr><td className="py-2 text-gray-600">Estilos</td><td className="py-2 font-medium">Tailwind CSS 4</td></tr>
                      <tr><td className="py-2 text-gray-600">Lenguaje</td><td className="py-2 font-medium">TypeScript 5</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">Backend</h4>
                  <table className="mt-3 w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="py-2 text-gray-600">API</td><td className="py-2 font-medium">Next.js Route Handlers</td></tr>
                      <tr><td className="py-2 text-gray-600">Base de Datos</td><td className="py-2 font-medium">Microsoft SQL Server</td></tr>
                      <tr><td className="py-2 text-gray-600">Driver DB</td><td className="py-2 font-medium">mssql 12.2.1</td></tr>
                      <tr><td className="py-2 text-gray-600">Almacenamiento</td><td className="py-2 font-medium">Cloudinary</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">Autenticacion</h4>
                  <table className="mt-3 w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="py-2 text-gray-600">Tokens</td><td className="py-2 font-medium">JWT (jsonwebtoken)</td></tr>
                      <tr><td className="py-2 text-gray-600">Hashing</td><td className="py-2 font-medium">bcryptjs</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">Pagos</h4>
                  <table className="mt-3 w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="py-2 text-gray-600">Proveedor</td><td className="py-2 font-medium">PayPal</td></tr>
                      <tr><td className="py-2 text-gray-600">SDK</td><td className="py-2 font-medium">@paypal/react-paypal-js</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Base de Datos */}
            <section id="bd" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">4. Base de Datos</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                <p>
                  El sistema utiliza Microsoft SQL Server con un esquema relacional normalizado. 
                  A continuacion se detallan las tablas principales:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Tabla</th>
                        <th className="px-4 py-3 text-left font-semibold">Descripcion</th>
                        <th className="px-4 py-3 text-left font-semibold">Campos Clave</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">usuarios</td>
                        <td className="px-4 py-3">Usuarios del sistema</td>
                        <td className="px-4 py-3 text-xs">id, id_rol, correo, hash_contrasena, nombre</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">roles</td>
                        <td className="px-4 py-3">Roles de usuario</td>
                        <td className="px-4 py-3 text-xs">id, nombre</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">productos</td>
                        <td className="px-4 py-3">Catalogo de productos</td>
                        <td className="px-4 py-3 text-xs">id, id_marca, id_categoria, nombre, descripcion</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">variantes_producto</td>
                        <td className="px-4 py-3">Variantes de productos</td>
                        <td className="px-4 py-3 text-xs">id, id_producto, sku, precio, precio_oferta</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">tiendas</td>
                        <td className="px-4 py-3">Ubicaciones fisicas</td>
                        <td className="px-4 py-3 text-xs">id, nombre, ciudad</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">niveles_stock</td>
                        <td className="px-4 py-3">Inventario por tienda</td>
                        <td className="px-4 py-3 text-xs">id_variante, id_tienda, cantidad</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">pedidos</td>
                        <td className="px-4 py-3">Ordenes de compra</td>
                        <td className="px-4 py-3 text-xs">id, id_usuario, estado, monto_total</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">pagos</td>
                        <td className="px-4 py-3">Registro de pagos</td>
                        <td className="px-4 py-3 text-xs">id, id_pedido, monto, metodo_pago, estado</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">cupones</td>
                        <td className="px-4 py-3">Codigos de descuento</td>
                        <td className="px-4 py-3 text-xs">id, codigo, tipo, valor, activo</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">devoluciones</td>
                        <td className="px-4 py-3">Solicitudes de devolucion</td>
                        <td className="px-4 py-3 text-xs">id, id_pedido, motivo, estado</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <h4 className="font-semibold text-yellow-900">Diagrama Entidad-Relacion Simplificado</h4>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                    <div className="rounded bg-white px-3 py-2 shadow">usuarios</div>
                    <div className="flex items-center text-gray-400">1:N</div>
                    <div className="rounded bg-white px-3 py-2 shadow">pedidos</div>
                    <div className="flex items-center text-gray-400">1:N</div>
                    <div className="rounded bg-white px-3 py-2 shadow">items_pedido</div>
                    <div className="flex items-center text-gray-400">N:1</div>
                    <div className="rounded bg-white px-3 py-2 shadow">variantes_producto</div>
                    <div className="flex items-center text-gray-400">N:1</div>
                    <div className="rounded bg-white px-3 py-2 shadow">productos</div>
                  </div>
                </div>
              </div>
            </section>

            {/* API */}
            <section id="api" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">5. API Endpoints</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>La API REST esta organizada en los siguientes grupos de endpoints:</p>
                
                <div className="space-y-4">
                  {[
                    { grupo: 'Autenticacion', endpoints: [
                      { method: 'POST', path: '/api/auth/login', desc: 'Iniciar sesion' },
                      { method: 'POST', path: '/api/auth/register', desc: 'Registrar usuario' },
                    ]},
                    { grupo: 'Productos', endpoints: [
                      { method: 'GET', path: '/api/productos', desc: 'Listar productos' },
                      { method: 'POST', path: '/api/productos', desc: 'Crear producto' },
                      { method: 'GET', path: '/api/variantes', desc: 'Listar variantes' },
                      { method: 'GET', path: '/api/categorias', desc: 'Listar categorias' },
                      { method: 'GET', path: '/api/marcas', desc: 'Listar marcas' },
                    ]},
                    { grupo: 'Pedidos', endpoints: [
                      { method: 'GET', path: '/api/pedidos', desc: 'Listar pedidos' },
                      { method: 'POST', path: '/api/pedidos', desc: 'Crear pedido' },
                      { method: 'GET', path: '/api/pagos', desc: 'Listar pagos' },
                      { method: 'POST', path: '/api/pagos', desc: 'Registrar pago' },
                    ]},
                    { grupo: 'Inventario', endpoints: [
                      { method: 'GET', path: '/api/stock', desc: 'Consultar stock' },
                      { method: 'PUT', path: '/api/stock', desc: 'Actualizar stock' },
                      { method: 'GET', path: '/api/tiendas', desc: 'Listar tiendas' },
                    ]},
                  ].map((g) => (
                    <div key={g.grupo} className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-semibold">{g.grupo}</div>
                      <div className="divide-y divide-gray-100">
                        {g.endpoints.map((e, i) => (
                          <div key={i} className="flex items-center gap-4 px-4 py-2 text-sm">
                            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                              e.method === 'GET' ? 'bg-green-100 text-green-700' :
                              e.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>{e.method}</span>
                            <code className="font-mono text-gray-800">{e.path}</code>
                            <span className="text-gray-500">{e.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Seguridad */}
            <section id="seguridad" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">6. Seguridad</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-green-50 p-4">
                    <h4 className="font-semibold text-green-900">Autenticacion</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-800">
                      <li>Tokens JWT firmados con clave secreta</li>
                      <li>Expiracion de tokens configurable</li>
                      <li>Refresh token para sesiones prolongadas</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="font-semibold text-blue-900">Contrasenas</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800">
                      <li>Hashing con bcrypt (salt rounds: 10)</li>
                      <li>Validacion de fortaleza en frontend</li>
                      <li>Sin almacenamiento de texto plano</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <h4 className="font-semibold text-purple-900">Autorizacion</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-purple-800">
                      <li>Control de acceso basado en roles (RBAC)</li>
                      <li>Verificacion de permisos en cada endpoint</li>
                      <li>Rutas protegidas en frontend y backend</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <h4 className="font-semibold text-orange-900">Base de Datos</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-orange-800">
                      <li>Consultas parametrizadas (anti SQL injection)</li>
                      <li>Conexiones con pool gestionado</li>
                      <li>Variables de entorno para credenciales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Requisitos */}
            <section id="requisitos" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">7. Requisitos del Sistema</h2>
              <div className="mt-4 grid gap-6 md:grid-cols-2 text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-900">Hardware Minimo (Servidor)</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>CPU: 2 nucleos</li>
                    <li>RAM: 4 GB</li>
                    <li>Almacenamiento: 20 GB SSD</li>
                    <li>Red: 100 Mbps</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Hardware Recomendado (Servidor)</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>CPU: 4+ nucleos</li>
                    <li>RAM: 8+ GB</li>
                    <li>Almacenamiento: 50+ GB SSD</li>
                    <li>Red: 1 Gbps</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Software Requerido</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Node.js 18+ (recomendado 20 LTS)</li>
                    <li>Microsoft SQL Server 2019+</li>
                    <li>npm o pnpm</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Navegadores Soportados</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Chrome 90+</li>
                    <li>Firefox 88+</li>
                    <li>Safari 14+</li>
                    <li>Edge 90+</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Instalacion */}
            <section id="instalacion" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">8. Instalacion y Configuracion</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                <div className="rounded-lg bg-gray-900 p-4 text-sm">
                  <p className="text-gray-400"># 1. Clonar repositorio</p>
                  <code className="text-green-400">git clone https://github.com/CarlosTorres6969/proyecto_ing.git</code>
                  <p className="mt-4 text-gray-400"># 2. Instalar dependencias</p>
                  <code className="text-green-400">cd proyecto_ing && npm install</code>
                  <p className="mt-4 text-gray-400"># 3. Configurar variables de entorno</p>
                  <code className="text-green-400">cp .env.example .env.local</code>
                  <p className="mt-4 text-gray-400"># 4. Ejecutar migraciones de base de datos</p>
                  <code className="text-green-400">sqlcmd -S servidor -d base -i schema.sql</code>
                  <p className="mt-4 text-gray-400"># 5. Iniciar servidor de desarrollo</p>
                  <code className="text-green-400">npm run dev</code>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">Variables de Entorno Requeridas</h4>
                  <table className="mt-3 w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="py-2 font-mono text-blue-600">DB_SERVER</td><td className="py-2">Servidor SQL Server</td></tr>
                      <tr><td className="py-2 font-mono text-blue-600">DB_NAME</td><td className="py-2">Nombre de la base de datos</td></tr>
                      <tr><td className="py-2 font-mono text-blue-600">DB_USER</td><td className="py-2">Usuario de base de datos</td></tr>
                      <tr><td className="py-2 font-mono text-blue-600">DB_PASSWORD</td><td className="py-2">Contrasena de base de datos</td></tr>
                      <tr><td className="py-2 font-mono text-blue-600">JWT_SECRET</td><td className="py-2">Clave secreta para tokens</td></tr>
                      <tr><td className="py-2 font-mono text-blue-600">CLOUDINARY_URL</td><td className="py-2">URL de Cloudinary</td></tr>
                      <tr><td className="py-2 font-mono text-blue-600">PAYPAL_CLIENT_ID</td><td className="py-2">Client ID de PayPal</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Footer del manual */}
            <div className="rounded-xl bg-gray-900 p-6 text-center text-white">
              <p className="text-lg font-semibold">TecnoWorld - Sistema de E-commerce Multi-tienda</p>
              <p className="mt-1 text-gray-400">Documento de Requerimientos Tecnicos v1.0</p>
              <p className="mt-2 text-sm text-gray-500">Proyecto de Ingenieria de Software - 2024</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
