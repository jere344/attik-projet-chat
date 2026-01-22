import { getCVProfile, updateCVProfile } from '../../../../backend/services/cvService.js';
import { auth, unauthorized, serverError, success } from '../../_utils.js';

export async function GET(request) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    return success(await getCVProfile(user.sub));
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { content } = await request.json();
    return success(await updateCVProfile(user.sub, content));
  } catch (error) {
    return serverError(error);
  }
}
