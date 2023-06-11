import { ChatMessageDTO, IChatModel } from '@/models/ai/chat';
import { statusCode } from '@/types/statusCode';
import { Request, Response, NextFunction } from 'express';

export function checkForInappropriateContent(
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

  const forbiddenWords = ['badword1', 'badword2']; // Replace with real list

  for (let word of forbiddenWords) {
    if (message.content.includes(word)) {
      res.status(400).json({ error: 'Inappropriate content found.' });
    }
  }
  next();
}
