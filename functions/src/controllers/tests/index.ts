/* eslint-disable no-unused-vars */
import express from 'express';
import { requestLog } from '../../utils/requestLog';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.post('/post', async (req: express.Request, res: express.Response) => {
  return res.send(true);
});
app.get('/get', async (req: express.Request, res: express.Response) => {
  requestLog(req.originalUrl);
  return res.send(true);
});

app.use(require('@/middlewares/errors'));

module.exports = app;
