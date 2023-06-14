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
  getAllChats(uid: string): Promise<ChatDTO[]>;
  getAllMessages(chatId: string): Promise<ChatMessageDTO[]>;
  deleteChat(chatId: string): Promise<void>;
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
  async deleteChat(chatId: string): Promise<void> {
    try {
      await db.collection('chats').doc(chatId).delete();
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

  async getAllChats(uid: string): Promise<ChatDTO[]> {
    try {
      const snapshot = await db
        .collection('chats')
        .withConverter(ChatConverter)
        .where('uid', '==', uid)
        .orderBy('updatedAt', 'asc')
        .get();

      const data = snapshot.docs.map((doc) => {
        return doc.data();
      });

      return data;
    } catch (err) {
      throw err;
    }
  },
  async getAllMessages(chatId: string): Promise<ChatMessageDTO[]> {
    try {
      const snapshot = await db
        .collection('messages')
        .withConverter(ChatMessageConverter)
        .where('chatId', '==', chatId)
        .orderBy('createdAt', 'asc')
        .get();

      const data = snapshot.docs.map((doc) => {
        return doc.data();
      });

      return data;
    } catch (err) {
      throw err;
    }
  },
};
