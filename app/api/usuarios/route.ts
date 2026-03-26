import { NextRequest } from 'next/server';
import { getConnection, sql } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

// GET /api/usuarios | ?id=1
export async function GET(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    const pool = await getConnection();
    if (id) {
      const result = await pool
        .request()
        .input('id', sql.BigInt, id)
        .query('SELECT id, id_rol, correo, nombre, apellido, telefono, creado_en, actualizado_en FROM usuarios WHERE id = @id');
      if (result.recordset.length === 0) return errorResponse('Usuario no encontrado', 404);
      return successResponse(result.recordset[0]);
    }
    const result = await pool.request().query('SELECT id, id_rol, correo, nombre, apellido, telefono, creado_en, actualizado_en FROM usuarios ORDER BY id');
    return successResponse(result.recordset);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return errorResponse('Error al obtener los usuarios');
  }
}

// POST /api/usuarios  — body: { id_rol, correo, contrasena, nombre, apellido, telefono? }
export async function POST(request: NextRequest) {
  try {
    const { id_rol, correo, contrasena, nombre, apellido, telefono } = await request.json();
    if (!id_rol || !correo || !contrasena || !nombre || !apellido) return errorResponse('Faltan campos requeridos', 400);

    const hash = await bcrypt.hash(contrasena, 10);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id_rol', sql.BigInt, id_rol)
      .input('correo', sql.NVarChar, correo)
      .input('hash_contrasena', sql.NVarChar, hash)
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('telefono', sql.NVarChar, telefono ?? null)
      .query('INSERT INTO usuarios (id_rol, correo, hash_contrasena, nombre, apellido, telefono) OUTPUT INSERTED.id, INSERTED.id_rol, INSERTED.correo, INSERTED.nombre, INSERTED.apellido, INSERTED.telefono, INSERTED.creado_en VALUES (@id_rol, @correo, @hash_contrasena, @nombre, @apellido, @telefono)');
    return createdResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error creating usuario:', error);
    return errorResponse('Error al crear el usuario');
  }
}

// PUT /api/usuarios  — body: { id, id_rol?, nombre?, apellido?, telefono?, contrasena? }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return errorResponse('id es requerido', 400);

    const pool = await getConnection();
    const req = pool.request().input('id', sql.BigInt, id);
    const sets: string[] = [];

    if (body.id_rol !== undefined)   { req.input('id_rol', sql.BigInt, body.id_rol);       sets.push('id_rol = @id_rol'); }
    if (body.nombre !== undefined)   { req.input('nombre', sql.NVarChar, body.nombre);     sets.push('nombre = @nombre'); }
    if (body.apellido !== undefined) { req.input('apellido', sql.NVarChar, body.apellido); sets.push('apellido = @apellido'); }
    if (body.telefono !== undefined) { req.input('telefono', sql.NVarChar, body.telefono ?? null); sets.push('telefono = @telefono'); }
    if (body.contrasena) {
      const hash = await bcrypt.hash(body.contrasena, 10);
      req.input('hash_contrasena', sql.NVarChar, hash);
      sets.push('hash_contrasena = @hash_contrasena');
    }

    if (sets.length === 0) return errorResponse('Nada que actualizar', 400);

    const result = await req.query(`UPDATE usuarios SET ${sets.join(', ')} OUTPUT INSERTED.id, INSERTED.id_rol, INSERTED.correo, INSERTED.nombre, INSERTED.apellido, INSERTED.telefono, INSERTED.actualizado_en WHERE id = @id`);
    if (result.recordset.length === 0) return errorResponse('Usuario no encontrado', 404);
    return successResponse(result.recordset[0]);
  } catch (error) {
    console.error('Error updating usuario:', error);
    return errorResponse('Error al actualizar el usuario');
  }
}

// DELETE /api/usuarios?id=1
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('id es requerido', 400);
    const pool = await getConnection();
    const result = await pool.request().input('id', sql.BigInt, id).query('DELETE FROM usuarios OUTPUT DELETED.id WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse('Usuario no encontrado', 404);
    return successResponse({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error deleting usuario:', error);
    return errorResponse('Error al eliminar el usuario');
  }
}
