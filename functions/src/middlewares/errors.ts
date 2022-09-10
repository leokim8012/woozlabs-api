import * as express from 'express';
// 공용 Error 처리
module.exports = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err.message === 'abc') return res.status(403).end();

  return res.send(err.message);
};
