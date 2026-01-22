import { getCVCompany, updateCVCompany, deleteCVCompany } from '../../../../../backend/services/cvService.js';
import { auth, unauthorized, notFound, serverError, success } from '../../../_utils.js';

export async function GET(request, { params }) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { id } = await params;
    const company = await getCVCompany(id, user.sub);
    if (!company) return notFound('Company not found');
    return success(company);
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { id } = await params;
    const data = await request.json();
    const company = await updateCVCompany(id, user.sub, data);
    if (!company) return notFound('Company not found');
    return success(company);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    const { id } = await params;
    await deleteCVCompany(id, user.sub);
    return success({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
