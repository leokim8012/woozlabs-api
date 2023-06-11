import express from 'express';
import { checkInputLength, checkForInappropriateContent } from '@/middlewares';
import { IChatModel, ChatMessageDTO } from '@/models/ai/chat';
import { chatService } from '@/services/ai/chat';

require('express-async-errors');
const cors = require('cors');

const router = express.Router();

router.use(cors({ origin: true }));

router
  .route('/chat')
  .post(
    checkInputLength,
    checkForInappropriateContent,
    async (req: express.Request, res: express.Response) => {
      const {
        uid,
        model,
        message,
      }: { uid: string; model: IChatModel; message: ChatMessageDTO } = req.body;

      try {
        const chatId = await chatService.startChatWithModel(
          uid,
          model,
          message
        );
        res.status(201).json({ chatId: chatId });
      } catch (err) {
        throw err;
      }
    }
  );

router
  .route('/chat/:chatId/message')
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
  .route('/chat/:chatId/history')
  .get(async (req: express.Request, res: express.Response) => {
    const chatId: string = req.params.chatId;
    const uid: string = req.body.uid;

    try {
      const chatHistory = await chatService.getChatHistory(uid, chatId);
      res.json({ history: chatHistory });
    } catch (err) {
      throw err;
    }
  });

router.use(require('@/middlewares/errors'));

module.exports = router;
