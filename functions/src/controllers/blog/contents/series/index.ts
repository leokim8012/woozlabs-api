/* eslint-disable no-unused-vars */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.get('/test', async (req: express.Request, res: express.Response) => {
  requestLog('GET SERIES TEST');
  return res.send(true);
});

app.use(require('@/middlewares/errors'));

module.exports = app;
