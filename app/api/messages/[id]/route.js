import { deleteMessageAndFollowing } from '../../../../backend/services/chatService.js';
import { auth, unauthorized, serverError, success } from '../../_utils.js';

export async function DELETE(request, { params }) {
  try {
    if (!auth(request)) return unauthorized();
    const { id } = await params;
    return success(await deleteMessageAndFollowing(id));
  } catch (error) {
    return serverError(error);
  }
}
