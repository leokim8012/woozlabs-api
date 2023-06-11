import { ChatMessageDTO } from '@/models/ai/chat';
import { Request, Response, NextFunction } from 'express';

export function checkInputLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message: ChatMessageDTO = req.body.message;
  if (message.content.length > 2048) {
    // 2048 is just an example, replace it with the actual limit
    res.status(400).json({ error: 'Input is too long.' });
  } else {
    next();
  }
}
