import { Request, Response, NextFunction } from 'express';

export function checkForInappropriateContent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message: string = req.body.message;
  const forbiddenWords = ['badword1', 'badword2']; // Replace with real list

  for (let word of forbiddenWords) {
    if (message.includes(word)) {
      res.status(400).json({ error: 'Inappropriate content found.' });
    }
  }
  next();
}
