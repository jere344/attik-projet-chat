import { getAllConversations, createConversation } from '../../../backend/services/chatService.js';
import { auth, unauthorized, serverError, success } from '../_utils.js';

export async function GET(request) {
  try {
    if (!auth(request)) return unauthorized();
    return success(await getAllConversations());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request) {
  try {
    if (!auth(request)) return unauthorized();
    const { title = 'Nouvelle conversation' } = await request.json().catch(() => ({}));
    return success(await createConversation(title));
  } catch (error) {
    return serverError(error);
  }
}
