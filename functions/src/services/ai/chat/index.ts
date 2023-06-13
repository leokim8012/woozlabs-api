import { v4 as uuidv4 } from 'uuid';
import {
  ChatDTO,
  ChatMessageDTO,
  ChatMessageDTOToGPT,
  GPTResponseToChatMessageDTO,
  IChatModel,
} from '@/models/ai/chat';
import { chatRepository } from '@/repository/ai/chat';
import admin from '@/plugins/firebase';
import { sendPrompt } from '@/plugins/openai';

export interface ChatService {
  startChatWithModel(
    uid: string,
    model: IChatModel,
    message: ChatMessageDTO
  ): Promise<ChatMessageDTO>;
  sendMessageToModel(
    uid: string,
    chatId: string,
    model: IChatModel,
    messages: ChatMessageDTO[]
  ): Promise<ChatMessageDTO>;

  getChatHistory(uid: string, chatId?: string): Promise<ChatDTO | ChatDTO[]>;
  getAllChatHistories(uid: string): Promise<ChatDTO[]>;
  getAllMessages(chatId: string): Promise<ChatMessageDTO[]>;
  validateUserChatAccess(uid: string, chatId: string): Promise<boolean>;
}

const modelHandlers: {
  [key in IChatModel]: (messages: ChatMessageDTO[]) => Promise<ChatMessageDTO>;
} = {
  'gpt-3.5-turbo': async (messages: ChatMessageDTO[]) => {
    // Call GPT-3.5 Turbo API here

    const modelResponse = await sendPrompt(
      'gpt-3.5-turbo',
      messages.map((message) => ChatMessageDTOToGPT(message))
    );

    const response = GPTResponseToChatMessageDTO(modelResponse);
    return response;
  },
  'gpt-4': async (messages: ChatMessageDTO[]) => {
    // Call GPT-4 API here

    const sampleResponse: ChatMessageDTO = {
      chatId: '',
      content: `GPT-4\n${SAMPLE_RESPONSE}`,
      id: '',
      model: 'gpt-4',
      role: 'model',
      status: 'complete',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return sampleResponse;
  },
  'palm-2': async (messages: ChatMessageDTO[]) => {
    // Call PALM-2 API here
    const sampleResponse: ChatMessageDTO = {
      chatId: '',
      content: `PALM-2\n${SAMPLE_RESPONSE}`,
      id: '',
      model: 'palm-2',
      role: 'model',
      status: 'complete',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return sampleResponse;
  },
};

export const chatService: ChatService = {
  async startChatWithModel(
    uid: string,
    model: IChatModel,
    message: ChatMessageDTO
  ): Promise<ChatMessageDTO> {
    const chat: ChatDTO = {
      id: uuidv4(),
      uid: uid,
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const chatId = await chatRepository.createChat(chat);

    const updatedMessage = message;
    updatedMessage.chatId = chatId;

    const response = await this.sendMessageToModel(uid, chatId, model, [
      updatedMessage,
    ]);
    return response;
  },

  async sendMessageToModel(
    uid: string,
    chatId: string,
    model: IChatModel,
    messages: ChatMessageDTO[]
  ): Promise<ChatMessageDTO> {
    if (messages.length == 0) throw new Error('Empty message');

    const hasAccess = await this.validateUserChatAccess(uid, chatId);

    if (!hasAccess) {
      throw new Error("User doesn't have access to the chat.");
    }

    const modelHandler = modelHandlers[model];

    const modelResponse = await modelHandler(messages);
    await chatRepository.sendMessage(messages[messages.length - 1]);
    modelResponse.chatId = chatId;
    if (modelResponse.id == '') modelResponse.id = uuidv4();

    await chatRepository.sendMessage(modelResponse);
    return modelResponse;
  },

  async getChatHistory(
    uid: string,
    chatId?: string
  ): Promise<ChatDTO | ChatDTO[]> {
    try {
      // If chatId is provided, get history for that chat. Otherwise, get all chats for the user.
      if (chatId) {
        const hasAccess = await this.validateUserChatAccess(uid, chatId);
        if (!hasAccess) {
          throw new Error("User doesn't have access to the chat.");
        }
        const chatHistory = await chatRepository.getChatHistory(chatId);
        return chatHistory;
      } else {
        return this.getAllChatHistories(uid);
      }
    } catch (err) {
      throw err;
    }
  },

  async getAllChatHistories(uid: string): Promise<ChatDTO[]> {
    try {
      const allChats = await chatRepository.getAllChats(uid);
      return allChats;
    } catch (err) {
      throw err;
    }
  },
  async getAllMessages(chatId: string): Promise<ChatMessageDTO[]> {
    try {
      const allMessages = await chatRepository.getAllMessages(chatId);
      return allMessages;
    } catch (err) {
      throw err;
    }
  },

  async validateUserChatAccess(uid: string, chatId: string): Promise<boolean> {
    try {
      const chat = await chatRepository.getChat(chatId);
      if (chat && chat.uid === uid) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  },
};
const SAMPLE_RESPONSE = `
### Random responses in a variety of formats
----

#### Text response:

The quick brown fox jumps over the lazy dog.



#### Markdown table:

| Fruit    | Quantity | Price |
| -------- | -------- | ----- |
| Apples   | 50       | $0.5  |
| Bananas  | 100      | $0.25 |
| Cherries | 200      | $1    |

#### Code block:

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("world")
\`\`\`

#### Bulleted list:

- Item 1
- Item 2
- Item 3

#### Numbered list:

1. First item
2. Second item
3. Third item
   Link:
   [Visit Apple!](https://apple.com)

#### Quote:
   > This is a blockquote.
   > These are just examples. Depending on what you need to test, you may want to create other types of content.
   > 
`;
