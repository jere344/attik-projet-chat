import { NextResponse } from 'next/server';
import { validateUser, generateToken } from '../../../../backend/services/authService.js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const user = await validateUser(email.toLowerCase(), password);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = generateToken(user);
    return NextResponse.json({ token, user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
