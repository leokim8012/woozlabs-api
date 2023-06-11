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
  }: { uid: string; model: IChatModel; message: ChatMessageDTO } = req.body;

  if (!uid || !message || !model) throw new Error(statusCode.BAD_REQUEST);

  if (message.content.length > 2048) {
    // 2048 is just an example, replace it with the actual limit
    res.status(400).json({ error: 'Input is too long.' });
  } else {
    next();
  }
}
