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
  const messages = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await getClient().chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
  });

  return response.choices[0]?.message?.content || 'No response';
}

// Specialized function for CV generation with JSON mode
export async function getCVAIResponse(conversationHistory = []) {
  const messages = conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await getClient().chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || '{}';
}
