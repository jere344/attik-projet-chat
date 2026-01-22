import { getAllCVCompanies, createCVCompany } from '../../../../backend/services/cvService.js';
import { auth, unauthorized, serverError, success } from '../../_utils.js';

export async function GET(request) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    return success(await getAllCVCompanies(user.sub));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { name } = await request.json();
    return success(await createCVCompany(user.sub, name));
  } catch (error) {
    return serverError(error);
  }
}
