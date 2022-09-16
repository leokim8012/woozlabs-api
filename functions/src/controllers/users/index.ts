/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.post('/createUser', async (req: express.Request, res: express.Response) => {
  console.log(`===CREATE USER===\n${new Date()}`);
  if (!req.body) return res.send(false);
  if (!req.body.uid) return res.send(false);

  return res.send(true);
});

app.use(require('@/middlewares/errors'));

module.exports = app;
