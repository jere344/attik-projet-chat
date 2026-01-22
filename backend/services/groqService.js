import Groq from 'groq-sdk';

let groq = null;

function getClient() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

export async function getAIResponse(userMessage, conversationHistory = []) {
  // Build messages array from conversation history
  const messages = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Add the current user message if not already in history (async safety)
  if (messages.length === 0 || messages[messages.length - 1].content !== userMessage) {
    messages.push({
      role: 'user',
      content: userMessage,
    });
  }

  const response = await getClient().chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: messages,
  });

  return response.choices[0]?.message?.content || 'No response';
}
