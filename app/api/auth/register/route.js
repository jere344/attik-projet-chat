import { NextResponse } from 'next/server';
import { createUser, generateToken } from '../../../../backend/services/authService.js';
import { validateAuthFields } from '../../_utils.js';

export async function POST(request) {
  try {
    const { email, password } = await validateAuthFields(request);

    const user = await createUser(email, password);
    return NextResponse.json({ token: generateToken(user), user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
