import { NextResponse } from 'next/server';

export function successResponse(data: unknown, message?: string) {
  return NextResponse.json({ success: true, message, data }, { status: 200 });
}

export function createdResponse(data: unknown, message?: string) {
  return NextResponse.json({ success: true, message, data }, { status: 201 });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}
