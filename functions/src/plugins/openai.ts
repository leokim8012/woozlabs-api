import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
export interface IOpenAIMessage {
  role: 'system' | 'assistant' | 'user';
  content: string;
}

export async function sendPrompt(
  model: 'gpt-3.5-turbo' | 'gpt-4',
  messages: ChatCompletionRequestMessage[]
) {
  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages,
  });

  return completion.data;
}

export async function stopPromt(id: string) {}
