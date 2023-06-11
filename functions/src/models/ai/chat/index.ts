import { db } from '@/plugins/firebase';
import firestore from '@google-cloud/firestore';

export type IMessageRole = 'assistant' | 'user';
export type IMessageStatus = 'complete' | 'processing' | 'error';
export type IChatModel = 'gpt-4' | 'gpt-3.5-turbo' | 'palm-2';

export interface ChatDTO {
  id: string;
  uid: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessageDTO {
  id: string;
  chatId: string;
  model: IChatModel;
  status: IMessageStatus;
  role: IMessageRole;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ChatConverter: firestore.FirestoreDataConverter<ChatDTO> = {
  toFirestore(chat: ChatDTO): firestore.DocumentData {
    const createdAt =
      typeof chat.createdAt === 'string'
        ? new Date(chat.createdAt)
        : chat.createdAt;
    const updatedAt =
      typeof chat.createdAt === 'string'
        ? new Date(chat.createdAt)
        : chat.createdAt;
    return {
      uid: chat.uid,
      id: chat.id,
      title: chat.title,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  },
  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): ChatDTO {
    const data = snapshot.data();
    return {
      id: data.id,
      uid: data.uid,
      title: data.title,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  },
};

export const ChatMessageConverter: firestore.FirestoreDataConverter<ChatMessageDTO> =
  {
    toFirestore(chatMessage: ChatMessageDTO): firestore.DocumentData {
      const createdAt =
        typeof chatMessage.createdAt === 'string'
          ? new Date(chatMessage.createdAt)
          : chatMessage.createdAt;
      const updatedAt =
        typeof chatMessage.createdAt === 'string'
          ? new Date(chatMessage.createdAt)
          : chatMessage.createdAt;

      return {
        id: chatMessage.id,
        chatId: chatMessage.chatId,
        model: chatMessage.model,
        status: chatMessage.status,
        role: chatMessage.role,
        content: chatMessage.content,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): ChatMessageDTO {
      const data = snapshot.data();
      return {
        id: data.id,
        chatId: data.chatId,
        model: data.model,
        status: data.status,
        role: data.role,
        content: data.content,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    },
  };

export const chatsCollection = db
  .collection('chats')
  .withConverter(ChatConverter);

export const chatMessagesCollection = db
  .collection('chatMessages')
  .withConverter(ChatMessageConverter);
