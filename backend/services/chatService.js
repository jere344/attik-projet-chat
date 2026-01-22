import prisma from '../lib/prisma.js';
import { getAIResponse } from './groqService.js';

export async function getAllMessages() {
  return prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function createUserMessage(content) {
  return prisma.message.create({
    data: {
      content,
      role: 'user',
    },
  });
}

export async function createAssistantMessage(content) {
  return prisma.message.create({
    data: {
      content,
      role: 'assistant',
    },
  });
}

export async function processMessage(userContent) {
  // Save user message
  const userMessage = await createUserMessage(userContent);

  // Get AI response
  const aiResponse = await getAIResponse(userContent);

  // Save assistant message
  const assistantMessage = await createAssistantMessage(aiResponse);

  return { userMessage, assistantMessage };
}
