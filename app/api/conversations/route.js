import { getAllConversations, createConversation } from '../../../backend/services/chatService.js';
import { auth, unauthorized, serverError, success } from '../_utils.js';

export async function GET(request) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    return success(await getAllConversations(user.sub));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { title = 'Nouvelle conversation' } = await request.json().catch(() => ({}));
    return success(await createConversation(title, user.sub));
  } catch (error) {
    return serverError(error);
  }
}
