import { getMessagesByConversation, processMessage } from '../../../backend/services/chatService.js';
import { auth, unauthorized, badRequest, serverError, success } from '../_utils.js';

export async function GET(request) {
  try {
    if (!auth(request)) return unauthorized();
    const conversationId = new URL(request.url).searchParams.get('conversationId');
    if (!conversationId) return badRequest('conversationId is required');

    return success(await getMessagesByConversation(conversationId));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request) {
  try {
    if (!auth(request)) return unauthorized();
    const { content, conversationId } = await request.json();
    if (!content?.trim()) return badRequest('Message cannot be empty');
    if (!conversationId) return badRequest('conversationId is required');

    return success(await processMessage(content.trim(), conversationId));
  } catch (error) {
    return serverError(error);
  }
}
