import express from 'express';
import { checkInputLength, checkForInappropriateContent } from '@/middlewares';
import { IChatModel, ChatMessageDTO } from '@/models/ai/chat';
import { chatService } from '@/services/ai/chat';
import { statusCode } from '@/types/statusCode';

require('express-async-errors');
const cors = require('cors');

const router = express.Router();

router.use(cors({ origin: true }));

router
  .route('/')
  .post(
    checkInputLength,
    checkForInappropriateContent,
    async (req: express.Request, res: express.Response) => {
      const {
        uid,
        model,
        message,
      }: { uid: string; model: IChatModel; message: ChatMessageDTO } = req.body;

      if (!uid || !message || !model) throw new Error(statusCode.BAD_REQUEST);

      console.log(`SEND CHAT MESSAGE: ${model} ${uid}`);

      try {
        const responseMessage = await chatService.startChatWithModel(
          uid,
          model,
          message
        );
        res.status(201).json({ response: responseMessage });
      } catch (err) {
        throw err;
      }
    }
  );

router
  .route('/:chatId/message')
  .post(
    checkInputLength,
    checkForInappropriateContent,
    async (req: express.Request, res: express.Response) => {
      const {
        uid,
        model,
        message,
      }: { uid: string; model: IChatModel; message: ChatMessageDTO } = req.body;
      const chatId: string = req.params.chatId;

      if (!uid || !chatId || !model) throw new Error(statusCode.BAD_REQUEST);

      console.log(`SEND CHAT MESSAGE: ${model} ${uid}`);
      try {
        const responseMessage = await chatService.sendMessageToModel(
          uid,
          chatId,
          model,
          message
        );
        res.json({ response: responseMessage });
      } catch (err) {
        throw err;
      }
    }
  );
router
  .route('/:chatId/messages')
  .get(async (req: express.Request, res: express.Response) => {
    const chatId: string = req.params.chatId;
    const uid: string = req.query.uid as string;
    if (!uid || !chatId) throw new Error(statusCode.BAD_REQUEST);
    console.log(`GET CHAT MESSAGES: ${chatId} ${uid}`);

    try {
      const messages = await chatService.getAllMessages(chatId);
      res.json({ messages: messages });
    } catch (err) {
      throw err;
    }
  });
router
  .route('/history')
  .get(async (req: express.Request, res: express.Response) => {
    const chatId: string = req.query.chatId as string;
    const uid: string = req.query.uid as string;
    if (!uid) throw new Error(statusCode.BAD_REQUEST);

    console.log(`GET CHAT HISTORY: ${uid} | ${chatId}`);
    try {
      let chatHistory;
      if (chatId) {
        // Fetch history for specific chatId
        chatHistory = await chatService.getChatHistory(uid, chatId);
      } else {
        // Fetch all chat histories for the uid
        chatHistory = await chatService.getAllChatHistories(uid);
      }
      res.json({ history: chatHistory });
    } catch (err) {
      throw err;
    }
  });

router.use(require('@/middlewares/errors'));

module.exports = router;
