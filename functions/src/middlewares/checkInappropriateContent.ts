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
    messages,
  }: {
    uid: string;
    model: IChatModel;
    message?: ChatMessageDTO;
    messages?: ChatMessageDTO[];
  } = req.body;

  if (!uid || !model) throw new Error(statusCode.BAD_REQUEST);

  const forbiddenWords = ['badword1', 'badword2']; // Replace with real list

  let contentsToCheck: string[] = [];

  if (message) {
    // Single message case
    contentsToCheck.push(message.content);
  } else if (messages && Array.isArray(messages)) {
    // Array of messages case
    contentsToCheck = messages.map((msg) => msg.content);
  } else {
    throw new Error(statusCode.BAD_REQUEST);
  }

  for (let content of contentsToCheck) {
    for (let word of forbiddenWords) {
      if (content.includes(word)) {
        res.status(400).json({ error: 'Inappropriate content found.' });
      }
    }
  }
  next();
}
