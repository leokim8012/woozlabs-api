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
  createNewChat(uid: string, model: IChatModel): Promise<string>;
  // startChatWithModel(
  //   uid: string,
  //   model: IChatModel,
  //   message: ChatMessageDTO
  // ): Promise<ChatMessageDTO>;
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

  deleteHistory(uid: string, chatId: string): Promise<void>;
  updateChatTitle(uid: string, chatId: string, title: string): Promise<void>;
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

    const modelResponse = await sendPrompt(
      'gpt-4',
      messages.map((message) => ChatMessageDTOToGPT(message))
    );

    const response = GPTResponseToChatMessageDTO(modelResponse);
    return response;
  },
  'palm-2': async (messages: ChatMessageDTO[]) => {
    // Call PALM-2 API here
    const sampleResponse: ChatMessageDTO = {
      chatId: '',
      uid: '',
      content: `${SAMPLE_RESPONSE1}`,
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
  async createNewChat(uid: string, model: IChatModel): Promise<string> {
    const chat: ChatDTO = {
      id: uuidv4(),
      uid: uid,
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const chatId = await chatRepository.createChat(chat);
    return chatId;
  },

  // async startChatWithModel(
  //   uid: string,
  //   model: IChatModel,
  //   message: ChatMessageDTO
  // ): Promise<ChatMessageDTO> {
  //   const chat: ChatDTO = {
  //     id: uuidv4(),
  //     uid: uid,
  //     title: 'New Chat',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };
  //   const chatId = await chatRepository.createChat(chat);

  //   const updatedMessage = message;
  //   updatedMessage.chatId = chatId;

  //   const response = await this.sendMessageToModel(uid, chatId, model, [
  //     updatedMessage,
  //   ]);
  //   return response;
  // },

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
    modelResponse.uid = uid;
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
  async deleteHistory(uid: string, chatId: string): Promise<void> {
    try {
      const hasAccess = await this.validateUserChatAccess(uid, chatId);
      if (!hasAccess) {
        throw new Error("User doesn't have access to the chat.");
      }

      await chatRepository.deleteChat(chatId);

      return;
    } catch (err) {
      throw err;
    }
  },

  async updateChatTitle(
    uid: string,
    chatId: string,
    title: string
  ): Promise<void> {
    try {
      const hasAccess = await this.validateUserChatAccess(uid, chatId);
      if (!hasAccess) {
        throw new Error("User doesn't have access to the chat.");
      }

      await chatRepository.updateChatTitle(chatId, title);

      return;
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

const SAMPLE_RESPONSE1 = `
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

const SAMPLE_RESPONSE2 = `
There are a number of potential solutions to mitigate the impact of climate change on photosynthesis. These include:

- **Reducing greenhouse gas emissions:** This is the most important step in mitigating climate change, as it will reduce the overall level of stress on plants and ecosystems.
- **Improving plant health:** This can be done through a variety of measures, such as improving soil health, providing adequate water and nutrients, and managing pests and diseases.
- **Selecting and breeding climate-resilient plants:** This involves identifying and developing plant varieties that are better able to tolerate the stresses of climate change, such as drought, heat, and flooding.
- **Restoring and protecting natural ecosystems:** Natural ecosystems, such as forests and wetlands, play an important role in regulating the climate and providing habitat for plants and animals. By restoring and protecting these ecosystems, we can help to mitigate the impact of climate change on photosynthesis.
- **Developing new technologies:** There is a growing field of research into new technologies that could help to mitigate the impact of climate change on photosynthesis. These include artificial photosynthesis, which could be used to remove carbon dioxide from the atmosphere, and genetically modified plants that are more resistant to climate change.

It is important to note that there is no single solution that will be effective in mitigating the impact of climate change on photosynthesis. A combination of approaches will be necessary to address this complex challenge.

Here are some additional details about each of these potential solutions:

- **Reducing greenhouse gas emissions:** Greenhouse gases trap heat in the atmosphere, which is causing the planet to warm. Reducing greenhouse gas emissions will help to slow the rate of climate change and reduce the overall stress on plants and ecosystems.
- **Improving plant health:** Healthy plants are better able to tolerate the stresses of climate change. There are a number of things that can be done to improve plant health, such as improving soil health, providing adequate water and nutrients, and managing pests and diseases.
- **Selecting and breeding climate-resilient plants:** There are a number of plant varieties that are better able to tolerate the stresses of climate change, such as drought, heat, and flooding. By selecting and breeding these varieties, we can help to ensure that plants are able to continue to photosynthesize and produce food in a changing climate.
- **Restoring and protecting natural ecosystems:** Natural ecosystems, such as forests and wetlands, play an important role in regulating the climate and providing habitat for plants and animals. By restoring and protecting these ecosystems, we can help to mitigate the impact of climate change on photosynthesis.
- **Developing new technologies:** There is a growing field of research into new technologies that could help to mitigate the impact of climate change on photosynthesis. These include artificial photosynthesis, which could be used to remove carbon dioxide from the atmosphere, and genetically modified plants that are more resistant to climate change.

It is important to note that there is no single solution that will be effective in mitigating the impact of climate change on photosynthesis. A combination of approaches will be necessary to address this complex challenge.
`;
