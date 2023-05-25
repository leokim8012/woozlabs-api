// https://api.woozlabs.com/api/docs/* tslint:disable:no-unused-variable */
// import admin from '@/plugins/firebase';
// import express from 'express';
// import { requestLog } from '@/utils/requestLog';
// import { sleep } from '@/utils/sleep';
// import * as functions from 'firebase-functions';
// import { statusCode } from '@/types/statusCode';
// const app = express();
// const cors = require('cors');
// require('express-async-errors');

// // middlewares
// app.use(cors({ origin: true })); // CORS

// app.post(
//   '/test-success',
//   async (req: express.Request, res: express.Response) => {
//     await sleep(1000);
//     return res.sendStatus(200);
//   }
// );

// app.post('/test-fail', async (req: express.Request, res: express.Response) => {
//   await sleep(1000);
//   throw Error(statusCode.BAD_REQUEST);
// });

// app.use(require('@/middlewares/errors'));

// exports.common = functions.https.onRequest(app);

// https://api.woozlabs.com/api/docs/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
import { sleep } from '@/utils/sleep';
import * as functions from 'firebase-functions';
import { statusCode } from '@/types/statusCode';
const cors = require('cors');
require('express-async-errors');

const router = express.Router();
// middlewares

router
  .route('/test-success')
  .post(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      return res.sendStatus(200);
    }
  );
router
  .route('/test-fail')
  .post(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      throw Error(statusCode.BAD_REQUEST);
    }
  );
router
  .route('/')
  .post(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      return res.sendStatus(201);
    }
  );

router.get(
  '/',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    return res.sendStatus(201);
  }
);

module.exports = router;
