// https://api.woozlabs.com/api/docs/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
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
    return res.send(true);
  }
);

app.get('/test-failed', async (req: express.Request, res: express.Response) => {
  throw Error(statusCode.BAD_REQUEST);
});

app.use(require('@/middlewares/errors'));

module.exports = app;
