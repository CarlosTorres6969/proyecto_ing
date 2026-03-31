import { NextRequest } from 'next/server';
import { getConnection, sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, createdResponse, authError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const pool = await getConnection();
    if (id) {
      const result = await pool.request().input('id', sql.BigInt, id)
        .query(`SELECT p.*, m.nombre as nombre_marca, c.nombre as nombre_categoria,
          (SELECT TOP 1 ip.url FROM imagenes_producto ip
           JOIN variantes_producto vp ON ip.id_variante = vp.id
           WHERE vp.id_producto = p.id ORDER BY ip.orden ASC) as imagen_url
          FROM productos p JOIN marcas m ON p.id_marca = m.id JOIN categorias c ON p.id_categoria = c.id WHERE p.id = @id`);
      if (result.recordset.length === 0) return errorResponse('Producto no encontrado', 404);
      return successResponse(result.recordset[0]);
    }
    const req = pool.request();
    let query = `SELECT p.*, m.nombre as nombre_marca, c.nombre as nombre_categoria,
      (SELECT TOP 1 ip.url FROM imagenes_producto ip
       JOIN variantes_producto vp ON ip.id_variante = vp.id
       WHERE vp.id_producto = p.id ORDER BY ip.orden ASC) as imagen_url
      FROM productos p JOIN marcas m ON p.id_marca = m.id JOIN categorias c ON p.id_categoria = c.id WHERE 1=1`;
    const id_categoria = searchParams.get('id_categoria');
    const id_marca = searchParams.get('id_marca');
    const activo = searchParams.get('activo');
    if (id_categoria) { req.input('id_categoria', sql.BigInt, id_categoria); query += ' AND p.id_categoria = @id_categoria'; }
    if (id_marca)     { req.input('id_marca', sql.BigInt, id_marca);         query += ' AND p.id_marca = @id_marca'; }
    if (activo !== null) { req.input('activo', sql.Bit, activo === 'true' ? 1 : 0); query += ' AND p.activo = @activo'; }
    query += ' ORDER BY p.creado_en DESC';
    const result = await req.query(query);
    return successResponse(result.recordset);
  } catch (error) { console.error(error); return errorResponse('Error al obtener los productos'); }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const { id_marca, id_categoria, nombre, descripcion, activo } = await request.json();
    if (!id_marca || !id_categoria || !nombre) return errorResponse('id_marca, id_categoria y nombre son requeridos', 400);
    const pool = await getConnection();
    const result = await pool.request()
      .input('id_marca', sql.BigInt, id_marca)
      .input('id_categoria', sql.BigInt, id_categoria)
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion ?? null)
      .input('activo', sql.Bit, activo !== undefined ? (activo ? 1 : 0) : 1)
      .query('INSERT INTO productos (id_marca, id_categoria, nombre, descripcion, activo) OUTPUT INSERTED.* VALUES (@id_marca, @id_categoria, @nombre, @descripcion, @activo)');
    return createdResponse(result.recordset[0]);
  } catch (e) { const a = authError(e); if (a) return errorResponse(a, 403); return errorResponse('Error al crear el producto'); }
}

export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();
    const { id } = body;
    if (!id) return errorResponse('id es requerido', 400);
    const pool = await getConnection();
    const req = pool.request().input('id', sql.BigInt, id);
    const sets: string[] = [];
    if (body.id_marca !== undefined)     { req.input('id_marca', sql.BigInt, body.id_marca);         sets.push('id_marca = @id_marca'); }
    if (body.id_categoria !== undefined) { req.input('id_categoria', sql.BigInt, body.id_categoria); sets.push('id_categoria = @id_categoria'); }
    if (body.nombre !== undefined)       { req.input('nombre', sql.NVarChar, body.nombre);           sets.push('nombre = @nombre'); }
    if ('descripcion' in body)           { req.input('descripcion', sql.NVarChar, body.descripcion ?? null); sets.push('descripcion = @descripcion'); }
    if (body.activo !== undefined)       { req.input('activo', sql.Bit, body.activo ? 1 : 0);        sets.push('activo = @activo'); }
    if (sets.length === 0) return errorResponse('Nada que actualizar', 400);
    const result = await req.query(`UPDATE productos SET ${sets.join(', ')} OUTPUT INSERTED.* WHERE id = @id`);
    if (result.recordset.length === 0) return errorResponse('Producto no encontrado', 404);
    return successResponse(result.recordset[0]);
  } catch (e) { const a = authError(e); if (a) return errorResponse(a, 403); return errorResponse('Error al actualizar el producto'); }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('id es requerido', 400);
    const pool = await getConnection();
    // soft delete
    const result = await pool.request().input('id', sql.BigInt, id).query('UPDATE productos SET activo = 0 OUTPUT INSERTED.id WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse('Producto no encontrado', 404);
    return successResponse({ message: 'Producto desactivado' });
  } catch (e) { const a = authError(e); if (a) return errorResponse(a, 403); return errorResponse('Error al eliminar el producto'); }
}
