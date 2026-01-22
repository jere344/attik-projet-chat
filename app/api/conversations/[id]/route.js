import { getConversation, updateConversationTitle, deleteConversation } from '../../../../backend/services/chatService.js';
import { auth, unauthorized, badRequest, notFound, serverError, success } from '../../_utils.js';

export async function GET(request, { params }) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { id } = await params;
    const conversation = await getConversation(id, user.sub);
    if (!conversation) return notFound('Conversation not found');
    return success(conversation);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { id } = await params;
    const { title } = await request.json();
    if (!title?.trim()) return badRequest('Title cannot be empty');
    return success(await updateConversationTitle(id, title.trim()));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { id } = await params;
    await deleteConversation(id, user.sub);
    return success({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
