import { getCVCompany, getCVProfile, processCV, generateInitialCV } from '../../../../../../backend/services/cvService.js';
import { auth, unauthorized, notFound, badRequest, serverError, success } from '../../../../_utils.js';

export async function POST(request, { params }) {
  try {
    const user = auth(request);
    if (!user) return unauthorized();
    
    const { id } = await params;
    const { message, generateInitial } = await request.json();
    
    const company = await getCVCompany(id, user.sub);
    if (!company) return notFound('Company not found');
    
    if (!company.positionInfo?.trim()) {
      return badRequest('Position information is required before chatting');
    }
    
    const cvProfile = await getCVProfile(user.sub);
    
    let result;
    if (generateInitial) {
      result = await generateInitialCV(company, cvProfile);
    } else {
      if (!message?.trim()) return badRequest('Message cannot be empty');
      result = await processCV(message.trim(), company, cvProfile);
    }
    
    return success(result);
  } catch (error) {
    return serverError(error);
  }
}
