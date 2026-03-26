// Tipos base que coinciden con el schema de la BD

export interface Rol {
  id: number;
  nombre: string;
  creado_en: string;
}

export interface Usuario {
  id: number;
  id_rol: number;
  correo: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  creado_en: string;
  actualizado_en: string;
  rol_nombre?: string;
}

export interface DireccionUsuario {
  id: number;
  id_usuario: number;
  direccion_linea1: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigo_postal: string;
  es_direccion_envio_predeterminada: boolean;
  creado_en: string;
  actualizado_en: string;
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface Categoria {
  id: number;
  id_categoria_padre?: number;
  nombre: string;
  slug: string;
  nombre_categoria_padre?: string;
}

export interface Producto {
  id: number;
  id_marca: number;
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  creado_en: string;
  nombre_marca?: string;
  nombre_categoria?: string;
}

export interface VarianteProducto {
  id: number;
  id_producto: number;
  sku: string;
  nombre_variante?: string;
  precio: number;
  precio_oferta?: number;
  activo: boolean;
  nombre_producto?: string;
}

export interface ImagenProducto {
  id: number;
  id_variante: number;
  url: string;
  cloudinary_public_id?: string;
}

export interface Tienda {
  id: number;
  nombre: string;
  ciudad?: string;
}

export interface NivelStock {
  id_variante: number;
  id_tienda: number;
  cantidad: number;
}

export interface CarritoCompra {
  id: number;
  id_usuario: number;
}

export interface ItemCarrito {
  id: number;
  id_carrito: number;
  id_variante: number;
  cantidad: number;
  sku?: string;
  nombre_variante?: string;
  precio?: number;
  precio_oferta?: number;
  nombre_producto?: string;
}

export interface Carrito {
  carrito: CarritoCompra;
  items: ItemCarrito[];
  total: number;
}

export interface Pedido {
  id: number;
  id_usuario: number;
  estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';
  monto_total: number;
  creado_en: string;
  items?: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  id_pedido: number;
  id_variante: number;
  cantidad: number;
  precio_unitario: number;
  sku?: string;
  nombre_variante?: string;
  nombre_producto?: string;
}

export interface Pago {
  id: number;
  id_pedido: number;
  monto: number;
  metodo_pago: string;
  estado: string;
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth
export interface AuthResponse {
  usuario: Usuario;
  token: string;
}

export interface LoginCredentials {
  correo: string;
  contrasena: string;
}

export interface RegisterData {
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  id_rol?: number;
}

// Producto con variantes para mostrar en tienda
export interface ProductoConVariantes extends Producto {
  variantes: VarianteProducto[];
  imagenes?: ImagenProducto[];
}
