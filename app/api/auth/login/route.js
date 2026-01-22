import { NextResponse } from 'next/server';
import { validateUser, generateToken } from '../../../../backend/services/authService.js';
import { validateAuthFields } from '../../_utils.js';

export async function POST(request) {
  try {
    const { email, password } = await validateAuthFields(request);

    const user = await validateUser(email, password);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    return NextResponse.json({ token: generateToken(user), user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
