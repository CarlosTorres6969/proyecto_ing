import { NextRequest } from 'next/server';
import { getConnection, sql } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/lib/api-response';

// GET /api/marcas | ?id=1
export async function GET(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    const pool = await getConnection();
    if (id) {
      const result = await pool.request().input('id', sql.BigInt, id).query('SELECT * FROM marcas WHERE id = @id');
      if (result.recordset.length === 0) return errorResponse('Marca no encontrada', 404);
      return successResponse(result.recordset[0]);
    }
    const result = await pool.request().query('SELECT * FROM marcas ORDER BY nombre');
    return successResponse(result.recordset);
  } catch (error) {
    console.error('Error fetching marcas:', error);
    return errorResponse('Error al obtener las marcas');
  }
}

// POST /api/marcas  — body: { nombre }
export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();
    if (!nombre) return errorResponse('nombre es requerido', 400);
    const pool = await getConnection();
    const result = await pool.request().input('nombre', sql.NVarChar, nombre).query('INSERT INTO marcas (nombre) OUTPUT INSERTED.* VALUES (@nombre)');
    return createdResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error creating marca:', error);
    return errorResponse('Error al crear la marca');
  }
}

// PUT /api/marcas  — body: { id, nombre }
export async function PUT(request: NextRequest) {
  try {
    const { id, nombre } = await request.json();
    if (!id || !nombre) return errorResponse('id y nombre son requeridos', 400);
    const pool = await getConnection();
    const result = await pool.request().input('id', sql.BigInt, id).input('nombre', sql.NVarChar, nombre).query('UPDATE marcas SET nombre = @nombre OUTPUT INSERTED.* WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse('Marca no encontrada', 404);
    return successResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error updating marca:', error);
    return errorResponse('Error al actualizar la marca');
  }
}

// DELETE /api/marcas?id=1
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('id es requerido', 400);
    const pool = await getConnection();
    const result = await pool.request().input('id', sql.BigInt, id).query('DELETE FROM marcas OUTPUT DELETED.id WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse('Marca no encontrada', 404);
    return successResponse({ message: 'Marca eliminada' });
  } catch (error) {
    console.error('Error deleting marca:', error);
    return errorResponse('Error al eliminar la marca');
  }
}
