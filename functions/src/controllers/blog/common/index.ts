/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import { requestLog } from '@/utils/requestLog';
import express from 'express';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.get('/test', async (req: express.Request, res: express.Response) => {
  requestLog('GET BLOG COMMON TEST');
  return res.send(true);
});
app.use(require('@/middlewares/errors'));

module.exports = app;
