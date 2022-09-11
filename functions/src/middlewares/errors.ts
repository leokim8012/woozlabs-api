import { statusCode } from '@/types/statusCode';
import * as express from 'express';
// 공용 Error 처리
module.exports = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  switch (err.message) {
    case statusCode.BAD_REQUEST:
      return res.status(400).end();

    case statusCode.UNAUTHORIZED:
      return res.status(401).end();

    case statusCode.FORBIDDEN:
      return res.status(403).end();

    case statusCode.NOT_FOUND:
      return res.status(404).end();

    case statusCode.CONFLICT:
      return res.status(409).end();

    case statusCode.INTERNAL_SERVER_ERROR:
      return res.status(500).end();

    case statusCode.SERVICE_UNAVAILABLE:
      return res.status(503).end();

    case statusCode.DB_ERROR:
      return res.statusCode(600).end();
  }
  return res.send(err.message);
};
