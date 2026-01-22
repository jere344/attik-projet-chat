import prisma from '../lib/prisma.js';
import { getCVAIResponse } from './groqService.js';

const toInt = (id) => parseInt(id, 10);

// CV Profile functions
export const getCVProfile = async (userId) => {
  let profile = await prisma.cVProfile.findUnique({ where: { userId: toInt(userId) } });
  if (!profile) {
    profile = await prisma.cVProfile.create({ data: { userId: toInt(userId) } });
  }
  return profile;
};

export const updateCVProfile = (userId, content) =>
  prisma.cVProfile.upsert({
    where: { userId: toInt(userId) },
    update: { content },
    create: { userId: toInt(userId), content },
  });

// CV Company functions
export const getAllCVCompanies = (userId) =>
  prisma.cVCompany.findMany({
    where: { userId: toInt(userId) },
    orderBy: { updatedAt: 'desc' },
  });

export const getCVCompany = (id, userId) =>
  prisma.cVCompany.findFirst({
    where: { id: toInt(id), userId: toInt(userId) },
  });

export const createCVCompany = (userId, name = 'Nouvelle entreprise') =>
  prisma.cVCompany.create({ data: { userId: toInt(userId), name } });

export const updateCVCompany = (id, userId, data) =>
  prisma.cVCompany.updateMany({
    where: { id: toInt(id), userId: toInt(userId) },
    data,
  }).then(() => getCVCompany(id, userId));

export const deleteCVCompany = (id, userId) =>
  prisma.cVCompany.deleteMany({ where: { id: toInt(id), userId: toInt(userId) } });

// CV Generation with AI
const CV_SYSTEM_PROMPT = `Tu es un assistant expert en rédaction de CV et lettres de motivation.

RÈGLES STRICTES:
1. Tu DOIS TOUJOURS répondre avec UNIQUEMENT un objet JSON valide
2. Tu DOIS TOUJOURS fournir une lettre de motivation complète dans "letter"
3. Tu DOIS TOUJOURS fournir les données CV complètes dans "cvData"
4. Si des informations manquent, INVENTE des valeurs plausibles basées sur le contexte
5. N'écris JAMAIS de texte en dehors du JSON
6. Utilise \\n pour les sauts de ligne dans la lettre

FORMAT JSON OBLIGATOIRE (une seule ligne, pas de retours à la ligne):
{"message":"Ton message","letter":"Objet: Candidature...\\n\\nMadame, Monsieur,...","cvData":{"fullName":"Nom","title":"Titre","email":"email@example.com","phone":"0600000000","location":"Ville","summary":"Résumé","experience":[{"company":"Entreprise","position":"Poste","period":"2020-2023","description":"Description"}],"education":[{"school":"École","degree":"Diplôme","period":"2016-2020"}],"skills":["Skill1","Skill2"],"languages":["Français (natif)"]}}

Adapte le CV et la lettre au poste. Mets en avant les compétences pertinentes.`;

export async function processCV(userMessage, company, cvProfile) {
  const chatHistory = Array.isArray(company.chatHistory) ? company.chatHistory : [];
  
  // Build context for AI
  const systemMessage = {
    role: 'system',
    content: CV_SYSTEM_PROMPT,
  };
  
  const contextMessage = {
    role: 'user',
    content: `Voici les informations de base:

=== MON CV PERSONNEL ===
${cvProfile.content || 'Aucune information fournie'}

=== OFFRE D'EMPLOI ===
${company.positionInfo || 'Aucune offre fournie'}

=== LETTRE ACTUELLE ===
${company.generatedLetter || 'Aucune lettre générée'}

=== CV ACTUEL (JSON) ===
${JSON.stringify(company.generatedCV, null, 2)}

Maintenant, voici ma demande: ${userMessage}`,
  };

  // Include chat history for context
  const messages = [
    systemMessage,
    ...chatHistory.slice(-10), // Keep last 10 messages for context
    contextMessage,
  ];

  const aiResponse = await getCVAIResponse(messages);
  
  // Parse AI response - try multiple strategies
  let parsed = { message: '', letter: '', cvData: {} };
  
  try {
    // Strategy 1: Try to parse the entire response as JSON
    parsed = JSON.parse(aiResponse);
  } catch {
    try {
      // Strategy 2: Try to find and parse a JSON block
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        // Strategy 3: Try to find JSON object pattern
        const objectMatch = aiResponse.match(/\{[\s\S]*"message"[\s\S]*"letter"[\s\S]*"cvData"[\s\S]*\}/);
        if (objectMatch) {
          // Clean up common issues: fix missing commas, trailing commas
          let cleanJson = objectMatch[0]
            .replace(/"\s*\n\s*"/g, '",\n"') // Add missing commas between string fields
            .replace(/}\s*\n\s*"/g, '},\n"') // Add missing commas after objects
            .replace(/]\s*\n\s*"/g, '],\n"') // Add missing commas after arrays
            .replace(/,\s*}/g, '}') // Remove trailing commas before }
            .replace(/,\s*]/g, ']'); // Remove trailing commas before ]
          parsed = JSON.parse(cleanJson);
        }
      }
    } catch {
      // Strategy 4: Extract parts manually using regex
      const messageMatch = aiResponse.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      const letterMatch = aiResponse.match(/"letter"\s*:\s*"((?:[^"\\]|\\[\s\S])*)"/s);
      
      parsed = {
        message: messageMatch ? messageMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : aiResponse,
        letter: letterMatch ? letterMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : company.generatedLetter,
        cvData: company.generatedCV,
      };
      
      // Try to extract cvData separately
      try {
        const cvDataMatch = aiResponse.match(/"cvData"\s*:\s*(\{[\s\S]*?\})\s*\}/);
        if (cvDataMatch) {
          parsed.cvData = JSON.parse(cvDataMatch[1] + '}');
        }
      } catch {}
    }
  }

  // Ensure we have valid data
  parsed.message = parsed.message || aiResponse;
  parsed.letter = parsed.letter || company.generatedLetter || '';
  parsed.cvData = (parsed.cvData && typeof parsed.cvData === 'object') ? parsed.cvData : (company.generatedCV || {});

  // Update chat history
  const newHistory = [
    ...chatHistory,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: parsed.message },
  ];

  // Update company with new data
  const updatedCompany = await prisma.cVCompany.update({
    where: { id: company.id },
    data: {
      chatHistory: newHistory,
      generatedLetter: parsed.letter || company.generatedLetter,
      generatedCV: parsed.cvData || company.generatedCV,
    },
  });

  return {
    message: parsed.message,
    letter: updatedCompany.generatedLetter,
    cvData: updatedCompany.generatedCV,
    chatHistory: newHistory,
  };
}

// Initial CV generation (when position info is first filled)
export async function generateInitialCV(company, cvProfile) {
  return processCV(
    'Génère-moi une lettre de motivation et adapte mon CV pour ce poste. Analyse bien l\'offre d\'emploi et mets en avant les compétences pertinentes.',
    company,
    cvProfile
  );
}
