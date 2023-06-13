import { ChatMessageDTO, IChatModel } from '@/models/ai/chat';
import { statusCode } from '@/types/statusCode';
import { Request, Response, NextFunction } from 'express';

export function checkInputLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    uid,
    model,
    message,
    messages,
  }: {
    uid: string;
    model: IChatModel;
    message?: ChatMessageDTO;
    messages?: ChatMessageDTO[];
  } = req.body;

  if (!uid || !model) throw new Error(statusCode.BAD_REQUEST);

  if (message) {
    // Single message case
    if (message.content.length > 2048) {
      // 2048 is just an example, replace it with the actual limit
      res.status(400).json({ error: 'Input is too long.' });
    }
  } else if (messages && Array.isArray(messages)) {
    // Array of messages case
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.content.length > 2048) {
      // Check last message length
      res.status(400).json({ error: 'Input is too long.' });
    }
  } else {
    throw new Error(statusCode.BAD_REQUEST);
  }

  next();
}
