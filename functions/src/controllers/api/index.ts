// https://api.woozlabs.com/api/docs/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
import { sleep } from '@/utils/sleep';
import * as functions from 'firebase-functions';
import { statusCode } from '@/types/statusCode';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.get(
  '/test-success',
  async (req: express.Request, res: express.Response) => {
    await sleep(1000);
    return res.send(true);
  }
);

app.get('/test-fail', async (req: express.Request, res: express.Response) => {
  await sleep(1000);
  throw Error(statusCode.BAD_REQUEST);
});

app.use(require('@/middlewares/errors'));

module.exports = app;
