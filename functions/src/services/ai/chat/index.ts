import { v4 as uuidv4 } from 'uuid';
import { ChatDTO, ChatMessageDTO, IChatModel } from '@/models/ai/chat';
import { chatRepository } from '@/repository/ai/chat';
import admin from '@/plugins/firebase';

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
    message: ChatMessageDTO
  ): Promise<ChatMessageDTO>;

  getChatHistory(uid: string, chatId?: string): Promise<ChatDTO | ChatDTO[]>;
  getAllChatHistories(uid: string): Promise<ChatDTO[]>;
  getAllMessages(chatId: string): Promise<ChatMessageDTO[]>;
  validateUserChatAccess(uid: string, chatId: string): Promise<boolean>;
}

const modelHandlers: { [key in IChatModel]: () => Promise<string> } = {
  'gpt-3.5-turbo': async () => {
    // Call GPT-3.5 Turbo API here
    return 'Response from GPT-3.5 Turbo';
  },
  'gpt-4': async () => {
    // Call GPT-4 API here
    return 'Response from GPT-4';
  },
  'palm-2': async () => {
    // Call PALM-2 API here
    return 'Response from PALM-2';
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
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    const chatId = await chatRepository.createChat(chat);

    const updatedMessage = message;
    updatedMessage.chatId = chatId;

    const response = await this.sendMessageToModel(
      uid,
      chatId,
      model,
      updatedMessage
    );
    return response;
  },

  async sendMessageToModel(
    uid: string,
    chatId: string,
    model: IChatModel,
    message: ChatMessageDTO
  ): Promise<ChatMessageDTO> {
    const hasAccess = await this.validateUserChatAccess(uid, chatId);

    if (!hasAccess) {
      throw new Error("User doesn't have access to the chat.");
    }

    const modelHandler = modelHandlers[model];

    const modelResponse = await modelHandler();
    await chatRepository.sendMessage(message);

    const reponse: ChatMessageDTO = {
      chatId: chatId,
      content: modelResponse,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
      model: model,
      role: 'assistant',
      status: 'complete',
      id: uuidv4(),
    };
    await chatRepository.sendMessage(reponse);
    return reponse;
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
