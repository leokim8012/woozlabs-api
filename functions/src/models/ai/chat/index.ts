import { db } from '@/plugins/firebase';
import firestore from '@google-cloud/firestore';
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
  ChatCompletionResponseMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';
import { v4 as uuidv4 } from 'uuid';

export type IMessageRole = 'system' | 'model' | 'user';
export type IMessageStatus = 'complete' | 'processing' | 'stop' | 'error';
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
export interface ChatModelResponse {
  id: string;
  chatId: string;
  model: IChatModel;
  status: IMessageStatus;
  role: IMessageRole;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// {
//   "id": "chatcmpl-6qhMHZvFBoFW13dvUQ3aOr9Fc2lxU",
//   "object": "chat.completion",
//   "created": 1678017745,
//   "model": "gpt-3.5-turbo-0301",
//   "usage": {
//     "prompt_tokens": 48,
//     "completion_tokens": 69,
//     "total_tokens": 117
//   },
//   "choices": [{
//       "message": {
//         "role": "assistant",
//         "content": "저는 프로그램으로 작동하는 인공지능이므로 감정을 가지지 않습니다. 단지, 제작된 프로그램에서 한국어를 인식하고 대화를 할 수 있도록 프로그래밍 되었습니다."
//       },
//       "finish_reason": "stop",
//       "index": 0
//   }]
// }

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

export function ChatMessageDTOToGPT(
  dto: ChatMessageDTO
): ChatCompletionRequestMessage {
  let role: ChatCompletionRequestMessageRoleEnum;
  if (dto.role === 'model') {
    role = 'assistant';
  } else {
    role = dto.role;
  }

  // Assuming the model object has a content and name property. Adjust as needed.
  return {
    role: role,
    content: dto.content,
  };
}
export function GPTResponseToChatMessageDTO(
  response: CreateChatCompletionResponse
): ChatMessageDTO {
  // Assuming the first choice is the desired one.
  const message = response.choices[0].message;

  if (!message) {
    throw new Error('Response Error Occurred');
  }

  let role: IMessageRole;
  if (message.role === 'assistant') {
    role = 'model';
  } else {
    role = message.role as IMessageRole;
  }

  return {
    id: response.id, // Use the ID from the response
    chatId: '', // Generate a chatId or get from another source
    model: response.model as IChatModel,
    content: message.content,
    status: 'complete', // Set the status based on your application logic
    role: role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
