/* tslint:disable:no-unused-variable */
import admin, { storage } from '@/plugins/firebase';
import { requestLog } from '@/utils/requestLog';
import * as functions from 'firebase-functions';
import express, { CookieOptions } from 'express';
import { statusCode } from '@/types/statusCode';
import { userAuthService } from '@/services/user/auth';
import cookieParser from 'cookie-parser';
const router = express.Router();

router.use(cookieParser());

router
  .route('/sessionStatus')
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.log(req.cookies);
      // Get session cookie
      const sessionCookie = req.cookies.session;

      if (!sessionCookie) {
        res.status(400).send('BAD REQUEST!');
        return;
      }

      console.log(`STATUS REQUESTED: ${sessionCookie}`);
      // Verify the session cookie. In this case, to check if it's revoked.

      try {
        const decodedClaims = await admin
          .auth()
          .verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;
        // Create a custom token.
        const customToken = await admin.auth().createCustomToken(uid);

        // Send custom token to the client.
        res.send({ customToken });
        return;
      } catch (e) {
        res.status(401).send('UNAUTHORIZED REQUEST!');
        return;
      }
    }
  );

router
  .route('/sessionLogin')
  .post(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const idToken = req.body.idToken as string;

      console.log(`LOGIN REQUESTED: ${idToken}`);
      try {
        // Verify the ID token first.
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        // Create Session cookie and set it.
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await admin
          .auth()
          .createSessionCookie(idToken, { expiresIn });

        const options: CookieOptions = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          domain: '.woozlabs.com',
        };

        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({ status: 'success' }));
      } catch (error) {
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
    }
  );
router
  .route('/sessionLogout')
  .post(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      // Get user id from request
      const uid = req.body.uid;

      // Revoke all refresh tokens for a specified user for whatever reason.
      // Retrieve the timestamp in seconds from the revocation, rounded down to the nearest hour.
      admin
        .auth()
        .revokeRefreshTokens(uid)
        .then(() => {
          admin
            .auth()
            .getUser(uid)
            .then((userRecord) => {
              // Handle possible undefined value of userRecord.tokensValidAfterTime
              if (userRecord.tokensValidAfterTime) {
                return (
                  new Date(userRecord.tokensValidAfterTime).getTime() / 1000
                );
              } else {
                throw new Error('No valid token timestamp found for user');
              }
            })
            .then((timestamp) => {
              console.log('Tokens revoked at: ', timestamp);
            })
            .catch((error) => {
              console.log(error);
            });
        });

      // Clear the session cookie
      const options: CookieOptions = {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        domain: '.woozlabs.com',
      };

      res.cookie('session', '', options);
      res.end(JSON.stringify({ status: 'success' }));
    }
  );

router
  .route('/:uid')
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!req.params.uid) throw new Error(statusCode.BAD_REQUEST);
      requestLog(`GET USER ${req.params.uid}`);
      try {
        const result = await userAuthService.getUserByUid(req.params.uid);
        res.status(200).json(result);
      } catch (err) {
        throw err;
      }
    }
  )
  .post(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!req.params.uid) throw new Error(statusCode.BAD_REQUEST);
      requestLog(`PATCH USER ${req.params.uid}`);
      try {
        const result = await userAuthService.updateUser(
          req.params.uid,
          req.body
        );
        res.status(200).json(result);
      } catch (err) {
        throw err;
      }
    }
  );

module.exports = router;
