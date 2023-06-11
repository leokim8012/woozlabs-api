import {
  ChatDTO,
  ChatConverter,
  ChatMessageDTO,
  ChatMessageConverter,
} from '@/models/ai/chat';
import admin, { db } from '@/plugins/firebase';

export interface ChatRepository {
  createChat(chat: ChatDTO): Promise<string>;
  sendMessage(chatMessage: ChatMessageDTO): Promise<string>;
  getChatHistory(chatId: string): Promise<ChatDTO>;
  getChat(chatId: string): Promise<ChatDTO>;
}

export const chatRepository: ChatRepository = {
  async createChat(chat: ChatDTO): Promise<string> {
    try {
      await db
        .collection('chats')
        .doc(chat.id)
        .withConverter(ChatConverter)
        .set(chat);

      return chat.id;
    } catch (err) {
      throw err;
    }
  },

  async sendMessage(chatMessage: ChatMessageDTO): Promise<string> {
    try {
      await db
        .collection('messages')
        .doc(chatMessage.id)
        .withConverter(ChatMessageConverter)
        .set(chatMessage);

      // Updating the 'updatedAt' field of the chat
      await db.collection('chats').doc(chatMessage.chatId).update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return chatMessage.id;
    } catch (err) {
      throw err;
    }
  },

  async getChatHistory(chatId: string): Promise<ChatDTO> {
    try {
      const snapshot = await db
        .collection('chats')
        .doc(chatId)
        .withConverter(ChatConverter)
        .get();

      if (!snapshot.exists) {
        throw new Error('Chat not found');
      }

      const chat = snapshot.data() as ChatDTO;

      return chat;
    } catch (err) {
      throw err;
    }
  },

  async getChat(chatId: string): Promise<ChatDTO> {
    try {
      const snapshot = await db
        .collection('chats')
        .doc(chatId)
        .withConverter(ChatConverter)
        .get();

      if (!snapshot.exists) {
        throw new Error('Chat not found');
      }

      const chat = snapshot.data() as ChatDTO;

      return chat;
    } catch (err) {
      throw err;
    }
  },
};
