import { NextResponse } from 'next/server';
import { getAllMessages, processMessage } from '../../../backend/services/chatService.js';

export async function GET() {
  try {
    const messages = await getAllMessages();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const { userMessage, assistantMessage } = await processMessage(content.trim());

    return NextResponse.json({ userMessage, assistantMessage });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
