import prisma from '../lib/prisma.js';
import { getAIResponse } from './groqService.js';

const toInt = (id) => parseInt(id);

// Conversation functions
export const getAllConversations = () =>
  prisma.conversation.findMany({ orderBy: { updatedAt: 'desc' } });

export const getConversation = (id) =>
  prisma.conversation.findUnique({
    where: { id: toInt(id) },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

export const createConversation = (title = 'Nouvelle conversation') =>
  prisma.conversation.create({ data: { title } });

export const updateConversationTitle = (id, title) =>
  prisma.conversation.update({ where: { id: toInt(id) }, data: { title } });

export const deleteConversation = (id) =>
  prisma.conversation.delete({ where: { id: toInt(id) } });

// Message functions
export const getMessagesByConversation = (conversationId) =>
  prisma.message.findMany({
    where: { conversationId: toInt(conversationId) },
    orderBy: { createdAt: 'asc' },
  });

async function createMessage(content, role, conversationId, updateTimestamp = false) {
  if (updateTimestamp) {
    await prisma.conversation.update({
      where: { id: toInt(conversationId) },
      data: { updatedAt: new Date() },
    });
  }
  return prisma.message.create({
    data: { content, role, conversationId: toInt(conversationId) },
  });
}

export async function processMessage(userContent, conversationId) {
  const userMessage = await createMessage(userContent, 'user', conversationId, true);
  const messages = await getMessagesByConversation(conversationId);
  const aiResponse = await getAIResponse(userContent, messages);
  const assistantMessage = await createMessage(aiResponse, 'assistant', conversationId);

  // Auto-generate title from first message
  if (messages.length === 1) {
    const title = userContent.length > 50 ? userContent.substring(0, 50) + '...' : userContent;
    await updateConversationTitle(conversationId, title);
  }

  return { userMessage, assistantMessage };
}

export async function deleteMessageAndFollowing(messageId) {
  const message = await prisma.message.findUnique({ where: { id: toInt(messageId) } });
  if (!message) throw new Error('Message not found');

  const { count } = await prisma.message.deleteMany({
    where: { conversationId: message.conversationId, createdAt: { gte: message.createdAt } },
  });

  return { deletedCount: count, conversationId: message.conversationId };
}
