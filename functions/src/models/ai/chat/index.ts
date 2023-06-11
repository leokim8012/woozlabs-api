import { db } from '@/plugins/firebase';
import firestore from '@google-cloud/firestore';

export type IMessageRole = 'assistant' | 'user';
export type IMessageStatus = 'complete' | 'processing' | 'error';
export type IChatModel = 'gpt-4' | 'gpt-3.5-turbo' | 'palm-2';

export interface ChatDTO {
  id: string;
  uid: string;
  title: string;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

export interface ChatMessageDTO {
  id: string;
  chatId: string;
  model: IChatModel;
  status: IMessageStatus;
  role: IMessageRole;
  content: string;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

export const ChatConverter: firestore.FirestoreDataConverter<ChatDTO> = {
  toFirestore(chat: ChatDTO): firestore.DocumentData {
    return { ...chat };
  },
  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): ChatDTO {
    const data = snapshot.data();
    return {
      id: data.id,
      uid: data.uid,
      title: data.title,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

export const ChatMessageConverter: firestore.FirestoreDataConverter<ChatMessageDTO> =
  {
    toFirestore(chatMessage: ChatMessageDTO): firestore.DocumentData {
      return { ...chatMessage };
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
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    },
  };

export const chatsCollection = db
  .collection('chats')
  .withConverter(ChatConverter);

export const chatMessagesCollection = db
  .collection('chatMessages')
  .withConverter(ChatMessageConverter);
