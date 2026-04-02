'use client';

import Link from 'next/link';
import { useState } from 'react';

const secciones = [
  { id: 'intro', titulo: 'Introduccion' },
  { id: 'registro', titulo: 'Registro e Inicio de Sesion' },
  { id: 'navegacion', titulo: 'Navegacion en la Tienda' },
  { id: 'carrito', titulo: 'Carrito de Compras' },
  { id: 'checkout', titulo: 'Proceso de Compra' },
  { id: 'pedidos', titulo: 'Mis Pedidos' },
  { id: 'admin', titulo: 'Panel de Administracion' },
  { id: 'cajero', titulo: 'Sistema de Cajero' },
  { id: 'faq', titulo: 'Preguntas Frecuentes' },
];

export default function ManualUsuarioPage() {
  const [seccionActiva, setSeccionActiva] = useState('intro');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manual de Usuario</h1>
              <p className="mt-1 text-gray-400">Guia completa para usar TecnoWorld</p>
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
            <section id="intro" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">1. Introduccion</h2>
              <div className="mt-4 space-y-4 text-gray-600">
                <p>
                  Bienvenido a <strong>TecnoWorld</strong>, tu tienda de tecnologia en linea. Este manual 
                  te guiara a traves de todas las funcionalidades del sistema para que puedas realizar 
                  tus compras de manera facil y segura.
                </p>
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-900">Que puedes hacer en TecnoWorld?</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-blue-800">
                    <li>Explorar nuestro catalogo de productos tecnologicos</li>
                    <li>Agregar productos a tu carrito de compras</li>
                    <li>Realizar compras seguras con PayPal</li>
                    <li>Dar seguimiento a tus pedidos</li>
                    <li>Administrar tu cuenta y direcciones</li>
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="mt-2 font-medium">Compra Segura</p>
                    <p className="text-sm text-gray-500">Pagos protegidos con PayPal</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="mt-2 font-medium">Envio Rapido</p>
                    <p className="text-sm text-gray-500">Entrega a domicilio</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <p className="mt-2 font-medium">Multiples Tiendas</p>
                    <p className="text-sm text-gray-500">Recoge en tienda fisica</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Registro */}
            <section id="registro" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">2. Registro e Inicio de Sesion</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">2.1 Crear una cuenta nueva</h3>
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <ol className="list-inside list-decimal space-y-3">
                      <li>
                        <span className="font-medium">Accede a la pagina de registro</span>
                        <p className="ml-6 text-sm text-gray-500">Haz clic en &quot;Registrarse&quot; en la esquina superior derecha</p>
                      </li>
                      <li>
                        <span className="font-medium">Completa el formulario</span>
                        <ul className="ml-6 mt-1 list-inside list-disc text-sm text-gray-500">
                          <li>Nombre y apellido</li>
                          <li>Correo electronico valido</li>
                          <li>Contrasena (minimo 8 caracteres)</li>
                          <li>Numero de telefono (opcional)</li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-medium">Confirma tu registro</span>
                        <p className="ml-6 text-sm text-gray-500">Haz clic en el boton &quot;Crear cuenta&quot;</p>
                      </li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">2.2 Iniciar sesion</h3>
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <ol className="list-inside list-decimal space-y-2">
                      <li>Haz clic en &quot;Iniciar sesion&quot; en el menu superior</li>
                      <li>Ingresa tu correo electronico y contrasena</li>
                      <li>Haz clic en &quot;Entrar&quot;</li>
                    </ol>
                  </div>
                </div>

                <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <p className="font-semibold text-yellow-800">Consejo de seguridad</p>
                  <p className="mt-1 text-sm text-yellow-700">
                    Nunca compartas tu contrasena con nadie. Si olvidas tu contrasena, 
                    utiliza la opcion &quot;Recuperar contrasena&quot; para restablecerla.
                  </p>
                </div>
              </div>
            </section>

            {/* Navegacion */}
            <section id="navegacion" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">3. Navegacion en la Tienda</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">3.1 Pagina Principal</h3>
                  <p className="mt-2">La pagina principal muestra:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 ml-4">
                    <li><strong>Banner principal:</strong> Promociones y ofertas destacadas</li>
                    <li><strong>Categorias:</strong> Acceso rapido a las secciones del catalogo</li>
                    <li><strong>Productos destacados:</strong> Articulos recomendados</li>
                    <li><strong>Nuestras tiendas:</strong> Ubicaciones fisicas disponibles</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">3.2 Explorar Productos</h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-medium text-gray-900">Por Categoria</h4>
                      <p className="mt-1 text-sm">Navega por el menu de categorias para encontrar productos especificos como laptops, smartphones, accesorios, etc.</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-medium text-gray-900">Busqueda</h4>
                      <p className="mt-1 text-sm">Usa la barra de busqueda para encontrar productos por nombre, marca o caracteristicas.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">3.3 Pagina de Producto</h3>
                  <p className="mt-2">Al hacer clic en un producto podras ver:</p>
                  <div className="mt-3 rounded-lg border border-gray-200 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="font-medium">Informacion del producto</p>
                        <ul className="mt-1 list-inside list-disc text-sm text-gray-500">
                          <li>Imagenes del producto</li>
                          <li>Nombre y descripcion</li>
                          <li>Precio y ofertas</li>
                          <li>Especificaciones tecnicas</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">Opciones de compra</p>
                        <ul className="mt-1 list-inside list-disc text-sm text-gray-500">
                          <li>Seleccion de variante (color, capacidad)</li>
                          <li>Cantidad deseada</li>
                          <li>Disponibilidad en tiendas</li>
                          <li>Boton &quot;Agregar al carrito&quot;</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Carrito */}
            <section id="carrito" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">4. Carrito de Compras</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">4.1 Agregar productos</h3>
                  <ol className="mt-3 list-inside list-decimal space-y-2 ml-4">
                    <li>Navega al producto que deseas comprar</li>
                    <li>Selecciona la variante si aplica (color, tamano, etc.)</li>
                    <li>Indica la cantidad deseada</li>
                    <li>Haz clic en &quot;Agregar al carrito&quot;</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">4.2 Ver y editar el carrito</h3>
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <p>Haz clic en el icono del carrito en la esquina superior derecha para:</p>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      <li><strong>Ver productos:</strong> Lista de articulos agregados</li>
                      <li><strong>Modificar cantidad:</strong> Usa los botones + y -</li>
                      <li><strong>Eliminar productos:</strong> Haz clic en el icono de eliminar</li>
                      <li><strong>Ver subtotal:</strong> Total parcial de tu compra</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">4.3 Cupones de descuento</h3>
                  <div className="mt-3 rounded-lg border-l-4 border-green-400 bg-green-50 p-4">
                    <p className="text-green-800">
                      Si tienes un codigo de cupon, ingresalo en el campo &quot;Codigo de descuento&quot; 
                      antes de proceder al pago. El descuento se aplicara automaticamente.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Checkout */}
            <section id="checkout" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">5. Proceso de Compra (Checkout)</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                
                <div className="rounded-lg bg-gray-900 p-6 text-white">
                  <h3 className="text-lg font-semibold">Pasos para completar tu compra</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    {[
                      { paso: '1', titulo: 'Revisar', desc: 'Confirma los productos' },
                      { paso: '2', titulo: 'Direccion', desc: 'Indica donde enviar' },
                      { paso: '3', titulo: 'Pago', desc: 'Elige metodo de pago' },
                      { paso: '4', titulo: 'Confirmar', desc: 'Finaliza la orden' },
                    ].map((p) => (
                      <div key={p.paso} className="text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 font-bold">
                          {p.paso}
                        </div>
                        <p className="mt-2 font-medium">{p.titulo}</p>
                        <p className="text-sm text-gray-400">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">5.1 Direccion de envio</h3>
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <p>Puedes seleccionar una direccion guardada o agregar una nueva:</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li>Direccion completa</li>
                      <li>Ciudad y estado</li>
                      <li>Codigo postal</li>
                      <li>Telefono de contacto</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">5.2 Metodo de pago</h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <span className="text-xl font-bold text-blue-600">P</span>
                        </div>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-gray-500">Pago seguro en linea</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                          <span className="text-xl font-bold text-green-600">$</span>
                        </div>
                        <div>
                          <p className="font-medium">Efectivo</p>
                          <p className="text-sm text-gray-500">Pago en tienda fisica</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">5.3 Confirmacion del pedido</h3>
                  <p className="mt-2">
                    Una vez completado el pago, recibiras un numero de pedido y podras dar 
                    seguimiento a tu orden desde la seccion &quot;Mis Pedidos&quot;.
                  </p>
                </div>
              </div>
            </section>

            {/* Pedidos */}
            <section id="pedidos" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">6. Mis Pedidos</h2>
              <div className="mt-4 space-y-6 text-gray-600">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">6.1 Ver historial de pedidos</h3>
                  <p className="mt-2">
                    Accede a &quot;Mi Cuenta&quot; y luego a &quot;Mis Pedidos&quot; para ver todos tus pedidos.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">6.2 Estados del pedido</h3>
                  <div className="mt-3 space-y-2">
                    {[
                      { estado: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', desc: 'Esperando confirmacion de pago' },
                      { estado: 'Pagado', color: 'bg-blue-100 text-blue-800', desc: 'Pago recibido, preparando envio' },
                      { estado: 'Enviado', color: 'bg-purple-100 text-purple-800', desc: 'En camino a tu direccion' },
                      { estado: 'Entregado', color: 'bg-green-100 text-green-800', desc: 'Pedido completado' },
                      { estado: 'Cancelado', color: 'bg-red-100 text-red-800', desc: 'Pedido cancelado' },
                    ].map((e) => (
                      <div key={e.estado} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${e.color}`}>
                          {e.estado}
                        </span>
                        <span className="text-sm">{e.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">6.3 Solicitar devolucion</h3>
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <ol className="list-inside list-decimal space-y-2">
                      <li>Ve al detalle del pedido entregado</li>
                      <li>Haz clic en &quot;Solicitar devolucion&quot;</li>
                      <li>Indica el motivo de la devolucion</li>
                      <li>Espera la aprobacion del equipo</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Admin */}
            <section id="admin" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">7. Panel de Administracion</h2>
              <p className="mt-2 text-gray-600">(Solo para usuarios con rol de Administrador)</p>
              
              <div className="mt-6 space-y-6 text-gray-600">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900">Gestion de Productos</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li>Crear, editar y eliminar productos</li>
                      <li>Gestionar variantes y precios</li>
                      <li>Subir imagenes de productos</li>
                      <li>Organizar por categorias y marcas</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900">Gestion de Pedidos</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li>Ver todos los pedidos</li>
                      <li>Actualizar estados</li>
                      <li>Procesar devoluciones</li>
                      <li>Ver estadisticas de ventas</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900">Gestion de Inventario</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li>Controlar stock por tienda</li>
                      <li>Ajustar cantidades</li>
                      <li>Transferir entre tiendas</li>
                      <li>Alertas de stock bajo</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-gray-900">Gestion de Usuarios</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      <li>Ver lista de usuarios</li>
                      <li>Asignar roles</li>
                      <li>Gestionar tiendas</li>
                      <li>Configurar cupones</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-900 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Acceso:</strong> Inicia sesion con una cuenta de administrador 
                    y accede a <code className="rounded bg-gray-800 px-2 py-0.5">/admin</code>
                  </p>
                </div>
              </div>
            </section>

            {/* Cajero */}
            <section id="cajero" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">8. Sistema de Cajero (POS)</h2>
              <p className="mt-2 text-gray-600">(Solo para usuarios con rol de Cajero)</p>
              
              <div className="mt-6 space-y-6 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">8.1 Realizar una venta</h3>
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <ol className="list-inside list-decimal space-y-3">
                      <li>
                        <span className="font-medium">Buscar productos</span>
                        <p className="ml-6 text-sm text-gray-500">Usa el buscador o selecciona de la cuadricula de productos</p>
                      </li>
                      <li>
                        <span className="font-medium">Agregar al carrito</span>
                        <p className="ml-6 text-sm text-gray-500">Haz clic en el producto para agregarlo</p>
                      </li>
                      <li>
                        <span className="font-medium">Ajustar cantidades</span>
                        <p className="ml-6 text-sm text-gray-500">Usa los botones + y - en el resumen</p>
                      </li>
                      <li>
                        <span className="font-medium">Procesar pago</span>
                        <p className="ml-6 text-sm text-gray-500">Haz clic en &quot;Cobrar&quot; para completar la venta</p>
                      </li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">8.2 Funciones adicionales</h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900">Gestion de Stock</h4>
                      <p className="mt-1 text-sm text-gray-500">Consulta y ajusta el inventario de tu tienda</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900">Historial de Ventas</h4>
                      <p className="mt-1 text-sm text-gray-500">Ver pedidos procesados durante tu turno</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-900 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Acceso:</strong> Inicia sesion con una cuenta de cajero 
                    y accede a <code className="rounded bg-gray-800 px-2 py-0.5">/cajero</code>
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">9. Preguntas Frecuentes</h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    pregunta: 'Como puedo recuperar mi contrasena?',
                    respuesta: 'Haz clic en "Olvidaste tu contrasena?" en la pagina de inicio de sesion e ingresa tu correo para recibir instrucciones.',
                  },
                  {
                    pregunta: 'Cuanto tiempo tarda el envio?',
                    respuesta: 'El tiempo de envio depende de tu ubicacion. Generalmente entre 3-7 dias habiles para envios nacionales.',
                  },
                  {
                    pregunta: 'Puedo cancelar un pedido?',
                    respuesta: 'Si, puedes cancelar un pedido mientras este en estado "Pendiente". Una vez pagado, deberas solicitar una devolucion.',
                  },
                  {
                    pregunta: 'Como aplico un cupon de descuento?',
                    respuesta: 'En el carrito de compras, ingresa el codigo del cupon en el campo "Codigo de descuento" y haz clic en "Aplicar".',
                  },
                  {
                    pregunta: 'Que metodos de pago aceptan?',
                    respuesta: 'Aceptamos PayPal para compras en linea y efectivo para compras en tienda fisica.',
                  },
                ].map((faq, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900">{faq.pregunta}</h4>
                    <p className="mt-2 text-sm text-gray-600">{faq.respuesta}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="font-semibold text-blue-900">Necesitas mas ayuda?</p>
                <p className="mt-1 text-sm text-blue-700">
                  Contactanos a traves de nuestras redes sociales o visitanos en cualquiera de nuestras tiendas fisicas.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="rounded-xl bg-gray-900 p-6 text-center text-white">
              <p className="text-lg font-semibold">TecnoWorld - Manual de Usuario</p>
              <p className="mt-1 text-gray-400">Version 1.0 - Tu tienda de tecnologia online</p>
              <p className="mt-2 text-sm text-gray-500">Proyecto de Ingenieria de Software - 2024</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
