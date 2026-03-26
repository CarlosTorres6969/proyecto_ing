import { NextRequest } from 'next/server';
import { getConnection, sql } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/lib/api-response';

// GET /api/roles
export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM roles ORDER BY id');
    return successResponse(result.recordset);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return errorResponse('Error al obtener los roles');
  }
}

// POST /api/roles  — body: { nombre }
export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();
    if (!nombre) return errorResponse('nombre es requerido', 400);
    const pool = await getConnection();
    const result = await pool.request().input('nombre', sql.NVarChar, nombre).query('INSERT INTO roles (nombre) OUTPUT INSERTED.* VALUES (@nombre)');
    return createdResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error creating rol:', error);
    return errorResponse('Error al crear el rol');
  }
}

// PUT /api/roles  — body: { id, nombre }
export async function PUT(request: NextRequest) {
  try {
    const { id, nombre } = await request.json();
    if (!id || !nombre) return errorResponse('id y nombre son requeridos', 400);
    const pool = await getConnection();
    const result = await pool.request().input('id', sql.BigInt, id).input('nombre', sql.NVarChar, nombre).query('UPDATE roles SET nombre = @nombre OUTPUT INSERTED.* WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse('Rol no encontrado', 404);
    return successResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error updating rol:', error);
    return errorResponse('Error al actualizar el rol');
  }
}

// DELETE /api/roles?id=1
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('id es requerido', 400);
    const pool = await getConnection();
    const result = await pool.request().input('id', sql.BigInt, id).query('DELETE FROM roles OUTPUT DELETED.id WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse('Rol no encontrado', 404);
    return successResponse({ message: 'Rol eliminado' });
  } catch (error) {
    console.error('Error deleting rol:', error);
    return errorResponse('Error al eliminar el rol');
  }
}
