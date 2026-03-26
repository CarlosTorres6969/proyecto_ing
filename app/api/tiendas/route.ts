import { NextRequest } from 'next/server';
import { getConnection, sql } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/lib/api-response';

// GET /api/tiendas | ?id=1
export async function GET(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    const pool = await getConnection();
    if (id) {
      const result = await pool.request().input('id', sql.BigInt, id).query('SELECT * FROM tiendas WHERE id = @id');
      if (result.recordset.length === 0) return errorResponse('Tienda no encontrada', 404);
      return successResponse(result.recordset[0]);
    }
    const result = await pool.request().query('SELECT * FROM tiendas ORDER BY nombre');
    return successResponse(result.recordset);
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    return errorResponse('Error al obtener las tiendas');
  }
}

// POST /api/tiendas  — body: { nombre, ciudad? }
export async function POST(request: NextRequest) {
  try {
    const { nombre, ciudad } = await request.json();
    if (!nombre) return errorResponse('nombre es requerido', 400);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('nombre', sql.NVarChar, nombre)
      .input('ciudad', sql.NVarChar, ciudad ?? null)
      .query('INSERT INTO tiendas (nombre, ciudad) OUTPUT INSERTED.* VALUES (@nombre, @ciudad)');
    return createdResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error creating tienda:', error);
    return errorResponse('Error al crear la tienda');
  }
}

// PUT /api/tiendas  — body: { id, nombre?, ciudad? }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return errorResponse('id es requerido', 400);

    const pool = await getConnection();
    const req = pool.request().input('id', sql.BigInt, id);
    const sets: string[] = [];

    if (body.nombre !== undefined) { req.input('nombre', sql.NVarChar, body.nombre); sets.push('nombre = @nombre'); }
    if (body.ciudad !== undefined) { req.input('ciudad', sql.NVarChar, body.ciudad ?? null); sets.push('ciudad = @ciudad'); }

    if (sets.length === 0) return errorResponse('Nada que actualizar', 400);

    const result = await req.query(`UPDATE tiendas SET ${sets.join(', ')} OUTPUT INSERTED.* WHERE id = @id`);
    if (result.recordset.length === 0) return errorResponse('Tienda no encontrada', 404);
    return successResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error updating tienda:', error);
    return errorResponse('Error al actualizar la tienda');
  }
}

// DELETE /api/tiendas?id=1
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('id es requerido', 400);
    const pool = await getConnection();
    const result = await pool.request().input('id', sql.BigInt, id).query('DELETE FROM tiendas OUTPUT DELETED.id WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse('Tienda no encontrada', 404);
    return successResponse({ message: 'Tienda eliminada' });
  } catch (error) {
    console.error('Error deleting tienda:', error);
    return errorResponse('Error al eliminar la tienda');
  }
}
