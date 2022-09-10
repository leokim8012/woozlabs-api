import admin from '@/plugins/firebase';
import * as express from 'express';

module.exports = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.headers.authorization) {
    admin
      .auth()
      .verifyIdToken(req.headers.authorization)
      .then((decodedIdToken) => {
        admin
          .auth()
          .getUser(decodedIdToken.uid)
          .then((userRecord) => {
            return next(userRecord);
          })
          .catch((error) => {
            console.error('Error while getting Firebase User record:', error);
            res.status(403).send();
          });
      })
      .catch((error) => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send();
      });
  } else {
    res.status(404).send();
  }
};
