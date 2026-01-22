import { NextResponse } from 'next/server';
import { verifyToken } from '../../backend/services/authService.js';

// Auth helper - returns payload if valid, null if not
export function auth(request) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  return verifyToken(token);
}

// Response helpers
export const success = (data) => NextResponse.json(data);
export const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
export const badRequest = (msg) => NextResponse.json({ error: msg }, { status: 400 });
export const notFound = (msg) => NextResponse.json({ error: msg }, { status: 404 });
export const serverError = (err) => NextResponse.json({ error: err.message }, { status: 500 });
